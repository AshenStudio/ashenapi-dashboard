# ── Ashen Studio Dashboard — Dockerfile ──────────────────
# Serves static HTML/JS/CSS via Caddy, with reverse proxy
# for /api/* and /pgadmin/* to the FastAPI backend.
#
# Supports API_URL environment variable (optional) to override
# the apiUrl at runtime via start.sh.
#
# This image is automatically published to ghcr.io on every
# push to main (see .github/workflows/publish-dashboard.yml).
# ──────────────────────────────────────────────────────────

FROM caddy:alpine

WORKDIR /app

# Copy all static files and configuration
COPY . .

# Caddyfile goes in the default location
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

# caddy:alpine has ENTRYPOINT ["caddy"] — clear it so CMD
# runs /app/start.sh directly instead of passing it to caddy
ENTRYPOINT []
CMD ["/bin/sh", "/app/start.sh"]
