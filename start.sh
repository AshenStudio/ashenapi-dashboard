#!/bin/sh
# ── Ashen Studio Dashboard — Startup Script ──────────────
# Reads the API_URL environment variable and overrides the
# apiUrl in config.js at runtime before starting the server.
# This lets Portainer set the API URL without modifying config.js.

set -e

CONFIG_FILE="/app/config.js"

if [ -n "$API_URL" ]; then
    # Replace apiUrl in config.js with the env var value
    # Matches: apiUrl: 'any-value',
    sed -i "s|apiUrl: '[^']*'|apiUrl: '$API_URL'|" "$CONFIG_FILE"
    echo "[*] API_URL env var detected — overrode apiUrl to $API_URL"
else
    echo "[*] No API_URL env var — using default apiUrl from config.js"
fi

echo "[*] Starting HTTP server on port 80"
exec python -m http.server 80 --bind 0.0.0.0
