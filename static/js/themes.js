/**
 * Theme Manager - Modular theme system with dynamic theme loading
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'pink';
        this.themes = [];
        this.storageKeyTheme = 'calculator_theme';
        this.loadedThemeFiles = new Set(); // Track loaded CSS files

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

            // Set default theme if specified
            const defaultTheme = this.themes.find(t => t.default);
            if (defaultTheme && !localStorage.getItem(this.storageKeyTheme)) {
                this.currentTheme = defaultTheme.id;
            }
        } catch (error) {
            console.error('Error loading themes:', error);
            // Fallback to pink theme
            this.themes = [
                {
                    id: 'pink',
                    name: 'Pink Theme',
                    file: 'pink.css',
                    enabled: true,
                    default: true,
                    description: 'Beautiful pink theme'
                }
            ];
        }
    }

    loadPreferences() {
        const savedTheme = localStorage.getItem(this.storageKeyTheme);
        if (savedTheme) {
            // Verify theme exists
            const themeExists = this.themes.some(t => t.id === savedTheme);
            if (themeExists) {
                this.currentTheme = savedTheme;
            }
        }
    }

    savePreferences() {
        localStorage.setItem(this.storageKeyTheme, this.currentTheme);
    }

    bindEvents() {
        // Theme buttons (multiple sources)
        document.querySelectorAll('#btn-themes, [data-action="open-themes"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openThemeModal();
            });
        });

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

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeThemeModal();
            }
        });
    }

    applyTheme() {
        const html = document.documentElement;
        const theme = this.themes.find(t => t.id === this.currentTheme);

        if (!theme) {
            console.error(`Theme ${this.currentTheme} not found`);
            return;
        }

        // Remove all theme classes
        this.themes.forEach(t => {
            html.classList.remove(`theme-${t.id}`);
        });

        // Add current theme class
        html.classList.add(`theme-${theme.id}`);

        // Load theme CSS file
        this.loadThemeCSS(theme);

        // Update body class for compatibility
        document.body.setAttribute('data-theme', theme.id);
    }

    loadThemeCSS(theme) {
        // Create or update theme stylesheet link
        let themeLink = document.getElementById(`theme-${theme.id}-stylesheet`);

        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.id = `theme-${theme.id}-stylesheet`;
            themeLink.rel = 'stylesheet';
            themeLink.href = `/static/css/themes/${theme.file}`;
            document.head.appendChild(themeLink);
            this.loadedThemeFiles.add(theme.id);
        }

        // Hide other theme stylesheets, show current one
        this.themes.forEach(t => {
            const link = document.getElementById(`theme-${t.id}-stylesheet`);
            if (link) {
                link.disabled = (t.id !== theme.id);
            }
        });
    }

    setTheme(themeId) {
        const theme = this.themes.find(t => t.id === themeId);

        if (!theme) {
            console.error(`Theme ${themeId} not found`);
            return;
        }

        // Check if theme is enabled
        if (!theme.enabled) {
            alert(`${theme.name} is coming soon!`);
            return;
        }

        this.currentTheme = themeId;
        this.savePreferences();
        this.applyTheme();
        this.renderThemeModal(); // Update UI to show active theme
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
            const previewColor = theme.preview || '#cccccc';

            html += `
                <div class="theme-card ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}"
                     data-theme-id="${theme.id}">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 8px; 
                                    background-color: ${previewColor}; 
                                    border: 2px solid rgba(0,0,0,0.1);
                                    flex-shrink: 0;"></div>
                        <div style="flex: 1;">
                            <div class="theme-name">${theme.name}</div>
                            <div class="theme-description">${theme.description}</div>
                        </div>
                    </div>
                    ${isActive ? '<span class="theme-badge">Active</span>' : ''}
                    ${isDisabled ? '<span class="theme-badge placeholder">Coming Soon</span>' : ''}
                </div>
            `;
        });

        container.innerHTML = html;

        // Bind click events
        container.querySelectorAll('.theme-card:not(.disabled)').forEach(card => {
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
