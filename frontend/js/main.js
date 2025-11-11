// ========================================
// ZENFISIO MANAGER - MAIN APPLICATION
// ========================================

class ZenfisioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchModule(e.target.closest('.nav-btn').dataset.module));
        });

        // Clear button
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearInput());
    }

    switchModule(moduleName) {
        // Hide all modules
        document.querySelectorAll('.module').forEach(mod => {
            mod.classList.remove('active');
        });

        // Show selected module
        const targetModule = document.getElementById(moduleName) || document.querySelector(`[data-module="${moduleName}"]`);
        if (targetModule) {
            targetModule.classList.add('active');
        }

        // Update nav button states
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-module="${moduleName}"]`)?.closest('.nav-btn')?.classList.add('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    clearInput() {
        const textarea = document.getElementById('evolucaoTextarea');
        if (textarea) {
            textarea.value = '';
            textarea.focus();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ZenfisioApp();
});
