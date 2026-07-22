#!/bin/sh
# ── Ashen Studio Dashboard — Startup Script ──────────────
# Reads the API_URL environment variable (optional) and
# overrides the apiUrl in config.js at runtime before
# starting the server. This lets Portainer set the API URL
# without modifying config.js in the repo.
#
# If API_URL is not set, the compiled-in value in config.js
# is used as-is.

set -e

CONFIG_FILE="/app/config.js"

if [ -n "$API_URL" ]; then
    echo "[*] API_URL detected — setting apiUrl to $API_URL"
    cat > "$CONFIG_FILE" <<- EOF
window.ASHEN_CONFIG = {
    configBuiltAt: '$(date -u +%Y-%m-%dT%H:%M:%SZ)',
    apiUrl: '$API_URL',
    statsRefreshInterval: 30000,
    defaultPageSize: 20,
    tokenKey: 'ashen_auth_token',
    refreshTokenKey: 'ashen_refresh_token',
    pgAdminUrl: '/pgadmin/',
    launcherFileName: 'AshenLauncher.exe',
    modpackFileName: 'modpack.zip',
};
EOF
else
    echo "[*] No API_URL env var — using default config.js"
fi

echo "[*] Starting HTTP server on port 80"
exec python -m http.server 80 --bind 0.0.0.0
