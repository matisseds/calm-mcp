# SAP Cloud ALM MCP Walkthrough

## Purpose

This file is a running handoff for future AI or human contributors working on this repository. It summarizes what exists today, what was verified in this session, what is likely to break, and the plan for the next implementation passes.

## What This Repository Is

This project is a TypeScript MCP server for SAP Cloud ALM APIs, intended to run on SAP BTP Cloud Foundry.

In practical terms, this repository is the bridge between MCP clients and SAP Cloud ALM:

- MCP clients talk to this server through MCP and HTTP
- this server translates MCP tool calls into SAP Cloud ALM API requests
- SAP Cloud ALM remains the system of record behind the destination

So the server is not SAP Cloud ALM itself, and it is not only a UI. It is the middleware layer that exposes SAP Cloud ALM capabilities as MCP tools.

Current high-level flow:

1. `src/index.ts` starts an Express server.
2. The server exposes `/mcp` over streamable HTTP transport.
3. OAuth and JWT validation are handled through SAP XSUAA in `src/services/auth-service.ts`.
4. Destination lookup is handled through SAP BTP Destination service in `src/services/destination-service.ts`.
5. SAP Cloud ALM API calls are made from `src/services/sap-client.ts`.
6. MCP tools are registered in `src/tools/tool-registry.ts`.

## Current MCP Tools

These tools are already registered:

- `get-landscape-info`
- `find-property-capable-landscape-objects`
- `get-landscape-property-info`
- `get-status-events`
- `gather-incident-context`

The SAP endpoints they target are:

- `/calm-landscape/v1/landscapeObjects`
- `/calm-landscape/v1/properties`
- `/bsm-service/v1/events`

Higher-level orchestration tools:

- `find-property-capable-landscape-objects`
  Filters landscape results to avoid the `BusinessService` entries that tend to fail on the properties endpoint.
- `gather-incident-context`
  Combines status events, related landscape searches, and heuristic next checks into one AI-friendly context bundle.

## Files Reviewed In This Session

- `README.md`
- `package.json`
- `mta.yaml`
- `xs-security.json`
- `tsconfig.json`
- `eslint.config.ts`
- `src/index.ts`
- `src/mcp-server.ts`
- `src/services/auth-service.ts`
- `src/services/destination-service.ts`
- `src/services/sap-client.ts`
- `src/tools/tool-registry.ts`
- `src/utils/config.ts`
- `src/utils/error-handler.ts`
- `src/utils/logger.ts`
- `src/types/sap-types.ts`
- `.env.example`

## What Was Verified

- The implementation is already split into reasonable layers:
  - HTTP/OAuth entrypoint
  - MCP server wrapper
  - destination/auth/SAP services
  - tool registry
- The project is aimed at SAP BTP CF deployment through `mta.yaml`.
- Dependencies were installed successfully with `npm install`.
- `npm run build` now succeeds in this workspace.
- The server starts locally and `/health` responds successfully on `http://localhost:3000/health`.
- When XSUAA bindings are missing, the server logs a warning and continues with OAuth disabled.
- `@sap/xsenv` reports an engine warning under Node `v24.14.0`, so Node `20.x` is likely a safer target for regular development and deployment parity.
- Local hybrid bindings were created successfully in `.cdsrc-private.json` for:
  - `mcpcalm-xsuaa-default-space`
  - `destinationcalm`
  - `mcp-connectivity-default-space`
- A local `.env` was added with `CALM_DESTINATION_NAME=MDS_CALM_API`.
- Local development now supports a config-driven scope bypass via `ALLOW_DEV_SCOPE_BYPASS=true`.
- A lightweight local dashboard is now available at `/dashboard`.
- A dedicated developer dashboard is available at `/dashboard/dev`.
- Token inspection is now available at `/debug/token-info`.
- The dashboard now supports a self-redirecting OAuth flow using `/dashboard` as the default local callback target.
- The UI is now split into two experiences:
  - `/dashboard` for guided user workflows
  - `/dashboard/dev` for raw developer-oriented MCP testing
- The guided `/dashboard` now includes result-card actions that can prefill the next workflow step, such as checking service health or preparing incident analysis from a selected system.

## Immediate Risks And Gaps

### 1. Local setup still needs environment alignment

The project now builds and starts locally, but SAP-specific flows are still unverified because there are no bound XSUAA/Destination services in this workspace.

### 2. Build scripts are Unix-leaning

`package.json` uses commands like `mkdir -p`, `cp`, and `rm -rf`, which are not portable to default Windows shells. Since this workspace is on Windows, local development will likely be rough even after `npm install` unless scripts are made cross-platform.

### 3. OAuth surface is larger than what has been tested

`src/index.ts` exposes several OAuth-related endpoints and custom MCP discovery behavior. The design is ambitious, but none of the following have been validated yet in this session:

