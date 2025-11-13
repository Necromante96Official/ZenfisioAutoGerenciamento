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
            // Expandir card de paciente
            if (e.target.closest('.schedule-patient-card-header')) {
                const card = e.target.closest('.schedule-patient-card');
                this.toggleCardExpansion(card);
            }

            // Fechar card flutuante
            if (e.target.closest('.floating-card-close')) {
                this.closeFloatingCard();
            }

            // Clique fora do card
            if (e.target.classList.contains('floating-card-overlay')) {
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
            <div class="schedules-pacientes-container">
                <!-- COLUNA ESQUERDA: Compareceram -->
                <div class="schedules-column schedules-column-compareceu">
                    <div class="schedules-column-header">
                        <h3>✅ Compareceram</h3>
                        <span class="column-info">${compareceram.length} pacientes</span>
                    </div>
                    <div class="schedules-list">
        `;

        // Renderiza pacientes que compareceram
        if (compareceram.length === 0) {
            html += this.getEmptyState('Nenhum paciente compareceu', true);
        } else {
            compareceram.forEach(paciente => {
                html += this.renderPacienteCard(paciente, 'compareceu');
            });
        }

        html += `
                    </div>
                </div>

                <!-- COLUNA DIREITA: Faltaram -->
                <div class="schedules-column schedules-column-faltaram">
                    <div class="schedules-column-header">
                        <h3>❌ Faltaram</h3>
                        <span class="column-info">${faltaram.length} pacientes</span>
                    </div>
                    <div class="schedules-list">
        `;

        // Renderiza pacientes que faltaram
        if (faltaram.length === 0) {
            html += this.getEmptyState('Nenhum paciente faltou', true);
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
     * Renderiza card de paciente - Moderno e expandível com data
     * @param {Object} paciente
     * @param {string} tipo - 'compareceu' ou 'falta'
     * @returns {string} - HTML
     */
    renderPacienteCard(paciente, tipo) {
        const icon = tipo === 'compareceu' ? '✅' : '❌';
        const statusClass = tipo === 'compareceu' ? 'compareceu' : 'falta';
        
        // Obtém data do analyzer
        const data = this.analyzer.data || 'Data não informada';

        return `
            <div class="schedule-patient-card schedule-patient-${statusClass}">
                <div class="schedule-patient-card-header">
                    <div class="patient-header-left">
                        <span class="patient-icon">${icon}</span>
                        <div class="patient-info">
                            <div class="patient-name" title="${this.sanitize(paciente.nome)}">${this.sanitize(paciente.nome)}</div>
                            <div class="patient-time">
                                <span>⏰ ${this.sanitize(paciente.horario || 'Horário não informado')}</span>
                                <span style="margin-left: 0.5rem;">📅 ${data}</span>
                            </div>
                        </div>
                    </div>
                    <div class="patient-header-right">
                        <span class="expand-icon">⋯</span>
                    </div>
                </div>
                <div class="schedule-patient-card-content">
                    <div class="patient-detail">
                        <span class="detail-label">👨‍⚕️ Fisio:</span>
                        <span class="detail-value">${this.sanitize(paciente.fisioterapeuta || 'Não informado')}</span>
                    </div>
                    <div class="patient-detail">
                        <span class="detail-label">🏥 Convênio:</span>
                        <span class="detail-value">${this.sanitize(paciente.convenio || 'Não informado')}</span>
                    </div>
                    <div class="patient-detail">
                        <span class="detail-label">📱 Celular:</span>
                        <span class="detail-value">${this.sanitize(paciente.celular || 'Não informado')}</span>
                    </div>
                    <div class="patient-detail">
                        <span class="detail-label">🏥 Procedimento:</span>
                        <span class="detail-value">${this.sanitize(paciente.procedimentos || 'Não informado')}</span>
                    </div>
                    <div class="patient-detail">
                        <span class="detail-label">📌 Status:</span>
                        <span class="detail-value">${this.sanitize(paciente.status || 'Não informado')}</span>
                    </div>
                    ${paciente.periodo ? `
                    <div class="patient-detail">
                        <span class="detail-label">📅 Período:</span>
                        <span class="detail-value">${this.sanitize(paciente.periodo)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Toggle expansão de card - Com animação
     */
    toggleCardExpansion(card) {
        const header = card.querySelector('.schedule-patient-card-header');
        const content = card.querySelector('.schedule-patient-card-content');
        const icon = card.querySelector('.expand-icon');
        
        const isExpanded = content.classList.contains('show');
        
        if (isExpanded) {
            content.classList.remove('show');
            header.classList.remove('expanded');
            icon.textContent = '⋯';
        } else {
            content.classList.add('show');
            header.classList.add('expanded');
            icon.textContent = '⋀';
        }
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
        const floatingCard = document.querySelector('.floating-card');
        if (floatingCard) {
            floatingCard.remove();
        }
    }
}

// Exporta a classe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchedulesUI;
}
