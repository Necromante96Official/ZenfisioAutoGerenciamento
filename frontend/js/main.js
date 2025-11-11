// ========================================
// ZENFISIO MANAGER - MAIN APPLICATION
// ========================================

class ZenfisioApp {
    constructor() {
        this.currentData = null;
        this.currentDate = new Date().toISOString().split('T')[0];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setTodayDate();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchModule(e.target.closest('.nav-btn').dataset.module));
        });

        // Process Button - DESATIVADO: evolucoesIntegration cuida disso
        // document.getElementById('processBtn')?.addEventListener('click', () => this.processData());
        
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearInput());

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-btn')));
        });

        // Export buttons
        document.getElementById('exportJsonBtn')?.addEventListener('click', () => this.exportJson());
        document.getElementById('exportCsvBtn')?.addEventListener('click', () => this.exportCsv());

        // Date input
        document.getElementById('dataInput')?.addEventListener('change', (e) => {
            this.currentDate = e.target.value;
        });
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        const input = document.getElementById('dataInput');
        if (input) input.value = today;
    }

    switchModule(moduleName) {
        // Hide all modules with fade out
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

    switchTab(tabBtn) {
        const tabName = tabBtn.dataset.tab;
        const container = tabBtn.closest('.card-body');
        if (!container) return;

        // Hide all panes
        container.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // Show selected pane
        container.querySelector(`#${tabName}`)?.classList.add('active');

        // Update buttons
        container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        tabBtn.classList.add('active');
    }

    async processData() {
        const textarea = document.getElementById('evolucaoTextarea');
        const data = textarea.value.trim();

        if (!data) {
            this.showStatus('Por favor, cole alguns dados', 'error');
            return;
        }

        try {
            this.showStatus('Processando dados...', 'info');
            
            // Usa o parser local em vez de fazer fetch
            if (!window.parser) {
                window.parser = new AgendamentoParser();
            }

            const agendamentos = window.parser.parseMultiple(data);

            if (agendamentos.length === 0) {
                this.showStatus('Nenhum agendamento válido encontrado', 'warning');
                return;
            }

            this.currentData = agendamentos;
            this.showStatus(`${agendamentos.length} registros processados com sucesso!`, 'success');
            this.displayResults();
        } catch (error) {
            // Traduz o erro para português
            const errorMessage = error.message.includes('Failed to fetch') 
                ? 'Erro na conexão com o servidor' 
                : error.message;
            this.showStatus(`Erro: ${errorMessage}`, 'error');
            console.error('Error:', error);
        }
    }

    async displayResults() {
        if (!this.currentData || this.currentData.length === 0) {
            this.showStatus('Nenhum dado para exibir', 'error');
            return;
        }

        // Show results card
        const resultsCard = document.getElementById('resultsCard');
        if (resultsCard) {
            resultsCard.classList.remove('hidden');

            // Display stats
            await this.displayStats();

            // Display data table
            this.displayDataTable();

            // Scroll to results
            setTimeout(() => {
                resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    }

    async displayStats() {
        try {
            const response = await fetch('/api/analytics/financeiro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: this.currentData })
            });

            const result = await response.json();
            const analysis = result.analysis || {};

            const statsGrid = document.getElementById('statsGrid');
            if (!statsGrid) return;

            statsGrid.innerHTML = `
                <div class="stat-card animate-scale-in">
                    <div class="stat-label">Total de Registros</div>
                    <div class="stat-value">${this.currentData.length}</div>
                </div>
                <div class="stat-card animate-scale-in">
                    <div class="stat-label">Total (R$)</div>
                    <div class="stat-value">R$ ${(analysis.total || 0).toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="stat-card animate-scale-in">
                    <div class="stat-label">Média (R$)</div>
                    <div class="stat-value">R$ ${(analysis.media || 0).toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="stat-card animate-scale-in">
                    <div class="stat-label">Mínimo (R$)</div>
                    <div class="stat-value">R$ ${(analysis.minimo || 0).toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="stat-card animate-scale-in">
                    <div class="stat-label">Máximo (R$)</div>
                    <div class="stat-value">R$ ${(analysis.maximo || 0).toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="stat-card animate-scale-in">
                    <div class="stat-label">Mediana (R$)</div>
                    <div class="stat-value">R$ ${(analysis.mediana || 0).toFixed(2).replace('.', ',')}</div>
                </div>
            `;

            // Add stagger animation
            statsGrid.querySelectorAll('.stat-card').forEach((card, i) => {
                card.style.animationDelay = `${i * 60}ms`;
            });
        } catch (error) {
            console.error('Error displaying stats:', error);
        }
    }

    displayDataTable() {
        const dataTable = document.getElementById('dataTable');
        if (!dataTable) return;

        const data = this.currentData.slice(0, 10);
        const rows = data.map((item, i) => {
            const preview = JSON.stringify(item).substring(0, 50);
            return `
                <div class="table-row stagger-item" style="animation-delay: ${i * 30}ms">
                    <div class="table-cell">#${i + 1}</div>
                    <div class="table-cell">${preview}${preview.length >= 50 ? '...' : ''}</div>
                </div>
            `;
        }).join('');

        dataTable.innerHTML = `
            <div class="table">
                <div class="table-header">
                    <div class="table-cell-header">ID</div>
                    <div class="table-cell-header">Dados</div>
                </div>
                ${rows}
                ${this.currentData.length > 10 ? `<div class="table-footer">+ ${this.currentData.length - 10} mais registros</div>` : ''}
            </div>
        `;
    }

    exportJson() {
        if (!this.currentData || this.currentData.length === 0) {
            this.showStatus('Nenhum dado para exportar', 'error');
            return;
        }

        const dataStr = JSON.stringify(this.currentData, null, 2);
        this.downloadFile(dataStr, `zenfisio-${this.currentDate}.json`, 'application/json');
        this.showStatus('Arquivo JSON exportado com sucesso!', 'success');
    }

    exportCsv() {
        if (!this.currentData || this.currentData.length === 0) {
            this.showStatus('Nenhum dado para exportar', 'error');
            return;
        }

        const keys = Object.keys(this.currentData[0]);
        const csv = [
            keys.join(','),
            ...this.currentData.map(row => 
                keys.map(key => {
                    const val = row[key] || '';
                    return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
                }).join(',')
            )
        ].join('\n');

        this.downloadFile(csv, `zenfisio-${this.currentDate}.csv`, 'text/csv');
        this.showStatus('Arquivo CSV exportado com sucesso!', 'success');
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearInput() {
        document.getElementById('evolucaoTextarea').value = '';
        const resultsCard = document.getElementById('resultsCard');
        if (resultsCard) resultsCard.classList.add('hidden');
        this.currentData = null;
    }

    showStatus(message, type = 'info') {
        // Usa apenas o sistema de notificações flutuante
        if (window.notify) {
            const typeMap = {
                'error': 'error',
                'success': 'success',
                'warning': 'warning',
                'info': 'info'
            };
            window.notify[typeMap[type] || 'info'](message);
        } else {
            console.warn('Sistema de notificações não inicializado:', message);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ZenfisioApp();
});
