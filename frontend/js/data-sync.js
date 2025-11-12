/**
 * DATA-SYNC.JS
 * Sistema de sincronização e validação de dados
 * Garante que dados sempre estejam atualizados mesmo se salvos localmente
 */

class DataSync {
    constructor() {
        this.lastSyncTime = {};
        this.syncInterval = 5 * 60 * 1000; // 5 minutos
        this.init();
    }

    init() {
        console.log('📡 DataSync: Sistema de sincronização inicializado');
        this.setupSyncListeners();
    }

    /**
     * Registra última sincronização de um módulo
     */
    recordSync(moduleName) {
        this.lastSyncTime[moduleName] = new Date().getTime();
        console.log(`⏱️  ${moduleName}: Sincronização registrada em ${new Date().toLocaleTimeString('pt-BR')}`);
    }

    /**
     * Verifica se precisa sincronizar um módulo
     */
    needsSync(moduleName) {
        const lastSync = this.lastSyncTime[moduleName] || 0;
        const now = new Date().getTime();
        const timePassed = now - lastSync;
        
        return timePassed > this.syncInterval;
    }

    /**
     * Obtém o tempo da última sincronização de forma legível
     */
    getLastSyncTime(moduleName) {
        const time = this.lastSyncTime[moduleName];
        if (!time) return 'Nunca';
        
        const date = new Date(time);
        return date.toLocaleTimeString('pt-BR');
    }

    /**
     * Valida se dados estão desatualizados
     */
    validateDataFreshness(moduleName, maxAgeMinutes = 30) {
        const lastSync = this.lastSyncTime[moduleName] || 0;
        const now = new Date().getTime();
        const ageMinutes = (now - lastSync) / (60 * 1000);
        
        const isStale = ageMinutes > maxAgeMinutes;
        
        if (isStale) {
            console.warn(`⚠️  ${moduleName}: Dados possivelmente desatualizados (${Math.floor(ageMinutes)} min atrás)`);
        }
        
        return {
            isStale,
            ageMinutes,
            lastSyncTime: new Date(lastSync).toLocaleTimeString('pt-BR')
        };
    }

    /**
     * Força sincronização imediata
     */
    forceSync(moduleName) {
        console.log(`🔄 ${moduleName}: Sincronização forçada solicitada`);
        this.recordSync(moduleName);
        
        // Dispara evento customizado
        window.dispatchEvent(new CustomEvent('dataSync', {
            detail: { moduleName, forced: true }
        }));
    }

    /**
     * Configura listeners para mudanças de dados
     */
    setupSyncListeners() {
        // Listener para mudanças em Evoluções
        if (window.dataManager) {
            const originalAddEvolucion = window.dataManager.addEvolucion?.bind(window.dataManager);
            if (originalAddEvolucion) {
                window.dataManager.addEvolucion = function(...args) {
                    const result = originalAddEvolucion(...args);
                    window.dataSync?.recordSync('Evoluções');
                    return result;
                };
            }

            // Listener para mudanças em Financeiro
            const originalAddFinanceiro = window.dataManager.addFinanceiro?.bind(window.dataManager);
            if (originalAddFinanceiro) {
                window.dataManager.addFinanceiro = function(...args) {
                    const result = originalAddFinanceiro(...args);
                    window.dataSync?.recordSync('Financeiro');
                    return result;
                };
            }
        }
    }

    /**
     * Gera relatório de status de sincronização
     */
    getStatusReport() {
        const report = {
            timestamp: new Date().toLocaleString('pt-BR'),
            modules: {}
        };

        ['Evoluções', 'Financeiro'].forEach(module => {
            report.modules[module] = {
                lastSync: this.getLastSyncTime(module),
                needsSync: this.needsSync(module),
                freshness: this.validateDataFreshness(module)
            };
        });

        return report;
    }

    /**
     * Exibe relatório no console
     */
    printStatusReport() {
        const report = this.getStatusReport();
        console.group('📊 Relatório de Sincronização de Dados');
        console.table(report.modules);
        console.log('⏰ Gerado em:', report.timestamp);
        console.groupEnd();
    }
}

// Inicializa quando documento estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dataSync = new DataSync();
        console.log('✅ DataSync: Sistema ativo e pronto');
    });
} else {
    window.dataSync = new DataSync();
}
