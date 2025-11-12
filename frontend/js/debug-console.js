/**
 * DEBUG-CONSOLE.JS
 * Adiciona logging detalhado para debug
 */

class DebugConsole {
    static init() {
        console.log('🔴 ===== DEBUG CONSOLE INICIALIZADO =====');
        
        // Espera um pouco para que tudo carregue
        setTimeout(() => {
            console.log('🔴 Verificando objetos globais:');
            console.log('� window.evolucoesIntegration:', typeof window.evolucoesIntegration);
            console.log('🔍 window.financialIntegration:', typeof window.financialIntegration);
            console.log('� window.dataManager:', typeof window.dataManager);
            
            // Intercepta o processamento
            if (window.evolucoesIntegration) {
                const originalProcessar = window.evolucoesIntegration.processar;
                window.evolucoesIntegration.processar = function() {
                    console.log('🔴 DEBUG: processar() chamado');
                    const textarea = document.getElementById('evolucaoTextarea');
                    if (textarea) {
                        const content = textarea.value.trim();
                        console.log('� Content length:', content.length);
                        if (content) {
                            console.log('� Content preview:', content.substring(0, 100));
                        } else {
                            console.log('� Content is EMPTY!');
                        }
                    }
                    return originalProcessar.call(this);
                };
            }
            
            // Verifica se filtros vão ser renderizados
            console.log('🔴 Verificando containers:');
            console.log('  - #filter-container-evolucoes existe:', !!document.getElementById('filter-container-evolucoes'));
            console.log('  - #filter-container-financeiro existe:', !!document.getElementById('filter-container-financeiro'));
        }, 1000);
    }
}

// Inicializa quando pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DebugConsole.init());
} else {
    DebugConsole.init();
}

