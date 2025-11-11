/**
 * FILTER-UI.JS
 * Interface visual para o sistema de filtragem
 */

class FilterUI {
    constructor(containerId, filterSystem, type = 'evolucoes') {
        this.container = document.getElementById(containerId);
        this.filterSystem = filterSystem;
        this.type = type;
        this.callbacks = {};
    }

    /**
     * Renderiza a interface de filtros
     */
    render() {
        // Se o container foi destruído, cria um novo
        if (!this.container) {
            console.warn(`⚠️ FilterUI.render(): Container não encontrado`);
            return;
        }

        console.log('🟢 FilterUI.render(): renderizando filtros em', this.container.id, '(type:', this.type + ')');

        const filters = this.filterSystem.getFilterOptions();
        const active = this.filterSystem.getActiveFilters();

        const html = `
            <div class="filter-container">
                <!-- Seção de Data -->
                <div class="filter-section">
                    <div class="filter-section-title">📅 Filtrar por Data</div>
                    <div class="filter-row">
                        <div class="filter-group">
                            <label for="filter-dia">Dia</label>
                            <input type="number" id="filter-dia" min="1" max="31" placeholder="1-31" 
                                   value="${active.dia || ''}" class="filter-input">
                        </div>
                        <div class="filter-group">
                            <label for="filter-mes">Mês</label>
                            <select id="filter-mes" class="filter-select">
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
                        <div class="filter-group">
                            <label for="filter-ano">Ano</label>
                            <input type="number" id="filter-ano" min="2000" max="2100" placeholder="2025" 
                                   value="${active.ano || ''}" class="filter-input">
                        </div>
                        <div class="filter-group">
                            <button id="filter-clear-date" class="filter-btn-secondary" title="Limpar filtros de data">
                                ✕ Data
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Seção de Texto/Dropdowns -->
                <div class="filter-section">
                    <div class="filter-section-title">🔍 Filtros Específicos</div>
                    <div class="filter-row">
                        <div class="filter-group">
                            <label for="filter-paciente">Paciente</label>
                            <input type="text" id="filter-paciente" placeholder="Digite o nome..." 
                                   value="${active.paciente}" class="filter-input">
                        </div>

                        <div class="filter-group">
                            <label for="filter-fisioterapeuta">Fisioterapeuta</label>
                            <input type="text" id="filter-fisioterapeuta" placeholder="Digite o nome..." 
                                   value="${active.fisioterapeuta}" class="filter-input">
                        </div>

                        <div class="filter-group">
                            <label for="filter-status">Status</label>
                            <select id="filter-status" class="filter-select">
                                <option value="">Todos</option>
                                ${filters.status.map(s => 
                                    `<option value="${s}" ${active.status === s.toLowerCase() ? 'selected' : ''}>${s}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <div class="filter-group">
                            <label for="filter-convenio">Convênio</label>
                            <select id="filter-convenio" class="filter-select">
                                <option value="">Todos</option>
                                <option value="Particular" ${active.convenio === 'particular' ? 'selected' : ''}>Particular</option>
                                <option value="Isento" ${active.convenio === 'isento' ? 'selected' : ''}>Isento</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Seção de Procedimentos -->
                <div class="filter-section">
                    <div class="filter-section-title">⚕️ Procedimentos & Ações</div>
                    <div class="filter-row">
                        <div class="filter-group flex-grow">
                            <label for="filter-procedimentos">Procedimento</label>
                            <input type="text" id="filter-procedimentos" placeholder="Digite o procedimento..." 
                                   value="${active.procedimentos}" class="filter-input">
                        </div>

                        <div class="filter-actions">
                            <button id="filter-clear-all" class="filter-btn-danger" title="Limpar todos os filtros">
                                🔄 Limpar Tudo
                            </button>
                            <button id="filter-apply" class="filter-btn-primary" title="Aplicar filtros">
                                ✓ Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Indicador de Filtros Ativos -->
                <div class="filter-indicator" id="filter-indicator" style="display: none;">
                    <div class="indicator-content">
                        <span class="indicator-icon">🔍</span>
                        <span class="indicator-text" id="indicator-text"></span>
                    </div>
                </div>
            </div>
        `;

        // Insere o HTML DENTRO do container
        this.container.innerHTML = html;
        this._attachEventListeners();
    }

    /**
     * Conecta event listeners
     */
    _attachEventListeners() {
        // Data
        document.getElementById('filter-dia')?.addEventListener('change', (e) => {
            const dia = e.target.value ? parseInt(e.target.value) : null;
            const mes = document.getElementById('filter-mes')?.value || null;
            const ano = document.getElementById('filter-ano')?.value || null;
            this.filterSystem.setDateFilter(
                dia,
                mes ? parseInt(mes) : null,
                ano ? parseInt(ano) : null
            );
            this._triggerCallback('filter');
            this._updateIndicator();
        });

        document.getElementById('filter-mes')?.addEventListener('change', (e) => {
            const dia = document.getElementById('filter-dia')?.value || null;
            const mes = e.target.value ? parseInt(e.target.value) : null;
            const ano = document.getElementById('filter-ano')?.value || null;
            this.filterSystem.setDateFilter(
                dia ? parseInt(dia) : null,
                mes,
                ano ? parseInt(ano) : null
            );
            this._triggerCallback('filter');
            this._updateIndicator();
        });

        document.getElementById('filter-ano')?.addEventListener('change', (e) => {
            const dia = document.getElementById('filter-dia')?.value || null;
            const mes = document.getElementById('filter-mes')?.value || null;
            const ano = e.target.value ? parseInt(e.target.value) : null;
            this.filterSystem.setDateFilter(
                dia ? parseInt(dia) : null,
                mes ? parseInt(mes) : null,
                ano
            );
            this._triggerCallback('filter');
            this._updateIndicator();
        });

        // Texto
        document.getElementById('filter-paciente')?.addEventListener('input', (e) => {
            this.filterSystem.setTextFilter('paciente', e.target.value);
            this._triggerCallback('filter');
            this._updateIndicator();
        });

        document.getElementById('filter-fisioterapeuta')?.addEventListener('input', (e) => {
            this.filterSystem.setTextFilter('fisioterapeuta', e.target.value);
            this._triggerCallback('filter');
            this._updateIndicator();
        });

        document.getElementById('filter-status')?.addEventListener('change', (e) => {
            this.filterSystem.setTextFilter('status', e.target.value);
            this._triggerCallback('filter');
            this._updateIndicator();
        });

        document.getElementById('filter-procedimentos')?.addEventListener('input', (e) => {
            this.filterSystem.setTextFilter('procedimentos', e.target.value);
            this._triggerCallback('filter');
            this._updateIndicator();
        });

        document.getElementById('filter-convenio')?.addEventListener('change', (e) => {
            this.filterSystem.setTextFilter('convenio', e.target.value);
            this._triggerCallback('filter');
            this._updateIndicator();
        });

        // Botões
        document.getElementById('filter-clear-date')?.addEventListener('click', () => {
            document.getElementById('filter-dia').value = '';
            document.getElementById('filter-mes').value = '';
            document.getElementById('filter-ano').value = '';
            this.filterSystem.clearFilter('data');
            this._triggerCallback('filter');
            this._updateIndicator();
            this.notify('Filtros de data limpos', 'info');
        });

        document.getElementById('filter-clear-all')?.addEventListener('click', () => {
            document.getElementById('filter-dia').value = '';
            document.getElementById('filter-mes').value = '';
            document.getElementById('filter-ano').value = '';
            document.getElementById('filter-paciente').value = '';
            document.getElementById('filter-fisioterapeuta').value = '';
            document.getElementById('filter-status').value = '';
            document.getElementById('filter-procedimentos').value = '';
            document.getElementById('filter-convenio').value = '';
            this.filterSystem.clearFilter();
            this._triggerCallback('filter');
            this._updateIndicator();
            this.notify('Todos os filtros foram removidos', 'info');
        });

        document.getElementById('filter-apply')?.addEventListener('click', () => {
            this._triggerCallback('filter');
            this.notify('Filtros aplicados com sucesso', 'success');
        });
    }

    /**
     * Atualiza indicador de filtros ativos
     */
    _updateIndicator() {
        const active = this.filterSystem.getActiveFilters();
        const stats = this.filterSystem.getStats();
        const hasFilters = active.dia || active.mes || active.ano || active.paciente || 
                          active.fisioterapeuta || active.status || active.procedimentos || active.convenio;

        const indicator = document.getElementById('filter-indicator');
        
        if (hasFilters) {
            const filters = [];
            if (active.dia) filters.push(`Dia: ${active.dia}`);
            if (active.mes) filters.push(`Mês: ${active.mes}`);
            if (active.ano) filters.push(`Ano: ${active.ano}`);
            if (active.paciente) filters.push(`Paciente: ${active.paciente}`);
            if (active.fisioterapeuta) filters.push(`Fisio: ${active.fisioterapeuta}`);
            if (active.status) filters.push(`Status: ${active.status}`);
            if (active.procedimentos) filters.push(`Proc: ${active.procedimentos}`);
            if (active.convenio) filters.push(`Conv: ${active.convenio}`);

            const text = `${stats.totalRegistros}/${stats.percentualReduzido}% • ${filters.join(' | ')}`;
            document.getElementById('indicator-text').textContent = text;
            indicator.style.display = 'flex';
        } else {
            indicator.style.display = 'none';
        }
    }

    /**
     * Registra callback
     */
    onFilter(callback) {
        this.callbacks['filter'] = callback;
    }

    /**
     * Executa callback
     */
    _triggerCallback(event) {
        if (this.callbacks[event]) {
            this.callbacks[event](this.filterSystem.getFilteredData());
        }
    }

    /**
     * Mostra notificação
     */
    notify(message, type = 'info') {
        if (window.notify) {
            window.notify[type](message, 3000);
        }
    }
}
