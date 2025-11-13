/**
 * SCHEDULES-UI.JS
 * Interface gráfica para análise de agendamentos e faltas
 * Exibe dois cards informativos e uma aba de pacientes com comparativo lado-a-lado
 */

class SchedulesUI {
    constructor(analyzerInstance) {
        console.log(`🎨 SchedulesUI: Inicializando...`);
        this.analyzer = analyzerInstance;
        this.currentTab = 'pacientes';
        this.currentSelectedPatient = null;
        console.log(`🎨 SchedulesUI: Configurando event listeners...`);
        this.init();
        console.log(`🎨 SchedulesUI: Inicialização concluída`);
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listeners para botões
        document.addEventListener('click', (e) => {
            // Clique no item da lista de paciente - abre modal flutuante
            if (e.target.closest('.list-item')) {
                const card = e.target.closest('.list-item');
                this.openPatientDetailModal(card);
            }

            // Fechar modal flutuante
            if (e.target.closest('.modal-schedule-close')) {
                this.closeFloatingCard();
            }

            // Clique fora do modal
            if (e.target.classList.contains('modal-schedule-overlay')) {
                this.closeFloatingCard();
            }
        });
    }

    /**
     * Renderiza a página inteira de agendamentos
     * @param {Object} data - Dados do analyzer
     */
    render(data) {
        console.log(`🎨 SchedulesUI.render() chamado`);
        
        // Obtém container da seção
        const container = document.querySelector('#agendamentos-content');
        if (!container) {
            console.error('❌ Container #agendamentos-content não encontrado');
            return;
        }
        
        console.log(`✅ Container #agendamentos-content encontrado`);

        // Limpa container
        container.innerHTML = '';

        // Obtém resumo
        const resumo = this.analyzer.getResumo();
        console.log(`📊 Resumo:`, resumo);

        // Renderiza cards informativos (agora com 3 colunas)
        const cardsHTML = this.renderCards(resumo);
        container.innerHTML += cardsHTML;

        // Aba de Pacientes
        const tabsHTML = this.renderTabs();
        container.innerHTML += tabsHTML;

        // Renderiza conteúdo da aba padrão
        this.renderTab(this.currentTab);

        // Setup tab clicks
        this.setupTabClicks();
        
        console.log(`✅ SchedulesUI.render() concluído`);
    }

    /**
     * Renderiza os três cards informativos (Comparecimentos / Faltas / Total)
     * @returns {string} - HTML dos cards
     */
    renderCards(resumo) {
        const totalRegistros = resumo.totalCompareceram + resumo.totalFaltas;
        
        return `
            <div class="schedules-cards-container">
                <div class="schedules-info-card card-primary">
                    <div class="card-icon">✅</div>
                    <div class="card-content">
                        <div class="card-label">Comparecimentos</div>
                        <div class="card-value">${resumo.totalCompareceram}</div>
                        <div class="card-subtext">pacientes que compareceram</div>
                    </div>
                </div>

                <div class="schedules-info-card card-danger">
                    <div class="card-icon">❌</div>
                    <div class="card-content">
                        <div class="card-label">Faltas</div>
                        <div class="card-value">${resumo.totalFaltas}</div>
                        <div class="card-subtext">taxa: ${resumo.taxaFalta}%</div>
                    </div>
                </div>

                <div class="schedules-info-card card-info">
                    <div class="card-icon">📊</div>
                    <div class="card-content">
                        <div class="card-label">Total de Agendamentos</div>
                        <div class="card-value">${totalRegistros}</div>
                        <div class="card-subtext">registros processados</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza abas de navegação
     * @returns {string} - HTML das abas
     */
    renderTabs() {
        return `
            <div class="schedules-tabs">
                <div class="schedules-tabs-header">
                    <button class="schedules-tab-btn active" data-tab="pacientes">👥 Pacientes</button>
                </div>
                <div class="schedules-tabs-content">
                    <div id="schedules-tab-pacientes" data-tab-content="pacientes" class="schedules-tab-content active"></div>
                </div>
            </div>
        `;
    }

    /**
     * Setup de clicks nas abas
     */
    setupTabClicks() {
        document.querySelectorAll('.schedules-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    /**
     * Muda de aba
     * @param {string} tabName
     */
    switchTab(tabName) {
        this.currentTab = tabName;

        // Atualiza botões
        document.querySelectorAll('.schedules-tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Atualiza conteúdo
        document.querySelectorAll('.schedules-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const tabContent = document.querySelector(`#schedules-tab-${tabName}`);
        if (tabContent) {
            tabContent.classList.add('active');
            this.renderTab(tabName);
        }
    }

