/**
 * SCHEDULES-INTEGRATION.JS
 * Integra parser, analyzer e UI da aba de Agendamentos
 * Orquestra o fluxo de processamento de dados de agendamentos
 */

class SchedulesIntegration {
    constructor() {
        console.log(`📅 SchedulesIntegration: Inicializando...`);
        this.parser = new SchedulesParser();
        this.analyzer = new SchedulesAnalyzer();
        this.ui = new SchedulesUI(this.analyzer);
        console.log(`📅 SchedulesIntegration: UI criada`);
        this.loadSavedData();
        console.log(`📅 SchedulesIntegration: Dados carregados`);
        this.setupEventListeners();
        console.log(`📅 SchedulesIntegration: Event listeners configurados`);
    }

    /**
     * Carrega dados salvos ao iniciar
     */
    loadSavedData() {
        console.log(`📅 SchedulesIntegration.loadSavedData() iniciado`);
        
        try {
            let dadosCarregados = false;
            
            if (window.dataManager) {
                const savedSchedules = window.dataManager.getSchedules?.();
                console.log(`   - Dados salvos encontrados:`, savedSchedules);
                
                if (savedSchedules && (savedSchedules.compareceram?.length > 0 || savedSchedules.faltaram?.length > 0)) {
                    console.log(`✅ Dados de agendamentos salvos encontrados. Carregando...`);
                    this.analyzer.restaurarDados(savedSchedules);
                    console.log(`✅ Agendamentos carregados: ${savedSchedules.compareceram?.length || 0} compareceram, ${savedSchedules.faltaram?.length || 0} faltaram`);
                    dadosCarregados = true;
                }
            }
            
            if (!dadosCarregados) {
                console.log(`⚠️ Nenhum dado salvo encontrado, renderizando UI vazia`);
            }
            
            // SEMPRE renderiza UI (mostra cards zerados se não houver dados)
            console.log(`   - Chamando render()...`);
            this.ui.render(this.analyzer.getDadosParaSalvar());
            console.log(`✅ Interface de agendamentos renderizada`);
        } catch (error) {
            console.error('❌ Erro ao carregar dados de agendamentos:', error);
            console.error('   Stack:', error.stack);
            // Tenta renderizar UI mesmo com erro
            try {
                this.ui.render(this.analyzer.getDadosParaSalvar());
            } catch (renderError) {
                console.error('❌ Erro ao renderizar interface de agendamentos:', renderError);
                console.error('   Stack:', renderError.stack);
            }
        }
    }

    /**
     * Setup de event listeners
     */
    setupEventListeners() {
        // Listener para o botão de limpar agendamentos
        document.addEventListener('click', (e) => {
            if (e.target.id === 'clearSchedulesDataBtn') {
                this.showClearConfirmation();
            }
        });
        
        // Listener para quando o módulo de agendamentos fica visível
        const agendamentosSection = document.getElementById('agendamentos');
        if (agendamentosSection) {
            // Cria um observer para detectar quando a seção fica visível
            const observer = new MutationObserver((mutations) => {
                const isVisible = agendamentosSection.classList.contains('active');
                if (isVisible) {
                    console.log(`📅 Seção de agendamentos ficou visível, re-renderizando...`);
                    this.ui.render(this.analyzer.getDadosParaSalvar());
                }
            });
            
            observer.observe(agendamentosSection, { attributes: true, attributeFilter: ['class'] });
        }
    }

