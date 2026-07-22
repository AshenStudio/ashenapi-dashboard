// ── Ashen Studio Dashboard — Shared App Logic ────────────

(function () {
    'use strict';

    const CFG = () => window.ASHEN_CONFIG || { tokenKey: 'ashen_auth_token' };

    // ── Navigation setup ──────────────────────────────────
    function initNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Mark active nav link
        document.querySelectorAll('.nav-link').forEach(el => {
            const href = el.getAttribute('href');
            if (href === currentPage) {
                el.classList.add('nav-active');
            }
        });

        // Show/hide login/logout buttons
        const isLoggedIn = !!localStorage.getItem(CFG().tokenKey);
        document.querySelectorAll('.js-auth-show').forEach(el => el.style.display = isLoggedIn ? '' : 'none');
        document.querySelectorAll('.js-guest-show').forEach(el => el.style.display = isLoggedIn ? 'none' : '');

        // Logout handler
        document.querySelectorAll('.js-logout').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        });
    }

    // ── Auth guard ────────────────────────────────────────
    function requireAuth() {
        if (!isAuthenticated()) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (currentPage !== 'login.html') {
                window.location.href = 'login.html';
                return false;
            }
        }
        return true;
    }

    // ── Toast notifications ───────────────────────────────
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const colors = {
            success: 'bg-emerald-600',
            error: 'bg-red-600',
            info: 'bg-indigo-600',
            warning: 'bg-amber-600',
        };

        const toast = document.createElement('div');
        toast.className = `${colors[type] || colors.info} text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium transform transition-all duration-300 translate-y-0 opacity-100`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ── Format helpers ────────────────────────────────────
    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleString('en-GB', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    function formatShortDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleString('en-GB', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }

    function truncate(str, len = 40) {
        if (!str) return '—';
        return str.length > len ? str.slice(0, len) + '…' : str;
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ── Copy to clipboard ─────────────────────────────────
    function setupCopyButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.js-copy');
            if (!btn) return;
            const targetId = btn.dataset.target;
            const el = document.getElementById(targetId);
            const text = el ? el.textContent.trim() : btn.dataset.value;
            if (!text) return;

            navigator.clipboard.writeText(text).then(() => {
                const orig = btn.innerHTML;
                btn.innerHTML = '<span class="text-emerald-400">✓ Copied!</span>';
                setTimeout(() => { btn.innerHTML = orig; }, 1500);
            }).catch(() => {
                // Fallback: select the text
                if (el) {
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
        });
    }

    // ── Expose globals ────────────────────────────────────
    window.App = {
        initNav,
        requireAuth,
        showToast,
        formatDate,
        formatShortDate,
        truncate,
        escapeHtml,
        setupCopyButtons,
    };

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initNav();
            setupCopyButtons();
        });
    } else {
        initNav();
        setupCopyButtons();
    }
})();
