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
     * Abre modal de filtros (DESABILITADO - Não mostra modal mesmo com dados)
     */
    openFilterModal() {
        // Modal desabilitado conforme solicitação
        // Mantém a função para compatibilidade, mas não executa nada
        return;
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
                case 'profissionais':
                    activeTab.innerHTML = this._renderProfessionals(this.data.byProfessional || []);
                    break;
                case 'pacientes':
                    activeTab.innerHTML = this._renderPatients(this.data.byPatient || { isentos: [], particulares: [] });
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
                byProfessional: [],
                byPatient: { isentos: [], particulares: [] }
            };
        }

        const summary = this.data.summary || {};
        const byDate = this.data.byDate || [];
        const bySpecialty = this.data.bySpecialty || [];
        const byProfessional = this.data.byProfessional || [];
        const byPatient = this.data.byPatient || { isentos: [], particulares: [] };

        // Debug
        console.log('📋 _generateHTML() com dados:', {
            summary: summary,
            byDateCount: byDate.length,
            bySpecialtyCount: bySpecialty.length,
            byProfessionalCount: byProfessional.length
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
                        <button class="financial-tab-btn" data-tab="profissionais">
                            👨‍⚕️ Profissionais
                        </button>
                        <button class="financial-tab-btn" data-tab="pacientes">
                            👥 Pacientes
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

                    <!-- Profissionais Tab -->
                    <div class="financial-tab-pane" id="profissionais">
                        ${this._renderProfessionals(byProfessional)}
                    </div>

                    <!-- Pacientes Tab -->
                    <div class="financial-tab-pane" id="pacientes">
                        ${this._renderPatients(byPatient)}
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
                            <div class="item-title">${s.nome}</div>
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
     * Renderiza seção de profissionais
     */
    _renderProfessionals(professionals) {
        if (!professionals || professionals.length === 0) {
            return `<div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-title">Nenhum profissional encontrado</div>
            </div>`;
        }

        return `
            <div class="financial-list">
                ${professionals.map((p, idx) => `
                    <div class="financial-item" style="animation-delay: ${idx * 0.05}s">
                        <div class="item-header">
                            <div class="item-title">${p.nome}</div>
                            <div class="item-badge">${p.atendimentos} Atendimento${p.atendimentos !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="item-info">
                            <span class="info-tag">👥 ${p.pacientesUnicos} pacientes</span>
                            <span class="info-tag">🎯 ${p.especialidades}</span>
                        </div>
                        <div class="item-stats">
                            <div class="stat">
                                <span class="stat-label">Pagantes:</span>
                                <span class="stat-value">${p.pagantes}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Isentos:</span>
                                <span class="stat-value">${p.isentos}</span>
                            </div>
                            <div class="stat highlight">
                                <span class="stat-label">Receita:</span>
                                <span class="stat-value">R$ ${this._formatValue(p.receita.toFixed(2))}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza seção de pacientes (lado a lado)
     */
    _renderPatients(byPatient) {
        const isentos = byPatient.isentos || [];
        const particulares = byPatient.particulares || [];
        const maxHeight = Math.max(isentos.length, particulares.length);

        return `
            <div class="patients-container">
                <div class="patients-column">
                    <div class="patients-header">
                        <div class="patients-title">🛡️ Isentos</div>
                        <div class="patients-count">${isentos.length}</div>
                    </div>
                    <div class="patients-list">
                        ${isentos.length > 0 ? isentos.map((p, idx) => `
                            <div class="patient-item isento" style="animation-delay: ${idx * 0.03}s">
                                <div class="patient-name">${p.nome}</div>
                                <div class="patient-info">
                                    <span class="info-item">📞 ${p.celular}</span>
                                </div>
                                <div class="patient-meta">
                                    <span class="meta-tag">${p.fisioterapeuta}</span>
                                    <span class="meta-tag">${p.especialidade}</span>
                                </div>
                                <div class="patient-stats">
                                    <span class="stat-badge">${p.atendimentos} Atendimento${p.atendimentos !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        `).join('') : '<div class="empty-message">Nenhum paciente isento</div>'}
                    </div>
                </div>

                <div class="patients-column">
                    <div class="patients-header">
                        <div class="patients-title">💰 Particulares</div>
                        <div class="patients-count">${particulares.length}</div>
                    </div>
                    <div class="patients-list">
                        ${particulares.length > 0 ? particulares.map((p, idx) => `
                            <div class="patient-item particular" style="animation-delay: ${idx * 0.03}s">
                                <div class="patient-name">${p.nome}</div>
                                <div class="patient-info">
                                    <span class="info-item">📞 ${p.celular}</span>
                                </div>
                                <div class="patient-meta">
                                    <span class="meta-tag">${p.fisioterapeuta}</span>
                                    <span class="meta-tag">${p.especialidade}</span>
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
        `;
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
        // Conecta o botão de filtrar (mesmo que desabilitado, mantém compatibilidade)
        const filterBtn = document.getElementById('openFinanceiroFilterBtn');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.openFilterModal());
        }
    }
}
