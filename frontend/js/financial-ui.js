/**
 * Financial UI - Interface de Análise Financeira
 */

class FinancialUI {
    constructor() {
        this.container = null;
        this.data = {};
        this.filterModal = null;
        this.filteredData = null;
        this.originalRecords = [];
    }

    /**
     * Renderiza análise financeira completa
     */
    render(analysis, records = []) {
        this.data = analysis;
        this.originalRecords = records;
        const module = document.getElementById('financeiro');
        
        if (!module) {
            console.error('❌ Container #financeiro não encontrado');
            return;
        }

        console.log('📊 FinancialUI.render() chamado com:', {
            analysis: analysis,
            recordsCount: records.length,
            summary: analysis?.summary
        });

        // Renderiza HTML PRIMEIRO
        module.innerHTML = this._generateHTML();
        this._attachEventListeners();
        this._setupTabs();

        // Inicializa modal de filtros
        if (!this.filterModal) {
            this.filterModal = new FilterModal('financeiro');
        }
        
        console.log('✅ FinancialUI renderizado com sucesso');
    }

    /**
     * Abre modal de filtros
     */
    openFilterModal() {
        if (!this.filterModal) {
            this.filterModal = new FilterModal('financeiro');
        }

        if (this.originalRecords.length === 0) {
            if (window.notify) {
                window.notify.warning('Nenhum dado disponível para filtrar', 2000);
            }
            return;
        }

        this.filterModal.open(this.originalRecords, (filteredRecords) => {
            this.reanalyzeWithFilters(filteredRecords);
        });
    }

    /**
     * Setup do sistema de filtros
     */

    /**
     * Reanalisa dados com filtros aplicados
     */
    reanalyzeWithFilters(filteredRecords) {
        const analyzer = new FinancialAnalyzer(filteredRecords);
        const analysis = analyzer.analyze();
        this.data = analysis;
        
        // Re-renderiza apenas o conteúdo das abas
        this._rerenderTabs();
    }

    /**
     * Re-renderiza as abas com novos dados
     */
    _rerenderTabs() {
        const tabs = document.querySelectorAll('.financial-tab-pane');
        const activeTab = document.querySelector('.financial-tab-pane.active');
        
        if (activeTab) {
            const tabId = activeTab.id;
            switch(tabId) {
                case 'datas':
                    activeTab.innerHTML = this._renderByDate(this.data.byDate || []);
                    break;
                case 'especialidades':
                    activeTab.innerHTML = this._renderSpecialties(this.data.bySpecialty || []);
                    break;
                case 'pacientes':
                    activeTab.innerHTML = this._renderPatients(this.data.byPatient || { isentos: [], particulares: [] });
                    break;
                case 'registros':
                    activeTab.innerHTML = this._renderDetailedRecords(this.originalRecords);
                    break;
            }
        }
    }

