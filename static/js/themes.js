/**
 * Theme Manager - Modular theme system with easy extensibility
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'pink';
        this.currentMode = 'light'; // 'light' or 'dark'
        this.themes = [];
        this.storageKeyTheme = 'calculator_theme';
        this.storageKeyMode = 'calculator_dark_mode';

        this.init();
    }

    async init() {
        await this.loadThemesList();
        this.loadPreferences();
        this.applyTheme();
        this.bindEvents();
    }

    async loadThemesList() {
        try {
            const response = await fetch('/api/themes');
            const data = await response.json();
            this.themes = data.themes || [];
        } catch (error) {
            console.error('Error loading themes:', error);
            // Fallback to default themes
            this.themes = [
                {
                    id: 'pink',
                    name: 'Default Pink',
                    file: 'pink.css',
                    enabled: true,
                    description: 'Beautiful pink theme with dark mode support'
                }
            ];
        }
    }

    loadPreferences() {
        // Load saved theme
        const savedTheme = localStorage.getItem(this.storageKeyTheme);
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }

        // Load saved dark mode preference
        const savedMode = localStorage.getItem(this.storageKeyMode);
        if (savedMode) {
            this.currentMode = savedMode;
        }
    }

    savePreferences() {
        localStorage.setItem(this.storageKeyTheme, this.currentTheme);
        localStorage.setItem(this.storageKeyMode, this.currentMode);
    }

    bindEvents() {
        // Theme button
        const themeBtn = document.getElementById('btn-themes');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.openThemeModal());
        }

        // Modal close button
        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeThemeModal());
        }

        // Modal overlay (click outside to close)
        const overlay = document.getElementById('theme-modal');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeThemeModal();
                }
            });
        }

        // Dark mode toggle (if exists)
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeThemeModal();
            }
        });
    }

    applyTheme() {
        const html = document.documentElement;

        // Apply theme class
        html.className = '';
        html.classList.add(`theme-${this.currentTheme}`);

        // Apply dark mode
        if (this.currentMode === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.add('light');
        }

        // Load theme CSS file
        this.loadThemeCSS();
    }

    loadThemeCSS() {
        const theme = this.themes.find(t => t.id === this.currentTheme);
        if (!theme) return;

        // Check if theme CSS is already loaded
        const existingLink = document.getElementById('theme-stylesheet');

        if (existingLink) {
            existingLink.href = `/static/css/themes/${theme.file}`;
        } else {
            const link = document.createElement('link');
            link.id = 'theme-stylesheet';
            link.rel = 'stylesheet';
            link.href = `/static/css/themes/${theme.file}`;
            document.head.appendChild(link);
        }
    }

    setTheme(themeId) {
        const theme = this.themes.find(t => t.id === themeId);

        // Don't allow disabled themes
        if (!theme || !theme.enabled) {
            if (!theme.enabled) {
                alert(`${theme.name} is coming soon!`);
            }
            return;
        }

        this.currentTheme = themeId;
        this.savePreferences();
        this.applyTheme();
        this.renderThemeModal();
    }

    toggleDarkMode() {
        this.currentMode = this.currentMode === 'dark' ? 'light' : 'dark';
        this.savePreferences();
        this.applyTheme();
    }

    openThemeModal() {
        this.renderThemeModal();
        const modal = document.getElementById('theme-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeThemeModal() {
        const modal = document.getElementById('theme-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    renderThemeModal() {
        const container = document.getElementById('theme-list');
        if (!container) return;

        let html = '';

        this.themes.forEach(theme => {
            const isActive = theme.id === this.currentTheme;
            const isDisabled = !theme.enabled;

            html += `
                <div class="theme-card ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}"
                     data-theme-id="${theme.id}">
                    <div class="theme-name">${theme.name}</div>
                    <div class="theme-description">${theme.description}</div>
                    ${isActive ? '<span class="theme-badge">Active</span>' : ''}
                    ${isDisabled ? '<span class="theme-badge placeholder">Coming Soon</span>' : ''}
                </div>
            `;
        });

        container.innerHTML = html;

        // Bind click events
        container.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                const themeId = card.dataset.themeId;
                this.setTheme(themeId);
            });
        });
    }
}

// Initialize theme manager when DOM is ready
let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();

    // Expose globally
    window.themeManager = themeManager;
});
