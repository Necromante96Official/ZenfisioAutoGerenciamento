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
        document.addEventListener('click', (e) => {
            // Botão de limpeza de Evoluções
            if (e.target.id === 'clearEvolucoesDataBtn') {
                this.showConfirmationDialog('evolucoes');
            }

            // Botão de limpeza de Financeiro
            if (e.target.id === 'clearFinanceiroDataBtn') {
                this.showConfirmationDialog('financeiro');
            }
        });
    }

    /**
     * Mostra diálogo de confirmação
     */
    showConfirmationDialog(module) {
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
        }

        // Usa modal de confirmação ao invés de confirm()
        if (window.confirmationModal) {
            window.confirmationModal.show(title, message, details).then((confirmed) => {
                if (confirmed) {
                    this.clearModuleData(module);
                }
            });
        } else {
            // Fallback para confirm() se modal não estiver disponível
            const legacyMessage = title + '\n\n' + message + '\n\n' + 
                details.map(d => '✓ ' + d).join('\n') + '\n\nEsta ação NÃO pode ser desfeita!\n\nDeseja continuar?';
            if (confirm(legacyMessage)) {
                this.clearModuleData(module);
            }
        }
    }

    /**
     * Limpa dados de um módulo específico
     */
    clearModuleData(module) {
        try {
            if (module === 'evolucoes') {
                this.clearEvolucoesData();
            } else if (module === 'financeiro') {
                this.clearFinanceiroData();
            }
        } catch (error) {
            console.error(`❌ Erro ao limpar dados de ${module}:`, error);
            this.showNotification(`Erro ao limpar ${module}: ${error.message}`, 'error', 3000);
        }
    }

    /**
     * Limpa APENAS dados de Evoluções
     */
    clearEvolucoesData() {
        try {
            console.log('🧹 Limpando dados de EVOLUÇÕES...');

            // 1. Limpa dados de Evoluções no DataManager
            if (window.dataManager) {
                window.dataManager.data.evolucoes = [];
                window.dataManager.saveData();
                console.log('✅ Dados de Evoluções removidos do localStorage');
            }

            // 2. Limpa Evoluções Integration
            if (window.evolucoesIntegration) {
                window.evolucoesIntegration.limpar();
                console.log('✅ Evoluções Integration limpo');
            }

            // 3. Limpa textarea de evoluções
            const textarea = document.getElementById('evolucaoTextarea');
            if (textarea) {
                textarea.value = '';
                console.log('✅ Textarea de Evoluções limpo');
            }

            // 4. Mostra notificação de sucesso
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
    clearFinanceiroData() {
        try {
            console.log('🧹 Limpando dados de ANÁLISE FINANCEIRA...');

            // 1. Limpa dados de Financeiro no DataManager
            if (window.dataManager) {
                window.dataManager.data.financeiro = {};
                window.dataManager.data.financeiro_records = [];
                window.dataManager.saveData();
                console.log('✅ Dados de Financeiro removidos do localStorage');
            }

            // 2. Limpa Financial Integration
            if (window.FinancialIntegration) {
                // Reseta parser
                window.FinancialIntegration.parser.records = [];
                console.log('✅ Financial Parser limpo');

                // Reseta analyzer
                window.FinancialIntegration.analyzer = new FinancialAnalyzer();
                console.log('✅ Financial Analyzer limpo');

                // Limpa UI
                const financeiro = document.getElementById('financeiro');
                if (financeiro) {
                    financeiro.innerHTML = '';
                    console.log('✅ Interface Financeira limpa');
                }
            }

            // 3. Mostra notificação de sucesso
            this.showNotification('Dados de Análise Financeira foram limpos com sucesso!', 'success', 3000);

            console.log('🎉 Limpeza de Financeiro finalizada!');

        } catch (error) {
            console.error('❌ Erro ao limpar Financeiro:', error);
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
