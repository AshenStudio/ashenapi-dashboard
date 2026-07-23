# ── Ashen Studio Dashboard — Dockerfile ──────────────────
# Serves static HTML/JS/CSS via Python's built-in HTTP server.
#
# Supports API_URL environment variable (optional) to override
# the apiUrl at runtime via start.sh.
#
# This image is automatically published to ghcr.io on every
# push to main (see .github/workflows/publish-dashboard.yml).
# ──────────────────────────────────────────────────────────

FROM python:3-slim

WORKDIR /app

# Copy all static files
COPY . .

RUN chmod +x /app/start.sh

EXPOSE 80

CMD ["/app/start.sh"]
