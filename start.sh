#!/bin/sh
# ── Ashen Studio Dashboard — Startup Script ──────────────
# config.js already has the correct apiUrl baked in.
# This script just starts the HTTP server.

set -e

echo "[*] Starting HTTP server on port 80"
exec python -m http.server 80 --bind 0.0.0.0
