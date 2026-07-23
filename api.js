// ── Ashen Studio Dashboard — API Client ───────────────────
// All API calls are centralized here.

const CFG = () => {
    const cfg = window.ASHEN_CONFIG || {
        apiUrl: 'http://localhost:8000',
        tokenKey: 'ashen_auth_token',
    };
    // ── Safety net ───────────────────────────────────────
    // If config.js is serving a stale localhost URL (Portainer cache),
    // override it with the production API URL so the dashboard
    // actually works. This can be removed once Portainer's Docker
    // cache has been flushed with the updated config.js.
    if (cfg.apiUrl && cfg.apiUrl.includes('localhost')) {
        cfg.apiUrl = 'https://ashenapi.overdev.net';
    }
    return cfg;
};

// ── Helpers ───────────────────────────────────────────────

function getToken() {
    return localStorage.getItem(CFG().tokenKey);
}

function isAuthenticated() {
    return !!getToken();
}

function logout() {
    localStorage.removeItem(CFG().tokenKey);
    localStorage.removeItem(CFG().refreshTokenKey || 'ashen_refresh_token');
    window.location.href = 'login.html';
}

async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = { 'Accept': 'application/json', ...options.headers };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }

    const res = await fetch(`${CFG().apiUrl}${path}`, { ...options, headers });

    if (res.status === 401 && token) {
        // Token expired or invalid — redirect to login
        logout();
        return null;
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const err = new Error(body.detail || `HTTP ${res.status}: ${res.statusText}`);
        err.status = res.status;
        err.body = body;
        throw err;
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return res.json();
    }

    // For 204 No Content or non-JSON
    return null;
}

// ── Auth ──────────────────────────────────────────────────

async function apiLogin(username, password) {
    const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { username, password },
    });
    if (data) {
        localStorage.setItem(CFG().tokenKey, data.access_token);
        if (data.refresh_token) {
            localStorage.setItem(CFG().refreshTokenKey || 'ashen_refresh_token', data.refresh_token);
        }
    }
    return data;
}

async function apiRefreshToken() {
    const refreshToken = localStorage.getItem(CFG().refreshTokenKey || 'ashen_refresh_token');
    if (!refreshToken) return null;

    try {
        const data = await apiFetch('/api/auth/refresh', {
            method: 'POST',
            body: { refresh_token: refreshToken },
        });
        if (data) {
            localStorage.setItem(CFG().tokenKey, data.access_token);
            if (data.refresh_token) {
                localStorage.setItem(CFG().refreshTokenKey || 'ashen_refresh_token', data.refresh_token);
            }
        }
        return data;
    } catch (err) {
        // Refresh token expired or invalid — clear everything
        logout();
        return null;
    }
}

// ── Accounts ──────────────────────────────────────────────

async function apiListAccounts(page = 1, pageSize = 20) {
    return apiFetch(`/api/admin/accounts?page=${page}&pageSize=${pageSize}`);
}

async function apiDeleteAccount(id) {
    return apiFetch(`/api/admin/accounts/${id}`, { method: 'DELETE' });
}

async function apiResetPassword(id, newPassword = null) {
    return apiFetch(`/api/admin/accounts/${id}/reset-password`, {
        method: 'POST',
        body: { new_password: newPassword },
    });
}

// ── Releases ──────────────────────────────────────────────

async function apiGetLatestLauncher() {
    return apiFetch('/api/launcher/version');
}

async function apiGetLatestModpack() {
    return apiFetch('/api/modpack/version');
}

async function apiListLauncherReleases() {
    return apiFetch('/api/admin/releases/launcher');
}

async function apiListModpackReleases() {
    return apiFetch('/api/admin/releases/modpack');
}

async function apiPublishRelease(type, version, file, releaseNotes) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('version', version);
    formData.append('release_notes', releaseNotes || '');

    return apiFetch(`/api/admin/releases/${type}`, {
        method: 'POST',
        body: formData,
        headers: {}, // Let fetch set the Content-Type for FormData
    });
}

async function apiDeleteRelease(type, version) {
    return apiFetch(`/api/admin/releases/${type}/${version}`, { method: 'DELETE' });
}

// ── Migrations ────────────────────────────────────────────

async function apiGetMigrationCounts() {
    return apiFetch('/api/admin/migrations/counts');
}

async function apiListMigrations(page = 1, pageSize = 20) {
    return apiFetch(`/api/admin/migrations?page=${page}&pageSize=${pageSize}`);
}

async function apiCreateRetryRequest(body) {
    return apiFetch('/api/admin/migrations/retry-requests', {
        method: 'POST',
        body,
    });
}

async function apiListRetryRequests(page = 1, pageSize = 20) {
    return apiFetch(`/api/admin/migrations/retry-requests?page=${page}&pageSize=${pageSize}`);
}

// ── Bootstrap ─────────────────────────────────────────────

async function apiBootstrapAdmin(username, serverKey) {
    return apiFetch('/api/admin/bootstrap', {
        method: 'POST',
        body: { username },
        headers: { 'X-Ashen-Server-Key': serverKey },
    });
}

// ── Database Query ─────────────────────────────────────────

async function apiExecuteQuery(query, params = null) {
    return apiFetch('/api/admin/db/query', {
        method: 'POST',
        body: { query, params },
    });
}
