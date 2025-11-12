/**
 * UI STATE MANAGER - v2
 * Gerencia e restaura a posição/estado da interface quando o sistema sincroniza
 * Agora com suporte robusto para múltiplas abas e filtros
 */

class UIStateManager {
    constructor() {
        this.activeTab = null;
        this.activeModule = null;
        this.scrollPositions = {};
        this.filterStates = {};
        console.log('✅ UIStateManager inicializado');
    }

    /**
     * Salva o estado atual da UI com debug detalhado
     */
    saveState() {
        console.log('💾 [UIStateManager] Salvando estado da UI...');
        
        // Detecta qual módulo está ativo
        const financialModule = document.getElementById('financeiro');
        const evolucoesModule = document.getElementById('evolucoes');
        
        const financialActive = financialModule && financialModule.style.display !== 'none' && !financialModule.classList.contains('hidden');
        const evolucaoActive = evolucoesModule && evolucoesModule.style.display !== 'none' && !evolucoesModule.classList.contains('hidden');
        
        // Salva aba ativa do módulo Financeiro
        if (financialActive) {
            const activeFinTab = document.querySelector('.financial-tab-btn.active');
            if (activeFinTab) {
                this.activeTab = activeFinTab.getAttribute('data-tab');
                this.activeModule = 'financeiro';
                console.log('💾 [Financeiro] Aba salva:', this.activeTab);
            }
        }
        
        // Salva aba ativa do módulo Evoluções
        if (evolucaoActive) {
            const activeEvTab = document.querySelector('.tab-btn.active');
            if (activeEvTab) {
                this.activeTab = activeEvTab.getAttribute('data-tab');
                this.activeModule = 'evolucoes';
                console.log('💾 [Evoluções] Aba salva:', this.activeTab);
            }
        }

        // Salva scroll positions
        document.querySelectorAll('[class*="list"], [class*="container"]').forEach(el => {
            if (el.scrollTop > 0) {
                this.scrollPositions[el.className] = el.scrollTop;
            }
        });

        // Salva status de filtros avançados de registros
        const advancedFilters = document.querySelectorAll('.column-filter-select');
        this.filterStates.advancedFilters = {};
        advancedFilters.forEach(select => {
            const column = select.getAttribute('data-column');
            const value = select.value;
            if (value) {
                this.filterStates.advancedFilters[column] = value;
            }
        });

        // Salva filtros de tipo
        const typeFilters = {
            specialty: document.querySelector('.specialty-type-filter.active')?.getAttribute('data-type'),
            patient: document.querySelector('.patients-type-filter.active')?.getAttribute('data-type'),
        };
        this.filterStates.typeFilters = typeFilters;

        // Salva valores de buscas
        const searchInputs = {
            records: document.getElementById('recordsSearchInput')?.value || '',
            patients: document.getElementById('patientsSearchInput')?.value || '',
            date: document.getElementById('dateSearchInput')?.value || '',
        };
        this.filterStates.searches = searchInputs;

        console.log('💾 [UIStateManager] Estado salvo:', {
            tab: this.activeTab,
            module: this.activeModule,
            filters: this.filterStates
        });

        this.saveToLocalStorage();
    }

    /**
     * Restaura o estado anterior da UI com retry logic
     */
    restoreState() {
        console.log('✅ [UIStateManager] Restaurando estado da UI...');
        
        // Aumenta o delay para garantir rendering
        setTimeout(() => {
            try {
                this._restoreTabState();
                this._restoreScrollState();
                this._restoreFilterState();
                console.log('✅ [UIStateManager] Estado restaurado com sucesso!');
            } catch (error) {
                console.error('❌ [UIStateManager] Erro ao restaurar:', error);
            }
        }, 200);
    }

