function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderPageShell(options: {
    title: string;
    description: string;
    modeLabel: string;
    modeHref: string;
    modeText: string;
    scriptPath: string;
    defaultScopes: string[];
    devScopeBypassEnabled: boolean;
    showMetaBadges?: boolean;
    body: string;
}): string {
    const scopeText = options.defaultScopes.join(', ') || 'none';
    const assetVersion = '20260312-ui-3';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(options.title)}</title>
    <style>
        :root {
            --bg: #07101d;
            --bg-2: #0d1730;
            --panel: rgba(12, 20, 37, 0.92);
            --panel-alt: rgba(15, 26, 47, 0.88);
            --panel-soft: rgba(18, 31, 57, 0.68);
            --text: #f5f8ff;
            --muted: #93a8c7;
            --line: rgba(144, 168, 199, 0.18);
            --accent: #ff8a3d;
            --accent-strong: #ff6b2d;
            --accent-soft: rgba(255, 138, 61, 0.16);
            --accent-2: #6ee7ff;
            --accent-3: #9bffcf;
            --warn: #ffb15c;
            --warn-soft: rgba(255, 177, 92, 0.14);
            --danger: #ff7b8f;
            --danger-soft: rgba(255, 123, 143, 0.14);
            --shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
            --radius: 28px;
            --font: "Aptos", "Trebuchet MS", "Segoe UI", sans-serif;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: var(--font);
            color: var(--text);
            background:
                radial-gradient(circle at 12% 18%, rgba(110, 231, 255, 0.18), transparent 20%),
                radial-gradient(circle at 86% 12%, rgba(255, 138, 61, 0.2), transparent 18%),
                radial-gradient(circle at 68% 72%, rgba(155, 255, 207, 0.12), transparent 22%),
                linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%);
            min-height: 100vh;
            position: relative;
        }
        body::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            background:
                linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
            background-size: 44px 44px;
            mask-image: radial-gradient(circle at center, black 42%, transparent 82%);
            opacity: 0.42;
        }
        .shell { max-width: 1480px; margin: 0 auto; padding: 36px 22px 88px; position: relative; z-index: 1; }
        .hero {
            background:
                radial-gradient(circle at top right, rgba(110, 231, 255, 0.2), transparent 28%),
                radial-gradient(circle at bottom left, rgba(255, 138, 61, 0.24), transparent 24%),
                linear-gradient(135deg, rgba(13, 22, 40, 0.98), rgba(10, 17, 29, 0.96));
            border: 1px solid rgba(144, 168, 199, 0.16);
            border-radius: 36px;
            box-shadow: var(--shadow);
            padding: 40px;
            display: grid;
            gap: 24px;
            position: relative;
            overflow: hidden;
            animation: rise 520ms ease both;
        }
        .hero::after {
            content: "";
            position: absolute;
            inset: auto -12% -45% 48%;
            height: 380px;
            background: radial-gradient(circle, rgba(110, 231, 255, 0.2), transparent 62%);
            filter: blur(18px);
            pointer-events: none;
        }
        .hero-top { display: flex; justify-content: space-between; gap: 16px; align-items: start; flex-wrap: wrap; }
        .eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em; color: var(--accent-2); font-weight: 800; margin-bottom: 10px; }
        h1 { margin: 0; font-size: clamp(40px, 7vw, 84px); line-height: 0.9; letter-spacing: -0.06em; max-width: 10ch; }
        .hero p { max-width: 760px; color: var(--muted); font-size: 21px; line-height: 1.65; margin: 0; }
        .hero-actions, .badge-row, .button-row, .pill-list, .action-strip { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .badge, .pill {
            border-radius: 999px;
            padding: 10px 16px;
            font-size: 14px;
            font-weight: 600;
        }
        .badge { background: rgba(18, 31, 57, 0.88); border: 1px solid var(--line); color: var(--muted); }
        .pill { background: rgba(110, 231, 255, 0.12); color: var(--accent-2); padding: 8px 12px; font-size: 13px; font-weight: 700; }
        .layout { margin-top: 28px; display: grid; gap: 24px; }
        .layout.two-col { grid-template-columns: minmax(300px, 380px) minmax(0, 1fr); }
        .panel {
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: 26px;
            backdrop-filter: blur(18px);
            animation: rise 580ms ease both;
        }
        .panel.alt { background: var(--panel-alt); }
        .stack, .stack-lg, .cards, .key-value { display: grid; gap: 16px; }
        .stack-lg { gap: 24px; }
        .section-title { margin: 0 0 8px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent-2); }
        .section-copy, .tiny, .muted { color: var(--muted); line-height: 1.5; margin: 0; }
        label { font-size: 12px; font-weight: 800; color: #c6d5ea; display: block; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
        input, select, textarea, button { font: inherit; }
        input, select, textarea {
            width: 100%;
            border: 1px solid rgba(144, 168, 199, 0.16);
            border-radius: 20px;
            background: rgba(9, 16, 30, 0.84);
            color: var(--text);
            padding: 16px 18px;
            min-height: 56px;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
        }
        input::placeholder,
        textarea::placeholder {
            color: rgba(147, 168, 199, 0.74);
        }
        input:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: rgba(110, 231, 255, 0.44);
            box-shadow: 0 0 0 4px rgba(110, 231, 255, 0.08);
        }
        textarea { min-height: 132px; resize: vertical; }
        button, .button-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 18px;
            min-height: 54px;
            padding: 0 22px;
            text-decoration: none;
            cursor: pointer;
            font-weight: 800;
            transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease;
        }
        button:hover,
        .button-link:hover {
            transform: translateY(-2px);
        }
        .primary {
            background: linear-gradient(135deg, var(--accent), #ffb35a);
            color: #111827;
            box-shadow: 0 16px 34px rgba(255, 138, 61, 0.22);
        }
        .primary:hover { background: linear-gradient(135deg, var(--accent-strong), var(--accent)); }
        .secondary {
            background: rgba(18, 31, 57, 0.9);
            color: var(--text);
            border: 1px solid rgba(144, 168, 199, 0.14);
        }
        .ghost {
            background: rgba(12, 20, 37, 0.7);
            color: var(--accent-2);
            border: 1px solid rgba(110, 231, 255, 0.22);
        }
        .status {
            border-radius: 22px;
            padding: 16px 18px;
            line-height: 1.45;
            border: 1px solid rgba(110, 231, 255, 0.18);
            background: rgba(110, 231, 255, 0.09);
            color: #d7fbff;
        }
        .status.warn { background: var(--warn-soft); border-color: rgba(255, 177, 92, 0.2); color: #ffd8a4; }
        .status.error { background: var(--danger-soft); border-color: rgba(255, 123, 143, 0.18); color: #ffb7c1; }
        .grid-2 { display: grid; gap: 20px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .grid-3 { display: grid; gap: 20px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .card {
            background: linear-gradient(180deg, rgba(19, 31, 56, 0.9), rgba(10, 18, 33, 0.92));
            border: 1px solid rgba(144, 168, 199, 0.14);
            border-radius: 24px;
            padding: 20px;
            box-shadow: 0 18px 46px rgba(0, 0, 0, 0.2);
        }
        .card h3, .card h4 { margin: 0 0 8px; }
        .card.compact { padding: 16px; }
        .helper { font-size: 13px; color: #456174; line-height: 1.5; }
        .highlight {
            background: linear-gradient(135deg, rgba(110, 231, 255, 0.12), rgba(255,255,255,0.04));
            border: 1px solid rgba(110, 231, 255, 0.2);
        }
        .result-toolbar {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            align-items: center;
            flex-wrap: wrap;
        }
        .task-card {
            background:
                linear-gradient(180deg, rgba(18, 31, 57, 0.98), rgba(8, 14, 26, 0.96));
            border: 1px solid rgba(144, 168, 199, 0.14);
            border-radius: 28px;
            padding: 24px;
            display: grid;
            gap: 16px;
            position: relative;
            overflow: hidden;
            transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
            animation: rise 620ms ease both;
        }
        .task-card::before {
            content: "";
            position: absolute;
            inset: 0 auto auto 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3));
            opacity: 0.84;
        }
        .task-card:hover {
            transform: translateY(-6px);
            border-color: rgba(110, 231, 255, 0.24);
            box-shadow: 0 28px 56px rgba(0, 0, 0, 0.28);
        }
        .task-card h3 { margin: 0; font-size: 28px; line-height: 1.05; }
        .task-number {
            width: 40px;
            height: 40px;
            border-radius: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(110, 231, 255, 0.12);
            color: var(--accent-2);
            font-weight: 800;
            font-size: 15px;
        }
        .task-top {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .task-card .button-row {
            margin-top: 4px;
        }
        .subtle-panel {
            background: rgba(18, 31, 57, 0.72);
            border: 1px solid rgba(144, 168, 199, 0.14);
            border-radius: 20px;
            padding: 16px;
        }
        .is-hidden { display: none !important; }
        .action-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
            align-items: start;
        }
        .action-hub {
            display: grid;
            gap: 22px;
            grid-template-columns: minmax(360px, 0.95fr) minmax(0, 1.05fr);
            align-items: start;
        }
        .action-choice-grid {
            display: grid;
            gap: 14px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            align-content: start;
        }
        .action-option {
            width: 100%;
            min-height: 0;
            border-radius: 22px;
            border: 1px solid rgba(144, 168, 199, 0.14);
            background: linear-gradient(180deg, rgba(18, 31, 57, 0.9), rgba(8, 14, 26, 0.92));
            color: var(--text);
            padding: 18px 18px 20px;
            display: grid;
            gap: 10px;
            justify-items: start;
            align-content: start;
            text-align: left;
            position: relative;
            overflow: hidden;
            box-shadow: 0 14px 36px rgba(0, 0, 0, 0.16);
        }
        .action-option::before {
            content: "";
            position: absolute;
            inset: 0 auto auto 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, rgba(110, 231, 255, 0.92), rgba(255, 138, 61, 0.92));
            opacity: 0;
            transition: opacity 180ms ease;
        }
        .action-option:hover,
        .action-option.is-active {
            transform: translateY(-4px);
            border-color: rgba(110, 231, 255, 0.28);
            box-shadow: 0 22px 44px rgba(0, 0, 0, 0.24);
        }
        .action-option:hover::before,
        .action-option.is-active::before {
            opacity: 1;
        }
        .action-option.is-active {
            background:
                radial-gradient(circle at top right, rgba(110, 231, 255, 0.16), transparent 34%),
                linear-gradient(180deg, rgba(20, 35, 66, 0.98), rgba(8, 14, 26, 0.96));
        }
        .action-option strong {
            font-size: 20px;
            line-height: 1.15;
        }
        .action-option span {
            color: var(--muted);
            font-size: 14px;
            line-height: 1.5;
            font-weight: 600;
        }
        .action-preview {
            padding: 20px;
            border-radius: 24px;
            background: linear-gradient(180deg, rgba(18, 31, 57, 0.96), rgba(8, 14, 26, 0.94));
            border: 1px solid rgba(144, 168, 199, 0.14);
            min-height: 100%;
        }
        .action-workbench {
            padding: 26px;
            border-radius: 28px;
            background:
                radial-gradient(circle at top right, rgba(255, 138, 61, 0.1), transparent 24%),
                linear-gradient(180deg, rgba(18, 31, 57, 0.98), rgba(8, 14, 26, 0.96));
            border: 1px solid rgba(144, 168, 199, 0.14);
            box-shadow: 0 22px 50px rgba(0, 0, 0, 0.24);
        }
        .action-preview h3 {
            margin: 0 0 10px;
            font-size: 28px;
            line-height: 1.05;
        }
        .action-meta {
            display: grid;
            gap: 14px;
        }
        .action-select-shell {
            display: grid;
            gap: 10px;
            padding: 14px 16px;
            border-radius: 20px;
            background: rgba(8, 14, 26, 0.72);
            border: 1px solid rgba(144, 168, 199, 0.1);
        }
        .action-eyebrow {
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--accent-2);
        }
        .key-row { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; border-bottom: 1px solid rgba(144, 168, 199, 0.12); padding-bottom: 8px; }
        .key-row:last-child { border-bottom: 0; padding-bottom: 0; }
        pre {
            margin: 0;
            background: linear-gradient(180deg, rgba(5, 10, 20, 0.96), rgba(8, 15, 28, 0.98));
            color: #dff3ff;
            padding: 18px;
            border-radius: 20px;
            overflow: auto;
            line-height: 1.6;
            border: 1px solid rgba(110, 231, 255, 0.1);
        }
        details {
            border: 1px solid rgba(144, 168, 199, 0.14);
            border-radius: 22px;
            padding: 16px 18px;
            background: rgba(14, 24, 42, 0.72);
        }
        summary {
            cursor: pointer;
            font-weight: 800;
            color: var(--text);
            letter-spacing: 0.02em;
        }
        @keyframes rise {
            from {
                opacity: 0;
                transform: translateY(16px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @media (max-width: 960px) {
            .layout.two-col, .grid-2, .grid-3, .action-grid, .action-hub, .action-choice-grid { grid-template-columns: 1fr; }
            .shell { padding: 20px 14px 40px; }
            .hero { padding: 24px; }
            h1 { max-width: none; }
        }
    </style>
</head>
<body>
    <div class="shell">
        <section class="hero">
            <div class="hero-top">
                <div>
                    <div class="eyebrow">${escapeHtml(options.modeLabel)}</div>
                    <h1>${escapeHtml(options.title)}</h1>
                </div>
                <div class="hero-actions">
                    <a class="button-link secondary" href="/docs">Docs</a>
                    ${options.showMetaBadges === false ? '' : `<a class="button-link secondary" href="/.well-known/oauth-authorization-server">OAuth Metadata</a>`}
                    <a class="button-link ghost" href="${escapeHtml(options.modeHref)}">${escapeHtml(options.modeText)}</a>
                </div>
            </div>
            <p>${escapeHtml(options.description)}</p>
            ${options.showMetaBadges === false ? '' : `
            <div class="badge-row">
                <div class="badge">Default scopes: ${escapeHtml(scopeText)}</div>
                <div class="badge">Dev scope bypass: ${options.devScopeBypassEnabled ? 'enabled' : 'disabled'}</div>
            </div>`}
        </section>
        ${options.body}
    </div>
    <script src="${escapeHtml(options.scriptPath)}?v=${assetVersion}"></script>
</body>
</html>`;
}

export function renderUserDashboardHtml(defaultScopes: string[], devScopeBypassEnabled: boolean): string {
    return renderPageShell({
        title: 'Cloud ALM Assistant',
        description: 'A guided workspace for non-technical users. Connect once, then use simple forms to explore systems, check disruptions, and gather incident context without writing JSON.',
        modeLabel: 'User Mode',
        modeHref: '/dashboard/dev',
        modeText: 'Open Developer Mode',
        scriptPath: '/dashboard-user.js',
        defaultScopes,
        devScopeBypassEnabled,
        body: `
        <div class="layout two-col">
            <aside class="stack-lg">
                <section class="panel">
                    <div class="stack">
                        <div>
                            <h2 class="section-title">1. Connect</h2>
                            <p class="section-copy">Sign in with SAP once. The page will finish the login flow automatically when you come back.</p>
                        </div>
                        <div class="button-row">
                            <button id="user-connect-button" class="primary" type="button">Connect to SAP</button>
                            <button id="user-refresh-button" class="secondary" type="button">Refresh Session</button>
                        </div>
                        <div id="user-auth-status" class="status">Not connected yet.</div>
                        <details>
                            <summary>Advanced</summary>
                            <div class="stack" style="margin-top: 16px;">
                                <div>
                                    <label for="user-redirect-uri">Redirect URI</label>
                                    <input id="user-redirect-uri" type="text">
                                </div>
                                <div>
                                    <label for="user-token">Bearer token</label>
                                    <textarea id="user-token" spellcheck="false"></textarea>
                                </div>
                            </div>
                        </details>
                    </div>
                </section>
                <section class="panel alt">
                    <div class="stack">
                        <div>
                            <h2 class="section-title">How this helps</h2>
                            <p class="section-copy">Choose a simple task below. The page handles sign-in, MCP session setup, and SAP calls behind the scenes.</p>
                        </div>
                        <div class="cards">
                            <div class="card compact"><h3>Find a system or service</h3><p class="section-copy">Search by name or system number and use the result cards to continue with one click.</p></div>
                            <div class="card compact"><h3>Check service health</h3><p class="section-copy">See if a service recently had a disruption, degradation, or maintenance issue.</p></div>
                            <div class="card compact"><h3>Understand an incident</h3><p class="section-copy">Turn raw alert text into useful context, likely causes, and next checks.</p></div>
                        </div>
                    </div>
                </section>
            </aside>
            <main class="stack-lg">
                <section class="panel">
                    <div class="stack">
                        <div>
                            <h2 class="section-title">Find a system or service</h2>
                            <p class="section-copy">Start with the name you know. We will look up matching Cloud ALM objects and highlight the easiest ones to follow up on.</p>
                        </div>
                        <div class="grid-2">
                            <div><label for="lookup-name">System or service name</label><input id="lookup-name" type="text" placeholder="45201 or Finance"></div>
                            <div><label for="lookup-system-number">System number</label><input id="lookup-system-number" type="text" placeholder="740316077"></div>
                            <div>
                                <label for="lookup-object-type">What are you looking for?</label>
                                <select id="lookup-object-type">
                                    <option value="">Anything</option>
                                    <option value="CloudService">Cloud service</option>
                                    <option value="TechnicalSystem">Technical system</option>
                                    <option value="BusinessService">Business service</option>
                                </select>
                            </div>
                            <div>
                                <label for="lookup-limit">Results</label>
                                <select id="lookup-limit">
                                    <option value="5">5</option>
                                    <option value="10" selected>10</option>
                                    <option value="25">25</option>
                                </select>
                            </div>
                        </div>
                        <div class="button-row">
                            <button id="lookup-submit" class="primary" type="button">Find Matches</button>
                            <button id="lookup-clear" class="secondary" type="button">Clear</button>
                        </div>
                        <div id="lookup-status" class="status">No search run yet.</div>
                    </div>
                </section>
                <section class="panel">
                    <div class="stack">
                        <div>
                            <h2 class="section-title">Check service health</h2>
                            <p class="section-copy">See if a service recently had disruptions or degradations. Good for triage before diving into details.</p>
                        </div>
                        <div class="grid-2">
                            <div><label for="disruption-service-name">Service name</label><input id="disruption-service-name" type="text" placeholder="45201"></div>
                            <div>
                                <label for="disruption-limit">Results</label>
                                <select id="disruption-limit">
                                    <option value="5" selected>5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                </select>
                            </div>
                        </div>
                        <div class="button-row"><button id="disruption-submit" class="primary" type="button">Check Health</button></div>
                        <div id="disruption-status" class="status">No disruption check run yet.</div>
                    </div>
                </section>
                <section class="panel">
                    <div class="stack">
                        <div>
                            <h2 class="section-title">Explain an incident</h2>
                            <p class="section-copy">Paste the alert text you received, optionally add a service name, and the assistant will gather relevant ALM context.</p>
                        </div>
                        <div class="grid-2">
                            <div><label for="incident-service-name">Service name</label><input id="incident-service-name" type="text" placeholder="45201"></div>
                            <div>
                                <label for="incident-limit">Events to inspect</label>
                                <select id="incident-limit">
                                    <option value="5" selected>5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                </select>
                            </div>
                        </div>
                        <div><label for="incident-raw-alert">Alert or issue text</label><textarea id="incident-raw-alert" placeholder="Integration failed because the authentication token expired."></textarea></div>
                        <div class="button-row"><button id="incident-submit" class="primary" type="button">Explain This Incident</button></div>
                        <div id="incident-status" class="status">No incident analysis run yet.</div>
                    </div>
                </section>
                <section class="panel alt">
                    <div class="stack">
                        <div class="result-toolbar">
                            <div>
                                <h2 class="section-title">Results</h2>
                                <p class="section-copy">Guided cards appear here after each action. Use the buttons on each card to continue the workflow.</p>
                            </div>
                            <div id="user-selection-summary" class="badge">No system selected yet</div>
                        </div>
                        <div id="user-results" class="cards">
                            <div class="card"><h3>No results yet</h3><p class="section-copy">Connect to SAP, then run one of the guided actions above.</p></div>
                        </div>
                        <details>
                            <summary>Raw response details</summary>
                            <div style="margin-top: 16px;"><pre id="user-raw-response">No requests sent yet.</pre></div>
                        </details>
                    </div>
                </section>
            </main>
        </div>`
    });
}

export function renderDashboardHtml(defaultScopes: string[], devScopeBypassEnabled: boolean): string {
    return renderPageShell({
        title: 'Cloud ALM Assistant',
        description: 'Use simple actions to find systems, check service health, and understand incidents. Technical controls are still here, but they stay out of the way until you need them.',
        modeLabel: 'Assistant Mode',
        modeHref: '/docs',
        modeText: 'Open Docs',
        scriptPath: '/dashboard.js',
        defaultScopes,
        devScopeBypassEnabled,
        showMetaBadges: false,
        body: `
        <div class="layout">
            <section class="panel">
                <div class="grid-2">
                    <div class="stack">
                        <div>
                            <h2 class="section-title">1. Connect</h2>
                            <p class="section-copy">Sign in once with SAP and keep the session ready while you work through incidents and service checks.</p>
                        </div>
                        <div class="button-row">
                            <button id="connect-button" class="primary" type="button">Connect to SAP</button>
                            <button id="finish-login-button" class="secondary" type="button">Finish Login</button>
                            <button id="refresh-session-button" class="secondary" type="button">Refresh Session</button>
                        </div>
                    </div>
                    <div class="stack">
                        <div>
                            <h2 class="section-title">Session Status</h2>
                            <p class="section-copy">This area confirms whether the assistant is connected and ready to work.</p>
                        </div>
                        <div id="auth-status" class="status">Not connected yet.</div>
                    </div>
                </div>
            </section>
            <section class="panel alt">
                <div class="stack-lg">
                    <div>
                        <h2 class="section-title">2. Action Studio</h2>
                        <p class="section-copy">Every Cloud ALM action is available here. Pick one and the workspace changes its inputs for you, so you do not need the Advanced Tools panel unless you actually want raw JSON.</p>
                    </div>
                    <div class="action-hub">
                        <div class="action-choice-grid">
                            <button class="action-option is-active" type="button" data-tool="get-landscape-info">
                                <strong>Landscape Overview</strong>
                                <span>Browse systems and services already known in Cloud ALM.</span>
                            </button>
                            <button class="action-option" type="button" data-tool="find-property-capable-landscape-objects">
                                <strong>Property-Safe Systems</strong>
                                <span>Find objects that are better candidates for property follow-up.</span>
                            </button>
                            <button class="action-option" type="button" data-tool="get-landscape-property-info">
                                <strong>Landscape Properties</strong>
                                <span>Load a detailed property view when you already have an lmsId.</span>
                            </button>
                            <button class="action-option" type="button" data-tool="get-status-events">
                                <strong>Status Events</strong>
                                <span>Review the latest maintenance, degradation, and disruption events.</span>
                            </button>
                            <button class="action-option" type="button" data-tool="gather-incident-context">
                                <strong>Incident Context</strong>
                                <span>Combine event history, service context, and alert text into one investigation view.</span>
                            </button>
                            <button class="action-option" type="button" data-tool="find-recent-service-disruptions">
                                <strong>Recent Disruptions</strong>
                                <span>Check a service for the most recent disruption and degradation events.</span>
                            </button>
                        </div>
                        <div class="action-workbench">
                            <div class="stack">
                                <div class="action-select-shell">
                                    <div class="action-eyebrow">Selected action</div>
                                    <h3 id="normal-action-title">Landscape Overview</h3>
                                    <div class="action-meta">
                                        <p id="normal-action-description" class="section-copy">Browse Cloud ALM landscape objects and services.</p>
                                        <div id="normal-action-tags" class="pill-list">
                                            <span class="pill">Landscape</span>
                                        </div>
                                    </div>
                                </div>
                                <select id="normal-action-select" class="is-hidden" aria-hidden="true" tabindex="-1"></select>
                                <div id="normal-name-group">
                                    <label id="normal-name-label" for="normal-name-input">Service or system name</label>
                                    <input id="normal-name-input" type="text" placeholder="45201 or Finance">
                                </div>
                                <div id="normal-lmsid-group" class="is-hidden">
                                    <label for="normal-lmsid-input">Landscape ID</label>
                                    <input id="normal-lmsid-input" type="text" placeholder="Paste an lmsId here">
                                </div>
                                <div class="grid-2">
                                    <div id="normal-limit-group">
                                        <label for="normal-limit-select">Results</label>
                                        <select id="normal-limit-select">
                                            <option value="5">5</option>
                                            <option value="10" selected>10</option>
                                            <option value="20">20</option>
                                            <option value="25">25</option>
                                        </select>
                                    </div>
                                    <div id="normal-object-type-group" class="is-hidden">
                                        <label for="normal-object-type-select">Object type</label>
                                        <select id="normal-object-type-select">
                                            <option value="">Any type</option>
                                            <option value="CloudService">Cloud service</option>
                                            <option value="TechnicalSystem">Technical system</option>
                                            <option value="BusinessService">Business service</option>
                                        </select>
                                    </div>
                                </div>
                                <div id="normal-alert-group" class="is-hidden">
                                    <label for="normal-alert-input">Alert text</label>
                                    <textarea id="normal-alert-input" spellcheck="false" placeholder="Integration failed because the authentication token expired."></textarea>
                                </div>
                                <div class="button-row">
                                    <button id="normal-action-run" class="primary" type="button">Run Selected Action</button>
                                </div>
                                <div id="normal-action-status" class="status">Choose an action and run it from here.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="grid-2">
                <section class="panel alt">
                    <div class="stack">
                        <div>
                            <h2 class="section-title">Friendly Summary</h2>
                            <p class="section-copy">This section translates technical results into a quicker business-facing summary.</p>
                        </div>
                        <div id="friendly-summary" class="cards">
                            <div class="card"><h3>No summary yet</h3><p class="section-copy">Run a tool to see a user-friendly summary here.</p></div>
                        </div>
                    </div>
                </section>
                <section class="panel alt">
                    <div class="stack">
                        <div>
                            <h2 class="section-title">Result Explorer</h2>
                            <p class="section-copy">Use these follow-up cards to move from search results into deeper checks without rewriting inputs.</p>
                        </div>
                        <div id="result-explorer" class="cards">
                            <div class="card"><h3>No result data yet</h3><p class="section-copy">Run a tool to turn results into follow-up actions.</p></div>
                        </div>
                    </div>
                </section>
            </section>
            <section class="panel alt">
                <details>
                    <summary>Advanced Tools</summary>
                    <div class="stack" style="margin-top: 16px;">
                        <div>
                            <h2 class="section-title">Tool Runner</h2>
                            <p class="section-copy">Run any registered MCP tool with raw JSON arguments.</p>
                        </div>
                        <div><label for="tool-select">Tool</label><select id="tool-select"></select></div>
                        <div><label for="tool-args">Arguments (JSON)</label><textarea id="tool-args" spellcheck="false"></textarea></div>
                        <div class="button-row">
                            <button id="run-tool-button" class="primary" type="button">Run Tool</button>
                            <button id="list-tools-button" class="secondary" type="button">List Tools</button>
                        </div>
                        <div id="tool-status" class="status">No active MCP session yet.</div>
                        <details>
                            <summary>Developer Controls</summary>
                            <div class="stack" style="margin-top: 16px;">
                                <div class="subtle-panel">
                                    <p class="section-copy">Use this only if you need to inspect or troubleshoot the SAP sign-in session.</p>
                                </div>
                                <div><label for="redirect-uri">Redirect URI</label><input id="redirect-uri" type="text"></div>
                                <div><label for="token-input">Bearer token</label><textarea id="token-input" spellcheck="false"></textarea></div>
                                <div class="button-row">
                                    <button id="inspect-token-button" class="secondary" type="button">Inspect Token</button>
                                    <button id="initialize-session-button" class="secondary" type="button">Initialize Session</button>
                                </div>
                            </div>
                        </details>
                        <div>
                            <h2 class="section-title">Parsed Response</h2>
                            <p class="section-copy">Technical JSON stays available here when you need to inspect the exact payload.</p>
                        </div>
                        <pre id="response-output">No requests sent yet.</pre>
                        <details>
                            <summary>Raw payload</summary>
                            <div style="margin-top: 16px;"><pre id="raw-payload-output">No requests sent yet.</pre></div>
                        </details>
                    </div>
                </details>
            </section>
        </div>`
    });
}

export function renderDashboardScript(): string {
    return String.raw`
const STORAGE_KEY = 'calm_mcp_dashboard_state_v2';
const TOOL_PRESETS = {
    'get-landscape-info': { limit: 5 },
    'find-property-capable-landscape-objects': { limit: 10 },
    'get-landscape-property-info': { lmsId: '' },
    'get-status-events': { limit: 5 },
    'gather-incident-context': { limit: 5 },
    'find-recent-service-disruptions': { limit: 5 }
};
const TOOL_ORDER = [
    'get-landscape-info',
    'find-property-capable-landscape-objects',
    'get-landscape-property-info',
    'get-status-events',
    'gather-incident-context',
    'find-recent-service-disruptions'
];
const TOOL_META = {
    'get-landscape-info': {
        label: 'Landscape Overview',
        description: 'Browse Cloud ALM landscape objects and services.',
        tags: ['Landscape', 'Search'],
        button: 'Run Landscape Search',
        nameLabel: 'Service or system name',
        namePlaceholder: '45201 or Finance',
        showName: true,
        showLmsId: false,
        showLimit: true,
        showObjectType: true,
        showAlert: false
    },
    'find-property-capable-landscape-objects': {
        label: 'Property-Safe Systems',
        description: 'Find systems that are better candidates for follow-up property lookups.',
        tags: ['Landscape', 'Follow-up'],
        button: 'Find Safe Systems',
        nameLabel: 'Service or system name',
        namePlaceholder: '45201 or Recruiting',
        showName: true,
        showLmsId: false,
        showLimit: true,
        showObjectType: true,
        showAlert: false
    },
    'get-landscape-property-info': {
        label: 'Landscape Properties',
        description: 'Inspect properties for a specific landscape object when you already have its lmsId.',
        tags: ['Properties', 'Details'],
        button: 'Load Properties',
        nameLabel: 'Service or system name',
        lmsIdPlaceholder: 'Paste the lmsId returned by a landscape search',
        showName: false,
        showLmsId: true,
        showLimit: false,
        showObjectType: false,
        showAlert: false
    },
    'get-status-events': {
        label: 'Status Events',
        description: 'Review the latest Cloud ALM maintenance, degradation, and disruption events.',
        tags: ['Events', 'Monitoring'],
        button: 'Check Status Events',
        nameLabel: 'Service name',
        namePlaceholder: '45201',
        showName: true,
        showLmsId: false,
        showLimit: true,
        showObjectType: false,
        showAlert: false
    },
    'gather-incident-context': {
        label: 'Incident Context',
        description: 'Combine service context, event history, and raw alert text into one investigation view.',
        tags: ['Incident', 'AI Summary'],
        button: 'Explain Incident',
        nameLabel: 'Service name',
        namePlaceholder: '45201',
        alertPlaceholder: 'Integration failed because the authentication token expired.',
        showName: true,
        showLmsId: false,
        showLimit: true,
        showObjectType: false,
        showAlert: true
    },
    'find-recent-service-disruptions': {
        label: 'Recent Disruptions',
        description: 'Look for the most recent disruptions and degradations for a service.',
        tags: ['Health', 'Disruptions'],
        button: 'Check Service Health',
        nameLabel: 'Service name',
        namePlaceholder: '45201',
        showName: true,
        showLmsId: false,
        showLimit: true,
        showObjectType: false,
        showAlert: false
    }
};

const state = {
    token: '',
    sessionId: '',
    lastResult: null,
    tokenInfo: null
};

function byId(id) { return document.getElementById(id); }
function defaultRedirectUri() { return window.location.origin + '/dashboard'; }
function parseMaybeJson(value) {
    if (typeof value !== 'string') { return value; }
    try { return JSON.parse(value); } catch (error) { return value; }
}
function parseSseFrame(text) {
    if (typeof text !== 'string' || text.indexOf('event:') === -1 || text.indexOf('data:') === -1) {
        return null;
    }
    const dataLines = text
        .split('\n')
        .filter(function(line) { return line.startsWith('data:'); })
        .map(function(line) { return line.slice(5).trim(); });
    if (!dataLines.length) {
        return null;
    }
    const dataText = dataLines.join('\n');
    return parseMaybeJson(dataText);
}
function setStatus(elementId, message, tone) {
    const apply = function(id) {
        const el = byId(id);
        if (!el) { return; }
        el.textContent = message;
        el.className = 'status';
        if (tone === 'warn') { el.classList.add('warn'); }
        if (tone === 'error') { el.classList.add('error'); }
    };
    apply(elementId);
    if (elementId === 'tool-status') {
        apply('normal-action-status');
    }
}
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: state.token, sessionId: state.sessionId }));
}
function loadState() {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        state.token = typeof parsed.token === 'string' ? parsed.token : '';
        state.sessionId = typeof parsed.sessionId === 'string' ? parsed.sessionId : '';
    } catch (error) {
        console.warn('Failed to load dashboard state', error);
    }
}
function setResponse(value) { byId('response-output').textContent = value; }
function setRawPayload(value) { byId('raw-payload-output').textContent = value; }
function collectContentText(result) {
    if (!result || !Array.isArray(result.content)) { return null; }
    const textParts = result.content
        .filter(function(entry) { return entry && entry.type === 'text' && typeof entry.text === 'string'; })
        .map(function(entry) { return entry.text; });
    return textParts.length ? textParts.join('\n') : null;
}
function parseMcpPayload(payload) {
    const ssePayload = parseSseFrame(payload);
    if (ssePayload) {
        return parseMcpPayload(ssePayload);
    }
    if (payload && payload.result) {
        const text = collectContentText(payload.result);
        return text !== null ? parseMaybeJson(text) : payload.result;
    }
    if (payload && payload.error) { return payload.error; }
    return payload;
}
function renderParsedResponse(toolName, parsed) {
    const header = toolName ? 'Tool call: ' + toolName + '\n\n' : '';
    setResponse(typeof parsed === 'string' ? header + parsed : header + JSON.stringify(parsed, null, 2));
}
function renderFriendlySummary(toolName, parsed) {
    const el = byId('friendly-summary');
    if (!el) {
        return;
    }
    if (toolName === 'gather-incident-context' && parsed && typeof parsed === 'object') {
        const summary = parsed.summary || {};
        const hypotheses = Array.isArray(parsed.hypotheses) ? parsed.hypotheses : [];
        const nextChecks = Array.isArray(parsed.nextChecks) ? parsed.nextChecks : [];
        el.innerHTML =
            '<div class="card">' +
                '<h3>What this likely means</h3>' +
                '<p class="section-copy">' + (summary.suggestedFocus || 'Review the latest events and related systems.') + '</p>' +
                '<div class="pill-list" style="margin-top:12px;">' +
                    '<span class="pill">Events: ' + (summary.totalEvents ?? 0) + '</span>' +
                    '<span class="pill">Related systems: ' + (summary.relatedLandscapeObjectCount ?? 0) + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="card">' +
                '<h3>Likely causes</h3>' +
                (hypotheses.length
                    ? hypotheses.map(function(item) { return '<p class="section-copy">' + item + '</p>'; }).join('')
                    : '<p class="section-copy">No likely causes inferred yet.</p>') +
            '</div>' +
            '<div class="card">' +
                '<h3>Next checks</h3>' +
                (nextChecks.length
                    ? nextChecks.map(function(item) { return '<p class="section-copy">' + item + '</p>'; }).join('')
                    : '<p class="section-copy">No next checks suggested yet.</p>') +
            '</div>';
        return;
    }
    if (toolName === 'find-recent-service-disruptions' && parsed && typeof parsed === 'object') {
        const summary = parsed.summary || {};
        el.innerHTML =
            '<div class="card">' +
                '<h3>Service health summary</h3>' +
                '<p class="section-copy">Recent disruption review completed for ' + (((summary.services || []).join(', ')) || 'the selected service') + '.</p>' +
                '<div class="pill-list" style="margin-top:12px;">' +
                    '<span class="pill">Disruptions: ' + (summary.totalDisruptions ?? 0) + '</span>' +
                    '<span class="pill">Types: ' + (((summary.eventTypes || []).join(', ')) || 'n/a') + '</span>' +
                '</div>' +
            '</div>';
        return;
    }
    if (Array.isArray(parsed)) {
        el.innerHTML =
            '<div class="card">' +
                '<h3>Quick read</h3>' +
                '<p class="section-copy">Found ' + parsed.length + ' result' + (parsed.length === 1 ? '' : 's') + '. Use the Result Explorer for follow-up actions.</p>' +
            '</div>';
        return;
    }
    el.innerHTML = '<div class="card"><h3>No summary yet</h3><p class="section-copy">Run a tool to see a user-friendly summary here.</p></div>';
}
async function inspectToken() {
    if (!state.token) {
        setStatus('auth-status', 'Paste a bearer token or connect first.', 'warn');
        return null;
    }
    const response = await fetch('/debug/token-info', { headers: { Authorization: 'Bearer ' + state.token } });
    const payload = await response.json();
    state.tokenInfo = payload;
    if (!response.ok) {
        setStatus('auth-status', payload.message || payload.error || 'Failed to inspect token.', 'error');
        return null;
    }
    const scopes = Array.isArray(payload.scopes) ? payload.scopes.join(', ') : 'none';
    const bypass = payload.devScopeBypassEnabled ? ' | bypass enabled' : '';
    const user = payload.email || payload.username || 'unknown user';
    setStatus('auth-status', 'User: ' + user + ' | scopes: ' + scopes + bypass, payload.hasRequiredScopes ? '' : 'warn');
    return payload;
}
async function exchangeCodeFromUrl() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (!code) {
        return false;
    }
    setStatus('auth-status', 'Exchanging login code for an access token...', '');
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    const response = await fetch('/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });
    const payload = await response.json();
    setRawPayload(JSON.stringify(payload, null, 2));
    if (!response.ok) {
        setStatus('auth-status', payload.error_description || payload.error || 'Token exchange failed.', 'error');
        return false;
    }
    state.token = payload.access_token || '';
    byId('token-input').value = state.token;
    saveState();
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, '', url.toString());
    setStatus('auth-status', 'Login completed. Inspecting token and initializing MCP session...', '');
    return true;
}
async function initializeSession() {
    if (!state.token) {
        setStatus('tool-status', 'Connect first so the console has a bearer token.', 'warn');
        return false;
    }
    const payload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'dashboard-dev', version: '1.0.0' }
        }
    };
    const response = await fetch('/mcp', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + state.token,
            'Content-Type': 'application/json',
            Accept: 'application/json, text/event-stream'
        },
        body: JSON.stringify(payload)
    });
    const sessionId = response.headers.get('Mcp-Session-Id') || response.headers.get('mcp-session-id') || '';
    const text = await response.text();
    setRawPayload(text);
    if (!response.ok) {
        const parsed = parseMaybeJson(text);
        const message = (parsed && parsed.error && parsed.error.message)
            || (parsed && parsed.message)
            || 'Failed to initialize MCP session.';
        state.sessionId = '';
        saveState();
        setStatus('tool-status', message, 'error');
        setResponse(typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2));
        return false;
    }
    state.sessionId = sessionId;
    saveState();
    setStatus('tool-status', 'MCP session ready' + (sessionId ? ': ' + sessionId : '.'), '');
    renderParsedResponse('initialize', parseMaybeJson(text));
    return true;
}
async function finishLoginFlow() {
    state.token = byId('token-input').value.trim() || state.token;
    saveState();
    const exchanged = await exchangeCodeFromUrl();
    if (exchanged) {
        await inspectToken();
        await initializeSession();
        return;
    }
    if (state.token) {
        await inspectToken();
        await initializeSession();
        setStatus('auth-status', 'Recovered your existing login and refreshed the MCP session.', '');
        return;
    }
    setStatus('auth-status', 'No OAuth callback code found. Click Connect first to start the login flow.', 'warn');
}
function buildAuthorizeUrl() {
    const redirectUri = byId('redirect-uri').value.trim() || defaultRedirectUri();
    const stateValue = 'dashboard-dev-' + Date.now();
    return '/oauth/authorize?redirect_uri=' + encodeURIComponent(redirectUri) + '&state=' + encodeURIComponent(stateValue) + '&scope=' + encodeURIComponent('openid');
}
async function sendMcpRequest(method, params) {
    if (!state.token) { throw new Error('No bearer token available.'); }
    if (!state.sessionId && method !== 'initialize') {
        const ready = await initializeSession();
        if (!ready) { throw new Error('MCP session is not ready.'); }
    }
    const payload = { jsonrpc: '2.0', id: Date.now(), method, params };
    const headers = {
        Authorization: 'Bearer ' + state.token,
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream'
    };
    if (state.sessionId) { headers['mcp-session-id'] = state.sessionId; }
    const response = await fetch('/mcp', { method: 'POST', headers, body: JSON.stringify(payload) });
    const sessionId = response.headers.get('Mcp-Session-Id') || response.headers.get('mcp-session-id');
    if (sessionId) { state.sessionId = sessionId; saveState(); }
    const text = await response.text();
    setRawPayload(text);
    const parsedPayload = parseMaybeJson(text);
    if (!response.ok) {
        const errorMessage = (parsedPayload && parsedPayload.error && parsedPayload.error.message) || '';
        if (response.status === 400 && errorMessage.indexOf('No valid session ID') >= 0) {
            state.sessionId = '';
            saveState();
            const ready = await initializeSession();
            if (!ready) {
                throw new Error(errorMessage || 'MCP session is not ready.');
            }
            return sendMcpRequest(method, params);
        }
        throw new Error(errorMessage || 'MCP request failed.');
    }
    return parsedPayload;
}
function updateArgsForTool(toolName, args) {
    byId('tool-select').value = toolName;
    byId('tool-args').value = JSON.stringify(args, null, 2);
}
function setVisibility(id, visible) {
    const el = byId(id);
    if (!el) {
        return;
    }
    el.classList.toggle('is-hidden', !visible);
}
function populateNormalActionSelect() {
    const select = byId('normal-action-select');
    select.innerHTML = TOOL_ORDER.map(function(tool) {
        const meta = TOOL_META[tool];
        return '<option value="' + tool + '">' + (meta ? meta.label : tool) + '</option>';
    }).join('');
    select.value = TOOL_ORDER[0];
}
function updateNormalActionForm() {
    const tool = byId('normal-action-select').value;
    const meta = TOOL_META[tool] || TOOL_META['get-landscape-info'];
    byId('normal-action-title').textContent = meta.label;
    byId('normal-action-description').textContent = meta.description;
    byId('normal-name-label').textContent = meta.nameLabel;
    byId('normal-name-input').placeholder = meta.namePlaceholder || 'Enter a name';
    byId('normal-lmsid-input').placeholder = meta.lmsIdPlaceholder || 'Paste an lmsId here';
    byId('normal-alert-input').placeholder = meta.alertPlaceholder || 'Paste the alert or issue text here';
    byId('normal-action-run').textContent = meta.button;
    byId('normal-action-tags').innerHTML = meta.tags.map(function(tag) {
        return '<span class="pill">' + tag + '</span>';
    }).join('');
    setVisibility('normal-name-group', meta.showName);
    setVisibility('normal-lmsid-group', meta.showLmsId);
    setVisibility('normal-limit-group', meta.showLimit);
    setVisibility('normal-object-type-group', meta.showObjectType);
    setVisibility('normal-alert-group', meta.showAlert);
    document.querySelectorAll('.action-option').forEach(function(button) {
        button.classList.toggle('is-active', button.getAttribute('data-tool') === tool);
    });
}
function buildNormalActionArgs() {
    const tool = byId('normal-action-select').value;
    const name = byId('normal-name-input').value.trim();
    const lmsId = byId('normal-lmsid-input').value.trim();
    const limit = Number(byId('normal-limit-select').value || '10');
    const objectType = byId('normal-object-type-select').value;
    const rawAlertText = byId('normal-alert-input').value.trim();

    switch (tool) {
        case 'get-landscape-info':
            return {
                ...(name ? { name: name } : {}),
                ...(objectType ? { objectType: objectType } : {}),
                limit: limit
            };
        case 'find-property-capable-landscape-objects':
            return {
                ...(name ? { name: name } : {}),
                ...(objectType ? { objectType: objectType } : {}),
                limit: limit
            };
        case 'get-landscape-property-info':
            return {
                lmsId: lmsId
            };
        case 'get-status-events':
            return {
                ...(name ? { serviceName: name } : {}),
                limit: limit
            };
        case 'gather-incident-context':
            return {
                ...(name ? { serviceName: name } : {}),
                ...(rawAlertText ? { rawAlertText: rawAlertText } : {}),
                limit: limit
            };
        case 'find-recent-service-disruptions':
            return {
                ...(name ? { serviceName: name } : {}),
                limit: limit
            };
        default:
            return {};
    }
}
function inferPropertyWarning(toolName, parsed) {
    if (toolName !== 'get-landscape-property-info') { return null; }
    if (parsed && parsed.message && String(parsed.message).indexOf('BusinessService') >= 0) { return parsed.message; }
    return null;
}
function renderLandscapeExplorer(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return '<div class="card"><h3>No results</h3><p class="section-copy">This tool did not return any landscape rows.</p></div>';
    }
    return items.map(function(item, index) {
        const name = item.name || item.serviceName || ('Result ' + (index + 1));
        const objectType = item.objectType || item.type || 'Unknown';
        const lmsId = item.lmsId || item.serviceId || '';
        const warning = objectType === 'BusinessService'
            ? '<div class="status warn" style="margin-top:12px;">Property lookup is usually not available for BusinessService objects.</div>'
            : '';
        const actions = lmsId
            ? '<div class="button-row" style="margin-top:12px;">' +
                '<button type="button" class="secondary explorer-search" data-lms-id="' + lmsId + '">Use In Search</button>' +
                '<button type="button" class="secondary explorer-properties" data-lms-id="' + lmsId + '" data-object-type="' + objectType + '">Use In Properties</button>' +
              '</div>'
            : '';
        return '<div class="card">' +
            '<h3>' + name + '</h3>' +
            '<div class="pill-list" style="margin-bottom:12px;">' +
                '<span class="pill">' + objectType + '</span>' +
                (item.serviceTypeLabel ? '<span class="pill">' + item.serviceTypeLabel + '</span>' : '') +
            '</div>' +
            '<p class="section-copy">lmsId: ' + (lmsId || 'n/a') + '</p>' +
            warning +
            actions +
        '</div>';
    }).join('');
}
function renderIncidentExplorer(data) {
    const summary = data.summary || {};
    const hypotheses = Array.isArray(data.hypotheses) ? data.hypotheses : [];
    const nextChecks = Array.isArray(data.nextChecks) ? data.nextChecks : [];
    const related = Array.isArray(data.relatedLandscapeObjects) ? data.relatedLandscapeObjects : [];
    let html = '<div class="card"><h3>Incident summary</h3><div class="key-value">' +
        '<div class="key-row"><span class="muted">Events</span><strong>' + (summary.totalEvents ?? 0) + '</strong></div>' +
        '<div class="key-row"><span class="muted">Related objects</span><strong>' + (summary.relatedLandscapeObjectCount ?? 0) + '</strong></div>' +
        '<div class="key-row"><span class="muted">Suggested focus</span><strong>' + (summary.suggestedFocus || 'Review timeline') + '</strong></div>' +
        '</div></div>';
    if (hypotheses.length) {
        html += '<div class="card"><h3>Hypotheses</h3><div class="cards">' +
            hypotheses.map(function(item) { return '<div class="pill">' + item + '</div>'; }).join('') +
            '</div></div>';
    }
    if (nextChecks.length) {
        html += '<div class="card"><h3>Next checks</h3><div class="stack">' +
            nextChecks.map(function(item) { return '<div class="section-copy">' + item + '</div>'; }).join('') +
            '</div></div>';
    }
    if (related.length) {
        html += '<div class="card"><h3>Related systems</h3><div class="cards">' + renderLandscapeExplorer(related) + '</div></div>';
    }
    return html;
}
function renderDisruptionExplorer(data) {
    const summary = data.summary || {};
    const disruptions = Array.isArray(data.disruptions) ? data.disruptions : [];
    let html = '<div class="card"><h3>Disruption summary</h3><div class="key-value">' +
        '<div class="key-row"><span class="muted">Total</span><strong>' + (summary.totalDisruptions ?? disruptions.length) + '</strong></div>' +
        '<div class="key-row"><span class="muted">Services</span><strong>' + ((summary.services || []).join(', ') || 'n/a') + '</strong></div>' +
        '<div class="key-row"><span class="muted">Types</span><strong>' + ((summary.eventTypes || []).join(', ') || 'n/a') + '</strong></div>' +
        '</div></div>';
    disruptions.forEach(function(item) {
        html += '<div class="card">' +
            '<h3>' + (item.eventName || 'Unnamed event') + '</h3>' +
            '<div class="pill-list" style="margin-bottom:12px;">' +
                '<span class="pill">' + (item.eventType || 'unknown') + '</span>' +
                '<span class="pill">' + (item.serviceName || 'unknown service') + '</span>' +
            '</div>' +
            '<p class="section-copy">Start: ' + (item.eventStartTime || 'n/a') + '</p>' +
            '<p class="section-copy">Status: ' + (item.eventStatus || 'n/a') + '</p>' +
        '</div>';
    });
    return html;
}
function attachExplorerEvents() {
    document.querySelectorAll('.explorer-search').forEach(function(button) {
        button.addEventListener('click', function() {
            const lmsId = button.getAttribute('data-lms-id') || '';
            updateArgsForTool('get-landscape-info', { lmsId: lmsId, limit: 1 });
            setStatus('tool-status', 'Prepared a focused landscape lookup for ' + lmsId + '.', '');
        });
    });
    document.querySelectorAll('.explorer-properties').forEach(function(button) {
        button.addEventListener('click', function() {
            const lmsId = button.getAttribute('data-lms-id') || '';
            const objectType = button.getAttribute('data-object-type') || '';
            updateArgsForTool('get-landscape-property-info', { lmsId: lmsId });
            if (objectType === 'BusinessService') {
                setStatus('tool-status', 'Landscape properties are not accessible for objectType \'BusinessService\' with lmsId \'' + lmsId + '\'. Use an lmsId for a technical system or cloud service object instead.', 'warn');
            } else {
                setStatus('tool-status', 'Prepared a property lookup for ' + lmsId + '.', '');
            }
        });
    });
}
function renderResultExplorer(toolName, parsed) {
    const el = byId('result-explorer');
    if (Array.isArray(parsed)) {
        state.lastResult = parsed;
        el.innerHTML = renderLandscapeExplorer(parsed);
        attachExplorerEvents();
        return;
    }
    if (toolName === 'gather-incident-context' && parsed && typeof parsed === 'object') {
        state.lastResult = parsed;
        el.innerHTML = renderIncidentExplorer(parsed);
        attachExplorerEvents();
        return;
    }
    if (toolName === 'find-recent-service-disruptions' && parsed && typeof parsed === 'object') {
        state.lastResult = parsed;
        el.innerHTML = renderDisruptionExplorer(parsed);
        return;
    }
    el.innerHTML = '<div class="card"><h3>No result data yet</h3><p class="section-copy">Run a tool to turn results into follow-up actions.</p></div>';
}
async function runTool(toolName, args) {
    setStatus('tool-status', 'Running ' + toolName + '...', '');
    const payload = await sendMcpRequest('tools/call', { name: toolName, arguments: args });
    const parsed = parseMcpPayload(payload);
    const warning = inferPropertyWarning(toolName, parsed);
    renderParsedResponse(toolName, parsed);
    renderFriendlySummary(toolName, parsed);
    renderResultExplorer(toolName, parsed);
    setStatus('tool-status', warning || 'Tool call completed.', warning ? 'warn' : '');
}
async function listTools() {
    setStatus('tool-status', 'Loading registered tools...', '');
    const payload = await sendMcpRequest('tools/list', {});
    const parsed = parseMcpPayload(payload);
    renderParsedResponse('tools/list', parsed);
    renderFriendlySummary('tools/list', parsed);
    renderResultExplorer('tools/list', parsed);
    setStatus('tool-status', 'Tool list loaded.', '');
}
function attachQuickSamples() {
    document.querySelectorAll('.sample-button').forEach(function(button) {
        button.addEventListener('click', async function() {
            const tool = button.getAttribute('data-tool') || 'get-landscape-info';
            const args = parseMaybeJson(button.getAttribute('data-args') || '{}');
            updateArgsForTool(tool, args);
            setStatus('tool-status', 'Running guided action for ' + tool + '...', '');
            state.token = byId('token-input').value.trim() || state.token;
            saveState();
            try {
                await runTool(tool, args);
            } catch (error) {
                setStatus('tool-status', error instanceof Error ? error.message : 'Guided action failed.', 'error');
            }
        });
    });
}
function attachGuidedTasks() {
    if (!byId('quick-landscape-button')) {
        return;
    }
    const runGuided = async function(tool, args, statusMessage) {
        state.token = byId('token-input').value.trim() || state.token;
        saveState();
        setStatus('tool-status', statusMessage, '');
        updateArgsForTool(tool, args);
        try {
            await runTool(tool, args);
        } catch (error) {
            setStatus('tool-status', error instanceof Error ? error.message : 'Guided action failed.', 'error');
        }
    };

    byId('quick-landscape-button').addEventListener('click', async function() {
        const name = byId('quick-landscape-name').value.trim();
        const limit = Number(byId('quick-landscape-limit').value || '10');
        await runGuided(
            'find-property-capable-landscape-objects',
            {
                ...(name ? { name: name } : {}),
                limit: limit
            },
            'Searching systems...'
        );
    });

    byId('quick-health-button').addEventListener('click', async function() {
        const serviceName = byId('quick-health-service').value.trim();
        const limit = Number(byId('quick-health-limit').value || '5');
        await runGuided(
            'find-recent-service-disruptions',
            {
                ...(serviceName ? { serviceName: serviceName } : {}),
                limit: limit
            },
            'Checking service health...'
        );
    });

    byId('quick-incident-button').addEventListener('click', async function() {
        const serviceName = byId('quick-incident-service').value.trim();
        const rawAlertText = byId('quick-incident-text').value.trim();
        await runGuided(
            'gather-incident-context',
            {
                ...(serviceName ? { serviceName: serviceName } : {}),
                ...(rawAlertText ? { rawAlertText: rawAlertText } : {}),
                limit: 5
            },
            'Explaining the incident...'
        );
    });
}
function attachNormalActionCenter() {
    byId('normal-action-select').addEventListener('change', function() {
        updateNormalActionForm();
    });

    document.querySelectorAll('.action-option').forEach(function(button) {
        button.addEventListener('click', function() {
            const tool = button.getAttribute('data-tool') || TOOL_ORDER[0];
            byId('normal-action-select').value = tool;
            updateNormalActionForm();
        });
    });

    byId('normal-action-run').addEventListener('click', async function() {
        const tool = byId('normal-action-select').value;
        const args = buildNormalActionArgs();
        updateArgsForTool(tool, args);
        state.token = byId('token-input').value.trim() || state.token;
        saveState();
        try {
            await runTool(tool, args);
        } catch (error) {
            setStatus('tool-status', error instanceof Error ? error.message : 'Action failed.', 'error');
        }
    });
}
function populateToolSelect() {
    const select = byId('tool-select');
    select.innerHTML = TOOL_ORDER.map(function(tool) {
        return '<option value="' + tool + '">' + tool + '</option>';
    }).join('');
    select.value = TOOL_ORDER[0];
    byId('tool-args').value = JSON.stringify(TOOL_PRESETS[TOOL_ORDER[0]], null, 2);
}
function attachToolPresetChange() {
    byId('tool-select').addEventListener('change', function(event) {
        const toolName = event.target.value;
        byId('tool-args').value = JSON.stringify(TOOL_PRESETS[toolName] || {}, null, 2);
    });
}
async function bootstrap() {
    loadState();
    populateToolSelect();
    populateNormalActionSelect();
    updateNormalActionForm();
    attachToolPresetChange();
    attachQuickSamples();
    attachNormalActionCenter();
    byId('redirect-uri').value = defaultRedirectUri();
    byId('token-input').value = state.token;
    byId('connect-button').addEventListener('click', function() { window.location.href = buildAuthorizeUrl(); });
    byId('finish-login-button').addEventListener('click', async function() {
        try { await finishLoginFlow(); } catch (error) { setStatus('auth-status', error instanceof Error ? error.message : 'Finish login failed.', 'error'); }
    });
    byId('refresh-session-button').addEventListener('click', async function() {
        try {
            state.token = byId('token-input').value.trim();
            saveState();
            await inspectToken();
            await initializeSession();
        } catch (error) {
            setStatus('auth-status', error instanceof Error ? error.message : 'Session refresh failed.', 'error');
        }
    });
    byId('inspect-token-button').addEventListener('click', async function() {
        state.token = byId('token-input').value.trim();
        saveState();
        try { await inspectToken(); } catch (error) { setStatus('auth-status', error instanceof Error ? error.message : 'Token inspection failed.', 'error'); }
    });
    byId('initialize-session-button').addEventListener('click', async function() {
        state.token = byId('token-input').value.trim();
        saveState();
        try { await initializeSession(); } catch (error) { setStatus('tool-status', error instanceof Error ? error.message : 'Session initialization failed.', 'error'); }
    });
    byId('run-tool-button').addEventListener('click', async function() {
        state.token = byId('token-input').value.trim();
        saveState();
        let args;
        try {
            args = parseMaybeJson(byId('tool-args').value || '{}');
            if (typeof args === 'string') { args = JSON.parse(args); }
        } catch (error) {
            setStatus('tool-status', 'Arguments must be valid JSON.', 'error');
            return;
        }
        try { await runTool(byId('tool-select').value, args || {}); } catch (error) { setStatus('tool-status', error instanceof Error ? error.message : 'Tool execution failed.', 'error'); }
    });
    byId('list-tools-button').addEventListener('click', async function() {
        state.token = byId('token-input').value.trim();
        saveState();
        try { await listTools(); } catch (error) { setStatus('tool-status', error instanceof Error ? error.message : 'Failed to list tools.', 'error'); }
    });
    const url = new URL(window.location.href);
    if (url.searchParams.get('code')) {
        try { await finishLoginFlow(); } catch (error) { setStatus('auth-status', error instanceof Error ? error.message : 'Automatic login completion failed.', 'error'); }
    } else if (state.token) {
        try {
            await inspectToken();
            if (state.sessionId) { setStatus('tool-status', 'Reusing existing MCP session: ' + state.sessionId, ''); }
        } catch (error) {
            setStatus('auth-status', error instanceof Error ? error.message : 'Could not restore prior token.', 'warn');
        }
    }
}
bootstrap();
`;
}

export function renderUserDashboardScript(): string {
    return String.raw`
