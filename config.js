// ── Ashen Studio Dashboard Configuration ──────────────────
// All configurable values live here — no hardcoded secrets
// in the HTML or JS files.
window.ASHEN_CONFIG = {
    // Build timestamp — check this in your browser to confirm
    // you're running the latest config (compare with GitHub)
    // configBuiltAt auto-updates when API_URL env var is set at runtime
    configBuiltAt: '2026-07-22T23:00:00Z',

    // API base URL (no trailing slash)
    apiUrl: 'https://ashenapi.overdev.net',

    // How often to auto-refresh migration stats (ms)
    statsRefreshInterval: 30000,

    // Page size defaults
    defaultPageSize: 20,

    // Auth token keys in localStorage
    tokenKey: 'ashen_auth_token',
    refreshTokenKey: 'ashen_refresh_token',

    // Release info
    launcherFileName: 'AshenLauncher.exe',
    modpackFileName: 'modpack.zip',
};
