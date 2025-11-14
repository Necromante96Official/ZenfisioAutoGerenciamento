/**
 * EVOLUCOES-UI.JS
 * Gerencia a interface de abas e renderização do conteúdo de evoluções
 */

class EvolucoesUI {
    constructor(analyzerInstance) {
        this.analyzer = analyzerInstance;
        this.currentTab = 'visao-geral';
        this.filteredData = null;
        this.init();
        this.restoreFilterFromLocalStorage();
    }

    init() {
        this.setupTabs();
        this.setupEventListeners();
        this.setupAutoSave();  // Ativa auto-save a cada 5 segundos
        
        // Salva estado antes de descarregar a página
        window.addEventListener('beforeunload', () => {
            this.savePageState();
        });
    }



    setupTabs() {
        const tabsContainer = document.querySelector('.evolucoes-tabs');
        if (!tabsContainer) return;

        const tabs = ['visao-geral', 'pacientes', 'fisioterapeutas', 'cronologia'];
        
        tabs.forEach(tab => {
            const btn = document.querySelector(`[data-tab="${tab}"]`);
            if (btn) {
                btn.addEventListener('click', () => this.switchTab(tab));
            }
        });
    }

    setupEventListeners() {
        // Listeners para botões de expansão
        document.addEventListener('click', (e) => {
            if (e.target.closest('.card-expand-btn')) {
                const btn = e.target.closest('.card-expand-btn');
                const patientCard = btn.closest('.patient-card');
                const therapistCard = btn.closest('.therapist-card');
                
                if (patientCard) {
                    const pacienteName = patientCard.querySelector('.card-patient-name')?.textContent;
                    this.showAttendanceDetailsCard(pacienteName);
                } else if (therapistCard) {
                    const therapistName = therapistCard.querySelector('.card-therapist-name')?.textContent;
                    this.showTherapistDetailsCard(therapistName);
                }
            }

            // Fechar card flutuante
            if (e.target.closest('.floating-card-close')) {
                this.closeFloatingCard();
            }

            // Clique fora do card flutuante
            if (e.target.classList.contains('floating-card-overlay')) {
                this.closeFloatingCard();
            }
        });

        // Event listener para scroll (salva posição)
        window.addEventListener('scroll', () => {
            // Debounce para não salvar a cada pixel
            clearTimeout(this._scrollTimeout);
            this._scrollTimeout = setTimeout(() => {
                this.savePageState();
            }, 1000);
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Atualizar botões
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Atualizar conteúdo
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const tabContent = document.querySelector(`[data-tab-content="${tabName}"]`);
        if (tabContent) {
            tabContent.classList.add('active');
            this.renderTab(tabName);
        }

        // Salva estado da aba ativa
        this.savePageState();
    }

    renderTab(tabName) {
        const container = document.querySelector(`[data-tab-content="${tabName}"]`);
        if (!container) return;

        switch (tabName) {
            case 'visao-geral':
                this.renderVisaoGeral(container);
                break;
            case 'pacientes':
                this.renderPacientes(container);
                break;
            case 'fisioterapeutas':
                this.renderFisioterapeutas(container);
                break;
            case 'cronologia':
                this.renderCronologia(container);
                break;
        }
    }

    /**
     * Renderiza todas as abas (usado quando filtros mudam)
     */
    renderAllTabs() {
        this.renderTab(this.currentTab);
    }

    /**
     * Obtém dados com filtros aplicados
     */
    getFilteredData() {
        // Se há dados filtrados (modal foi usado), retorna eles (mesmo que array vazio)
        if (this.filteredData !== null && this.filteredData !== undefined) {
            return this.filteredData;
        }
        // Caso contrário, retorna todos os dados
        return this.analyzer.evolucoes || [];
    }

    renderVisaoGeral(container) {
        // Usa dados filtrados
        let filteredData = this.getFilteredData();
        
        // Se ainda não há dados, mostra mensagem vazia
        if (!filteredData || filteredData.length === 0) {
            container.innerHTML = this.getEmptyState('Nenhuma evolução processada ou nenhum resultado com os filtros aplicados');
            return;
        }
        
        // Cria analyzer temporário com dados filtrados
        const analyzer = new EvolucoesAnalyzer();
        analyzer.evolucoes = filteredData;
        analyzer._atualizarIndices();
        
        const data = analyzer.getVisaoGeral();
        
        // Enriquece data com totalAtendimentos e totalPacientesUnicos para garantir filtros
        data.totalAtendimentos = filteredData.length;
        data.totalPacientesUnicos = analyzer.pacientes.size;
        data.totalFisioterapeutasUnicos = analyzer.fisioterapeutas.size;

        let html = this.getStatsBar(data) + `
            <div class="visao-geral-container">
                <div class="visao-geral-column">
                    <h4>👥 Pacientes com Falta de Evolução (${data.pacientes.length})</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        `;

        data.pacientes.forEach(paciente => {
            html += `
                <div class="visao-geral-item">
                    <div class="visao-item-nome">${paciente.nome}</div>
                    <div class="visao-item-info">
                        <div class="visao-item-stat">
                            <div class="visao-item-stat-label">Atendimentos</div>
                            <div class="visao-item-stat-value">${paciente.totalAtendimentos}</div>
                        </div>
                    </div>
                    <div class="visao-item-list">
                        <div class="visao-item-list-title">Fisioterapeutas:</div>
                        <div class="visao-item-list-items">
                            ${paciente.fisioterapeutas.map(f => `<span>• ${f}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
                <div class="visao-geral-column">
                    <h4>👨‍⚕️ Fisioterapeutas com Falta de Evoluções (${data.fisioterapeutas.length})</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        `;

        data.fisioterapeutas.forEach(fisio => {
            html += `
                <div class="visao-geral-item">
                    <div class="visao-item-nome">${fisio.nome}</div>
                    <div class="visao-item-info">
                        <div class="visao-item-stat">
                            <div class="visao-item-stat-label">Atendimentos</div>
                            <div class="visao-item-stat-value">${fisio.totalAtendimentos}</div>
                        </div>
                        <div class="visao-item-stat">
                            <div class="visao-item-stat-label">Pacientes</div>
                            <div class="visao-item-stat-value">${fisio.totalPacientes}</div>
                        </div>
                    </div>
                    <div class="visao-item-list">
                        <div class="visao-item-list-title">Pacientes:</div>
                        <div class="visao-item-list-items">
                            ${fisio.pacientes.map(p => `<span>• ${p}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    renderPacientes(container) {
        // Usa dados filtrados
        let filteredData = this.getFilteredData();
        
        if (!filteredData || filteredData.length === 0) {
            container.innerHTML = this.getEmptyState('Nenhum paciente encontrado com os filtros aplicados');
            return;
        }
        
        const analyzer = new EvolucoesAnalyzer();
        analyzer.evolucoes = filteredData;
        analyzer._atualizarIndices();
        
        const pacientes = analyzer.getPacientes();

        if (pacientes.length === 0) {
            container.innerHTML = this.getEmptyState('Nenhum paciente encontrado com os filtros aplicados');
            return;
        }

        let html = this.getStatsBar({ 
            totalPacientesUnicos: pacientes.length, 
            totalAtendimentos: filteredData.length,
            totalFisioterapeutasUnicos: analyzer.fisioterapeutas.size 
        }) + `
            <div class="patients-grid">
        `;

        pacientes.forEach((paciente, index) => {
            html += `
                <div class="patient-card" style="animation-delay: ${index * 50}ms">
                    <div class="card-patient-header">
                        <div class="card-patient-name">${paciente.nome}</div>
                        <div class="card-patient-badge">${paciente.totalAtendimentos}</div>
                    </div>
                    <div class="card-patient-info">
                        <div class="card-info-item">
                            <span class="card-info-label">Atendimentos</span>
                            <span class="card-info-value">${paciente.totalAtendimentos}x</span>
                        </div>
                        <div class="card-info-item">
                            <span class="card-info-label">Fisios</span>
                            <span class="card-info-value">${paciente.fisioterapeutas.split(', ').length}</span>
                        </div>
                        <div class="card-info-item">
                            <span class="card-info-label">Período</span>
                            <span class="card-info-value multi-line">
                                ${paciente.datas.map(d => `<span>${d}</span>`).join('')}
                            </span>
                        </div>
                    </div>
                    <div class="card-expandable">
                        <button class="card-expand-btn">▶ Detalhes de Atendimentos</button>
                        <div class="card-details">
                            ${paciente.atendimentos.map(at => `
                                <div class="detail-item">
                                    <span class="detail-label">${at.data}</span>
                                    <span class="detail-value">${at.fisioterapeuta} (${at.horario})</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    renderFisioterapeutas(container) {
        // Usa dados filtrados
        let filteredData = this.getFilteredData();
        
        if (!filteredData || filteredData.length === 0) {
            container.innerHTML = this.getEmptyState('Nenhum fisioterapeuta encontrado com os filtros aplicados');
            return;
        }
        
        const analyzer = new EvolucoesAnalyzer();
        analyzer.evolucoes = filteredData;
        analyzer._atualizarIndices();
        
        const fisios = analyzer.getFisioterapeutas();

        if (fisios.length === 0) {
            container.innerHTML = this.getEmptyState('Nenhum fisioterapeuta encontrado com os filtros aplicados');
            return;
        }

        let html = this.getStatsBar({ 
            totalFisioterapeutasUnicos: fisios.length, 
            totalAtendimentos: filteredData.length,
            totalPacientesUnicos: analyzer.pacientes.size 
        }) + `
            <div class="therapists-grid">
        `;

        fisios.forEach((fisio, index) => {
            html += `
                <div class="therapist-card" style="animation-delay: ${index * 50}ms">
                    <div class="card-therapist-header">
                        <div class="card-therapist-name">${fisio.nome}</div>
                        <div class="card-therapist-badge">${fisio.totalAtendimentos}</div>
                    </div>
                    <div class="card-therapist-info">
                        <div class="card-info-item">
                            <span class="card-info-label">Atendimentos</span>
                            <span class="card-info-value">${fisio.totalAtendimentos}x</span>
                        </div>
                        <div class="card-info-item">
                            <span class="card-info-label">Pacientes</span>
                            <span class="card-info-value">${fisio.totalPacientes}</span>
                        </div>
                        <div class="card-info-item">
                            <span class="card-info-label">Período</span>
                            <span class="card-info-value multi-line">
                                ${fisio.datas.map(d => `<span>${d}</span>`).join('')}
                            </span>
                        </div>
                    </div>
                    <div class="card-expandable">
                        <button class="card-expand-btn">▶ Mais detalhes</button>
                        <div class="card-details">
                            ${fisio.atendimentos.map(at => `
                                <div class="detail-item">
                                    <span class="detail-label">${at.data}</span>
                                    <span class="detail-value">${at.paciente} (${at.horario})</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    renderCronologia(container) {
        // Usa dados filtrados
        let filteredData = this.getFilteredData();
        
        if (!filteredData || filteredData.length === 0) {
            container.innerHTML = this.getEmptyState('Nenhuma cronologia encontrada com os filtros aplicados');
            return;
        }
        
        const analyzer = new EvolucoesAnalyzer();
        analyzer.evolucoes = filteredData;
        analyzer._atualizarIndices();
        
        // Adiciona stats bar com dados filtrados
        const statsBar = this.getStatsBar({
            totalAtendimentos: filteredData.length,
            totalPacientesUnicos: analyzer.pacientes.size,
            totalFisioterapeutasUnicos: analyzer.fisioterapeutas.size
        });
        
        const cronologia = analyzer.getCronologia();
        const datas = Object.keys(cronologia);

        if (datas.length === 0) {
            container.innerHTML = this.getEmptyState('Nenhum item na cronologia');
            return;
        }

        let html = statsBar + `<div class="cronologia-timeline">`;

        datas.forEach((data, dataIndex) => {
            html += `
                <div>
                    <div class="timeline-date">${data}</div>
                    <div class="timeline-items">
            `;

            cronologia[data].forEach((item, itemIndex) => {
                html += `
                    <div class="timeline-item" style="animation-delay: ${(dataIndex * cronologia[data].length + itemIndex) * 30}ms">
                        <div class="timeline-item-time">⏰ ${item.horario}</div>
                        <div class="timeline-item-details">
                            <div class="timeline-item-detail">
                                <div class="timeline-detail-label">Paciente</div>
                                <div class="timeline-detail-value">${item.paciente}</div>
                            </div>
                            <div class="timeline-item-detail">
                                <div class="timeline-detail-label">Fisioterapeuta</div>
                                <div class="timeline-detail-value">${item.fisioterapeuta}</div>
                            </div>
                            <div class="timeline-item-detail">
                                <div class="timeline-detail-label">Convênio</div>
                                <div class="timeline-detail-value">${item.convenio || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    getStatsBar(data) {
        return `
            <div class="stats-summary">
                <div class="stat-box">
                    <div class="stat-box-value">${data.totalAtendimentos || 0}</div>
                    <div class="stat-box-label">Total de Atendimentos</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-value">${data.totalPacientesUnicos || 0}</div>
                    <div class="stat-box-label">Total de Pacientes</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-value">${data.totalFisioterapeutasUnicos || 0}</div>
                    <div class="stat-box-label">Fisioterapeutas</div>
                </div>
            </div>
        `;
    }

    getEmptyState(message) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-title">Nenhum dado</div>
                <div class="empty-state-text">${message}</div>
            </div>
        `;
    }

    /**
     * Atualiza toda a interface após novo processamento
     */
    /**
     * Atualiza toda a interface após novo processamento
     */
    refresh() {
        // Limpa dados filtrados quando novos dados chegam
        this.filteredData = null;
        
        // Renderiza aba atual com todos os dados
        this.renderTab(this.currentTab);
        console.log('✅ Interface atualizada');
    }

    /**
     * Fecha modal de detalhes do paciente
     */
    closePatientDetailModal() {
        const modal = document.querySelector('.patient-detail-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    /**
     * Formata data em português brasileiro
     */
    formatDatePtBr(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            const formatter = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            return formatter.format(date);
        } catch (e) {
            return dateString;
        }
    }

    /**
     * Mostra card flutuante com detalhes de atendimentos
     */
    showAttendanceDetailsCard(pacienteName, cardElement) {
        // Remove card anterior se existir
        this.closeFloatingCard();

        // Usa dados filtrados
        const filteredData = this.getFilteredData();
        const evolucoesPaciente = filteredData.filter(e => e.paciente === pacienteName);
        
        if (evolucoesPaciente.length === 0) {
            window.notify.warning(`Nenhum atendimento encontrado para ${pacienteName}`);
            return;
        }

        // Calcula estatísticas
        const totalAtendimentos = evolucoesPaciente.length;
        const fisioterapeutas = [...new Set(evolucoesPaciente.map(e => e.fisioterapeuta))];
        const convenios = [...new Set(evolucoesPaciente.filter(e => e.convenio).map(e => e.convenio))];
        const procedimentos = evolucoesPaciente.filter(e => e.procedimentos).map(e => e.procedimentos);

        // Formata data em pt-br
        const formatDataPtBr = (data) => {
            if (!data) return '';
            const date = new Date(data);
            const formatter = new Intl.DateTimeFormat('pt-BR', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Sao_Paulo'
            });
            return formatter.format(date);
        };

        // Cria card flutuante
        const floatingCard = document.createElement('div');
        floatingCard.className = 'floating-card';
        floatingCard.innerHTML = `
            <div class="floating-card-overlay"></div>
            <div class="floating-card-content">
                <div class="floating-card-header">
                    <h3>📋 Detalhes de Atendimentos</h3>
                    <h4>${pacienteName}</h4>
                    <div class="floating-card-date">${formatDataPtBr(new Date())}</div>
                </div>
                <button class="floating-card-close">&times;</button>
                <div class="floating-card-body">
                    <div class="floating-stats-grid">
                        <div class="floating-stat">
                            <span class="floating-stat-label">Total de Atendimentos</span>
                            <span class="floating-stat-value">${totalAtendimentos}</span>
                        </div>
                        <div class="floating-stat">
                            <span class="floating-stat-label">Profissionais</span>
                            <span class="floating-stat-value">${fisioterapeutas.length}</span>
                        </div>
                        <div class="floating-stat">
                            <span class="floating-stat-label">Convênios</span>
                            <span class="floating-stat-value">${convenios.length}</span>
                        </div>
                    </div>

                    <div class="floating-section">
                        <h5>👨‍⚕️ Profissionais Atuantes</h5>
                        <div class="floating-list">
                            ${fisioterapeutas.map(f => {
                                const count = evolucoesPaciente.filter(e => e.fisioterapeuta === f).length;
                                return `<div class="floating-list-item"><span>${f}</span><span class="badge">${count}</span></div>`;
                            }).join('')}
                        </div>
                    </div>

                    ${convenios.length > 0 ? `
                    <div class="floating-section">
                        <h5>🏥 Convênios</h5>
                        <div class="floating-list">
                            ${convenios.map(c => `<div class="floating-list-item"><span>${c}</span></div>`).join('')}
                        </div>
                    </div>
                    ` : ''}

                    ${procedimentos.length > 0 ? `
                    <div class="floating-section">
                        <h5>💊 Procedimentos</h5>
                        <div class="floating-procedures">
                            ${procedimentos.slice(0, 5).map(p => `<span class="procedure-tag">${p}</span>`).join('')}
                            ${procedimentos.length > 5 ? `<span class="procedure-tag">+${procedimentos.length - 5} mais</span>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    <div class="floating-section">
                        <h5>📅 Atendimentos Recentes</h5>
                        <div class="floating-attendance-list">
                            ${evolucoesPaciente.slice(-5).reverse().map(e => `
                                <div class="attendance-item">
                                    <span class="attendance-date">${this.formatDatePtBr(e.dataProcessamento)}</span>
                                    <span class="attendance-time">${e.horario}</span>
                                    <span class="attendance-fisio">${e.fisioterapeuta}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(floatingCard);
        document.body.style.overflow = 'hidden';

        // Anima entrada
        setTimeout(() => {
            floatingCard.classList.add('active');
        }, 10);
    }

    /**
     * Fecha card flutuante
     */
    closeFloatingCard() {
        const card = document.querySelector('.floating-card');
        if (card) {
            card.classList.remove('active');
            setTimeout(() => {
                card.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    /**
     * Mostra card flutuante com detalhes do fisioterapeuta
     */
    showTherapistDetailsCard(therapistName) {
        // Remove card anterior se existir
        this.closeFloatingCard();

        // Usa dados filtrados
        const filteredData = this.getFilteredData();
        const evolucoesTherapist = filteredData.filter(e => e.fisioterapeuta === therapistName);
        
        if (evolucoesTherapist.length === 0) {
            window.notify.warning(`Nenhum atendimento encontrado para ${therapistName}`);
            return;
        }

        // Calcula estatísticas
        const totalAtendimentos = evolucoesTherapist.length;
        const pacientes = [...new Set(evolucoesTherapist.map(e => e.paciente))];
        const convenios = [...new Set(evolucoesTherapist.filter(e => e.convenio).map(e => e.convenio))];
        const procedimentos = evolucoesTherapist.filter(e => e.procedimentos).map(e => e.procedimentos);

        // Formata data em pt-br
        const formatDataPtBr = (data) => {
            if (!data) return '';
            const date = new Date(data);
            const formatter = new Intl.DateTimeFormat('pt-BR', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Sao_Paulo'
            });
            return formatter.format(date);
        };

        // Cria card flutuante
        const floatingCard = document.createElement('div');
        floatingCard.className = 'floating-card';
        floatingCard.innerHTML = `
            <div class="floating-card-overlay"></div>
            <div class="floating-card-content">
                <div class="floating-card-header">
                    <h3>📊 Detalhes de Atendimentos</h3>
                    <h4>${therapistName}</h4>
                    <div class="floating-card-date">${formatDataPtBr(new Date())}</div>
                </div>
                <button class="floating-card-close">&times;</button>
                <div class="floating-card-body">
                    <div class="floating-stats-grid">
                        <div class="floating-stat">
                            <span class="floating-stat-label">Total de Atendimentos</span>
                            <span class="floating-stat-value">${totalAtendimentos}</span>
                        </div>
                        <div class="floating-stat">
                            <span class="floating-stat-label">Pacientes Atendidos</span>
                            <span class="floating-stat-value">${pacientes.length}</span>
                        </div>
                        <div class="floating-stat">
                            <span class="floating-stat-label">Convênios</span>
                            <span class="floating-stat-value">${convenios.length}</span>
                        </div>
                    </div>

                    <div class="floating-section">
                        <h5>👥 Pacientes Atendidos</h5>
                        <div class="floating-list">
                            ${pacientes.map(p => {
                                const count = evolucoesTherapist.filter(e => e.paciente === p).length;
                                return `<div class="floating-list-item"><span>${p}</span><span class="badge">${count}</span></div>`;
                            }).join('')}
                        </div>
                    </div>

                    ${convenios.length > 0 ? `
                    <div class="floating-section">
                        <h5>🏥 Convênios</h5>
                        <div class="floating-list">
                            ${convenios.map(c => `<div class="floating-list-item"><span>${c}</span></div>`).join('')}
                        </div>
                    </div>
                    ` : ''}

                    ${procedimentos.length > 0 ? `
                    <div class="floating-section">
                        <h5>💊 Procedimentos</h5>
                        <div class="floating-procedures">
                            ${procedimentos.slice(0, 5).map(p => `<span class="procedure-tag">${p}</span>`).join('')}
                            ${procedimentos.length > 5 ? `<span class="procedure-tag">+${procedimentos.length - 5} mais</span>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    <div class="floating-section">
                        <h5>📅 Atendimentos Recentes</h5>
                        <div class="floating-attendance-list">
                            ${evolucoesTherapist.slice(-5).reverse().map(e => `
                                <div class="attendance-item">
                                    <span class="attendance-date">${this.formatDatePtBr(e.dataProcessamento)}</span>
                                    <span class="attendance-time">${e.horario}</span>
                                    <span class="attendance-fisio">${e.paciente}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(floatingCard);
        document.body.style.overflow = 'hidden';

        // Anima entrada
        setTimeout(() => {
            floatingCard.classList.add('active');
        }, 10);
    }

    /**
     * Salva filtro atual no localStorage
     */
    saveFilterToLocalStorage() {
        if (!this.filteredData || this.filteredData.length === 0) {
            localStorage.removeItem('evolucoesFilteredData');
            localStorage.removeItem('evolucoesActiveFilters');
            return;
        }

        try {
            // Salva dados filtrados
            localStorage.setItem('evolucoesFilteredData', JSON.stringify(this.filteredData));
            
            // Salva filtros ativos (do FilterSystem)
            if (this.filterModal && this.filterModal.filterSystem) {
                const activeFilters = this.filterModal.filterSystem.getActiveFilters();
                localStorage.setItem('evolucoesActiveFilters', JSON.stringify(activeFilters));
            }
            
            // Salva aba ativa e posição
            this.savePageState();
            
            console.log('💾 Filtros salvos no localStorage');
        } catch (error) {
            console.error('❌ Erro ao salvar filtros:', error);
        }
    }

    /**
     * Restaura filtro do localStorage ao carregar página
     */
    restoreFilterFromLocalStorage() {
        try {
            const savedFilteredData = localStorage.getItem('evolucoesFilteredData');
            const savedActiveFilters = localStorage.getItem('evolucoesActiveFilters');
            
            if (savedFilteredData) {
                this.filteredData = JSON.parse(savedFilteredData);
                console.log('♻️ Filtro restaurado do localStorage:', this.filteredData.length, 'registros');
                
                // Re-renderiza a aba atual com dados filtrados
                setTimeout(() => {
                    this.renderAllTabs();
                    if (window.notify) {
                        window.notify.success('Tudo restaurado! 🔄', 2000);
                    }
                }, 500);
            }
            
            // Restaura estado da página (aba, scroll)
            this.restorePageState();
        } catch (error) {
            console.error('❌ Erro ao restaurar filtros:', error);
            localStorage.removeItem('evolucoesFilteredData');
            localStorage.removeItem('evolucoesActiveFilters');
        }
    }

    /**
     * Limpa filtros do localStorage
     */
    clearFilterFromLocalStorage() {
        localStorage.removeItem('evolucoesFilteredData');
        localStorage.removeItem('evolucoesActiveFilters');
        this.filteredData = null;
        console.log('🗑️ Filtros removidos do localStorage');
    }

    /**
     * Salva o estado completo da página (aba, scroll, filtros)
     */
    savePageState() {
        try {
            const state = {
                currentTab: this.currentTab,
                scrollTop: window.scrollY || document.documentElement.scrollTop,
                filteredData: this.filteredData,
                timestamp: Date.now()
            };
            localStorage.setItem('evolucoesPageState', JSON.stringify(state));
            console.log('💾 Estado da página salvo:', state.currentTab, `(scroll: ${state.scrollTop}px)`);
        } catch (error) {
            console.error('❌ Erro ao salvar estado:', error);
        }
    }

    /**
     * Restaura o estado completo da página ao carregar
     */
    restorePageState() {
        try {
            const saved = localStorage.getItem('evolucoesPageState');
            if (!saved) return;

            const state = JSON.parse(saved);
            
            // Restaura aba ativa
            if (state.currentTab) {
                this.currentTab = state.currentTab;
                setTimeout(() => this.switchTab(state.currentTab), 100);
            }

            // Restaura posição do scroll
            if (state.scrollTop) {
                setTimeout(() => {
                    window.scrollTo(0, state.scrollTop);
                    console.log('📍 Posição restaurada:', state.scrollTop, 'px');
                }, 300);
            }

            console.log('♻️ Estado da página restaurado');
        } catch (error) {
            console.error('❌ Erro ao restaurar estado:', error);
        }
    }

    /**
     * Auto-save do estado a cada 5 segundos
     */
    setupAutoSave() {
        setInterval(() => {
            this.savePageState();
        }, 5000);
        console.log('⏱️ Auto-save ativado a cada 5 segundos');
    }

    /**
     * Renderiza com dados filtrados (chamado pelo sistema unificado de filtros)
     * @param {Array} filteredData - Dados já filtrados
     */
    renderWithFilteredData(filteredData) {
        console.log('🎨 EvolucoesUI: Renderizando dados filtrados');
        console.log(`   - Total de registros filtrados: ${filteredData.length}`);
        
        // Salva dados filtrados
        this.filteredData = filteredData;
        
        // Re-renderiza todas as abas com os dados filtrados
        this.renderAllTabs();
        
        console.log('✅ EvolucoesUI: Renderização com filtros concluída');
    }
}

// Exporta a classe para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EvolucoesUI;
}
