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
            financeiro: {},
            financeiro_records: [],
            schedules: {},
            schedules_data: {},
            timestamp: null
        };
        this.isSyncing = false;
        this.backendStateEndpoint = '/api/state';
        this.backendClearEndpoint = '/api/state/clear';
        this.initAutoSave();
        this.loadData();
        // NÃO sincronizar do servidor no constructor - apenas usar localStorage como fonte local
        // O backend é apenas backup para recuperação em caso de perda de dados
    }

    /**
     * Inicializa auto-save
     */
    initAutoSave() {
        setInterval(() => {
            this.saveData().catch((error) => console.warn('Auto-save falhou:', error));
        }, this.autoSaveInterval);

        // Salva ao sair da página
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });
    }

    /**
     * Salva dados no localStorage e persiste no backend
     */
    async saveData(options = {}) {
        const { remote = true, silent = false, preserveTimestamp = false } = options;

        try {
            if (!preserveTimestamp) {
                this.data.timestamp = new Date().toISOString();
            }
            this.saveLocalSnapshot();

            if (!silent) {
                console.log('✅ Dados salvos automaticamente');
            }

            if (remote) {
                await this.syncToServer();
            }

            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }

    /**
     * Carrega dados do localStorage
     */
    loadData() {
        try {
            const json = localStorage.getItem(this.storageKey);
            if (json) {
                const parsed = JSON.parse(json);
                this.data = this.normalizeState(parsed);
                console.log('✅ Dados carregados do armazenamento');
                return true;
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.data = this.normalizeState({});
        }
        return false;
    }

    /**
     * Adiciona dados de evoluções
     * ACUMULA com dados antigos (não substitui)
     */
    addEvolucoes(records) {
        if (!Array.isArray(records)) return false;
        
        console.log(`💾 DataManager.addEvolucoes() - Acumulando dados`);
        console.log(`   - Registros a adicionar: ${records.length}`);
        console.log(`   - Registros antigos já no storage: ${this.data.evolucoes?.length || 0}`);
        
        // ACUMULA DIRETAMENTE: O caller já deve passar dados combinados
        // Mas como fallback, se forem novos registros, acumula com os antigos
        this.data.evolucoes = Array.isArray(records) ? records : [];
        
        console.log(`   - Total acumulado agora: ${this.data.evolucoes.length}`);
        
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
        console.log(`   - Registros antigos já no storage: ${this.data.financeiro_records?.length || 0}`);
        
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
        
        // 🔑 CRUCIAL: ACUMULA records (já vem combinado de FinancialIntegration)
        // Usa os records passados diretamente - já contêm acúmulo de FinancialIntegration
        this.data.financeiro_records = Array.isArray(records) ? records : [];
        
        console.log(`   - Total acumulado agora: ${this.data.financeiro_records.length}`);
        
        this.saveData();
        return true;
    }

    /**
     * Adiciona dados de agendamentos
     */
    addSchedules(schedulesData = {}) {
        if (!schedulesData) return false;
        
        console.log(`💾 DataManager.addSchedules() - Salvando dados de agendamentos`);
        console.log(`   - Compareceram: ${schedulesData.compareceram?.length || 0}`);
        console.log(`   - Faltaram: ${schedulesData.faltaram?.length || 0}`);
        
        this.data.schedules_data = schedulesData;
        
        console.log(`   - Dados de agendamentos salvos`);
        
        this.saveData();
        return true;
    }

    /**
     * Exporta todos os dados em JSON estruturado
     */
    exportData() {
        try {
            // Coleta dados de agendamentos
            const schedulesData = this.data.schedules_data || {};
            const compareceram = schedulesData.compareceram || [];
            const faltaram = schedulesData.faltaram || [];
            const totalAgendamentos = compareceram.length + faltaram.length;

            const exportData = {
                version: '1.2.0',
                exportDate: new Date().toISOString(),
                data: this.data,
                metadata: {
                    evolucoesCont: this.data.evolucoes?.length || 0,
                    financeiroCont: this.data.financeiro?.summary ? 1 : 0,
                    totalAtendimentos: this.data.financeiro?.summary?.totalAtendimentos || 0,
                    receitaTotal: this.data.financeiro?.summary?.receitaTotal || '0.00',
                    agendamentosCompareceram: compareceram.length,
                    agendamentosFaltaram: faltaram.length,
                    totalAgendamentos: totalAgendamentos,
                    dataAgendamentos: schedulesData.data || 'Não informada'
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

            // Valida estrutura de agendamentos
            if (importData.data.schedules_data === undefined) {
                importData.data.schedules_data = {};
            }

            if (importData.data.schedules_records === undefined) {
                importData.data.schedules_records = [];
            }

            // Carrega dados mantendo a estrutura
            this.data = {
                evolucoes: importData.data.evolucoes || [],
                financeiro: importData.data.financeiro || {},
                financeiro_records: importData.data.financeiro_records || [],
                schedules_data: importData.data.schedules_data || {},
                schedules_records: importData.data.schedules_records || [],
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
    async clearFinanceiroData() {
        this.data.financeiro = {};
        this.data.financeiro_records = [];
        await this.saveData();
        console.log('🧹 Dados financeiros limpos');
    }

    /**
     * Limpa dados de agendamentos
     */
    async clearSchedulesData() {
        this.data.schedules_data = {};
        this.data.schedules_records = [];
        await this.saveData();
        console.log('🧹 Dados de agendamentos limpos');
    }

    /**
     * Limpa dados
     */
    async clearData() {
        this.data = this.normalizeState({ evolucoes: [], financeiro: {}, financeiro_records: [], schedules_data: {}, schedules_records: [], timestamp: null });
        localStorage.removeItem(this.storageKey);
        console.log('✅ Dados limpos');
        await this.clearRemoteState();
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
     * Retorna dados de agendamentos
     */
    getSchedules() {
        return this.data.schedules_data || {};
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

    /**
     * Normaliza estrutura de dados para evitar campos ausentes
     */
    normalizeState(state) {
        return {
            evolucoes: Array.isArray(state?.evolucoes) ? state.evolucoes : [],
            financeiro: state?.financeiro || {},
            financeiro_records: Array.isArray(state?.financeiro_records) ? state.financeiro_records : [],
            schedules: state?.schedules || {},
            schedules_data: state?.schedules_data || {},
            schedules_records: Array.isArray(state?.schedules_records) ? state.schedules_records : [],
            timestamp: state?.timestamp || null
        };
    }

    /**
     * Persiste snapshot local sem sincronizar com backend
     */
    saveLocalSnapshot() {
        try {
            const json = JSON.stringify(this.data);
            localStorage.setItem(this.storageKey, json);
        } catch (error) {
            console.warn('⚠️ Não foi possível salvar dados localmente:', error);
        }
    }

    /**
     * Envia estado atual para o backend
     */
    async syncToServer() {
        try {
            const response = await fetch(this.backendStateEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: this.data })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const payload = await response.json();
            if (!payload.success) {
                throw new Error(payload.message || 'Falha ao sincronizar estado no backend');
            }
        } catch (error) {
            console.warn('⚠️ Não foi possível sincronizar com o backend:', error);
        }
    }

    /**
     * Carrega estado persistido no backend e aplica se estiver mais atual
     */
    async syncFromServer() {
        try {
            const response = await fetch(this.backendStateEndpoint);
            if (!response.ok) {
                return;
            }

            const payload = await response.json();
            if (!payload.success || !payload.state) {
                return;
            }

            const remoteState = this.normalizeState(payload.state);
            const remoteTime = this.parseTimestamp(remoteState.timestamp);
            const localTime = this.parseTimestamp(this.data.timestamp);

            if (remoteTime > localTime) {
                this.data = remoteState;
                await this.saveData({ remote: false, silent: true, preserveTimestamp: true });
                console.log('☁️ Dados sincronizados a partir do backend');
            }
        } catch (error) {
            console.warn('⚠️ Falha ao carregar estado do backend:', error);
        }
    }

    /**
     * Converte timestamp em epoch para comparação
     */
    parseTimestamp(value) {
        if (!value) {
            return 0;
        }

        const time = new Date(value).getTime();
        return Number.isNaN(time) ? 0 : time;
    }

    /**
     * Remove estado persistido no backend
     */
    async clearRemoteState() {
        try {
            const response = await fetch(this.backendClearEndpoint, { method: 'POST' });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ Não foi possível limpar o estado persistido:', error);
        }
    }
}

// Instância global
let dataManager;

document.addEventListener('DOMContentLoaded', () => {
    dataManager = new DataManager();
    window.dataManager = dataManager;
});
 