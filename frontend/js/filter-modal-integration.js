/**
 * FILTER-MODAL-INTEGRATION.JS
 * Conecta os botões de filtro às modais
 */

document.addEventListener('DOMContentLoaded', () => {
    // Botão de filtro para Financeiro
    document.addEventListener('click', (e) => {
        if (e.target.id === 'openFinanceiroFilterBtn') {
            if (window.financialIntegration && window.financialIntegration.ui) {
                window.financialIntegration.ui.openFilterModal();
            }
        }
    });
});
