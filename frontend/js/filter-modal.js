/**
 * FILTER-MODAL.JS
 * Modal flutuante para filtros em Evoluções e Financeiro
 * Cada aba tem seus próprios filtros baseados em seu conteúdo
 */

class FilterModal {
    constructor(type = 'evolucoes') {
        this.type = type; // 'evolucoes' ou 'financeiro'
        this.filterSystem = null;
        this.isOpen = false;
        this.callbacks = {};
    }

    /**
     * Abre o modal com filtros
     */
    open(data, onFilter) {
        if (!data || data.length === 0) {
            console.warn('FilterModal: nenhum dado disponível');
            return;
        }

        // Cria FilterSystem se não existir
        if (!this.filterSystem) {
            this.filterSystem = new FilterSystem(this.type);
        }

        this.filterSystem.setData(data);
        this.onFilter = onFilter;
        this.isOpen = true;

        this._render();
    }

    /**
     * Fecha o modal
     */
    close() {
        const modal = document.getElementById(`filter-modal-${this.type}`);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
        this.isOpen = false;
    }

    /**
     * Renderiza o modal
     */
    _render() {
        // Remove modal anterior se existir
        const existing = document.getElementById(`filter-modal-${this.type}`);
        if (existing) existing.remove();

        const filters = this.filterSystem.getFilterOptions();
        const active = this.filterSystem.getActiveFilters();

        const html = `
            <div id="filter-modal-${this.type}" class="filter-modal-overlay">
                <div class="filter-modal">
                    <!-- Header -->
                    <div class="filter-modal-header">
                        <h2>🔍 Filtrar ${this.type === 'evolucoes' ? 'Evoluções' : 'Análise Financeira'}</h2>
                        <button class="filter-modal-close" id="filter-modal-close-${this.type}">✕</button>
                    </div>

                    <!-- Body -->
                    <div class="filter-modal-body">
                        <!-- Seção de Data -->
                        <div class="filter-modal-section">
                            <h3 class="filter-modal-title">📅 Filtrar por Data</h3>
                            <div class="filter-modal-row">
                                <div class="filter-modal-group">
                                    <label>Dia</label>
                                    <input type="number" id="filter-${this.type}-dia" min="1" max="31" 
                                           placeholder="1-31" value="${active.dia || ''}" class="filter-modal-input">
                                </div>
                                <div class="filter-modal-group">
                                    <label>Mês</label>
                                    <select id="filter-${this.type}-mes" class="filter-modal-select">
                                        <option value="">Selecione mês</option>
                                        <option value="1" ${active.mes === 1 ? 'selected' : ''}>Janeiro</option>
                                        <option value="2" ${active.mes === 2 ? 'selected' : ''}>Fevereiro</option>
                                        <option value="3" ${active.mes === 3 ? 'selected' : ''}>Março</option>
                                        <option value="4" ${active.mes === 4 ? 'selected' : ''}>Abril</option>
                                        <option value="5" ${active.mes === 5 ? 'selected' : ''}>Maio</option>
                                        <option value="6" ${active.mes === 6 ? 'selected' : ''}>Junho</option>
                                        <option value="7" ${active.mes === 7 ? 'selected' : ''}>Julho</option>
                                        <option value="8" ${active.mes === 8 ? 'selected' : ''}>Agosto</option>
                                        <option value="9" ${active.mes === 9 ? 'selected' : ''}>Setembro</option>
                                        <option value="10" ${active.mes === 10 ? 'selected' : ''}>Outubro</option>
                                        <option value="11" ${active.mes === 11 ? 'selected' : ''}>Novembro</option>
                                        <option value="12" ${active.mes === 12 ? 'selected' : ''}>Dezembro</option>
                                    </select>
                                </div>
                                <div class="filter-modal-group">
                                    <label>Ano</label>
                                    <input type="number" id="filter-${this.type}-ano" min="2000" max="2100" 
                                           placeholder="2025" value="${active.ano || ''}" class="filter-modal-input">
                                </div>
                            </div>
                        </div>

                        <!-- Seção de Texto -->
                        <div class="filter-modal-section">
                            <h3 class="filter-modal-title">🔍 Filtros Específicos</h3>
                            
                            <!-- Paciente - Dropdown com opções -->
                            ${filters.pacientes && filters.pacientes.length > 0 ? `
                            <div class="filter-modal-group">
                                <label>Paciente</label>
                                <select id="filter-${this.type}-paciente" class="filter-modal-select">
                                    <option value="">Selecione um paciente</option>
                                    ${filters.pacientes.map(p => `<option value="${p}" ${active.paciente === p.toLowerCase() ? 'selected' : ''}>${p}</option>`).join('')}
                                </select>
                            </div>
                            ` : ''}

                            <!-- Fisioterapeuta - Dropdown com opções -->
                            ${filters.fisioterapeutas && filters.fisioterapeutas.length > 0 ? `
                            <div class="filter-modal-group">
                                <label>Fisioterapeuta</label>
                                <select id="filter-${this.type}-fisioterapeuta" class="filter-modal-select">
                                    <option value="">Selecione um fisioterapeuta</option>
                                    ${filters.fisioterapeutas.map(f => `<option value="${f}" ${active.fisioterapeuta === f.toLowerCase() ? 'selected' : ''}>${f}</option>`).join('')}
                                </select>
                            </div>
                            ` : ''}

                            <!-- Status - Mostrado apenas se houver dados e for Evoluções -->
                            <!-- REMOVIDO: Status não é necessário para Evoluções -->

                            <!-- Convênio - REMOVIDO: Não é necessário para Evoluções -->
                        </div>

                        <!-- Informações -->
                        <div class="filter-modal-info">
                            <p>Total de registros: <strong>${this.filterSystem.originalData.length}</strong></p>
                            <p id="filter-${this.type}-count">Resultados: <strong>${this.filterSystem.originalData.length}</strong></p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="filter-modal-footer">
                        <button class="filter-modal-btn secondary" id="filter-${this.type}-clear">
                            ✕ Limpar Filtros
                        </button>
                        <button class="filter-modal-btn secondary" id="filter-${this.type}-close">
                            Fechar
                        </button>
                        <button class="filter-modal-btn primary" id="filter-${this.type}-apply">
                            ✓ Aplicar Filtros
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        // Adiciona à página
        setTimeout(() => {
            const modal = document.getElementById(`filter-modal-${this.type}`);
            if (modal) modal.classList.add('active');
        }, 10);

        this._attachEventListeners();
    }

    /**
     * Conecta event listeners
     */
    _attachEventListeners() {
        const prefix = `filter-${this.type}`;

        // Data
        document.getElementById(`${prefix}-dia`)?.addEventListener('change', () => this._updateFilters());
        document.getElementById(`${prefix}-mes`)?.addEventListener('change', () => this._updateFilters());
        document.getElementById(`${prefix}-ano`)?.addEventListener('change', () => this._updateFilters());

        // Texto
        document.getElementById(`${prefix}-paciente`)?.addEventListener('change', () => this._updateFilters());
        document.getElementById(`${prefix}-fisioterapeuta`)?.addEventListener('change', () => this._updateFilters());
        document.getElementById(`${prefix}-status`)?.addEventListener('change', () => this._updateFilters());

        // Botões
        document.getElementById(`filter-modal-close-${this.type}`)?.addEventListener('click', () => this.close());
        document.getElementById(`${prefix}-close`)?.addEventListener('click', () => this.close());

        document.getElementById(`${prefix}-clear`)?.addEventListener('click', () => {
            // Limpa todos os inputs usando optional chaining
            document.getElementById(`${prefix}-dia`)?.value && (document.getElementById(`${prefix}-dia`).value = '');
            document.getElementById(`${prefix}-mes`)?.value && (document.getElementById(`${prefix}-mes`).value = '');
            document.getElementById(`${prefix}-ano`)?.value && (document.getElementById(`${prefix}-ano`).value = '');
            document.getElementById(`${prefix}-paciente`)?.value && (document.getElementById(`${prefix}-paciente`).value = '');
            document.getElementById(`${prefix}-fisioterapeuta`)?.value && (document.getElementById(`${prefix}-fisioterapeuta`).value = '');
            document.getElementById(`${prefix}-status`)?.value && (document.getElementById(`${prefix}-status`).value = '');

            // Limpa filtros no system
            this.filterSystem.clearFilter();
            this._updateCount();
        });

        document.getElementById(`${prefix}-apply`)?.addEventListener('click', () => {
            if (this.onFilter) {
                const filtered = this.filterSystem.getFilteredData();
                this.onFilter(filtered);
                
                // Salva filtro no localStorage para evoluções
                if (this.type === 'evolucoes' && window.evolucoesUI) {
                    window.evolucoesUI.saveFilterToLocalStorage();
                }
                
                if (window.notify) {
                    window.notify.success('Filtros aplicados com sucesso!', 2000);
                }
                this.close();
            }
        });

        // Fechar ao clicar fora
        document.getElementById(`filter-modal-${this.type}`)?.addEventListener('click', (e) => {
            if (e.target.id === `filter-modal-${this.type}`) {
                this.close();
            }
        });
    }

    /**
     * Atualiza filtros em tempo real
     */
    _updateFilters() {
        const prefix = `filter-${this.type}`;

        const dia = document.getElementById(`${prefix}-dia`)?.value || null;
        const mes = document.getElementById(`${prefix}-mes`)?.value || null;
        const ano = document.getElementById(`${prefix}-ano`)?.value || null;
        const paciente = document.getElementById(`${prefix}-paciente`)?.value || '';
        const fisioterapeuta = document.getElementById(`${prefix}-fisioterapeuta`)?.value || '';
        const status = document.getElementById(`${prefix}-status`)?.value || '';

        // Aplica filtros
        this.filterSystem.setDateFilter(
            dia ? parseInt(dia) : null,
            mes ? parseInt(mes) : null,
            ano ? parseInt(ano) : null
        );

        this.filterSystem.setTextFilter('paciente', paciente);
        this.filterSystem.setTextFilter('fisioterapeuta', fisioterapeuta);
        this.filterSystem.setTextFilter('status', status);

        this._updateCount();
    }

    /**
     * Atualiza contagem de resultados
     */
    _updateCount() {
        const filtered = this.filterSystem.getFilteredData();
        const countEl = document.getElementById(`filter-${this.type}-count`);
        if (countEl) {
            countEl.innerHTML = `Resultados: <strong>${filtered.length}</strong>`;
        }
    }
}