    /**
     * Restaura a aba ativa
     */
    _restoreTabState() {
        if (!this.activeTab) {
            console.warn('⚠️ [UIStateManager] Nenhuma aba para restaurar');
            return;
        }

        console.log('🔄 [UIStateManager] Restaurando aba:', this.activeTab);

        // Procura por tab button no módulo financeiro
        let tabBtn = document.querySelector(`.financial-tab-btn[data-tab="${this.activeTab}"]`);
        
        // Se não encontrar no financeiro, procura no evoluções
        if (!tabBtn) {
            tabBtn = document.querySelector(`.tab-btn[data-tab="${this.activeTab}"]`);
        }

        if (tabBtn) {
            console.log('✅ [UIStateManager] Aba encontrada, ativando:', this.activeTab);
            tabBtn.click();
            
            // Confirm restoration
            setTimeout(() => {
                const isActive = tabBtn.classList.contains('active');
                console.log(isActive ? '✅ [UIStateManager] Aba ativa confirmada' : '⚠️ [UIStateManager] Falha ao ativar aba');
            }, 50);
        } else {
            console.warn('⚠️ [UIStateManager] Aba não encontrada:', this.activeTab);
        }
    }

    /**
     * Restaura scroll positions
     */
    _restoreScrollState() {
        if (!this.scrollPositions || Object.keys(this.scrollPositions).length === 0) {
            return;
        }

        console.log('🔄 [UIStateManager] Restaurando posições de scroll...');
        Object.entries(this.scrollPositions).forEach(([selector, position]) => {
            const el = document.querySelector('.' + selector.split(' ')[0]);
            if (el) {
                el.scrollTop = position;
            }
        });
    }

    /**
     * Restaura todos os filtros
     */
    _restoreFilterState() {
        if (!this.filterStates) return;

        console.log('🔄 [UIStateManager] Restaurando filtros...');

        // Restaura filtros avançados
        if (this.filterStates.advancedFilters) {
            Object.entries(this.filterStates.advancedFilters).forEach(([column, value]) => {
                const select = document.querySelector(`.column-filter-select[data-column="${column}"]`);
                if (select) {
                    select.value = value;
                }
            });
        }

        // Restaura filtros de tipo
        if (this.filterStates.typeFilters) {
            // Specialty filter
            if (this.filterStates.typeFilters.specialty) {
                const btn = document.querySelector(`.specialty-type-filter[data-type="${this.filterStates.typeFilters.specialty}"]`);
                if (btn) btn.click();
            }

            // Patient filter
            if (this.filterStates.typeFilters.patient) {
                const btn = document.querySelector(`.patients-type-filter[data-type="${this.filterStates.typeFilters.patient}"]`);
                if (btn) btn.click();
            }
        }

        // Restaura buscas
        if (this.filterStates.searches) {
            if (this.filterStates.searches.records) {
                const input = document.getElementById('recordsSearchInput');
                if (input) {
                    input.value = this.filterStates.searches.records;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }

            if (this.filterStates.searches.patients) {
                const input = document.getElementById('patientsSearchInput');
                if (input) {
                    input.value = this.filterStates.searches.patients;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }

            if (this.filterStates.searches.date) {
                const input = document.getElementById('dateSearchInput');
                if (input) {
                    input.value = this.filterStates.searches.date;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }

        console.log('✅ [UIStateManager] Filtros restaurados');
    }

    /**
     * Salva estado em localStorage para recuperação em caso de erro
     */
    saveToLocalStorage() {
        const state = {
            tab: this.activeTab,
            module: this.activeModule,
            filterStates: this.filterStates,
            timestamp: new Date().toISOString()
        };
        try {
            localStorage.setItem('uiState_v2', JSON.stringify(state));
            console.log('💾 [UIStateManager] Estado persistido em localStorage');
        } catch (error) {
            console.warn('⚠️ [UIStateManager] localStorage não disponível:', error);
        }
    }

    /**
     * Restaura estado do localStorage se necessário
     */
    restoreFromLocalStorage() {
        const saved = localStorage.getItem('uiState_v2');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.activeTab = state.tab;
                this.activeModule = state.module;
                this.filterStates = state.filterStates || {};
                console.log('✅ [UIStateManager] Estado carregado do localStorage');
                this.restoreState();
            } catch (error) {
                console.error('❌ [UIStateManager] Erro ao restaurar do localStorage:', error);
            }
        }
    }
}

// Instancia globalmente
window.uiStateManager = new UIStateManager();
console.log('✅ [UIStateManager] Instância global criada');