- XSUAA discovery metadata
- authorization-code callback flow
- refresh flow
- static client registration flow
- session lifecycle behavior under repeated MCP requests

### 4. User-token-dependent tool execution may be fragile

`SAPClient.ensureAuthorized()` requires a user JWT and validates local scopes before any CALM call. That is a good security baseline, but it means:

- all tool execution depends on a valid XSUAA user token
- local testing needs either real XSUAA bindings or a deliberate dev fallback
- missing scope configuration will surface as runtime failures

### 5. Logging and error payloads need cleanup

There are several noisy or placeholder-style messages, plus some encoding artifacts in comments/log output. This is not blocking, but it will make troubleshooting harder.

### 6. Existing docs are helpful but not yet operational

`README.md` explains the intended deployment path, but it does not yet give a known-good local bootstrap sequence for this exact repo on Windows.

## First-Pass Technical Assessment

### Strengths

- Clear separation between auth, destination resolution, SAP API calls, and MCP tool wiring.
- Tool registration is simple and easy to extend.
- The server already includes health checks, docs, OAuth metadata, and session cleanup.
- TypeScript strict mode is enabled.

### Likely improvement areas

- cross-platform scripts
- runtime validation and error normalization
- more explicit health/readiness endpoints
- test coverage for service logic
- better docs for local hybrid mode
- more CALM tools beyond the initial three

## Working Plan

This is the plan to follow unless new repo context changes priorities.

### Phase 1: Make the project runnable locally

Goal: get a dependable local build and startup loop.

Tasks:

Status in this session: mostly completed.

Completed:

1. Installed dependencies.
2. Ran `npm run build`.
3. Replaced Unix-only package scripts with cross-platform Node-based alternatives.
4. Confirmed the app can start locally and answer `/health`.

Remaining:

1. Confirm lint status.
2. Decide on a supported local Node version and document it.

### Phase 2: Make the current API actually work

Goal: verify the existing three CALM tools end-to-end.

Tasks:

1. Validate destination resolution with real BTP bindings or local env configuration.
2. Verify XSUAA auth initialization and token validation.
3. Exercise `/mcp`, `/health`, `/docs`, and OAuth endpoints.
4. Confirm the current tools reach SAP Cloud ALM successfully.
5. Fix any scope, destination, or transport issues discovered during real calls.

### Phase 3: Harden the server

Goal: reduce operational risk and improve maintainability.

Tasks:

1. Normalize error responses and log structure.
2. Add better startup diagnostics for missing env vars or missing bindings.
3. Improve session lifecycle cleanup and observability.
4. Add readiness-style checks for downstream dependencies.
5. Tighten config handling and document required env vars more clearly.

### Phase 4: Add more MCP functionality

Goal: extend the useful SAP Cloud ALM surface area.

Candidate tasks:

1. Add more CALM read tools.
2. Group tool registration by domain for easier expansion.
3. Add parameter validation and user-friendly tool descriptions.
4. Consider pagination helpers and response shaping for large result sets.

## Recommended Next Actions

If a future agent picks this up, the next command sequence should be:

1. Run `npm install`.
2. Run `npm run build`.
3. If build passes, run the local start path.
4. Fix any Windows script issues before doing deeper SAP validation.

## Notes For Future AI Agents

- Do not assume the current OAuth flow is correct just because the endpoints exist.
- Do not assume the current package scripts are safe on Windows.
- Keep `walkthrough.md` updated after each meaningful implementation pass.
- If you change auth, destination, or tool behavior, also update `README.md`.

## Session Outcome

This session established the initial working baseline.

Completed in this pass:

- reviewed the project structure and core source files
- documented the repo and roadmap in `walkthrough.md`
- installed dependencies
- fixed Windows-incompatible npm scripts in `package.json`
- confirmed `npm run build` succeeds
- confirmed the server starts and `/health` works locally

Still pending:

- real XSUAA validation
- destination resolution against SAP BTP
- end-to-end execution of all CALM MCP tools
- server hardening beyond the initial local-build fixes

## Verified Runtime Status

Confirmed in hybrid mode with real BTP bindings:

- `get-landscape-info`: works
- `get-status-events`: works
- `get-landscape-property-info`: works for some object types, but should fail with a friendly message for `BusinessService` IDs
- `find-property-capable-landscape-objects`: works
- `gather-incident-context`: works
- `find-recent-service-disruptions`: works
- `/dashboard`: now serves the guided non-technical user experience
- `/dashboard/dev`: now serves the raw developer console

Interpretation:

- the local MCP server, OAuth flow, session flow, destination lookup, and both dashboard modes work
- the remaining blocker for `get-landscape-property-info` is object-type specific SAP behavior, not local server wiring
