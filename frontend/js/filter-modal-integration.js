/**
 * FILTER-MODAL-INTEGRATION.JS
 * Conecta os botões de filtro às modais
 */

document.addEventListener('DOMContentLoaded', () => {
    // Botão de filtro para Evoluções
    document.addEventListener('click', (e) => {
        if (e.target.id === 'openEvolucoesFilterBtn') {
            if (window.evolucoesIntegration && window.evolucoesIntegration.ui) {
                window.evolucoesIntegration.ui.openFilterModal();
            }
        }

        // Botão de filtro para Financeiro
        if (e.target.id === 'openFinanceiroFilterBtn') {
            if (window.FinancialIntegration && window.FinancialIntegration.ui) {
                window.FinancialIntegration.ui.openFilterModal();
            }
        }
    });
});
