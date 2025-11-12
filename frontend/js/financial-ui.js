/**
 * Financial UI - Interface de Análise Financeira
 */

class FinancialUI {
    constructor() {
        this.container = null;
        this.data = {};
        this.originalRecords = [];
        this._initializeModuleListener();
    }

    /**
     * Escuta quando o módulo fica visível e reinicializa tabs
     */
    _initializeModuleListener() {
        // Aguarda o DOM estar pronto
        const setupListener = () => {
            const financeiroModule = document.getElementById('financeiro');
            if (!financeiroModule) {
                setTimeout(setupListener, 100);
                return;
            }

            // Observer para detectar quando o módulo fica visível
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const target = mutation.target;
                        // Se o módulo ficou ativo e tem dados, reinicializa tabs
                        if (target.classList.contains('active') && target.id === 'financeiro' && this.data) {
                            console.log('🔄 Módulo Financeiro ficou visível, reinicializando tabs...');
                            setTimeout(() => {
                                this._setupTabs();
                                this._attachEventListeners();
                            }, 50);
                        }
                    }
                });
            });

            // Inicia observação
            observer.observe(financeiroModule, { attributes: true, attributeFilter: ['class'] });
            console.log('✅ Observer de módulo Financeiro iniciado');
        };

        // Executa quando DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupListener);
        } else {
            setupListener();
        }
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

        console.log('✅ FinancialUI renderizado com sucesso');
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

                <!-- Tabs Navigation -->
                <div class="financial-tabs-container">
                    <!-- Action Button - À Esquerda -->
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
                <!-- Search Input com tema padrão -->
                <div style="margin-bottom: 20px;">
                    <input type="text" 
                           id="patientsSearchInput" 
                           class="filter-input" 
                           placeholder="🔍 Buscar pacientes...">
                </div>

                <div class="patients-columns-wrapper">
                    <!-- Isentos Column (ESQUERDA) -->
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

                    <!-- Particulares Column (DIREITA) -->
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
     * Renderiza registros detalhados sem filtros por status
     */
    _renderDetailedRecords(records) {
        if (!records || records.length === 0) {
            return `<div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-title">Nenhum registro encontrado</div>
                <div class="empty-state-text">Processe dados para ver registros detalhados</div>
            </div>`;
        }

        return `
            <div class="financial-detailed-records">
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
                            ${records.map((r, idx) => {
                                const paciente = r.paciente || '-';
                                const fisio = r.fisioterapeuta || '-';
                                const procedimento = FinancialAnalyzer.formatarProcedimento(r.procedimentos);
                                return `
                                    <tr class="record-row"
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
        `;
    }

    /**
     * Formatador de valores monetários
     */
    _formatValue(value) {
        if (!value || isNaN(value)) return '0,00';
        const formatter = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return formatter.format(value);
    }

    /**
     * Setup das abas e eventos
     */
    _setupTabs() {
        const tabButtons = document.querySelectorAll('.financial-tab-btn');
        const tabPanes = document.querySelectorAll('.financial-tab-pane');

        console.log(`📑 _setupTabs(): Encontrados ${tabButtons.length} botões e ${tabPanes.length} panes`);

        if (tabButtons.length === 0 || tabPanes.length === 0) {
            console.warn('⚠️ Nenhum tab botão ou pane encontrado');
            return;
        }

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = btn.getAttribute('data-tab');

                console.log(`📑 Aba clicada: ${tabName}`);

                // Remove active de todos
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // Adiciona active ao atual
                btn.classList.add('active');
                const targetPane = document.getElementById(tabName);
                if (targetPane) {
                    targetPane.classList.add('active');
                    console.log(`✅ Aba ${tabName} ativada`);
                } else {
                    console.error(`❌ Pane com ID ${tabName} não encontrado`);
                }
            });
        });

        console.log('✅ Tabs inicializadas com sucesso');
    }

    /**
     * Attach event listeners
     */
    _attachEventListeners() {
        // Event listeners para tabs
        const patientsSearchInput = document.getElementById('patientsSearchInput');
        if (patientsSearchInput) {
            patientsSearchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const patients = document.querySelectorAll('.patient-searchable');
                
                patients.forEach(p => {
                    const name = p.getAttribute('data-name');
                    p.style.display = name.includes(searchTerm) ? 'block' : 'none';
                });
            });
        }
    }
}