    /**
     * Renderiza o conteúdo de uma aba específica
     * @param {string} tabName
     */
    renderTab(tabName) {
        const container = document.querySelector(`#schedules-tab-${tabName}`);
        if (!container) return;

        switch (tabName) {
            case 'pacientes':
                this.renderTabPacientes(container);
                break;
        }
    }

    /**
     * Renderiza aba de Pacientes (lado-a-lado)
     * Esquerda: Compareceram | Direita: Faltaram
     */
    renderTabPacientes(container) {
        const { faltaram, compareceram, resumo } = this.analyzer.getPacientesComparativo();

        if (faltaram.length === 0 && compareceram.length === 0) {
            container.innerHTML = this.getEmptyState('Nenhum dado de agendamento processado');
            return;
        }

        let html = `
            <div class="schedules-list-wrapper">
                <!-- COLUNA ESQUERDA: Compareceram -->
                <div class="schedules-list-column">
                    <div class="list-section-header section-compareceu">
                        <div class="header-icon">✅</div>
                        <div class="header-info">
                            <h3>Compareceram</h3>
                            <span class="header-count">${compareceram.length} pacientes</span>
                        </div>
                    </div>
                    <div class="list-items">
        `;

        // Renderiza pacientes que compareceram
        if (compareceram.length === 0) {
            html += `<div class="list-empty-state">Nenhum paciente compareceu</div>`;
        } else {
            compareceram.forEach(paciente => {
                html += this.renderPacienteCard(paciente, 'compareceu');
            });
        }

        html += `
                    </div>
                </div>

                <!-- COLUNA DIREITA: Faltaram -->
                <div class="schedules-list-column">
                    <div class="list-section-header section-falta">
                        <div class="header-icon">❌</div>
                        <div class="header-info">
                            <h3>Faltaram</h3>
                            <span class="header-count">${faltaram.length} pacientes</span>
                        </div>
                    </div>
                    <div class="list-items">
        `;

        // Renderiza pacientes que faltaram
        if (faltaram.length === 0) {
            html += `<div class="list-empty-state">Nenhum paciente faltou</div>`;
        } else {
            faltaram.forEach(paciente => {
                html += this.renderPacienteCard(paciente, 'falta');
            });
        }

        html += `
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderiza item de paciente - LISTA SIMPLES E BONITA
     * @param {Object} paciente
     * @param {string} tipo - 'compareceu' ou 'falta'
     * @returns {string} - HTML
     */
    renderPacienteCard(paciente, tipo) {
        const icon = tipo === 'compareceu' ? '✅' : '❌';
        const statusClass = tipo === 'compareceu' ? 'status-success' : 'status-danger';
        
        // Obtém data do analyzer
        const data = this.analyzer.data || 'Data não informada';
        const horario = this.sanitize(paciente.horario || 'Horário não informado');
        const nome = this.sanitize(paciente.nome);

        return `
            <div class="list-item ${statusClass}" data-paciente-json='${JSON.stringify({
                nome: paciente.nome,
                horario: paciente.horario,
                data: data,
                fisioterapeuta: paciente.fisioterapeuta,
                convenio: paciente.convenio,
                celular: paciente.celular,
                procedimentos: paciente.procedimentos,
                status: paciente.status,
                periodo: paciente.periodo,
                tipo: tipo
            }).replace(/'/g, '&apos;')}'>
                <div class="item-left">
                    <span class="item-status">${icon}</span>
                </div>
                <div class="item-center">
                    <div class="item-name">${nome}</div>
                    <div class="item-meta">
                        <span class="meta-tag">📅 ${data}</span>
                        <span class="meta-tag">⏰ ${horario}</span>
                    </div>
                </div>
                <div class="item-right">
                    <span class="item-click">→</span>
                </div>
            </div>
        `;
    }

    /**
     * Abre modal flutuante centralizado com detalhes do paciente
     */
    openPatientDetailModal(cardElement) {
        const jsonStr = cardElement.dataset.pacienteJson;
        if (!jsonStr) return;

        try {
            const paciente = JSON.parse(jsonStr);
            this.createAndShowPatientModal(paciente);
        } catch (e) {
            console.error('Erro ao parsear paciente:', e);
        }
    }

    /**
     * Cria e exibe o modal do paciente - Totalmente centralizado
     */
    createAndShowPatientModal(paciente) {
        // Remove modal anterior se existir
        this.closeFloatingCard();

        const statusIcon = paciente.tipo === 'compareceu' ? '✅' : '❌';
        const statusText = paciente.tipo === 'compareceu' ? 'Compareceu' : 'Faltou';
        const statusClass = paciente.tipo === 'compareceu' ? 'status-success' : 'status-danger';

        const modalHTML = `
            <div class="modal-schedule-overlay">
                <div class="modal-schedule-container">
                    <!-- Header -->
                    <div class="modal-schedule-header ${statusClass}">
                        <div class="modal-header-left">
                            <span class="modal-status-icon">${statusIcon}</span>
                            <div class="modal-header-title">
                                <h2>${this.sanitize(paciente.nome)}</h2>
                                <p class="modal-status-text">${statusText}</p>
                            </div>
                        </div>
                    </div>
                    <button class="modal-schedule-close" aria-label="Fechar">✕</button>

                    <!-- Body -->
                    <div class="modal-schedule-body">
                        <!-- Seção de Agendamento -->
                        <div class="modal-section">
                            <h3 class="modal-section-title">📅 Agendamento</h3>
                            <div class="modal-grid-2">
                                <div class="modal-info-box">
                                    <span class="modal-label">Data</span>
                                    <span class="modal-value">${this.sanitize(paciente.data)}</span>
                                </div>
                                <div class="modal-info-box">
                                    <span class="modal-label">Horário</span>
                                    <span class="modal-value">${this.sanitize(paciente.horario || 'Não informado')}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Seção de Informações Pessoais -->
                        <div class="modal-section">
                            <h3 class="modal-section-title">👤 Informações Pessoais</h3>
                            <div class="modal-grid-2">
                                <div class="modal-info-box">
                                    <span class="modal-label">Nome Completo</span>
                                    <span class="modal-value">${this.sanitize(paciente.nome)}</span>
                                </div>
                                <div class="modal-info-box">
                                    <span class="modal-label">Celular</span>
                                    <span class="modal-value">${this.sanitize(paciente.celular || 'Não informado')}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Seção de Informações Clínicas -->
                        <div class="modal-section">
                            <h3 class="modal-section-title">🏥 Informações Clínicas</h3>
                            <div class="modal-grid-2">
                                <div class="modal-info-box">
                                    <span class="modal-label">Fisioterapeuta</span>
                                    <span class="modal-value">${this.sanitize(paciente.fisioterapeuta || 'Não informado')}</span>
                                </div>
                                <div class="modal-info-box">
                                    <span class="modal-label">Convênio</span>
                                    <span class="modal-value">${this.sanitize(paciente.convenio || 'Não informado')}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Seção de Procedimentos -->
                        <div class="modal-section">
                            <h3 class="modal-section-title">💊 Procedimento</h3>
                            <div class="modal-full-width">
                                <div class="modal-procedure-box">
                                    <span class="modal-value">${this.sanitize(paciente.procedimentos || 'Não informado')}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Seção de Status -->
                        <div class="modal-section">
                            <h3 class="modal-section-title">📌 Status</h3>
                            <div class="modal-grid-2">
                                <div class="modal-info-box">
                                    <span class="modal-label">Status</span>
                                    <span class="modal-value">${this.sanitize(paciente.status || 'Não informado')}</span>
                                </div>
                                ${paciente.periodo ? `
                                <div class="modal-info-box">
                                    <span class="modal-label">Período</span>
                                    <span class="modal-value">${this.sanitize(paciente.periodo)}</span>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Ativa o modal com animação
        setTimeout(() => {
            const modal = document.querySelector('.modal-schedule-overlay');
            if (modal) {
                modal.classList.add('active');
            }
        }, 10);
    }

    /**
     * Retorna HTML de estado vazio
     * @param {string} message - Mensagem a exibir
     * @param {boolean} inline - Se true, retorna versão em linha
     */
    getEmptyState(message, inline = false) {
        if (inline) {
            return `<div style="text-align: center; padding: 1rem; color: var(--text-secondary); font-size: 0.9rem;">📭 ${message}</div>`;
        }
        
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-title">Sem dados</div>
                <div class="empty-state-text">${message}</div>
            </div>
        `;
    }

    /**
     * Sanitiza texto para exibição (evita XSS)
     */
    sanitize(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Fecha card flutuante se existir
     */
    closeFloatingCard() {
        const modal = document.querySelector('.modal-schedule-overlay');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentElement) {
                    modal.remove();
                }
            }, 300);
        }
    }
}

// Exporta a classe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchedulesUI;
}
