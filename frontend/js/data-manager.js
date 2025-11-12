/**
 * Data Manager - Gerencia persistência de dados
 * - Salva automaticamente
 * - Exporta dados em JSON
 * - Importa dados com validação
 */

class DataManager {
    constructor() {
        this.storageKey = 'zenfisio_data';
        this.exportKey = 'zenfisio_export';
        this.autoSaveInterval = 10000; // 10 segundos
        this.data = {
            evolucoes: [],
            financeiro: [],
            financeiro_records: [],
            timestamp: null
        };
        this.initAutoSave();
        this.loadData();
    }

    /**
     * Inicializa auto-save
     */
    initAutoSave() {
        setInterval(() => {
            this.saveData();
        }, this.autoSaveInterval);

        // Salva ao sair da página
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });
    }

    /**
     * Salva dados no localStorage
     */
    saveData() {
        try {
            this.data.timestamp = new Date().toISOString();
            const json = JSON.stringify(this.data);
            localStorage.setItem(this.storageKey, json);
            console.log('✅ Dados salvos automaticamente');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    /**
     * Carrega dados do localStorage
     */
    loadData() {
        try {
            const json = localStorage.getItem(this.storageKey);
            if (json) {
                this.data = JSON.parse(json);
                console.log('✅ Dados carregados do armazenamento');
                return true;
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.data = {
                evolucoes: [],
                financeiro: [],
                financeiro_records: [],
                timestamp: null
            };
        }
        return false;
    }

    /**
     * Adiciona dados de evoluções
     */
    addEvolucoes(records) {
        if (!Array.isArray(records)) return false;
        
        this.data.evolucoes = records;
        this.saveData();
        return true;
    }

    /**
     * Adiciona dados financeiros
     * ACUMULA com dados antigos (não substitui)
     */
    addFinanceiro(analysis, records = []) {
        if (!analysis) return false;
        
        console.log(`💾 DataManager.addFinanceiro() - Acumulando dados`);
        console.log(`   - Novos registros: ${records.length}`);
        console.log(`   - Registros antigos: ${this.data.financeiro_records?.length || 0}`);
        
        // Atualiza análise (esta é sempre recalculada com dados acumulados)
        this.data.financeiro = {
            summary: analysis.summary || analysis?.summary,
            byDate: analysis.byDate || analysis?.byDate,
            bySpecialty: analysis.bySpecialty || analysis?.bySpecialty,
            byProfessional: analysis.byProfessional || analysis?.byProfessional,
            byPatient: analysis.byPatient || analysis?.byPatient,
            timestamp: new Date().toISOString()
        };
        
        // Se records não foram passados, tenta extrair dos dados financeiros
        if (records.length === 0 && analysis?.records) {
            records = analysis.records;
        }
        
        // 🔑 CRUCIAL: Usa os records passados diretamente (já contém acúmulo de FinancialIntegration)
        this.data.financeiro_records = Array.isArray(records) ? records : [];
        
        console.log(`   - Total acumulado: ${this.data.financeiro_records.length}`);
        
        this.saveData();
        return true;
    }

    /**
     * Exporta todos os dados em JSON estruturado
     */
    exportData() {
        try {
            const exportData = {
                version: '1.0.0.9',
                exportDate: new Date().toISOString(),
                data: this.data,
                metadata: {
                    evolucoesCont: this.data.evolucoes?.length || 0,
                    financeiroCont: this.data.financeiro?.summary ? 1 : 0,
                    totalAtendimentos: this.data.financeiro?.summary?.totalAtendimentos || 0,
                    receitaTotal: this.data.financeiro?.summary?.receitaTotal || '0.00'
                }
            };

            const json = JSON.stringify(exportData, null, 2);
            return json;
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            return null;
        }
    }

    /**
     * Importa dados com validação
     */
    importData(jsonString) {
        try {
            const importData = JSON.parse(jsonString);

            // Validações básicas
            if (!importData.data) {
                throw new Error('Formato inválido: campo "data" não encontrado');
            }

            if (!importData.version) {
                throw new Error('Formato inválido: versão não especificada');
            }

            // Valida estrutura de evoluções
            if (Array.isArray(importData.data.evolucoes) || importData.data.evolucoes === undefined) {
                if (importData.data.evolucoes === undefined) {
                    importData.data.evolucoes = [];
                }
            } else {
                throw new Error('Dados de evoluções inválidos');
            }

            // Valida estrutura financeira
            if (importData.data.financeiro === undefined) {
                importData.data.financeiro = {};
            }
            
            if (importData.data.financeiro_records === undefined) {
                importData.data.financeiro_records = [];
            }

            // Carrega dados mantendo a estrutura
            this.data = {
                evolucoes: importData.data.evolucoes || [],
                financeiro: importData.data.financeiro || {},
                financeiro_records: importData.data.financeiro_records || [],
                timestamp: new Date().toISOString()
            };

            this.saveData();
            return {
                success: true,
                message: 'Dados importados com sucesso',
                metadata: importData.metadata
            };
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Limpa dados financeiros (mantém evoluções)
     */
    clearFinanceiroData() {
        this.data.financeiro = {};
        this.data.financeiro_records = [];
        this.saveData();
        console.log('🧹 Dados financeiros limpos');
    }

    /**
     * Limpa dados
     */
    clearData() {
        this.data = {
            evolucoes: [],
            financeiro: [],
            timestamp: null
        };
        localStorage.removeItem(this.storageKey);
        console.log('✅ Dados limpos');
    }

    /**
     * Retorna dados de evoluções
     */
    getEvolucoes() {
        return this.data.evolucoes || [];
    }

    /**
     * Retorna dados financeiros
     */
    getFinanceiro() {
        return this.data.financeiro || {};
    }

    /**
     * Retorna records financeiros (para filtros)
     */
    getFinanceiroRecords() {
        return this.data.financeiro_records || [];
    }

    /**
     * Retorna timestamp do último save
     */
    getLastSaveTime() {
        return this.data.timestamp;
    }

    /**
     * Retorna status dos dados
     */
    getStatus() {
        return {
            evolucoes: this.data.evolucoes?.length || 0,
            financeiro: this.data.financeiro?.summary ? 'Processado' : 'Vazio',
            lastSave: this.data.timestamp,
            storageSize: new Blob([JSON.stringify(this.data)]).size + ' bytes'
        };
    }
}

// Instância global
let dataManager;

document.addEventListener('DOMContentLoaded', () => {
    dataManager = new DataManager();
    window.dataManager = dataManager;
});
