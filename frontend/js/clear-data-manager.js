/**
 * Clear Data Manager - Gerencia limpeza independente de dados por módulo
 * Cada botão limpa APENAS os dados do seu módulo
 */

class ClearDataManager {
    constructor() {
        this.setupEventListeners();
    }

    /**
     * Setup dos event listeners para botões de limpeza
     */
    setupEventListeners() {
        // Event delegation para botões criados dinamicamente
        document.addEventListener('click', async (e) => {
            // Botão de limpeza de Evoluções
            if (e.target.id === 'clearEvolucoesDataBtn') {
                await this.showConfirmationDialog('evolucoes');
            }

            // Botão de limpeza de Financeiro
            if (e.target.id === 'clearFinanceiroDataBtn') {
                await this.showConfirmationDialog('financeiro');
            }

            // Botão de limpeza de Agendamentos
            if (e.target.id === 'clearSchedulesDataBtn') {
                await this.showConfirmationDialog('agendamentos');
            }

            // Botão de limpeza de TUDO
            if (e.target.id === 'clearAllBtn') {
                await this.showConfirmationDialog('all');
            }
        });
    }

    /**
     * Mostra diálogo de confirmação
     */
    async showConfirmationDialog(module) {
        let title = '';
        let message = '';
        let details = [];

        if (module === 'evolucoes') {
            title = '⚠️ Limpar Dados de Evoluções';
            message = 'Tem certeza que deseja LIMPAR TODOS OS DADOS DE EVOLUÇÕES?';
            details = [
                'Remover todos os registros de Evoluções',
                'Limpar a análise de Evoluções',
                'Limpar o textarea de entrada',
                'Dados de ANÁLISE FINANCEIRA serão mantidos'
            ];
        } else if (module === 'financeiro') {
            title = '⚠️ Limpar Dados de Análise Financeira';
            message = 'Tem certeza que deseja LIMPAR TODOS OS DADOS DE ANÁLISE FINANCEIRA?';
            details = [
                'Remover todos os registros financeiros',
                'Limpar a análise financeira',
                'Limpar a interface financeira',
                'Dados de EVOLUÇÕES serão mantidos'
            ];
        } else if (module === 'agendamentos') {
            title = '⚠️ Limpar Dados de Agendamentos';
            message = 'Tem certeza que deseja LIMPAR TODOS OS DADOS DE AGENDAMENTOS?';
            details = [
                'Remover todos os agendamentos',
                'Limpar a análise de faltas',
                'Limpar listas de pacientes',
                'Dados de EVOLUÇÕES e ANÁLISE FINANCEIRA serão mantidos'
            ];
        } else if (module === 'all') {
            title = '🚨 LIMPAR TUDO';
            message = 'Tem CERTEZA que deseja LIMPAR TODOS OS DADOS DE TODAS AS PÁGINAS?';
            details = [
                'Remover todos os registros de EVOLUÇÕES',
                'Remover todos os registros FINANCEIROS',
                'Remover todos os AGENDAMENTOS',
                'Limpar o textarea de entrada',
                'Limpar todas as interfaces',
                'ESTA AÇÃO NÃO PODE SER DESFEITA!'
            ];
        }

        // Usa modal de confirmação ao invés de confirm()
        if (window.confirmationModal) {
            window.confirmationModal.show(title, message, details).then(async (confirmed) => {
                if (confirmed) {
                    await this.clearModuleData(module);
                }
            });
        } else {
            // Fallback para confirm() se modal não estiver disponível
            const legacyMessage = title + '\n\n' + message + '\n\n' + 
                details.map(d => '✓ ' + d).join('\n') + '\n\nEsta ação NÃO pode ser desfeita!\n\nDeseja continuar?';
            if (confirm(legacyMessage)) {
                await this.clearModuleData(module);
            }
        }
    }

    /**
     * Limpa dados de um módulo específico
     */
    async clearModuleData(module) {
        try {
            if (module === 'evolucoes') {
                await this.clearEvolucoesData();
            } else if (module === 'financeiro') {
                await this.clearFinanceiroData();
            } else if (module === 'agendamentos') {
                await this.clearAgendamentosData();
            } else if (module === 'all') {
                await this.clearAllData();
            }
        } catch (error) {
            console.error(`❌ Erro ao limpar dados de ${module}:`, error);
            this.showNotification(`Erro ao limpar ${module}: ${error.message}`, 'error', 3000);
        }
    }

