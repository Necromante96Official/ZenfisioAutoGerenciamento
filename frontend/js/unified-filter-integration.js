/**
 * UNIFIED-FILTER-INTEGRATION.JS
 * Integra botão de filtros global com o modal unificado
 * Configura callbacks para cada módulo
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔗 UnifiedFilterIntegration: Inicializando...');

    // Aguarda inicialização dos módulos
    setTimeout(() => {
        setupUnifiedFilter();
    }, 1000);
});

function setupUnifiedFilter() {
    const filterBtn = document.getElementById('unifiedFilterBtn');
    if (!filterBtn) {
        console.warn('⚠️ Botão de filtro unificado não encontrado');
        return;
    }

    // Configura callbacks para cada módulo
    if (window.unifiedFilterModal && window.unifiedFilterSystem) {
        // Callback para Agendamentos
        window.unifiedFilterModal.setCallback('agendamentos', (filters) => {
            console.log('📅 Aplicando filtros em Agendamentos');
            window.unifiedFilterSystem.applyAgendamentosFilters(filters);
        });

        // Callback para Evoluções
        window.unifiedFilterModal.setCallback('evolucoes', (filters) => {
            console.log('📋 Aplicando filtros em Evoluções');
            window.unifiedFilterSystem.applyEvolucoesFilters(filters);
        });

        // Callback para Financeiro
        window.unifiedFilterModal.setCallback('financeiro', (filters) => {
            console.log('💰 Aplicando filtros em Financeiro');
            window.unifiedFilterSystem.applyFinanceiroFilters(filters);
        });

        console.log('✅ Callbacks configurados');
    }

    // Evento de clique no botão
    filterBtn.addEventListener('click', () => {
        // Detecta qual módulo está ativo
        const activeModule = detectActiveModule();
        console.log(`🔍 Abrindo filtros para módulo: ${activeModule}`);
        
        // Abre modal na aba correspondente
        window.unifiedFilterModal.open(activeModule);
    });

    console.log('✅ UnifiedFilterIntegration: Configurado');
}

/**
 * Detecta qual módulo está ativo no momento
 */
function detectActiveModule() {
    // Verifica qual botão de navegação está ativo
    const activeNavBtn = document.querySelector('.nav-btn.active');
    if (!activeNavBtn) return 'agendamentos';

    const module = activeNavBtn.dataset.module;
    
    // Mapeia módulos
    const moduleMap = {
        'evolucoes': 'evolucoes',
        'financeiro': 'financeiro',
        'desenvolvimento': 'agendamentos'
    };

    return moduleMap[module] || 'agendamentos';
}

/**
 * Adiciona método helper para FinancialIntegration recarregar dados
 */
if (window.financialIntegration) {
    window.financialIntegration.reloadData = function() {
        console.log('🔄 FinancialIntegration: Recarregando dados originais');
        
        const allRecords = window.dataManager?.getFinanceiroRecords() || [];
        
        if (this.analyzer) {
            this.analyzer.limpar();
            allRecords.forEach(record => {
                this.analyzer.adicionarAtendimento(record);
            });
            
            const analysisData = this.analyzer.getAnalysis();
            this.ui.render(analysisData);
        }
    };
}

/**
 * Adiciona listener para limpar filtros quando trocar de módulo
 */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-btn')) {
        // Quando trocar de módulo, não limpa filtros automaticamente
        // O usuário deve clicar em "Limpar Filtros" manualmente
        console.log('📌 Módulo trocado - filtros mantidos');
    }
});

console.log('✅ unified-filter-integration.js carregado');

