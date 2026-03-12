import { DestinationService } from './destination-service.js';
import { Logger } from '../utils/logger.js';
import { executeHttpRequest } from '@sap-cloud-sdk/http-client'
import { EventTypeEnum, LandscapeQueryParams, StatusEventsQueryParams } from '../types/sap-types.js';

import { AuthService } from './auth-service.js';

/**
 * SAP Client for BTP CALM MCP Server
 * 
 * This client provides methods for interacting with CALM APIs.
 * It handles user token management and provides access to the destination service.
 */
export class SAPClient {
    private currentUserToken?: string;

    constructor(
        private readonly destinationService: DestinationService,
        private readonly logger: Logger,
        private readonly authService: AuthService
    ) { }

    /**
     * Set the user's JWT token for authenticated operations
     */
    setUserToken(token?: string): void {
        this.currentUserToken = token;
        this.logger.debug(`User token ${token ? 'set' : 'cleared'} for SAP client`);
    }

    /**
     * Get the current user token
     */
    getUserToken(): string | undefined {
        return this.currentUserToken;
    }

    /**
     * Get the destination service instance
     */
    getDestinationService(): DestinationService {
        return this.destinationService;
    }

    async getLandscapeInfo(params?: LandscapeQueryParams): Promise<string> {
        await this.ensureAuthorized('read');

        let destination;
        try {
            destination = await this.destinationService.getDestination(this.currentUserToken);
        }
        catch (error) {
            this.logger.debug('Error fetching destination for landscape info:', error);
            throw new Error('Failed to get destination for landscape info');
        }

        this.logger.debug(`Fetching landscape details`);
        const queryParams = this.buildQueryString(params);

        const response = await executeHttpRequest(
            destination,
            {
                method: 'get',
                url: `/calm-landscape/v1/landscapeObjects${queryParams}`
            }
        );

        return response.data;
    }

    async getPropertyCapableLandscapeInfo(params?: LandscapeQueryParams): Promise<string> {
        const result = await this.getLandscapeInfo(params);
        const parsed = typeof result === 'string' ? JSON.parse(result) : result;

        if (!Array.isArray(parsed)) {
            return JSON.stringify(parsed, null, 2);
        }

        const filtered = parsed
            .filter((item) => item?.objectType !== 'BusinessService')
            .map((item) => ({
                ...item,
                propertyLookupSupported: true,
                recommendedNextTool: 'get-landscape-property-info'
            }));

        return JSON.stringify(filtered, null, 2);
    }

    async getLandscapeProperties(lmsId: string): Promise<string> {
        if (!lmsId || lmsId.trim() === '') {
            throw new Error('No Landscape ID provided');
        }

        await this.ensureAuthorized('read');

        const destination = await this.destinationService.getDestination(this.currentUserToken);
        const landscapeObject = await this.getLandscapeObjectById(lmsId);

        if (landscapeObject?.objectType === 'BusinessService') {
            throw new Error(
                `Landscape properties are not accessible for objectType 'BusinessService' with lmsId '${lmsId}'. ` +
                `Use an lmsId for a technical system or cloud service object instead.`
            );
        }

        try {
            const response = await executeHttpRequest(
                destination,
                {
                    method: 'get',
                    url: `/calm-landscape/v1/properties?lmsId=${encodeURIComponent(lmsId)}`
                }
            );

            return response.data;
        } catch (error) {
            if (this.isHttpStatus(error, 403)) {
                const objectType = landscapeObject?.objectType || 'unknown';
                throw new Error(
                    `SAP Cloud ALM denied access to landscape properties for lmsId '${lmsId}'` +
                    ` (objectType '${objectType}'). This usually means the properties endpoint is not available` +
                    ` for that landscape object type or your CALM authorization does not cover it.`
                );
            }

            throw error;
        }
    }

    async getStatusEvents(params?: StatusEventsQueryParams): Promise<string> {
        await this.ensureAuthorized('read');

        let destination;
        try {
            destination = await this.destinationService.getDestination(this.currentUserToken);
        }
        catch (error) {
            this.logger.debug('Error fetching destination for landscape info:', error);
            throw new Error('Failed to get destination for landscape info');
        }

        this.logger.debug(`Fetching landscape details`);
        const queryParams = this.buildQueryString(params);

        const response = await executeHttpRequest(
            destination,
            {
                method: 'get',
                url: `/bsm-service/v1/events${queryParams}`
            }
        );

        return response.data;
    }

