/**
 * Financial Integration - Integra parser, analyzer e UI
 */

class FinancialIntegration {
    constructor() {
        this.parser = new FinancialParser();
        this.analyzer = new FinancialAnalyzer();
        this.ui = new FinancialUI();
        this.loadSavedData();
    }

    /**
     * Carrega dados financeiros salvos ao iniciar
     */
    loadSavedData() {
        try {
            if (window.dataManager) {
                const savedFinanceiro = window.dataManager.getFinanceiro();
                const savedRecords = window.dataManager.getFinanceiroRecords?.() || [];
                
                if (savedFinanceiro && savedFinanceiro.summary && savedFinanceiro.summary.totalAtendimentos > 0) {
                    console.log(`✅ Dados financeiros salvos encontrados. Carregando...`);
                    this.analyzer = new FinancialAnalyzer();
                    this.analyzer.analysis = savedFinanceiro;
                    this.ui.render(savedFinanceiro, savedRecords);
                    console.log(`✅ Análise Financeira carregada: ${savedFinanceiro.summary.totalAtendimentos} atendimentos`);
                }
            }
        } catch (error) {
            console.warn('Não foi possível carregar dados financeiros salvos:', error);
        }
    }

    /**
     * Processa dados financeiros
     * Agora ACUMULA dados como no módulo de Evoluções
     */
    processData(text, silent = false, acceptAnyStatus = false) {
        try {
            console.log(`📊 FinancialIntegration.processData() iniciado`);
            console.log(`   - Tamanho do texto: ${text?.length} caracteres`);
            console.log(`   - Silent mode: ${silent}`);
            console.log(`   - Accept any status: ${acceptAnyStatus}`);

            // Parse
            const records = this.parser.parse(text);
            console.log(`   - Records parseados: ${records.length}`);
            
            if (records.length === 0) {
                if (!silent) {
                    this.showNotification('Nenhum registro encontrado', 'warning');
                }
                return;
            }

            // Se acceptAnyStatus=true, processa qualquer registro válido
            // Caso contrário, filtra apenas "Presença confirmada"
            let recordsToProcess;
            
            if (acceptAnyStatus) {
                // Aceita todos os registros validados
                recordsToProcess = this.parser.getValidRecords();
                console.log(`📊 Processando ${recordsToProcess.length} registros (qualquer status)`);
            } else {
                // Filtra apenas "Presença confirmada" (comportamento original)
                recordsToProcess = this.parser.getConfirmedRecords();
                console.log(`📊 Processando ${recordsToProcess.length} registros com "Presença confirmada"`);
            }
            
            if (recordsToProcess.length === 0) {
                if (!silent) {
                    const msg = acceptAnyStatus 
                        ? 'Nenhum registro válido encontrado' 
                        : 'Nenhum registro com "Presença confirmada"';
                    this.showNotification(msg, 'warning');
                }
                console.log(`   - Nenhum registro para processar após filtro`);
                return;
            }

            // 🔑 CRUCIAL: Recupera registros antigos para ACUMULAR
            const registrosAntigos = window.dataManager?.getFinanceiroRecords?.() || [];
            console.log(`📊 Registros antigos carregados: ${registrosAntigos.length}`);
            
            // Combina registros antigos com novos (ACUMULAÇÃO)
            const registrosCombinados = [...registrosAntigos, ...recordsToProcess];
            console.log(`📊 Total de registros após acumular: ${registrosCombinados.length}`);

            // Analyze com TODOS os registros (antigos + novos)
            this.analyzer = new FinancialAnalyzer(registrosCombinados);
            const analysis = this.analyzer.analyze();
            console.log(`   - Análise gerada: ${analysis?.summary?.totalAtendimentos} atendimentos`);

            // Verifica se gerou alguma análise
            if (!analysis.summary || analysis.summary.totalAtendimentos === 0) {
                if (!silent) {
                    this.showNotification('Nenhum dado para análise', 'warning');
                }
                console.log(`   - Análise sem dados válidos`);
                return;
            }

            // Salva dados (COMBINADOS - antigos + novos)
            try {
                if (window.dataManager) {
                    window.dataManager.addFinanceiro(analysis, registrosCombinados);
                    console.log(`   - Dados salvos no dataManager (acumulado)`);
                }
            } catch (saveError) {
                console.warn('Aviso ao salvar dados financeiros:', saveError);
            }

            // Render com dados ACUMULADOS
            console.log(`   - Renderizando UI com ${registrosCombinados.length} registros acumulados`);
            this.ui.render(analysis, registrosCombinados);

            // Mostra notificação apenas se não for silencioso
            if (!silent) {
                this.showNotification(`${recordsToProcess.length} registros processados! Total acumulado: ${registrosCombinados.length}`, 'success');
            }
            
            console.log(`✅ FinancialIntegration.processData() concluído com ${registrosCombinados.length} registros totais`);
        } catch (error) {
            console.error('Erro na análise financeira:', error);
            if (!silent) {
                this.showNotification('Erro ao processar dados financeiros', 'error');
            }
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
     * Get summary
     */
    getSummary() {
        return this.analyzer.getSummary();
    }

    /**
     * Get specialties
     */
    getSpecialties() {
        return this.analyzer.getSpecialties();
    }

    /**
     * Get professionals
     */
    getProfessionals() {
        return this.analyzer.getProfessionals();
    }

    /**
     * Get patients
     */
    getPatients() {
        return this.analyzer.getPatients();
    }

    /**
     * Recarrega dados financeiros do localStorage
     * Usado para refresh automático garantir que dados sempre estejam atualizados
     */
    reloadData() {
        try {
            console.log('🔄 FinancialIntegration: Recarregando dados...');
            this.loadSavedData();
            console.log('✅ FinancialIntegration: Dados recarregados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao recarregar dados financeiros:', error);
        }
    }
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    window.FinancialIntegration = new FinancialIntegration();
});
