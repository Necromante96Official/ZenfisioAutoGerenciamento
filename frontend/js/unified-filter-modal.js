/**
 * UNIFIED-FILTER-MODAL.JS
 * Modal unificado de filtros para todas as páginas
 * - Evoluções Pendentes
 * - Análise Financeira  
 * - Agendamentos
 * 
 * Modal extenso centralizado com 3 abas internas
 */

class UnifiedFilterModal {
    constructor() {
        this.isOpen = false;
        this.currentTab = 'agendamentos'; // Tab ativo no modal
        this.filterStates = {
            evolucoes: {},
            financeiro: {},
            agendamentos: {}
        };
        this.callbacks = {
            evolucoes: null,
            financeiro: null,
            agendamentos: null
        };
    }

    /**
     * Abre o modal de filtros
     * @param {string} defaultTab - Tab a abrir por padrão ('evolucoes', 'financeiro', 'agendamentos')
     */
    open(defaultTab = 'agendamentos') {
        this.currentTab = defaultTab;
        this.isOpen = true;
        this._render();
    }

    /**
     * Fecha o modal
     */
    close() {
        const modal = document.getElementById('unified-filter-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
        this.isOpen = false;
    }

    /**
     * Define callback para aplicar filtros em um módulo
     */
    setCallback(module, callback) {
        this.callbacks[module] = callback;
    }

    /**
     * Renderiza o modal completo
     */
    _render() {
        // Remove modal anterior se existir
        const existing = document.getElementById('unified-filter-modal');
        if (existing) existing.remove();

        const html = `
            <div id="unified-filter-modal" class="unified-filter-overlay">
                <div class="unified-filter-container">
                    <!-- Header -->
                    <div class="unified-filter-header">
                        <h2>🔍 Filtros Avançados</h2>
                        <button class="unified-filter-close" id="unified-filter-close-btn">✕</button>
                    </div>

                    <!-- Tab Navigation -->
                    <div class="unified-filter-tabs">
                        <button class="unified-tab-btn ${this.currentTab === 'evolucoes' ? 'active' : ''}" data-tab="evolucoes">
                            📋 Evoluções
                        </button>
                        <button class="unified-tab-btn ${this.currentTab === 'financeiro' ? 'active' : ''}" data-tab="financeiro">
                            💰 Financeiro
                        </button>
                        <button class="unified-tab-btn ${this.currentTab === 'agendamentos' ? 'active' : ''}" data-tab="agendamentos">
                            📅 Agendamentos
                        </button>
                    </div>

                    <!-- Tab Contents -->
                    <div class="unified-filter-body">
                        <!-- Evoluções Tab -->
                        <div class="unified-tab-content ${this.currentTab === 'evolucoes' ? 'active' : ''}" data-tab-content="evolucoes">
                            ${this._renderEvolucoesFilters()}
                        </div>

                        <!-- Financeiro Tab -->
                        <div class="unified-tab-content ${this.currentTab === 'financeiro' ? 'active' : ''}" data-tab-content="financeiro">
                            ${this._renderFinanceiroFilters()}
                        </div>

                        <!-- Agendamentos Tab -->
                        <div class="unified-tab-content ${this.currentTab === 'agendamentos' ? 'active' : ''}" data-tab-content="agendamentos">
                            ${this._renderAgendamentosFilters()}
                        </div>
                    </div>

                    <!-- Footer com botões -->
                    <div class="unified-filter-footer">
                        <button class="unified-filter-btn secondary" id="unified-clear-filters">
                            ✕ Limpar Filtros
                        </button>
                        <button class="unified-filter-btn secondary" id="unified-close">
                            Fechar
                        </button>
                        <button class="unified-filter-btn primary" id="unified-apply-filters">
                            ✓ Aplicar Filtros
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        setTimeout(() => {
            const modal = document.getElementById('unified-filter-modal');
            if (modal) modal.classList.add('active');
        }, 10);

        this._attachEventListeners();
    }

    /**
     * Renderiza filtros da aba Evoluções
     */
    _renderEvolucoesFilters() {
        return `
            <div class="filter-section">
                <h3 class="filter-section-title">📅 Filtrar por Data</h3>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>Dia</label>
                        <input type="number" id="evolucoes-dia" min="1" max="31" placeholder="1-31" class="filter-input">
                    </div>
                    <div class="filter-group">
                        <label>Mês</label>
                        <select id="evolucoes-mes" class="filter-select">
                            <option value="">Todos os meses</option>
                            ${this._generateMonthOptions()}
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Ano</label>
                        <input type="number" id="evolucoes-ano" min="2000" max="2100" placeholder="2025" class="filter-input">
                    </div>
                </div>
            </div>

            <div class="filter-section">
                <h3 class="filter-section-title">👤 Filtros Específicos</h3>
                <div class="filter-row">
                    <div class="filter-group full-width">
                        <label>Paciente</label>
                        <input type="text" id="evolucoes-paciente" placeholder="Nome do paciente" class="filter-input">
                    </div>
                </div>
                <div class="filter-row">
                    <div class="filter-group full-width">
                        <label>Fisioterapeuta</label>
                        <input type="text" id="evolucoes-fisioterapeuta" placeholder="Nome do fisioterapeuta" class="filter-input">
                    </div>
                </div>
            </div>

            <div class="filter-info">
                <p id="evolucoes-filter-count">Nenhum filtro ativo</p>
            </div>
        `;
    }

    /**
     * Renderiza filtros da aba Financeiro
     */
    _renderFinanceiroFilters() {
        return `
            <div class="filter-section">
                <h3 class="filter-section-title">📅 Filtrar por Data</h3>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>Dia</label>
                        <input type="number" id="financeiro-dia" min="1" max="31" placeholder="1-31" class="filter-input">
                    </div>
                    <div class="filter-group">
                        <label>Mês</label>
                        <select id="financeiro-mes" class="filter-select">
                            <option value="">Todos os meses</option>
                            ${this._generateMonthOptions()}
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Ano</label>
                        <input type="number" id="financeiro-ano" min="2000" max="2100" placeholder="2025" class="filter-input">
                    </div>
                </div>
            </div>

            <div class="filter-section">
                <h3 class="filter-section-title">💰 Filtros de Valores</h3>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>Valor Mínimo (R$)</label>
                        <input type="number" id="financeiro-valor-min" min="0" step="0.01" placeholder="0.00" class="filter-input">
                    </div>
                    <div class="filter-group">
                        <label>Valor Máximo (R$)</label>
                        <input type="number" id="financeiro-valor-max" min="0" step="0.01" placeholder="1000.00" class="filter-input">
                    </div>
                </div>
            </div>

            <div class="filter-section">
                <h3 class="filter-section-title">👤 Filtros Específicos</h3>
                <div class="filter-row">
                    <div class="filter-group full-width">
                        <label>Profissional</label>
                        <input type="text" id="financeiro-profissional" placeholder="Nome do profissional" class="filter-input">
                    </div>
                </div>
                <div class="filter-row">
                    <div class="filter-group full-width">
                        <label>Convênio</label>
                        <input type="text" id="financeiro-convenio" placeholder="Nome do convênio" class="filter-input">
                    </div>
                </div>
            </div>

            <div class="filter-info">
                <p id="financeiro-filter-count">Nenhum filtro ativo</p>
            </div>
        `;
    }

    /**
     * Renderiza filtros da aba Agendamentos
     */
    _renderAgendamentosFilters() {
        return `
            <div class="filter-section">
                <h3 class="filter-section-title">📅 Filtrar por Período</h3>
                
                <!-- Filtros rápidos de período -->
                <div class="filter-quick-buttons">
                    <button class="filter-quick-btn" data-period="day">📅 Dia Específico</button>
                    <button class="filter-quick-btn" data-period="week">📆 Semana (Seg-Sex)</button>
                    <button class="filter-quick-btn" data-period="biweekly">🗓️ 15 Dias (Seg-Sex)</button>
                    <button class="filter-quick-btn" data-period="month">📊 Mês Completo</button>
                    <button class="filter-quick-btn" data-period="year">📈 Ano Completo</button>
                </div>

                <!-- Seleção manual de data -->
                <div class="filter-row" style="margin-top: 1.5rem;">
                    <div class="filter-group">
                        <label>Dia</label>
                        <input type="number" id="agendamentos-dia" min="1" max="31" placeholder="1-31" class="filter-input">
                    </div>
                    <div class="filter-group">
                        <label>Mês</label>
                        <select id="agendamentos-mes" class="filter-select">
                            <option value="">Todos os meses</option>
                            ${this._generateMonthOptions()}
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Ano</label>
                        <input type="number" id="agendamentos-ano" min="2000" max="2100" placeholder="2025" class="filter-input">
                    </div>
                </div>

                <!-- Intervalo de datas -->
                <div class="filter-row" style="margin-top: 1rem;">
                    <div class="filter-group">
                        <label>Data Início</label>
                        <input type="date" id="agendamentos-data-inicio" class="filter-input">
                    </div>
                    <div class="filter-group">
                        <label>Data Fim</label>
                        <input type="date" id="agendamentos-data-fim" class="filter-input">
                    </div>
                </div>
            </div>

            <div class="filter-section">
                <h3 class="filter-section-title">👤 Filtros Específicos</h3>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>Status</label>
                        <select id="agendamentos-status" class="filter-select">
                            <option value="">Todos os status</option>
                            <option value="compareceu">✅ Compareceu</option>
                            <option value="faltou">❌ Faltou</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Fisioterapeuta</label>
                        <input type="text" id="agendamentos-fisioterapeuta" placeholder="Nome do fisioterapeuta" class="filter-input">
                    </div>
                </div>
                <div class="filter-row">
                    <div class="filter-group full-width">
                        <label>Paciente</label>
                        <input type="text" id="agendamentos-paciente" placeholder="Nome do paciente" class="filter-input">
                    </div>
                </div>
            </div>

            <div class="filter-info">
                <p id="agendamentos-filter-count">Nenhum filtro ativo</p>
                <p id="agendamentos-period-info" style="color: var(--accent-primary); font-weight: 600; margin-top: 0.5rem;"></p>
            </div>
        `;
    }

    /**
     * Gera opções de meses
     */
    _generateMonthOptions() {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return meses.map((mes, i) => `<option value="${i + 1}">${mes}</option>`).join('');
    }

    /**
     * Conecta event listeners
     */
    _attachEventListeners() {
        // Navegação entre tabs
        document.querySelectorAll('.unified-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this._switchTab(tab);
            });
        });

        // Botões de período rápido (Agendamentos)
        document.querySelectorAll('.filter-quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                this._applyQuickPeriod(period);
            });
        });

        // Fechar modal
        document.getElementById('unified-filter-close-btn')?.addEventListener('click', () => this.close());
        document.getElementById('unified-close')?.addEventListener('click', () => this.close());

        // Clicar fora do modal
        document.getElementById('unified-filter-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'unified-filter-modal') {
                this.close();
            }
        });

        // Limpar filtros
        document.getElementById('unified-clear-filters')?.addEventListener('click', () => {
            this._clearCurrentTabFilters();
        });

        // Aplicar filtros
        document.getElementById('unified-apply-filters')?.addEventListener('click', () => {
            this._applyCurrentTabFilters();
        });
    }

    /**
     * Troca de tab interna
     */
    _switchTab(tabName) {
        this.currentTab = tabName;

        // Atualiza botões
        document.querySelectorAll('.unified-tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Atualiza conteúdo
        document.querySelectorAll('.unified-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const tabContent = document.querySelector(`[data-tab-content="${tabName}"]`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    }

    /**
     * Aplica período rápido para Agendamentos
     */
    _applyQuickPeriod(period) {
        const hoje = window.dateManager ? window.dateManager.getDate() : new Date();
        
        let dataInicio, dataFim;
        let infoText = '';

        switch (period) {
            case 'day':
                // Dia específico
                dataInicio = new Date(hoje);
                dataFim = new Date(hoje);
                infoText = '📅 Filtro: Dia específico';
                break;

            case 'week':
                // Semana atual (seg-sex)
                dataInicio = this._getMonday(hoje);
                dataFim = this._getFriday(hoje);
                infoText = '📆 Filtro: Semana (Seg-Sex)';
                break;

            case 'biweekly':
                // 15 dias úteis (seg-sex)
                dataInicio = new Date(hoje);
                dataFim = this._addBusinessDays(hoje, 15);
                infoText = '🗓️ Filtro: 15 dias úteis (Seg-Sex)';
                break;

            case 'month':
                // Mês completo
                dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
                infoText = '📊 Filtro: Mês completo';
                break;

            case 'year':
                // Ano completo
                dataInicio = new Date(hoje.getFullYear(), 0, 1);
                dataFim = new Date(hoje.getFullYear(), 11, 31);
                infoText = '📈 Filtro: Ano completo';
                break;
        }

        // Preenche campos
        if (dataInicio && dataFim) {
            const dataInicioStr = dataInicio.toISOString().split('T')[0];
            const dataFimStr = dataFim.toISOString().split('T')[0];

            document.getElementById('agendamentos-data-inicio').value = dataInicioStr;
            document.getElementById('agendamentos-data-fim').value = dataFimStr;

            // Mostra info
            const infoEl = document.getElementById('agendamentos-period-info');
            if (infoEl) {
                infoEl.textContent = infoText;
            }

            // Remove destaque de outros botões
            document.querySelectorAll('.filter-quick-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }
    }

    /**
     * Retorna segunda-feira da semana
     */
    _getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    /**
     * Retorna sexta-feira da semana
     */
    _getFriday(date) {
        const monday = this._getMonday(date);
        return new Date(monday.setDate(monday.getDate() + 4));
    }

    /**
     * Adiciona N dias úteis (seg-sex)
     */
    _addBusinessDays(date, days) {
        const result = new Date(date);
        let addedDays = 0;

        while (addedDays < days) {
            result.setDate(result.getDate() + 1);
            const dayOfWeek = result.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                addedDays++;
            }
        }

        return result;
    }

    /**
     * Limpa filtros da tab atual
     */
    _clearCurrentTabFilters() {
        const prefix = this.currentTab;

        // Limpa todos os inputs da tab ativa
        document.querySelectorAll(`#${prefix}-dia, #${prefix}-mes, #${prefix}-ano`).forEach(el => {
            if (el) el.value = '';
        });