    /**
     * Limpa APENAS dados de Evoluções
     */
    async clearEvolucoesData() {
        try {
            console.log('🧹 Limpando dados de EVOLUÇÕES...');

            // 1. Limpa dados de Evoluções no DataManager
            if (window.dataManager) {
                window.dataManager.data.evolucoes = [];
                await window.dataManager.saveData({ remote: true, silent: true });
                await window.dataManager.clearRemoteState();
                console.log('✅ Dados de Evoluções removidos do localStorage e backend');
            }

            // 2. Limpa localStorage específico de Evoluções
            localStorage.removeItem('evolucoesFilteredData');
            localStorage.removeItem('evolucoesActiveFilters');
            localStorage.removeItem('evolucoesPageState');
            console.log('✅ Cache de Evoluções removido');

            // 3. Limpa Evoluções Integration
            if (window.evolucoesIntegration) {
                // Reseta analyzer
                if (window.evolucoesIntegration.analyzer) {
                    window.evolucoesIntegration.analyzer.limpar();
                    console.log('✅ Evoluções Analyzer limpo');
                }

                // Reseta UI
                if (window.evolucoesIntegration.ui) {
                    window.evolucoesIntegration.ui.refresh();
                    console.log('✅ Evoluções UI atualizada');
                }
            }

            // 4. Limpa textarea de evoluções
            const textarea = document.getElementById('evolucaoTextarea');
            if (textarea) {
                textarea.value = '';
                console.log('✅ Textarea de Evoluções limpo');
            }

            // 5. Mostra notificação de sucesso
            this.showNotification('Dados de Evoluções foram limpos com sucesso!', 'success', 3000);

            console.log('🎉 Limpeza de Evoluções finalizada!');

        } catch (error) {
            console.error('❌ Erro ao limpar Evoluções:', error);
            throw error;
        }
    }

    /**
     * Limpa APENAS dados de Financeiro
     */
    async clearFinanceiroData() {
        try {
            console.log('🧹 Limpando dados de ANÁLISE FINANCEIRA...');

            // 1. Limpa dados de Financeiro no DataManager
            if (window.dataManager) {
                window.dataManager.data.financeiro = {};
                window.dataManager.data.financeiro_records = [];
                await window.dataManager.saveData({ remote: true, silent: true });
                await window.dataManager.clearRemoteState();
                console.log('✅ Dados de Financeiro removidos do localStorage e backend');
            }

            // 2. Limpa localStorage específico de Financeiro
            localStorage.removeItem('financialFilteredData');
            localStorage.removeItem('financialActiveFilters');
            console.log('✅ Cache de Financeiro removido');

            // 3. Limpa Financial Integration
            if (window.financialIntegration) {
                // Reseta parser
                window.financialIntegration.parser.records = [];
                console.log('✅ Financial Parser limpo');

                // Reseta analyzer
                window.financialIntegration.analyzer = new FinancialAnalyzer();
                console.log('✅ Financial Analyzer limpo');

                // Limpa UI
                const financeiro = document.getElementById('financeiro');
                if (financeiro) {
                    financeiro.innerHTML = '';
                    console.log('✅ Interface Financeira limpa');
                }
            }

            // 4. Mostra notificação de sucesso
            this.showNotification('Dados de Análise Financeira foram limpos com sucesso!', 'success', 3000);

            console.log('🎉 Limpeza de Financeiro finalizada!');

        } catch (error) {
            console.error('❌ Erro ao limpar Financeiro:', error);
            throw error;
        }
    }

    /**
     * Limpa APENAS dados de Agendamentos
     */
    async clearAgendamentosData() {
        try {
            console.log('🧹 Limpando dados de AGENDAMENTOS...');

            // 1. Limpa dados de Agendamentos no DataManager
            if (window.dataManager) {
                window.dataManager.data.schedules_data = {};
                window.dataManager.data.schedules_records = [];
                await window.dataManager.saveData({ remote: true, silent: true });
                await window.dataManager.clearRemoteState();
                console.log('✅ Dados de Agendamentos removidos do localStorage e backend');
            }

            // 2. Limpa localStorage específico de Agendamentos
            localStorage.removeItem('schedulesFilteredData');
            localStorage.removeItem('schedulesActiveFilters');
            console.log('✅ Cache de Agendamentos removido');

            // 3. Limpa Schedules Integration
            if (window.schedulesIntegration) {
                // Reseta parser
                if (window.schedulesIntegration.parser) {
                    window.schedulesIntegration.parser.records = [];
                    console.log('✅ Schedules Parser limpo');
                }

                // Reseta analyzer
                if (window.schedulesIntegration.analyzer) {
                    window.schedulesIntegration.analyzer = new SchedulesAnalyzer();
                    console.log('✅ Schedules Analyzer limpo');
                }

                // Limpa UI
                const desenvolvimento = document.getElementById('agendamentos');
                if (desenvolvimento) {
                    const conteudoDiv = desenvolvimento.querySelector('#agendamentos-content');
                    if (conteudoDiv) {
                        conteudoDiv.innerHTML = '';
                        console.log('✅ Interface de Agendamentos limpa');
                    }
                }
            }

            // 4. Mostra notificação de sucesso
            this.showNotification('Dados de Agendamentos foram limpos com sucesso!', 'success', 3000);

            console.log('🎉 Limpeza de Agendamentos finalizada!');

        } catch (error) {
            console.error('❌ Erro ao limpar Agendamentos:', error);
            throw error;
        }
    }