    async gatherIncidentContext(input: StatusEventsQueryParams & { rawAlertText?: string }): Promise<string> {
        const eventsData = await this.getStatusEvents({
            type: input.type,
            serviceName: input.serviceName,
            eventType: input.eventType,
            serviceType: input.serviceType,
            period: input.period,
            startTime: input.startTime,
            endTime: input.endTime,
            limit: input.limit ?? 10,
            offset: input.offset
        });

        const events = this.parseJsonArray<Record<string, unknown>>(eventsData);
        const relatedLandscapeObjects = await this.findRelatedLandscapeObjects(events, input.serviceName);
        const hypotheses = this.buildIncidentHypotheses(events, input.rawAlertText);
        const nextChecks = this.buildNextChecks(events, relatedLandscapeObjects, hypotheses);

        const summary = {
            totalEvents: events.length,
            relatedLandscapeObjectCount: relatedLandscapeObjects.length,
            eventTypes: [...new Set(events.map((event) => String(event.eventType || 'unknown')))],
            services: [...new Set(events.map((event) => String(event.serviceName || 'unknown')))],
            suggestedFocus: hypotheses[0] || 'Review recent events and related landscape objects.'
        };

        return JSON.stringify({
            summary,
            rawAlertText: input.rawAlertText || null,
            matchingEvents: events,
            relatedLandscapeObjects,
            hypotheses,
            nextChecks
        }, null, 2);
    }

    async findRecentServiceDisruptions(input: StatusEventsQueryParams): Promise<string> {
        const candidateEventTypes: EventTypeEnum[] = input.eventType
            ? [input.eventType]
            : [EventTypeEnum.Disruption, EventTypeEnum.Degradation];

        const combined: Record<string, unknown>[] = [];

        for (const eventType of candidateEventTypes) {
            const payload = await this.getStatusEvents({
                ...input,
                eventType,
                limit: input.limit ?? 10
            });

            const parsed = this.parseJsonArray<Record<string, unknown>>(payload);
            for (const item of parsed) {
                if (!combined.some((existing) => existing.eventId === item.eventId)) {
                    combined.push(item);
                }
            }
        }

        const sorted = combined.sort((left, right) => {
            const leftTime = Date.parse(String(left.eventStartTime || ''));
            const rightTime = Date.parse(String(right.eventStartTime || ''));
            return Number.isNaN(rightTime) || Number.isNaN(leftTime) ? 0 : rightTime - leftTime;
        });

        const summary = {
            totalDisruptions: sorted.length,
            services: [...new Set(sorted.map((event) => String(event.serviceName || 'unknown')))],
            eventTypes: [...new Set(sorted.map((event) => String(event.eventType || 'unknown')))]
        };

        return JSON.stringify({
            summary,
            disruptions: sorted
        }, null, 2);
    }

    /**
     * Builds a URL-encoded query string from the provided parameters.
     * Only includes parameters that are defined (not undefined/null).
     *
     * @param params - Optional key-value pairs to include as query parameters
     * @returns A query string prefixed with '?' or an empty string if no params are set
     */
    private buildQueryString(params?: LandscapeQueryParams | StatusEventsQueryParams): string {
        if (!params) {
            return '';
        }

        const entries = Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

        return entries.length > 0 ? `?${entries.join('&')}` : '';
    }

    private parseJsonArray<T>(payload: string): T[] {
        try {
            const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
            return Array.isArray(parsed) ? parsed as T[] : [];
        } catch (error) {
            this.logger.debug('Failed to parse JSON array payload', error);
            return [];
        }
    }

    private async findRelatedLandscapeObjects(
        events: Record<string, unknown>[],
        explicitServiceName?: string
    ): Promise<Record<string, unknown>[]> {
        const landscapeResults: Record<string, unknown>[] = [];
        const queries = new Set<string>();

        if (explicitServiceName) {
            queries.add(explicitServiceName);
        }

        for (const event of events) {
            const serviceName = typeof event.serviceName === 'string' ? event.serviceName : '';
            const systemNumber = typeof event.systemNumber === 'string' ? event.systemNumber : '';
            if (serviceName) {
                queries.add(serviceName);
            }
            if (systemNumber) {
                queries.add(systemNumber);
            }
        }

        for (const query of queries) {
            const looksNumeric = /^\d+$/.test(query);
            const params = looksNumeric
                ? { systemNumber: query, limit: 5 }
                : { name: query, limit: 5 };

            try {
                const response = await this.getLandscapeInfo(params);
                if (!response || !String(response).trim()) {
                    continue;
                }
                const parsed = this.parseJsonArray<Record<string, unknown>>(response);
                for (const item of parsed) {
                    if (!landscapeResults.some((existing) => existing.lmsId === item.lmsId)) {
                        landscapeResults.push(item);
                    }
                }
            } catch (error) {
                this.logger.debug(`Failed to gather related landscape objects for query '${query}'`, error);
            }
        }

        return landscapeResults;
    }

