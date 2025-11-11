/**
 * Export/Import Manager - Interface para exportar e importar dados completos
 * Captura: Evoluções, Análise Financeira, Em Desenvolvimento
 */

class ExportImportManager {
    constructor() {
        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Será configurado após o DOM estar pronto
        document.addEventListener('DOMContentLoaded', () => {
            this.attachListeners();
        });
    }

    /**
     * Attach listeners aos botões
     */
    attachListeners() {
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const importInput = document.getElementById('importInput');

        console.log('🔧 Configurando listeners:');
        console.log(`  ✅ Botão Exportar encontrado: ${!!exportBtn}`);
        console.log(`  ✅ Botão Importar encontrado: ${!!importBtn}`);
        console.log(`  ✅ Input File encontrado: ${!!importInput}`);

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                console.log('📤 Clique em Exportar detectado');
                this.handleExport();
            });
        }

        if (importBtn) {
            importBtn.addEventListener('click', () => {
                console.log('📥 Clique em Importar detectado');
                importInput?.click();
            });
        }

        if (importInput) {
            importInput.addEventListener('change', (e) => {
                console.log('📥 Arquivo selecionado:', e.target.files?.[0]?.name);
                this.handleImport(e);
            });
        }

        console.log('✅ Sistema de Export/Import inicializado');
    }

    /**
     * Coleta TODOS os dados do sistema
     * Inclui: Evoluções, Financeiro, Desenvolvimento, Configurações
     */
    collectAllData() {
        const completeData = {
            // Dados de Evoluções
            evolucoes: {
                dados: window.dataManager?.getEvolucoes() || [],
                analise: window.evolucoesIntegration?.analyzer 
                    ? this._serializeEvolucoesAnalyzer(window.evolucoesIntegration.analyzer)
                    : {}
            },

            // Dados de Análise Financeira
            financeiro: {
                dados: window.dataManager?.getFinanceiro() || {},
                completo: window.FinancialIntegration?.analyzer?.getAnalysis() || {}
            },

            // Dados em Desenvolvimento
            desenvolvimento: {
                placeholder: true,
                conteudo: [] // Será preenchido quando houver dados
            },

            // Metadados
            metadata: {
                versao: '1.0.0.6',
                dataExportacao: new Date().toISOString(),
                dataFormatada: new Date().toLocaleDateString('pt-BR'),
                horarioFormatado: new Date().toLocaleTimeString('pt-BR'),
                usuario: 'Clinica Zenfisio',
                navegador: navigator.userAgent.substring(0, 50),
                resolucao: `${window.innerWidth}x${window.innerHeight}`
            },

            // Resumo para validação
            resumo: {
                totalEvolucoesRegistradas: window.dataManager?.getEvolucoes()?.length || 0,
                totalAtendimentosFinanceiros: window.dataManager?.getFinanceiro()?.summary?.totalAtendimentos || 0,
                totalReceitaFinanceira: window.dataManager?.getFinanceiro()?.summary?.receitaTotal || '0.00',
                dataUltimoSalva: window.dataManager?.getLastSaveTime() || new Date().toISOString()
            }
        };

        return completeData;
    }

    /**
     * Serializa o EvolucoesAnalyzer para exportação
     */
    _serializeEvolucoesAnalyzer(analyzer) {
        try {
            return {
                evolucoes: analyzer.evolucoes || [],
                visaoGeral: analyzer.getVisaoGeral ? analyzer.getVisaoGeral() : {},
                pacientes: this._serializeMap(analyzer.pacientes),
                fisioterapeutas: this._serializeMap(analyzer.fisioterapeutas),
                cronologia: analyzer.cronologia || [],
                estatisticas: analyzer.getEstatisticas ? analyzer.getEstatisticas() : {}
            };
        } catch (error) {
            console.error('Erro ao serializar EvolucoesAnalyzer:', error);
            return {};
        }
    }

    /**
     * Converte Map para Object para JSON
     */
    _serializeMap(map) {
        const obj = {};
        if (map && map.forEach) {
            map.forEach((value, key) => {
                obj[key] = value;
            });
        }
        return obj;
    }

    /**
     * Handle export - Exporta TUDO em um arquivo JSON
     */
    handleExport() {
        try {
            console.log('📤 Iniciando exportação...');
            
            if (!window.dataManager) {
                this.showNotification('Gerenciador de dados não disponível', 'error');
                console.error('❌ DataManager não encontrado');
                return;
            }

            console.log('✅ DataManager encontrado');

            // Coleta todos os dados
            const allData = this.collectAllData();
            console.log('✅ Todos os dados coletados');
            console.log('📊 Resumo:', allData.resumo);

            // Formata JSON com indentação
            const jsonData = JSON.stringify(allData, null, 2);
            console.log(`✅ JSON formatado (${(jsonData.length / 1024).toFixed(2)} KB)`);

            // Valida se há dados para exportar
            const temEvoluçoes = allData.resumo.totalEvolucoesRegistradas > 0;
            const temFinanceiro = allData.resumo.totalAtendimentosFinanceiros > 0;

            console.log(`  📊 Evoluções: ${allData.resumo.totalEvolucoesRegistradas}`);
            console.log(`  💰 Financeiro: ${allData.resumo.totalAtendimentosFinanceiros}`);
            console.log(`  💵 Receita: R$ ${allData.resumo.totalReceitaFinanceira}`);

            if (!temEvoluçoes && !temFinanceiro) {
                this.showNotification('⚠️ Nenhum dado para exportar. Processe alguns atendimentos primeiro.', 'warning');
                console.warn('⚠️ Sem dados para exportar');
                return;
            }

            // Cria e baixa arquivo
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Nome do arquivo com data e hora
            const dataHora = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
            link.download = `zenfisio_backup_completo_${dataHora}.json`;
            link.href = url;
            
            console.log(`📥 Iniciando download: ${link.download}`);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log('✅ Download iniciado com sucesso');

            // Notificações granulares de sucesso
            this.showNotification('Backup exportado com sucesso', 'success', 3000);
            this.showNotification(`${allData.resumo.totalEvolucoesRegistradas} evoluções registradas`, 'info', 3000);
            this.showNotification(`${allData.resumo.totalAtendimentosFinanceiros} atendimentos financeiros`, 'info', 3000);
            this.showNotification(`Receita: R$ ${allData.resumo.totalReceitaFinanceira}`, 'info', 3000);
            this.showNotification(`Arquivo: ${link.download}`, 'info', 4000);
            
            console.log('✅ Arquivo exportado:', link.download);
        } catch (error) {
            console.error('❌ Erro ao exportar:', error);
            this.showNotification('Erro ao exportar dados', 'error');
            this.showNotification(error.message, 'warning');
        }
    }

    /**
     * Handle import - Restaura dados de backup
     */
    handleImport(event) {
        try {
            const file = event.target.files?.[0];
            if (!file) {
                console.log('ℹ️ Importação cancelada pelo usuário');
                return;
            }

            console.log('📥 Iniciando importação de:', file.name);
            console.log(`📦 Tamanho do arquivo: ${(file.size / 1024).toFixed(2)} KB`);

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonString = e.target?.result;
                    
                    if (!window.dataManager) {
                        this.showNotification('Gerenciador de dados não disponível', 'error');
                        console.error('❌ DataManager não encontrado');
                        return;
                    }

                    console.log('✅ DataManager encontrado');
                    console.log('🔍 Analisando arquivo...');

                    const importedData = JSON.parse(jsonString);

                    // Validação de estrutura
                    if (!importedData.metadata || !importedData.metadata.versao) {
                        throw new Error('Arquivo não é um backup válido do Zenfisio Manager');
                    }

                    console.log('✅ Arquivo validado');
                    console.log(`📋 Versão do backup: ${importedData.metadata.versao}`);
                    console.log(`📅 Data da exportação: ${importedData.metadata.dataFormatada}`);
                    console.log('📊 Resumo do backup:', importedData.resumo);

                    // Restaura dados de evoluções
                    if (importedData.evolucoes?.dados && Array.isArray(importedData.evolucoes.dados)) {
                        window.dataManager.addEvolucoes(importedData.evolucoes.dados);
                        console.log(`✅ ${importedData.evolucoes.dados.length} evoluções restauradas`);
                    }

                    // Restaura dados financeiros
                    if (importedData.financeiro?.dados && Object.keys(importedData.financeiro.dados).length > 0) {
                        window.dataManager.addFinanceiro(importedData.financeiro.dados);
                        console.log('✅ Dados financeiros restaurados');
                    }

                    console.log('✅ Todos os dados foram restaurados com sucesso');
                    console.log('🔄 Recarregando página em 2 segundos...');

                    // Notificações granulares de sucesso
                    this.showNotification('Backup restaurado com sucesso', 'success', 3000);
                    this.showNotification(`${importedData.resumo.totalEvolucoesRegistradas} evoluções restauradas`, 'info', 3000);
                    this.showNotification(`${importedData.resumo.totalAtendimentosFinanceiros} atendimentos financeiros`, 'info', 3000);
                    this.showNotification(`Receita: R$ ${importedData.resumo.totalReceitaFinanceira}`, 'info', 3000);
                    this.showNotification('Atualizando página em 2 segundos...', 'info', 3000);

                    // Recarrega a página para aplicar todos os dados
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);

                    console.log('📊 Resumo do backup restaurado:', importedData.resumo);
                } catch (error) {
                    console.error('❌ Erro ao processar arquivo:', error);
                    this.showNotification('Erro ao processar arquivo', 'error');
                    this.showNotification(error.message, 'warning');
                }
            };

            reader.readAsText(file);
            
            // Limpa input para permitir re-upload do mesmo arquivo
            event.target.value = '';
        } catch (error) {
            console.error('❌ Erro ao importar:', error);
            this.showNotification('❌ Erro ao importar dados', 'error');
        }
    }

    /**
     * Show notification com suporte a quebras de linha
     */
    showNotification(message, type = 'info', duration = 4000) {
        if (window.notify) {
            window.notify.show(message, type, duration);
        } else if (window.notificationSystem) {
            window.notificationSystem.show(message, type, duration);
        } else {
            console.warn('Sistema de notificações não disponível:', message);
        }
    }

    /**
     * Exporta dados de forma manual (para possível sincronização futura)
     */
    manualExport() {
        this.handleExport();
    }

    /**
     * Obtém dados para sincronização
     */
    getSyncData() {
        if (!window.dataManager) return null;
        return this.collectAllData();
    }

    /**
     * Retorna resumo dos dados atuais
     */
    getDataSummary() {
        return {
            evolucoes: window.dataManager?.getEvolucoes()?.length || 0,
            financeiro: window.dataManager?.getFinanceiro()?.summary?.totalAtendimentos || 0,
            ultimoSalva: window.dataManager?.getLastSaveTime() || 'Nunca'
        };
    }
}

// Instância global
let exportImportManager;

document.addEventListener('DOMContentLoaded', () => {
    exportImportManager = new ExportImportManager();
    window.exportImportManager = exportImportManager;
});