    /**
     * Limpa TODOS os dados de todas as páginas
     */
    async clearAllData() {
        try {
            console.log('🧹🧹🧹 Limpando TODOS OS DADOS de TUDO...');

            // 1. Limpa tudo no DataManager
            if (window.dataManager) {
                window.dataManager.data.evolucoes = [];
                window.dataManager.data.financeiro = {};
                window.dataManager.data.financeiro_records = [];
                window.dataManager.data.schedules_data = {};
                window.dataManager.data.schedules_records = [];
                await window.dataManager.saveData({ remote: true, silent: true });
                await window.dataManager.clearRemoteState();
                console.log('✅ Todos os dados removidos do localStorage e backend');
            }

            // 2. Limpa TODOS os itens do localStorage (não só os nomeados)
            const keysToRemove = [
                'evolucoesFilteredData',
                'evolucoesActiveFilters',
                'evolucoesPageState',
                'financialFilteredData',
                'financialActiveFilters',
                'schedulesFilteredData',
                'schedulesActiveFilters',
                'zenfisioManagerData',
                'financialData',
                'schedulesData',
                'app_state'
            ];
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Remove também qualquer chave que comece com prefixos conhecidos
            const lsKeys = Object.keys(localStorage);
            lsKeys.forEach(key => {
                if (key.toLowerCase().includes('evolucoes') || 
                    key.toLowerCase().includes('financial') || 
                    key.toLowerCase().includes('schedules') ||
                    key.toLowerCase().includes('zenfisio') ||
                    key.toLowerCase().includes('agendamento')) {
                    localStorage.removeItem(key);
                }
            });
            console.log('✅ Todos os caches removidos do localStorage');

            // 3. Limpa Evoluções Integration
            if (window.evolucoesIntegration) {
                if (window.evolucoesIntegration.analyzer) {
                    window.evolucoesIntegration.analyzer.limpar();
                }
                if (window.evolucoesIntegration.ui) {
                    window.evolucoesIntegration.ui.refresh();
                }
                console.log('✅ Evoluções Integration limpa');
            }

            // 4. Limpa textarea de evoluções
            const textarea = document.getElementById('evolucaoTextarea');
            if (textarea) {
                textarea.value = '';
            }

            // 5. Limpa Financial Integration
            if (window.financialIntegration) {
                window.financialIntegration.parser.records = [];
                window.financialIntegration.analyzer = new FinancialAnalyzer();
                const financeiro = document.getElementById('financeiro');
                if (financeiro) {
                    financeiro.innerHTML = '';
                }
                console.log('✅ Financial Integration limpa');
            }

            // 6. Limpa Schedules Integration
            if (window.schedulesIntegration) {
                // Reseta dados do analyzer completamente
                if (window.schedulesIntegration.analyzer) {
                    window.schedulesIntegration.analyzer.faltaram = [];
                    window.schedulesIntegration.analyzer.compareceram = [];
                    window.schedulesIntegration.analyzer.data = null;
                    window.schedulesIntegration.analyzer = new SchedulesAnalyzer();
                    console.log('✅ Schedules Analyzer limpo completamente');
                }
                
                // Reseta parser
                if (window.schedulesIntegration.parser) {
                    window.schedulesIntegration.parser.records = [];
                    console.log('✅ Schedules Parser limpo');
                }
                
                // Limpa UI - agendamentos-content
                const agendamentosContent = document.getElementById('agendamentos-content');
                if (agendamentosContent) {
                    agendamentosContent.innerHTML = '';
                    console.log('✅ Interface de Agendamentos limpa (content)');
                }
                
                console.log('✅ Schedules Integration limpa completamente');
            }

            // 7. Mostra notificação de sucesso
            this.showNotification('✨ TODOS OS DADOS foram limpos com sucesso! ✨', 'success', 4000);

            console.log('🎉🎉🎉 Limpeza TOTAL finalizada!');
            
            // 8. Aguarda 1 segundo e depois recarrega a página para garantir
            setTimeout(() => {
                console.log('🔄 Recarregando página para garantir limpeza total...');
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error('❌ Erro ao limpar todos os dados:', error);
            throw error;
        }
    }

    /**
     * Mostra notificação
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Usa o sistema de notificações se disponível
        if (window.notify) {
            window.notify[type](message, duration);
        } else if (window.notificationSystem) {
            window.notificationSystem.show(message, type);
        } else {
            // Fallback para alert se não houver sistema de notificações
            alert(message);
        }
    }
}

// Inicializa ao carregar o documento
document.addEventListener('DOMContentLoaded', () => {
    window.clearDataManager = new ClearDataManager();
    console.log('✅ ClearDataManager inicializado');
});