    private buildIncidentHypotheses(
        events: Record<string, unknown>[],
        rawAlertText?: string
    ): string[] {
        const joinedText = [
            rawAlertText || '',
            ...events.flatMap((event) => [
                String(event.eventName || ''),
                String(event.eventDescription || ''),
                String(event.eventType || ''),
                String(event.serviceDescription || '')
            ])
        ].join(' ').toLowerCase();

        const hypotheses: string[] = [];

        if (joinedText.includes('authentication') || joinedText.includes('token') || joinedText.includes('unauthorized')) {
            hypotheses.push('Authentication or token validity problem is a likely cause.');
        }
        if (joinedText.includes('certificate') || joinedText.includes('ssl') || joinedText.includes('tls')) {
            hypotheses.push('Certificate or TLS configuration should be checked.');
        }
        if (joinedText.includes('timeout') || joinedText.includes('latency') || joinedText.includes('connect')) {
            hypotheses.push('Connectivity or upstream availability issue is a likely cause.');
        }
        if (events.some((event) => String(event.eventType || '') === 'Maintenance')) {
            hypotheses.push('A planned maintenance event may explain the disruption.');
        }
        if (joinedText.includes('integration') || joinedText.includes('api')) {
            hypotheses.push('Integration endpoint or API dependency should be checked.');
        }

        if (hypotheses.length === 0) {
            hypotheses.push('No strong heuristic match found; review event timeline and impacted service metadata.');
        }

        return hypotheses;
    }

    private buildNextChecks(
        events: Record<string, unknown>[],
        landscapeObjects: Record<string, unknown>[],
        hypotheses: string[]
    ): string[] {
        const checks = [
            'Review the newest matching status event and confirm whether the incident is ongoing or historical.'
        ];

        if (landscapeObjects.length > 0) {
            checks.push('Inspect the related landscape object and verify whether a technical system or cloud service mapping exists.');
        }

        if (hypotheses.some((item) => item.toLowerCase().includes('authentication'))) {
            checks.push('Check token validity, destination credentials, and trust configuration for the impacted integration.');
        }

        if (hypotheses.some((item) => item.toLowerCase().includes('maintenance'))) {
            checks.push('Confirm whether the event window matches a planned maintenance period before escalating.');
        }

        if (events.some((event) => typeof event.serviceName === 'string' && event.serviceName)) {
            checks.push('Use the service name from the event to correlate logs, monitoring alerts, or dependent APIs.');
        }

        return checks;
    }

    private async getLandscapeObjectById(lmsId: string): Promise<{ lmsId?: string; objectType?: string } | null> {
        let destination;
        try {
            destination = await this.destinationService.getDestination(this.currentUserToken);
        } catch (error) {
            this.logger.debug('Error fetching destination for landscape object lookup:', error);
            return null;
        }

        try {
            const response = await executeHttpRequest(
                destination,
                {
                    method: 'get',
                    url: `/calm-landscape/v1/landscapeObjects?lmsId=${encodeURIComponent(lmsId)}&limit=1`
                }
            );

            const [firstMatch] = Array.isArray(response.data) ? response.data : [];
            return firstMatch || null;
        } catch (error) {
            this.logger.debug(`Failed to resolve landscape object for lmsId '${lmsId}'`, error);
            return null;
        }
    }

    private isHttpStatus(error: unknown, status: number): boolean {
        if (typeof error !== 'object' || error === null) {
            return false;
        }

        const candidate = error as { status?: number; response?: { status?: number } };
        return candidate.status === status || candidate.response?.status === status;
    }

        /**
     * Validates the current user token and checks the required local scope.
     * Throws if no token is set or the required scope is missing.
     */
    private async ensureAuthorized(scope: string): Promise<void> {
        if (!this.currentUserToken) {
            throw new Error('No user token set');
        }

        const securityContext = await this.authService.validateToken(this.currentUserToken);
        const isDevelopment = process.env.NODE_ENV !== 'production';
        const allowDevScopeBypass = process.env.ALLOW_DEV_SCOPE_BYPASS === 'true';

        // Debug: log token claims
        try {
            const payload = JSON.parse(Buffer.from(this.currentUserToken.split('.')[1], 'base64').toString());
            this.logger.debug(`Token scopes: ${JSON.stringify(payload.scope)}`);
            this.logger.debug(`Token role collections: ${JSON.stringify(payload['xs.rolecollections'])}`);
            this.logger.debug(`Token origin: ${payload.origin}`);
            this.logger.debug(`Token grant_type: ${payload.grant_type}`);
        } catch (e) {
            this.logger.debug('Could not decode token');
            this.logger.debug(`e.message: ${e instanceof Error ? e.message : String(e)}`);
        }

        const hasLocalScope = securityContext.checkLocalScope(scope);
        this.logger.debug(`checkLocalScope('${scope}') = ${hasLocalScope}`);

        if (!hasLocalScope && isDevelopment && allowDevScopeBypass) {
            this.logger.warn(
                `Bypassing missing local scope '${scope}' in development because ALLOW_DEV_SCOPE_BYPASS=true`
            );
            return;
        }

        if (!hasLocalScope) {
            throw new Error(`Forbidden: missing required scope '${scope}'`);
        }
    }
}