    /**
     * Gera HTML principal
     */
    _generateHTML() {
        // Garante que sempre tem valores válidos
        if (!this.data) {
            console.warn('⚠️ this.data está vazio em _generateHTML()');
            this.data = {
                summary: {},
                byDate: [],
                bySpecialty: [],
                byPatient: { isentos: [], particulares: [] }
            };
        }

        const summary = this.data.summary || {};
        const byDate = this.data.byDate || [];
        const bySpecialty = this.data.bySpecialty || [];
        const byPatient = this.data.byPatient || { isentos: [], particulares: [] };

        // Debug
        console.log('📋 _generateHTML() com dados:', {
            summary: summary,
            byDateCount: byDate.length,
            bySpecialtyCount: bySpecialty.length
        });

        return `
            <div class="financial-module">
                <!-- Summary Cards -->
                <div class="financial-summary">
                    <div class="summary-card">
                        <div class="summary-icon">📊</div>
                        <div class="summary-content">
                            <div class="summary-label">Total de Atendimentos</div>
                            <div class="summary-value">${summary.totalAtendimentos || 0}</div>
                        </div>
                    </div>

                    <div class="summary-card">
                        <div class="summary-icon">💰</div>
                        <div class="summary-content">
                            <div class="summary-label">Total Pagantes</div>
                            <div class="summary-value">${summary.totalPagantes || 0}</div>
                        </div>
                    </div>

                    <div class="summary-card">
                        <div class="summary-icon">🛡️</div>
                        <div class="summary-content">
                            <div class="summary-label">Total Isentos</div>
                            <div class="summary-value">${summary.totalIsentos || 0}</div>
                        </div>
                    </div>

                    <div class="summary-card highlight">
                        <div class="summary-icon">💵</div>
                        <div class="summary-content">
                            <div class="summary-label">Receita Total</div>
                            <div class="summary-value">R$ ${this._formatValue(summary.receitaTotal)}</div>
                        </div>
                    </div>
                </div>

                <!-- Tabs Navigation with Filter Button -->
                <div class="financial-tabs-container">
                    <button id="openFinanceiroFilterBtn" class="action-btn" title="Abrir painel de filtros">
                        🔍 Filtrar
                    </button>
                    <button id="clearFinanceiroDataBtn" class="action-btn" title="Limpar dados de análise financeira" style="background-color: #dc3545;">
                        🗑️ Limpar Financeiro
                    </button>
                    <div class="financial-tabs">
                        <button class="financial-tab-btn active" data-tab="datas">
                            📅 Por Data
                        </button>
                        <button class="financial-tab-btn" data-tab="especialidades">
                            🎯 Especialidades
                        </button>
                        <button class="financial-tab-btn" data-tab="pacientes">
                            👥 Pacientes
                        </button>
                        <button class="financial-tab-btn" data-tab="registros">
                            📋 Registros Detalhados
                        </button>
                    </div>
                </div>

                <!-- Tab Contents -->
                <div class="financial-tab-content">
                    <!-- Datas Tab -->
                    <div class="financial-tab-pane active" id="datas">
                        ${this._renderByDate(byDate)}
                    </div>

                    <!-- Especialidades Tab -->
                    <div class="financial-tab-pane" id="especialidades">
                        ${this._renderSpecialties(bySpecialty)}
                    </div>

                    <!-- Pacientes Tab -->
                    <div class="financial-tab-pane" id="pacientes">
                        ${this._renderPatients(byPatient)}
                    </div>

                    <!-- Registros Detalhados Tab -->
                    <div class="financial-tab-pane" id="registros">
                        ${this._renderDetailedRecords(this.originalRecords)}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza seção de datas
     */
    _renderByDate(dates) {
        if (!dates || dates.length === 0) {
            return `<div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <div class="empty-state-title">Nenhuma data encontrada</div>
                <div class="empty-state-text">Processe dados para ver análise por data</div>
            </div>`;
        }

        return `
            <div class="financial-list">
                ${dates.map((d, idx) => `
                    <div class="financial-item date-item" style="animation-delay: ${idx * 0.05}s">
                        <div class="item-header">
                            <div class="item-title">
                                📅 ${d.data}
                            </div>
                            <div class="item-badge">${d.atendimentos} Atendimento${d.atendimentos !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="item-stats">
                            <div class="stat">
                                <span class="stat-label">Pagantes:</span>
                                <span class="stat-value">${d.pagantes}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Isentos:</span>
                                <span class="stat-value">${d.isentos}</span>
                            </div>
                            <div class="stat highlight">
                                <span class="stat-label">Receita:</span>
                                <span class="stat-value">R$ ${this._formatValue(d.receita.toFixed(2))}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza seção de especialidades
     */
    _renderSpecialties(specialties) {
        if (!specialties || specialties.length === 0) {
            return `<div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-title">Nenhuma especialidade encontrada</div>
            </div>`;
        }

        return `
            <div class="financial-list">
                ${specialties.map((s, idx) => `
                    <div class="financial-item" style="animation-delay: ${idx * 0.05}s">
                        <div class="item-header">
                            <div class="item-title">
                                🎯 ${FinancialAnalyzer.formatarProcedimento(s.nome)}
                            </div>
                            <div class="item-badge">${s.atendimentos} Atendimento${s.atendimentos !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="item-stats">
                            <div class="stat">
                                <span class="stat-label">Pagantes:</span>
                                <span class="stat-value">${s.pagantes}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Isentos:</span>
                                <span class="stat-value">${s.isentos}</span>
                            </div>
                            <div class="stat highlight">
                                <span class="stat-label">Receita:</span>
                                <span class="stat-value">R$ ${this._formatValue(s.receita.toFixed(2))}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza seção de pacientes (lado a lado com busca)
     */
    _renderPatients(byPatient) {
        const isentos = byPatient.isentos || [];
        const particulares = byPatient.particulares || [];

        return `
            <div class="patients-container">
                <!-- Search Input -->
                <div class="patients-search-container">
                    <input type="text" 
                           id="patientsSearchInput" 
                           class="patients-search-input" 
                           placeholder="🔍 Buscar pacientes..." 
                           style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;">
                </div>

                <div class="patients-columns-wrapper">
                    <!-- Isentos Column -->
                    <div class="patients-column">
                        <div class="patients-header">
                            <div class="patients-title">🛡️ Isentos</div>
                            <div class="patients-count">${isentos.length}</div>
                        </div>
                        <div class="patients-list" id="isentosList">
                            ${isentos.length > 0 ? isentos.map((p, idx) => `
                                <div class="patient-item isento patient-searchable" 
                                     data-name="${p.nome.toLowerCase()}" 
                                     style="animation-delay: ${idx * 0.03}s">
                                    <div class="patient-name">${p.nome}</div>
                                    <div class="patient-info">
                                        <span class="info-item">📞 ${p.celular}</span>
                                    </div>
                                    <div class="patient-procedure">
                                        <strong>Procedimento:</strong> ${FinancialAnalyzer.formatarProcedimento(p.procedimentos)}
                                    </div>
                                    <div class="patient-meta">
                                        <span class="meta-tag">Fisio: ${p.fisioterapeuta}</span>
                                    </div>
                                    <div class="patient-stats">
                                        <span class="stat-badge">${p.atendimentos} Atendimento${p.atendimentos !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            `).join('') : '<div class="empty-message">Nenhum paciente isento</div>'}
                        </div>
                    </div>

                    <!-- Particulares Column -->
                    <div class="patients-column">
                        <div class="patients-header">
                            <div class="patients-title">💰 Particulares</div>
                            <div class="patients-count">${particulares.length}</div>
                        </div>
                        <div class="patients-list" id="particularesList">
                            ${particulares.length > 0 ? particulares.map((p, idx) => `
                                <div class="patient-item particular patient-searchable" 
                                     data-name="${p.nome.toLowerCase()}" 
                                     style="animation-delay: ${idx * 0.03}s">
                                    <div class="patient-name">${p.nome}</div>
                                    <div class="patient-info">
                                        <span class="info-item">📞 ${p.celular}</span>
                                    </div>
                                    <div class="patient-procedure">
                                        <strong>Procedimento:</strong> ${FinancialAnalyzer.formatarProcedimento(p.procedimentos)}
                                    </div>
                                    <div class="patient-meta">
                                        <span class="meta-tag">Fisio: ${p.fisioterapeuta}</span>
                                    </div>
                                    <div class="patient-stats">
                                        <span class="stat-badge">${p.atendimentos} Atendimento${p.atendimentos !== 1 ? 's' : ''}</span>
                                        <span class="value-badge">R$ ${this._formatValue(p.valor.toFixed(2))}</span>
                                    </div>
                                </div>
                            `).join('') : '<div class="empty-message">Nenhum paciente particular</div>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza registros detalhados com status, busca e filtros
     */
    _renderDetailedRecords(records) {
        if (!records || records.length === 0) {
            return `<div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-title">Nenhum registro encontrado</div>
                <div class="empty-state-text">Processe dados para ver registros detalhados</div>
            </div>`;
        }

        // Extrai status únicos e ordena
        const statuses = [...new Set(records.map(r => r.status || 'Sem Status'))].sort();
        
        // Agrupa por status e ordena registros dentro de cada grupo por data (DESC)
        const porStatus = {};
        records.forEach(record => {
            const status = record.status || 'Sem Status';
            if (!porStatus[status]) {
                porStatus[status] = [];
            }
            porStatus[status].push(record);
        });

        // Ordena registros dentro de cada status por data (descendente)
        Object.keys(porStatus).forEach(status => {
            porStatus[status].sort((a, b) => {
                const dataA = this._parseDate(a.dataProcessamento || a.dataAtendimento || '');
                const dataB = this._parseDate(b.dataProcessamento || b.dataAtendimento || '');
                return dataB.getTime() - dataA.getTime();
            });
        });

        return `
            <div class="financial-detailed-records">
                <!-- Filtros e Busca -->
                <div class="records-controls">
                    <input type="text" 
                           id="recordsSearchInput" 
                           class="records-search-input" 
                           placeholder="🔍 Buscar por paciente, fisio ou procedimento..." 
                           style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    
                    <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                        <button class="status-filter-btn active" data-status="all" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #f0f0f0;">
                            📊 Todos (${records.length})
                        </button>
                        ${statuses.map(status => `
                            <button class="status-filter-btn" data-status="${status}" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                                ${this._getStatusIcon(status)} ${status} (${porStatus[status].length})
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Tabelas por Status -->
                <div class="records-groups-container">
                    ${Object.entries(porStatus).map(([status, regs]) => `
                        <div class="records-group" data-status="${status}">
                            <div class="records-group-header">
                                <h4>${this._getStatusIcon(status)} ${status}</h4>
                                <span class="records-count">${regs.length} registro${regs.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div class="records-table">
                                <table class="detailed-table">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Horário</th>
                                            <th>Fisioterapeuta</th>
                                            <th>Paciente</th>
                                            <th>Convênio</th>
                                            <th>Procedimento</th>
                                            <th>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${regs.map((r, idx) => {
                                            const paciente = r.paciente || '-';
                                            const fisio = r.fisioterapeuta || '-';
                                            const procedimento = FinancialAnalyzer.formatarProcedimento(r.procedimentos);
                                            return `
                                                <tr class="record-row searchable-record"
                                                    data-search="${paciente.toLowerCase()}|${fisio.toLowerCase()}|${procedimento.toLowerCase()}|${r.convenio?.toLowerCase() || ''}"
                                                    style="animation-delay: ${idx * 0.02}s">
                                                    <td>${r.dataProcessamento || r.dataAtendimento || '-'}</td>
                                                    <td>${r.horario || '-'}</td>
                                                    <td>${fisio}</td>
                                                    <td class="patient-cell">${paciente}</td>
                                                    <td class="convenio-cell">${r.convenio || '-'}</td>
                                                    <td class="procedure-cell">
                                                        <div class="procedure-text">${procedimento}</div>
                                                    </td>
                                                    <td class="value-cell">R$ ${this._formatValue(r.valor || 0)}</td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Converte string de data DD/MM/YYYY para Date
     */
    _parseDate(dateStr) {
        if (!dateStr || dateStr === '-') return new Date(0);
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return new Date(parts[2], parseInt(parts[1]) - 1, parts[0]);
        }
        return new Date(0);
    }

    /**
     * Retorna ícone para cada status
     */
    _getStatusIcon(status) {
        const icons = {
            'Presença confirmada': '✅',
            'Confirmado': '✅',
            'Atendido': '📋',
            'Compareceu': '👤',
            'Falta': '❌',
            'Cancelado': '🚫',
            'Sem Status': '❓'
        };
        
        // Verifica se há correspondência exata
        if (icons[status]) {
            return icons[status];
        }
        
        // Verifica correspondência parcial
        for (const [key, icon] of Object.entries(icons)) {
            if (status.toLowerCase().includes(key.toLowerCase())) {
                return icon;
            }
        }
        
        return '📌'; // ícone padrão
    }

    /**
     * Formata valor monetário
     */
    _formatValue(value) {
        if (value === null || value === undefined) return '0,00';
        const num = parseFloat(value);
        return isNaN(num) ? '0,00' : num.toFixed(2).replace('.', ',');
    }

    /**
     * Configura tabs
     */
    _setupTabs() {
        const tabs = document.querySelectorAll('.financial-tab-btn');
        const panes = document.querySelectorAll('.financial-tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(targetTab)?.classList.add('active');
            });
        });
    }

    /**
     * Attach event listeners
     */
    _attachEventListeners() {
        // Conecta o botão de filtrar
        const filterBtn = document.getElementById('openFinanceiroFilterBtn');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.openFilterModal());
        }

        // Listener de busca para pacientes
        const searchInput = document.getElementById('patientsSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const patientItems = document.querySelectorAll('.patient-searchable');
                
                patientItems.forEach(item => {
                    const patientName = item.getAttribute('data-name');
                    if (patientName.includes(searchTerm) || searchTerm === '') {
                        item.style.display = '';
                        item.style.opacity = '1';
                    } else {
                        item.style.display = 'none';
                        item.style.opacity = '0';
                    }
                });
            });
        }

        // Listeners para filtro por status em registros
        const statusBtns = document.querySelectorAll('.status-filter-btn');
        statusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedStatus = btn.getAttribute('data-status');
                
                // Atualiza botões ativos
                statusBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                btn.style.background = '#e0e0e0';
                
                // Mostra/oculta grupos de registros
                const groups = document.querySelectorAll('.records-group');
                groups.forEach(group => {
                    if (selectedStatus === 'all') {
                        group.style.display = '';
                    } else {
                        group.style.display = group.getAttribute('data-status') === selectedStatus ? '' : 'none';
                    }
                });
            });
        });

        // Listener de busca para registros detalhados
        const recordsSearch = document.getElementById('recordsSearchInput');
        if (recordsSearch) {
            recordsSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const recordRows = document.querySelectorAll('.searchable-record');
                
                recordRows.forEach(row => {
                    const searchData = row.getAttribute('data-search');
                    if (searchData.includes(searchTerm) || searchTerm === '') {
                        row.style.display = '';
                        row.style.opacity = '1';
                    } else {
                        row.style.display = 'none';
                        row.style.opacity = '0';
                    }
                });
            });
        }
    }
}