const USER_STORAGE_KEY = 'calm_mcp_user_dashboard_state_v1';
const state = { token: '', sessionId: '', tokenInfo: null, selectedService: '', selectedObjectId: '' };
function byId(id) { return document.getElementById(id); }
function defaultRedirectUri() { return window.location.origin + '/dashboard'; }
function parseMaybeJson(value) {
    if (typeof value !== 'string') { return value; }
    try { return JSON.parse(value); } catch (error) { return value; }
}
function saveState() { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ token: state.token, sessionId: state.sessionId })); }
function loadState() {
    try {
        const parsed = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
        state.token = typeof parsed.token === 'string' ? parsed.token : '';
        state.sessionId = typeof parsed.sessionId === 'string' ? parsed.sessionId : '';
    } catch (error) {
        console.warn('Failed to load user dashboard state', error);
    }
}
function setStatus(elementId, message, tone) {
    const el = byId(elementId);
    el.textContent = message;
    el.className = 'status';
    if (tone === 'warn') { el.classList.add('warn'); }
    if (tone === 'error') { el.classList.add('error'); }
}
function setRawResponse(value) { byId('user-raw-response').textContent = value; }
function setSelectionSummary() {
    const text = state.selectedService
        ? 'Selected: ' + state.selectedService + (state.selectedObjectId ? ' | ID: ' + state.selectedObjectId : '')
        : 'No system selected yet';
    byId('user-selection-summary').textContent = text;
}
function collectContentText(result) {
    if (!result || !Array.isArray(result.content)) { return null; }
    const textParts = result.content
        .filter(function(entry) { return entry && entry.type === 'text' && typeof entry.text === 'string'; })
        .map(function(entry) { return entry.text; });
    return textParts.length ? textParts.join('\n') : null;
}
function parseMcpPayload(payload) {
    if (payload && payload.result) {
        const text = collectContentText(payload.result);
        return text !== null ? parseMaybeJson(text) : payload.result;
    }
    if (payload && payload.error) { return payload.error; }
    return payload;
}
async function inspectToken() {
    if (!state.token) {
        setStatus('user-auth-status', 'Connect first so the page can access your SAP token.', 'warn');
        return null;
    }
    const response = await fetch('/debug/token-info', { headers: { Authorization: 'Bearer ' + state.token } });
    const payload = await response.json();
    setRawResponse(JSON.stringify(payload, null, 2));
    state.tokenInfo = payload;
    if (!response.ok) {
        setStatus('user-auth-status', payload.message || payload.error || 'Token inspection failed.', 'error');
        return null;
    }
    const user = payload.email || payload.username || 'unknown user';
    const scopes = Array.isArray(payload.scopes) ? payload.scopes.join(', ') : 'none';
    const bypass = payload.devScopeBypassEnabled ? ' | bypass enabled' : '';
    setStatus('user-auth-status', 'Connected as ' + user + ' | scopes: ' + scopes + bypass, payload.hasRequiredScopes ? '' : 'warn');
    return payload;
}
async function exchangeCodeFromUrl() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (!code) { return false; }
    setStatus('user-auth-status', 'Finishing sign-in...', '');
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    const response = await fetch('/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });
    const payload = await response.json();
    setRawResponse(JSON.stringify(payload, null, 2));
    if (!response.ok) {
        setStatus('user-auth-status', payload.error_description || payload.error || 'Sign-in failed.', 'error');
        return false;
    }
    state.token = payload.access_token || '';
    byId('user-token').value = state.token;
    saveState();
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, '', url.toString());
    return true;
}
async function initializeSession() {
    if (!state.token) { throw new Error('Connect first.'); }
    const payload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'dashboard-user', version: '1.0.0' }
        }
    };
    const response = await fetch('/mcp', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + state.token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const sessionId = response.headers.get('Mcp-Session-Id') || response.headers.get('mcp-session-id') || '';
    const text = await response.text();
    setRawResponse(text);
    if (!response.ok) {
        const parsed = parseMaybeJson(text);
        const message = (parsed && parsed.error && parsed.error.message)
            || (parsed && parsed.message)
            || 'Could not initialize MCP session.';
        throw new Error(message);
    }
    state.sessionId = sessionId;
    saveState();
    return true;
}
async function ensureReady() {
    state.token = byId('user-token').value.trim();
    saveState();
    if (!state.token) { throw new Error('Connect to SAP first.'); }
    if (!state.tokenInfo) { await inspectToken(); }
    if (!state.sessionId) { await initializeSession(); }
}
async function sendMcpRequest(toolName, args) {
    await ensureReady();
    let response = await fetch('/mcp', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + state.token,
            'Content-Type': 'application/json',
            'mcp-session-id': state.sessionId
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: { name: toolName, arguments: args }
        })
    });
    const sessionId = response.headers.get('Mcp-Session-Id') || response.headers.get('mcp-session-id');
    if (sessionId) { state.sessionId = sessionId; saveState(); }
    let text = await response.text();
    setRawResponse(text);
    let parsedPayload = parseMaybeJson(text);
    if (!response.ok) {
        const errorMessage = (parsedPayload && parsedPayload.error && parsedPayload.error.message) || '';
        if (response.status === 400 && errorMessage.indexOf('No valid session ID') >= 0) {
            state.sessionId = '';
            saveState();
            await initializeSession();
            response = await fetch('/mcp', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + state.token,
                    'Content-Type': 'application/json',
                    'mcp-session-id': state.sessionId
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'tools/call',
                    params: { name: toolName, arguments: args }
                })
            });
            const retrySessionId = response.headers.get('Mcp-Session-Id') || response.headers.get('mcp-session-id');
            if (retrySessionId) { state.sessionId = retrySessionId; saveState(); }
            text = await response.text();
            setRawResponse(text);
            parsedPayload = parseMaybeJson(text);
        }
    }
    if (!response.ok) { throw new Error((parsedPayload && parsedPayload.error && parsedPayload.error.message) || 'Tool call failed.'); }
    return parseMcpPayload(parsedPayload);
}
function makeLandscapeCard(item) {
    const objectType = item.objectType || item.type || 'Unknown';
    const serviceName = item.name || item.serviceName || item.externalId || '';
    const objectId = item.lmsId || item.serviceId || '';
    const propertyText = item.propertyLookupSupported
        ? 'Ready for property lookup'
        : (objectType === 'BusinessService' ? 'Properties usually unavailable here' : 'Usable for follow-up');
    return '<div class="card">' +
        '<h3>' + (serviceName || 'Unnamed object') + '</h3>' +
        '<div class="pill-list" style="margin-bottom:12px;">' +
            '<span class="pill">' + objectType + '</span>' +
            (item.serviceTypeLabel ? '<span class="pill">' + item.serviceTypeLabel + '</span>' : '') +
        '</div>' +
        '<p class="section-copy">ID: ' + (objectId || 'n/a') + '</p>' +
        '<p class="section-copy">' + propertyText + '</p>' +
        '<div class="button-row" style="margin-top:12px;">' +
            '<button type="button" class="secondary user-use-service" data-service-name="' + serviceName + '" data-object-id="' + objectId + '">Use in incident analysis</button>' +
            '<button type="button" class="secondary user-check-service" data-service-name="' + serviceName + '">Check health</button>' +
        '</div>' +
    '</div>';
}
function renderLookupResults(data) {
    const items = Array.isArray(data) ? data : [];
    if (!items.length) { return '<div class="card"><h3>No systems found</h3><p class="section-copy">Try a broader search or remove one of the filters.</p></div>'; }
    return items.map(makeLandscapeCard).join('');
}
function renderDisruptionResults(data) {
    const disruptions = Array.isArray(data.disruptions) ? data.disruptions : [];
    if (!disruptions.length) { return '<div class="card"><h3>No recent disruptions found</h3><p class="section-copy">That is usually a good sign. Try another service name if needed.</p></div>'; }
    return disruptions.map(function(item) {
        const serviceName = item.serviceName || '';
        return '<div class="card">' +
            '<h3>' + (item.eventName || 'Unnamed event') + '</h3>' +
            '<div class="pill-list" style="margin-bottom:12px;">' +
                '<span class="pill">' + (item.eventType || 'unknown') + '</span>' +
                '<span class="pill">' + (serviceName || 'unknown service') + '</span>' +
            '</div>' +
            '<p class="section-copy">Status: ' + (item.eventStatus || 'n/a') + '</p>' +
            '<p class="section-copy">Start: ' + (item.eventStartTime || 'n/a') + '</p>' +
            '<div class="button-row" style="margin-top:12px;">' +
                '<button type="button" class="secondary user-investigate-service" data-service-name="' + serviceName + '">Investigate this service</button>' +
            '</div>' +
        '</div>';
    }).join('');
}
function renderIncidentResults(data) {
    const summary = data.summary || {};
    const hypotheses = Array.isArray(data.hypotheses) ? data.hypotheses : [];
    const nextChecks = Array.isArray(data.nextChecks) ? data.nextChecks : [];
    const related = Array.isArray(data.relatedLandscapeObjects) ? data.relatedLandscapeObjects : [];
    let html = '<div class="card"><h3>Summary</h3><div class="key-value">' +
        '<div class="key-row"><span class="muted">Matching events</span><strong>' + (summary.totalEvents ?? 0) + '</strong></div>' +
        '<div class="key-row"><span class="muted">Related systems</span><strong>' + (summary.relatedLandscapeObjectCount ?? 0) + '</strong></div>' +
        '<div class="key-row"><span class="muted">Suggested focus</span><strong>' + (summary.suggestedFocus || 'Review event timeline') + '</strong></div>' +
        '</div></div>';
    if (hypotheses.length) {
        html += '<div class="card"><h3>Likely causes</h3><div class="stack">' +
            hypotheses.map(function(item) { return '<div class="section-copy">' + item + '</div>'; }).join('') +
            '</div></div>';
    }
    if (nextChecks.length) {
        html += '<div class="card"><h3>Recommended next checks</h3><div class="stack">' +
            nextChecks.map(function(item) { return '<div class="section-copy">' + item + '</div>'; }).join('') +
            '</div></div>';
    }
    if (related.length) {
        html += '<div class="card"><h3>Related systems</h3><div class="cards">' + related.map(makeLandscapeCard).join('') + '</div></div>';
    }
    return html;
}
function setResultsHtml(html) { byId('user-results').innerHTML = html; }
function applySelectedService(serviceName, objectId) {
    if (serviceName) {
        state.selectedService = serviceName;
        byId('disruption-service-name').value = serviceName;
        byId('incident-service-name').value = serviceName;
    }
    if (objectId) {
        state.selectedObjectId = objectId;
    }
    setSelectionSummary();
}
function attachUserResultActions() {
    document.querySelectorAll('.user-use-service').forEach(function(button) {
        button.addEventListener('click', function() {
            const serviceName = button.getAttribute('data-service-name') || '';
            const objectId = button.getAttribute('data-object-id') || '';
            applySelectedService(serviceName, objectId);
            setStatus('incident-status', 'Prepared incident analysis for ' + serviceName + '.', '');
            document.getElementById('incident-service-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
    document.querySelectorAll('.user-check-service').forEach(function(button) {
        button.addEventListener('click', function() {
            const serviceName = button.getAttribute('data-service-name') || '';
            applySelectedService(serviceName, '');
            setStatus('disruption-status', 'Prepared a service health check for ' + serviceName + '.', '');
            document.getElementById('disruption-service-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
    document.querySelectorAll('.user-investigate-service').forEach(function(button) {
        button.addEventListener('click', function() {
            const serviceName = button.getAttribute('data-service-name') || '';
            applySelectedService(serviceName, '');
            setStatus('incident-status', 'Prepared incident analysis for ' + serviceName + '.', '');
            document.getElementById('incident-service-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}
function buildAuthorizeUrl() {
    const redirectUri = byId('user-redirect-uri').value.trim() || defaultRedirectUri();
    const stateValue = 'dashboard-user-' + Date.now();
    return '/oauth/authorize?redirect_uri=' + encodeURIComponent(redirectUri) + '&state=' + encodeURIComponent(stateValue) + '&scope=' + encodeURIComponent('openid');
}
async function runLookup() {
    setStatus('lookup-status', 'Searching systems...', '');
    const result = await sendMcpRequest('find-property-capable-landscape-objects', {
        name: byId('lookup-name').value.trim() || undefined,
        systemNumber: byId('lookup-system-number').value.trim() || undefined,
        objectType: byId('lookup-object-type').value || undefined,
        limit: Number(byId('lookup-limit').value || '10')
    });
    setResultsHtml(renderLookupResults(result));
    attachUserResultActions();
    setStatus('lookup-status', 'System search completed.', '');
}
async function runDisruptionCheck() {
    setStatus('disruption-status', 'Checking recent disruptions...', '');
    const result = await sendMcpRequest('find-recent-service-disruptions', {
        serviceName: byId('disruption-service-name').value.trim() || undefined,
        limit: Number(byId('disruption-limit').value || '5')
    });
    setResultsHtml(renderDisruptionResults(result));
    attachUserResultActions();
    setStatus('disruption-status', 'Recent disruption check completed.', '');
}
async function runIncidentAnalysis() {
    setStatus('incident-status', 'Gathering ALM incident context...', '');
    const result = await sendMcpRequest('gather-incident-context', {
        serviceName: byId('incident-service-name').value.trim() || undefined,
        rawAlertText: byId('incident-raw-alert').value.trim() || undefined,
        limit: Number(byId('incident-limit').value || '5')
    });
    setResultsHtml(renderIncidentResults(result));
    attachUserResultActions();
    setStatus('incident-status', 'Incident context gathered.', '');
}
function clearLookup() {
    byId('lookup-name').value = '';
    byId('lookup-system-number').value = '';
    byId('lookup-object-type').value = '';
    byId('lookup-limit').value = '10';
    state.selectedService = '';
    state.selectedObjectId = '';
    setSelectionSummary();
    setStatus('lookup-status', 'Search cleared.', '');
}
async function bootstrap() {
    loadState();
    byId('user-redirect-uri').value = defaultRedirectUri();
    byId('user-token').value = state.token;
    setSelectionSummary();
    byId('user-connect-button').addEventListener('click', function() { window.location.href = buildAuthorizeUrl(); });
    byId('user-refresh-button').addEventListener('click', async function() {
        try {
            state.token = byId('user-token').value.trim();
            saveState();
            state.sessionId = '';
            await inspectToken();
            setStatus('user-auth-status', 'Token refreshed. The session will start automatically when you run an action.', '');
        } catch (error) {
            setStatus('user-auth-status', error instanceof Error ? error.message : 'Could not refresh the session.', 'error');
        }
    });
    byId('lookup-submit').addEventListener('click', async function() {
        try { await runLookup(); } catch (error) { setStatus('lookup-status', error instanceof Error ? error.message : 'System search failed.', 'error'); }
    });
    byId('lookup-clear').addEventListener('click', clearLookup);
    byId('disruption-submit').addEventListener('click', async function() {
        try { await runDisruptionCheck(); } catch (error) { setStatus('disruption-status', error instanceof Error ? error.message : 'Disruption check failed.', 'error'); }
    });
    byId('incident-submit').addEventListener('click', async function() {
        try { await runIncidentAnalysis(); } catch (error) { setStatus('incident-status', error instanceof Error ? error.message : 'Incident analysis failed.', 'error'); }
    });
    const url = new URL(window.location.href);
    if (url.searchParams.get('code')) {
        try {
            const exchanged = await exchangeCodeFromUrl();
            if (exchanged) {
                await inspectToken();
                state.sessionId = '';
                saveState();
                setStatus('user-auth-status', 'Connected. You can now use the guided actions below.', '');
            }
        } catch (error) {
            setStatus('user-auth-status', error instanceof Error ? error.message : 'Automatic sign-in failed.', 'error');
        }
    } else if (state.token) {
        try {
            await inspectToken();
            setStatus('user-auth-status', 'Connected. You can now use the guided actions below.', '');
        } catch (error) {
            setStatus('user-auth-status', error instanceof Error ? error.message : 'Could not restore the previous login.', 'warn');
        }
    }
}
bootstrap();
`;
}
