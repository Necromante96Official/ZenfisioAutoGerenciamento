/**
 * UI STATE MANAGER
 * Gerencia e restaura a posição/estado da interface quando o sistema sincroniza
 */

class UIStateManager {
    constructor() {
        this.activeTab = null;
        this.activeModule = null;
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
        console.log('💾 Iniciando salvamento de estado da UI...');
        
        // Salva aba ativa (módulo Evoluções)
        const activeEvTab = document.querySelector('.tab-btn.active');
        if (activeEvTab) {
            this.activeTab = activeEvTab.dataset.tab;
            this.activeModule = 'evolucoes';
            console.log('💾 Aba Evoluções ativa:', this.activeTab);
        }

        // Salva aba ativa (módulo Financeiro)
        const activeFinTab = document.querySelector('.financial-tab-btn.active');
        if (activeFinTab) {
            this.activeTab = activeFinTab.dataset.tab;
            this.activeModule = 'financeiro';
            console.log('💾 Aba Financeira ativa:', this.activeTab);
        }

        // Salva posições de scroll de containers principais
        const mainContainer = document.querySelector('.evolucoes-tabs');
        if (mainContainer) {
            this.scrollPositions.evolucoes = mainContainer.scrollTop;
        }

        const financialContainer = document.querySelector('.financial-tabs-container');
        if (financialContainer) {
            this.scrollPositions.financeiro = financialContainer.scrollTop;
        }

        // Salva status de filtros (registros detalhados)
        const advancedFilters = document.querySelectorAll('.column-filter-select');
        this.filters.advanced = {};
        advancedFilters.forEach(select => {
            const column = select.getAttribute('data-column');
            const value = select.value;
            if (value) {
                this.filters.advanced[column] = value;
            }
        });

        // Salva filtros de tipo de especialidade
        const specialtyTypeFilter = document.querySelector('.specialty-type-filter.active');
        if (specialtyTypeFilter) {
            this.filters.specialtyType = specialtyTypeFilter.getAttribute('data-type');
        }

        // Salva filtros de tipo de paciente
        const patientTypeFilter = document.querySelector('.patients-type-filter.active');
        if (patientTypeFilter) {
            this.filters.patientType = patientTypeFilter.getAttribute('data-type');
        }

        // Salva valores de buscas
        const recordsSearch = document.getElementById('recordsSearchInput');
        if (recordsSearch && recordsSearch.value) {
            this.filters.recordsSearch = recordsSearch.value;
        }

        const patientsSearch = document.getElementById('patientsSearchInput');
        if (patientsSearch && patientsSearch.value) {
            this.filters.patientsSearch = patientsSearch.value;
        }

        const dateSearch = document.getElementById('dateSearchInput');
        if (dateSearch && dateSearch.value) {
            this.filters.dateSearch = dateSearch.value;
        }

        console.log('💾 Estado completo salvo:', {
            tab: this.activeTab,
            module: this.activeModule,
            scroll: this.scrollPositions,
            filters: this.filters
        });

        this.saveToLocalStorage();
    }

    /**
     * Restaura o estado anterior da UI
     */
    restoreState() {
        console.log('✅ Iniciando restauração de estado...');
        
        // Pequeno delay para garantir que o DOM foi atualizado
        setTimeout(() => {
            // Restaura aba ativa
            if (this.activeTab) {
                // Procura por seletores específicos dependendo do módulo
                let tabBtn = document.querySelector(`[data-tab="${this.activeTab}"].tab-btn`);
                if (!tabBtn) {
                    tabBtn = document.querySelector(`[data-tab="${this.activeTab}"].financial-tab-btn`);
                }
                
                if (tabBtn) {
                    console.log('✅ Clicando em aba:', this.activeTab);
                    tabBtn.click();
                } else {
                    console.warn('⚠️ Aba não encontrada:', this.activeTab);
                }
            }

            // Restaura posições de scroll
            if (this.scrollPositions.evolucoes) {
                const mainContainer = document.querySelector('.evolucoes-tabs');
                if (mainContainer) {
                    mainContainer.scrollTop = this.scrollPositions.evolucoes;
                    console.log('✅ Scroll Evoluções restaurado');
                }
            }

            if (this.scrollPositions.financeiro) {
                const financialContainer = document.querySelector('.financial-tabs-container');
                if (financialContainer) {
                    financialContainer.scrollTop = this.scrollPositions.financeiro;
                    console.log('✅ Scroll Financeiro restaurado');
                }
            }

            // Restaura filtros avançados de registros
            if (this.filters.advanced && Object.keys(this.filters.advanced).length > 0) {
                Object.entries(this.filters.advanced).forEach(([column, value]) => {
                    const select = document.querySelector(`.column-filter-select[data-column="${column}"]`);
                    if (select) {
                        select.value = value;
                    }
                });
                console.log('✅ Filtros avançados restaurados');
            }

            // Restaura filtro de tipo de especialidade
            if (this.filters.specialtyType) {
                const btn = document.querySelector(`.specialty-type-filter[data-type="${this.filters.specialtyType}"]`);
                if (btn) {
                    btn.click();
                    console.log('✅ Filtro de especialidade restaurado');
                }
            }

            // Restaura filtro de tipo de paciente
            if (this.filters.patientType) {
                const btn = document.querySelector(`.patients-type-filter[data-type="${this.filters.patientType}"]`);
                if (btn) {
                    btn.click();
                    console.log('✅ Filtro de paciente restaurado');
                }
            }

            // Restaura valores de buscas
            if (this.filters.recordsSearch) {
                const input = document.getElementById('recordsSearchInput');
                if (input) {
                    input.value = this.filters.recordsSearch;
                    input.dispatchEvent(new Event('input'));
                }
            }

            if (this.filters.patientsSearch) {
                const input = document.getElementById('patientsSearchInput');
                if (input) {
                    input.value = this.filters.patientsSearch;
                    input.dispatchEvent(new Event('input'));
                }
            }

            if (this.filters.dateSearch) {
                const input = document.getElementById('dateSearchInput');
                if (input) {
                    input.value = this.filters.dateSearch;
                    input.dispatchEvent(new Event('input'));
                }
            }

            console.log('✅ Estado restaurado com sucesso!');
        }, 150); // Aumentado para 150ms para garantir renderização completa
    }

    /**
     * Configura salvamento automático antes de atualizações
     */
    setupAutoSave() {
        // Nada mais necessário aqui, o main.js chama saveState/restoreState diretamente
    }

    /**
     * Salva estado em localStorage (backup)
     */
    saveToLocalStorage() {
        const state = {
            tab: this.activeTab,
            module: this.activeModule,
            scroll: this.scrollPositions,
            filters: this.filters,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('uiState', JSON.stringify(state));
        console.log('💾 Estado persistido em localStorage');
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
                this.activeModule = state.module;
                this.scrollPositions = state.scroll || {};
                this.filters = state.filters || {};
                console.log('✅ Estado carregado do localStorage');
                this.restoreState();
            } catch (e) {
                console.error('❌ Erro ao restaurar estado do localStorage:', e);
            }
        }
    }
}

// Instancia globalmente
window.uiStateManager = new UIStateManager();
