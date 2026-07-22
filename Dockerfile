# ── Ashen Studio Dashboard — Dockerfile ──────────────────
# Serves static HTML/JS/CSS via Python's built-in HTTP server.
# Supports API_URL environment variable to set the API endpoint
# at runtime (overrides the apiUrl in config.js).
#
# Usage in Portainer:
#   Environment variable: API_URL=https://ashenapi.overdev.net

# Use --build-arg CACHEBUST=$(date +%s) to force a clean rebuild
ARG CACHEBUST=1

FROM python:3-slim

WORKDIR /app

# Copy all static files
COPY . .

RUN chmod +x /app/start.sh

EXPOSE 80

CMD ["/app/start.sh"]
