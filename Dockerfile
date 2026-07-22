# ── Ashen Studio Dashboard — Dockerfile ──────────────────
# Serves static HTML/JS/CSS via Python's built-in HTTP server.
# For local dev / testing only.
# Your nginx admin will configure a proper reverse proxy in production.

FROM python:3-slim

WORKDIR /app

# Copy all static files
COPY . .

EXPOSE 80

CMD ["python", "-m", "http.server", "80", "--bind", "0.0.0.0"]
