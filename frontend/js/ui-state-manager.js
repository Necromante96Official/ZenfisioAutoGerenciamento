/**
 * UI STATE MANAGER
 * Gerencia e restaura a posição/estado da interface quando o sistema sincroniza
 */

class UIStateManager {
    constructor() {
        this.activeTab = null;
        this.scrollPositions = {};
        this.filters = {};
        this.init();
    }

    init() {
        // Salvar estado antes de atualizações
        this.setupAutoSave();
    }

    /**
     * Salva o estado atual da UI (aba ativa + posição de scroll)
     */
    saveState() {
        // Salva aba ativa (módulo Evoluções)
        const activeEvTab = document.querySelector('.tab-btn.active');
        if (activeEvTab) {
            this.activeTab = activeEvTab.dataset.tab;
            console.log('💾 Aba ativa salva:', this.activeTab);
        }

        // Salva aba ativa (módulo Financeiro)
        const activeFinTab = document.querySelector('.financial-tab-btn.active');
        if (activeFinTab) {
            this.activeTab = activeFinTab.dataset.tab;
            console.log('💾 Aba Financeira salva:', this.activeTab);
        }

        // Salva posições de scroll de containers principais
        const mainContainer = document.querySelector('.evolucoes-tabs');
        if (mainContainer) {
            this.scrollPositions.main = mainContainer.scrollTop;
        }

        const financialContainer = document.querySelector('.financial-tabs-container');
        if (financialContainer) {
            this.scrollPositions.financial = financialContainer.scrollTop;
        }

        // Salva status de filtros
        const statusFilters = document.querySelectorAll('.status-filter-btn');
        this.filters.statuses = Array.from(statusFilters)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.dataset.status);

        const typeFilters = document.querySelectorAll('.type-filter-btn');
        this.filters.types = Array.from(typeFilters)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.dataset.type);

        console.log('💾 Estado completo salvo:', {
            tab: this.activeTab,
            scroll: this.scrollPositions,
            filters: this.filters
        });
    }

    /**
     * Restaura o estado anterior da UI
     */
    restoreState() {
        // Pequeno delay para garantir que o DOM foi atualizado
        setTimeout(() => {
            // Restaura aba ativa
            if (this.activeTab) {
                const tabBtn = document.querySelector(`[data-tab="${this.activeTab}"]`);
                if (tabBtn) {
                    tabBtn.click();
                    console.log('✅ Aba restaurada:', this.activeTab);
                }
            }

            // Restaura posições de scroll
            if (this.scrollPositions.main) {
                const mainContainer = document.querySelector('.evolucoes-tabs');
                if (mainContainer) {
                    mainContainer.scrollTop = this.scrollPositions.main;
                }
            }

            if (this.scrollPositions.financial) {
                const financialContainer = document.querySelector('.financial-tabs-container');
                if (financialContainer) {
                    financialContainer.scrollTop = this.scrollPositions.financial;
                }
            }

            // Restaura filtros de status
            if (this.filters.statuses && this.filters.statuses.length > 0) {
                this.filters.statuses.forEach(status => {
                    const btn = document.querySelector(`[data-status="${status}"]`);
                    if (btn) {
                        btn.click();
                    }
                });
            }

            // Restaura filtros de tipo
            if (this.filters.types && this.filters.types.length > 0) {
                this.filters.types.forEach(type => {
                    const btn = document.querySelector(`[data-type="${type}"]`);
                    if (btn) {
                        btn.click();
                    }
                });
            }

            console.log('✅ Estado restaurado com sucesso');
        }, 100);
    }

    /**
     * Configura salvamento automático antes de atualizações
     */
    setupAutoSave() {
        // Hook no auto-refresh para salvar estado antes
        const originalSetupAutoRefresh = window.setupAutoRefresh;
        if (originalSetupAutoRefresh) {
            window.setupAutoRefresh = () => {
                console.log('🔄 Sincronizando... salvando estado da interface');
                this.saveState();
                originalSetupAutoRefresh();
            };
        }
    }

    /**
     * Salva estado em localStorage (backup)
     */
    saveToLocalStorage() {
        const state = {
            tab: this.activeTab,
            scroll: this.scrollPositions,
            filters: this.filters,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('uiState', JSON.stringify(state));
        console.log('💾 Estado salvo em localStorage');
    }

    /**
     * Restaura estado do localStorage
     */
    restoreFromLocalStorage() {
        const saved = localStorage.getItem('uiState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.activeTab = state.tab;
                this.scrollPositions = state.scroll;
                this.filters = state.filters;
                console.log('✅ Estado restaurado do localStorage');
                this.restoreState();
            } catch (e) {
                console.error('❌ Erro ao restaurar estado do localStorage:', e);
            }
        }
    }
}

// Instancia globalmente
window.uiStateManager = new UIStateManager();
