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
     * Agora aceita QUALQUER status válido (não apenas "Presença confirmada")
     */
    processData(text, silent = false, acceptAnyStatus = false) {
        try {
            // Parse
            const records = this.parser.parse(text);
            
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
                return;
            }

            // Analyze (passa records que já estão filtrados)
            this.analyzer = new FinancialAnalyzer(recordsToProcess);
            const analysis = this.analyzer.analyze();

            // Verifica se gerou alguma análise
            if (!analysis.summary || analysis.summary.totalAtendimentos === 0) {
                if (!silent) {
                    this.showNotification('Nenhum dado para análise', 'warning');
                }
                return;
            }

            // Salva dados (sem deixar falhas afetarem notificação)
            try {
                if (window.dataManager) {
                    window.dataManager.addFinanceiro(analysis, recordsToProcess);
                }
            } catch (saveError) {
                console.warn('Aviso ao salvar dados financeiros:', saveError);
            }

            // Render
            this.ui.render(analysis, recordsToProcess);

            // Mostra notificação apenas se não for silencioso
            if (!silent) {
                this.showNotification(`✅ ${recordsToProcess.length} registros processados com sucesso!`, 'success');
            }
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
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    window.FinancialIntegration = new FinancialIntegration();
});
