# ── Ashen Studio Dashboard — Dockerfile ──────────────────
# Serves static HTML/JS/CSS via Python's built-in HTTP server.
# Supports API_URL environment variable to set the API endpoint
# at runtime (overrides the apiUrl in config.js).
#
# Usage in Portainer:
#   Environment variable: API_URL=https://ashenapi.overdev.net

FROM python:3-slim

WORKDIR /app

# Copy all static files
COPY . .

EXPOSE 80

# Generate config.js at runtime — overrides apiUrl if API_URL is set
CMD ["python", "-c", """
import os
import re

cfg_path = '/app/config.js'
api_url = os.environ.get('API_URL', '')

if api_url:
    with open(cfg_path, 'r') as f:
        content = f.read()
    content = re.sub(
        r"apiUrl:\s*'[^']*'",
        f"apiUrl: '{api_url}'",
        content
    )
    with open(cfg_path, 'w') as f:
        f.write(content)
    print(f'[*] API_URL env var detected — overrode apiUrl to {api_url}')
else:
    print('[*] No API_URL env var — using default apiUrl from config.js')

# Start the HTTP server
os.execvp('python', ['python', '-m', 'http.server', '80', '--bind', '0.0.0.0'])
"""]