        document.querySelectorAll(`input[id^="${prefix}-"], select[id^="${prefix}-"]`).forEach(el => {
            if (el.type === 'checkbox') {
                el.checked = false;
            } else {
                el.value = '';
            }
        });

        // Remove destaque dos botões rápidos
        document.querySelectorAll('.filter-quick-btn').forEach(btn => btn.classList.remove('active'));

        // Limpa info
        const infoEl = document.getElementById(`${prefix}-filter-count`);
        if (infoEl) infoEl.textContent = 'Filtros limpos';

        const periodInfoEl = document.getElementById(`${prefix}-period-info`);
        if (periodInfoEl) periodInfoEl.textContent = '';

        if (window.notify) {
            window.notify.show('Filtros limpos', 'info');
        }
    }

    /**
     * Aplica filtros da tab atual
     */
    _applyCurrentTabFilters() {
        const filters = this._collectCurrentFilters();
        const callback = this.callbacks[this.currentTab];

        if (callback) {
            callback(filters);
            if (window.notify) {
                window.notify.success('Filtros aplicados com sucesso!');
            }
            this.close();
        } else {
            console.warn(`Callback não definido para ${this.currentTab}`);
            if (window.notify) {
                window.notify.warning('Sistema de filtros não configurado para esta página');
            }
        }
    }

    /**
     * Coleta filtros da tab atual
     */
    _collectCurrentFilters() {
        const prefix = this.currentTab;
        const filters = {
            module: this.currentTab,
            dia: null,
            mes: null,
            ano: null,
            dataInicio: null,
            dataFim: null
        };

        // Data básica
        const dia = document.getElementById(`${prefix}-dia`)?.value;
        const mes = document.getElementById(`${prefix}-mes`)?.value;
        const ano = document.getElementById(`${prefix}-ano`)?.value;

        if (dia) filters.dia = parseInt(dia);
        if (mes) filters.mes = parseInt(mes);
        if (ano) filters.ano = parseInt(ano);

        // Filtros específicos por módulo
        if (this.currentTab === 'agendamentos') {
            filters.dataInicio = document.getElementById('agendamentos-data-inicio')?.value || null;
            filters.dataFim = document.getElementById('agendamentos-data-fim')?.value || null;
            filters.status = document.getElementById('agendamentos-status')?.value || null;
            filters.fisioterapeuta = document.getElementById('agendamentos-fisioterapeuta')?.value || null;
            filters.paciente = document.getElementById('agendamentos-paciente')?.value || null;
        } else if (this.currentTab === 'financeiro') {
            filters.valorMin = document.getElementById('financeiro-valor-min')?.value || null;
            filters.valorMax = document.getElementById('financeiro-valor-max')?.value || null;
            filters.profissional = document.getElementById('financeiro-profissional')?.value || null;
            filters.convenio = document.getElementById('financeiro-convenio')?.value || null;
        } else if (this.currentTab === 'evolucoes') {
            filters.paciente = document.getElementById('evolucoes-paciente')?.value || null;
            filters.fisioterapeuta = document.getElementById('evolucoes-fisioterapeuta')?.value || null;
        }

        return filters;
    }
}

// Instância global
window.unifiedFilterModal = new UnifiedFilterModal();

