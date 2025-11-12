// ========================================
// ZENFISIO MANAGER - MAIN APPLICATION
// ========================================

class ZenfisioApp {
    constructor() {
        this.init();
        this.setupAutoRefresh();
    }

    init() {
        this.setupEventListeners();
    }

    /**
     * Configura refresh automático a cada 5 minutos (300 segundos)
     * Garante que dados sempre estejam atualizados mesmo se salvos localmente
     * Sincroniza automaticamente com as melhorias implementadas
     */
    setupAutoRefresh() {
        // Refresh inicial após 5 minutos (300 segundos)
        const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutos em milissegundos
        
        setInterval(() => {
            this.refreshAllData();
        }, REFRESH_INTERVAL);
        
        console.log('🔄 Auto-refresh configurado: a cada 300 segundos (5 minutos)');
    }

    /**
     * Atualiza todos os dados dos módulos
     */
    refreshAllData() {
        console.log('🔄 Iniciando refresh automático de dados...');
        
        // 💾 Salva a posição do usuário ANTES de atualizar
        if (window.uiStateManager) {
            window.uiStateManager.saveState();
        }
        
        try {
            // Refresh de Evoluções
            if (window.evolucoesIntegration) {
                console.log('  ♻️ Atualizando Evoluções...');
                window.evolucoesIntegration.reloadData?.();
                window.dataSync?.recordSync('Evoluções');
            }
            
            // Refresh de Financeiro
            if (window.financialIntegration) {
                console.log('  ♻️ Atualizando Análise Financeira...');
                window.financialIntegration.reloadData?.();
                window.dataSync?.recordSync('Financeiro');
            }
            
            console.log('✅ Refresh automático concluído');
            
            // ✅ Restaura a posição do usuário DEPOIS de atualizar
            if (window.uiStateManager) {
                window.uiStateManager.restoreState();
            }
            
            // Notifica usuário (opcional)
            if (window.notify) {
                window.notify.success('Dados atualizados com sucesso! 🔄', 2000);
            }
        } catch (error) {
            console.error('❌ Erro durante refresh automático:', error);
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchModule(e.target.closest('.nav-btn').dataset.module));
        });

        // Clear button
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearInput());
        
        // Refresh button (se existir)
        const refreshBtn = document.getElementById('refreshDataBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                console.log('👤 Refresh manual solicitado');
                
                // Adiciona classe para animação contínua
                refreshBtn.classList.add('refreshing');
                const icon = refreshBtn.querySelector('.refresh-icon');
                
                this.refreshAllData();
                
                // Remove classe de animação após conclusão (2 segundos)
                setTimeout(() => {
                    refreshBtn.classList.remove('refreshing');
                }, 2000);
            });
        }
    }

    switchModule(moduleName) {
        // Hide all modules
        document.querySelectorAll('.module').forEach(mod => {
            mod.classList.remove('active');
        });

        // Show selected module
        const targetModule = document.getElementById(moduleName) || document.querySelector(`[data-module="${moduleName}"]`);
        if (targetModule) {
            targetModule.classList.add('active');
        }

        // Update nav button states
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-module="${moduleName}"]`)?.closest('.nav-btn')?.classList.add('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    clearInput() {
        const textarea = document.getElementById('evolucaoTextarea');
        if (textarea) {
            textarea.value = '';
            textarea.focus();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ZenfisioApp();
});
