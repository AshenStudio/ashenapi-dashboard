// ── Ashen Studio Dashboard Configuration ──────────────────
// All configurable values live here — no hardcoded secrets
// in the HTML or JS files.
window.ASHEN_CONFIG = {
    // API base URL (no trailing slash)
    apiUrl: 'http://localhost:8000',

    // How often to auto-refresh migration stats (ms)
    statsRefreshInterval: 30000,

    // Page size defaults
    defaultPageSize: 20,

    // Auth token key in localStorage
    tokenKey: 'ashen_auth_token',

    // pgAdmin database editor URL
    pgAdminUrl: 'http://localhost:5050',

    // Release info
    launcherFileName: 'AshenLauncher.exe',
    modpackFileName: 'modpack.zip',
};
