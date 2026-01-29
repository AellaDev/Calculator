/**
 * History Manager - Device-specific calculation history using LocalStorage
 */

class HistoryManager {
    constructor() {
        this.storageKey = 'calculator_history';
        this.maxHistoryItems = 50;
        this.history = [];

        this.init();
    }

    init() {
        this.loadHistory();
        this.renderHistory();
        this.bindEvents();
    }

    bindEvents() {
        // Clear all button
        const clearAllBtn = document.getElementById('btn-clear-history');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAll());
        }
    }

    loadHistory() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.history = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading history:', error);
            this.history = [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    addCalculation(expression, result) {
        const calculation = {
            id: Date.now(),
            expression: expression,
            result: result,
            timestamp: new Date().toISOString()
        };

        // Add to beginning of array
        this.history.unshift(calculation);

        // Limit history size
        if (this.history.length > this.maxHistoryItems) {
            this.history = this.history.slice(0, this.maxHistoryItems);
        }

        this.saveHistory();
        this.renderHistory();
    }

    deleteCalculation(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.saveHistory();
        this.renderHistory();
    }

    clearAll() {
        if (this.history.length === 0) return;

        if (confirm('Clear all calculation history?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
        }
    }

    recallCalculation(id) {
        const calculation = this.history.find(item => item.id === id);
        if (calculation && window.calculator) {
            window.calculator.loadCalculation(calculation.expression, calculation.result);
        }
    }

    renderHistory() {
        const container = document.getElementById('history-container');
        if (!container) return;

        if (this.history.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <span class="material-symbols-outlined text-6xl text-primary/30 mb-4 block">history</span>
                    <p class="text-[#9a4c73] dark:text-white/60 text-sm">No calculations yet</p>
                </div>
            `;
            return;
        }

        // Group by date
        const grouped = this.groupByDate();
        let html = '';

        for (const [dateLabel, items] of Object.entries(grouped)) {
            html += `
                <div class="mb-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-[#9a4c73] dark:text-white/40 mb-3 px-2">
                        ${dateLabel}
                    </h4>
                    <div class="flex flex-col gap-3">
                        ${items.map(item => this.renderHistoryItem(item)).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;

        // Bind delete and recall events
        container.querySelectorAll('[data-delete-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCalculation(parseInt(btn.dataset.deleteId));
            });
        });

        container.querySelectorAll('[data-recall-id]').forEach(item => {
            item.addEventListener('click', () => {
                this.recallCalculation(parseInt(item.dataset.recallId));
            });
        });
    }

    renderHistoryItem(item) {
        const time = this.formatTime(new Date(item.timestamp));

        return `
            <div class="history-item p-4 bg-white dark:bg-white/5 rounded-lg border border-[#f3e7ed] dark:border-white/5 
                        group hover:border-primary/30 transition-all cursor-pointer fade-in"
                 data-recall-id="${item.id}">
                <div class="flex justify-between items-start mb-1">
                    <p class="history-time text-[#9a4c73] dark:text-white/60 text-xs">${time}</p>
                    <button class="material-symbols-outlined text-xs text-[#9a4c73] opacity-0 group-hover:opacity-100 
                                   transition-opacity hover:text-red-500"
                            data-delete-id="${item.id}">
                        delete
                    </button>
                </div>
                <p class="history-expression text-[#1b0d14] dark:text-white/80 text-sm font-medium mb-1">${this.escapeHtml(item.expression)}</p>
                <p class="history-result text-primary text-xl font-bold">${this.escapeHtml(item.result)}</p>
            </div>
        `;
    }

    groupByDate() {
        const groups = {};
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        this.history.forEach(item => {
            const itemDate = new Date(item.timestamp);
            const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

            let label;
            if (itemDay.getTime() === today.getTime()) {
                label = 'Today';
            } else if (itemDay.getTime() === yesterday.getTime()) {
                label = 'Yesterday';
            } else {
                label = this.formatDate(itemDate);
            }

            if (!groups[label]) {
                groups[label] = [];
            }
            groups[label].push(item);
        });

        return groups;
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize history manager when DOM is ready
let historyManager;
document.addEventListener('DOMContentLoaded', () => {
    historyManager = new HistoryManager();

    // Expose globally
    window.historyManager = historyManager;
});