    /**
     * Processa dados de agendamentos já separados por categoria
     * @param {Array} faltaram - Agendamentos com status "não atendido" ou "faltou"
     * @param {Array} compareceram - Agendamentos com outros status
     * @param {boolean} silent - Se true, não mostra notificações
     */
    processDataWithArray(faltaram, compareceram, silent = false) {
        try {
            console.log(`📅 SchedulesIntegration.processDataWithArray() iniciado`);
            console.log(`   - Faltaram recebidos: ${faltaram.length}`);
            console.log(`   - Compareceram recebidos: ${compareceram.length}`);

            // Valida dados
            if (!Array.isArray(faltaram) || !Array.isArray(compareceram)) {
                console.error('❌ Erro: Dados inválidos - não são arrays');
                return;
            }

            if (faltaram.length === 0 && compareceram.length === 0) {
                console.warn('⚠️ Nenhum agendamento para processar');
                if (!silent) {
                    this.showNotification('Nenhum agendamento para processar', 'warning');
                }
                return;
            }

            // ⭐ IMPORTANTE: Processa separadamente para manter categorização correta
            // Primeiro limpa o analyzer
            this.analyzer.limpar();
            
            // Processa faltaram
            if (faltaram.length > 0) {
                console.log(`   📌 Adicionando ${faltaram.length} agendamentos em FALTARAM...`);
                faltaram.forEach(agendamento => {
                    this.analyzer.adicionarAgendamento(agendamento);
                });
            }
            
            // Processa compareceram
            if (compareceram.length > 0) {
                console.log(`   📌 Adicionando ${compareceram.length} agendamentos em COMPARECERAM...`);
                compareceram.forEach(agendamento => {
                    this.analyzer.adicionarAgendamento(agendamento);
                });
            }

            // Obtém resultado
            const resultado = this.analyzer.getResumo();
            console.log(`   ✅ Resultado: ${resultado.totalCompareceram} compareceram, ${resultado.totalFaltas} faltaram`);

            // Salva dados
            try {
                if (window.dataManager) {
                    const dadosSalvar = this.analyzer.getDadosParaSalvar();
                    console.log(`   💾 Salvando dados no dataManager...`);
                    window.dataManager.addSchedules(dadosSalvar);
                    console.log(`   ✅ Dados salvos no dataManager`);
                }
            } catch (saveError) {
                console.warn('⚠️ Aviso ao salvar dados de agendamentos:', saveError);
            }

            // Renderiza UI
            console.log(`   🎨 Renderizando UI...`);
            this.ui.render(this.analyzer.getDadosParaSalvar());

            // Mostra notificação
            if (!silent) {
                const msg = `${resultado.totalCompareceram} comparecimentos e ${resultado.totalFaltas} faltas processadas!`;
                this.showNotification(msg, 'success');
            }
            
            console.log(`✅ SchedulesIntegration.processDataWithArray() concluído`);
        } catch (error) {
            console.error('❌ Erro no processamento de agendamentos com array:', error);
            console.error('   Stack:', error.stack);
            if (!silent) {
                this.showNotification('Erro ao processar agendamentos', 'error');
            }
        }
    }

    /**
     * Exibe confirmação para limpar dados
     */
    showClearConfirmation() {
        if (window.confirmationModal) {
            window.confirmationModal.show(
                'Limpar Agendamentos',
                'Tem certeza que deseja apagar todos os dados de agendamentos? Esta ação não pode ser desfeita.',
                () => this.clearData(),
                'Limpar',
                'Cancelar'
            );
        } else {
            // Fallback para confirm nativo
            if (confirm('Deseja realmente limpar todos os agendamentos?')) {
                this.clearData();
            }
        }
    }

    /**
     * Limpa todos os dados de agendamentos
     */
    clearData() {
        try {
            this.analyzer.limpar();
            
            // Salva dados vazios
            if (window.dataManager) {
                window.dataManager.addSchedules(this.analyzer.getDadosParaSalvar());
            }

            // Renderiza UI vazia
            this.ui.render(this.analyzer.getDadosParaSalvar());

            this.showNotification('Agendamentos limpos com sucesso', 'success');
            console.log('✅ Dados de agendamentos limpos');
        } catch (error) {
            console.error('Erro ao limpar agendamentos:', error);
            this.showNotification('Erro ao limpar agendamentos', 'error');
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        if (window.notificationSystem) {
            window.notificationSystem.show(message, type);
        } else if (window.notify) {
            window.notify.show(message, type);
        }
    }

    /**
     * Recarrega dados de agendamentos do localStorage
     */
    reloadData() {
        try {
            console.log('🔄 SchedulesIntegration: Recarregando dados...');
            this.loadSavedData();
            console.log('✅ SchedulesIntegration: Dados recarregados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao recarregar dados de agendamentos:', error);
        }
    }

    /**
     * Exporta dados em JSON
     * @returns {string} - JSON dos dados
     */
    exportData() {
        return this.analyzer.exportarJSON();
    }

    /**
     * Retorna resumo dos agendamentos
     */
    getSummary() {
        return this.analyzer.getResumo();
    }

    /**
     * Retorna pacientes que compareceram
     */
    getCompareceram() {
        return this.analyzer.getPacientesCompareceram();
    }

    /**
     * Retorna pacientes que faltaram
     */
    getFaltaram() {
        return this.analyzer.getPacientesFaltaram();
    }
}

// Initialize on document load
if (document.readyState === 'loading') {
    console.log(`📅 SchedulesIntegration: Aguardando DOMContentLoaded...`);
    document.addEventListener('DOMContentLoaded', () => {
        console.log(`📅 SchedulesIntegration: DOMContentLoaded disparado`);
        window.schedulesIntegration = new SchedulesIntegration();
    });
} else {
    console.log(`📅 SchedulesIntegration: DOM já carregado, inicializando...`);
    window.schedulesIntegration = new SchedulesIntegration();
}
