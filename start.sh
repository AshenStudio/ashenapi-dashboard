#!/bin/sh
# ── Ashen Studio Dashboard — Startup Script ──────────────
# Reads environment variables and configures the dashboard
# before starting Caddy.
#
# ── Environment variables ───────────────────────────────
#   API_URL (required for production)
#     Client-facing API URL for config.js. The browser uses
#     this to make API calls. Should be the same origin as
#     the dashboard (e.g., https://ashenapi.overdev.net).
#
#   API_UPSTREAM_URL (optional)
#     Internal Docker network URL for Caddy's reverse proxy
#     upstream. Defaults to http://ashenapi-api:8000.
#     Only needed if the internal URL differs from API_URL.
# ──────────────────────────────────────────────────────────

set -e

CONFIG_FILE="/app/config.js"

if [ -n "$API_URL" ]; then
    echo "[*] API_URL detected — setting apiUrl to $API_URL"
    cat > "$CONFIG_FILE" <<EOF
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

# Export the upstream URL for Caddy's env var substitution
# If not set, Caddyfile defaults to http://ashenapi-api:8000
if [ -n "$API_UPSTREAM_URL" ]; then
    export API_UPSTREAM_URL
fi

echo "[*] Starting Caddy on port 80"
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
