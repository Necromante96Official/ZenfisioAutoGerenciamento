/**
 * Confirmation Modal - Modal flutuante para confirmações
 * Substitui o confirm() do navegador com modal customizado
 */

class ConfirmationModal {
    constructor() {
        this.modal = null;
        this.callback = null;
        this.createModal();
    }

    /**
     * Cria a estrutura do modal
     */
    createModal() {
        // Verifica se já existe
        if (document.getElementById('confirmationModal')) {
            this.modal = document.getElementById('confirmationModal');
            return;
        }

        // Cria overlay
        const overlay = document.createElement('div');
        overlay.id = 'confirmationOverlay';
        overlay.className = 'confirmation-overlay';

        // Cria modal
        const modal = document.createElement('div');
        modal.id = 'confirmationModal';
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-header">
                    <h3 id="confirmationTitle">Confirmar Ação</h3>
                    <button class="confirmation-close" id="confirmationClose">✕</button>
                </div>
                
                <div class="confirmation-body">
                    <div class="confirmation-icon" id="confirmationIcon">⚠️</div>
                    <p id="confirmationMessage">Tem certeza que deseja continuar?</p>
                    <div class="confirmation-details" id="confirmationDetails"></div>
                </div>
                
                <div class="confirmation-footer">
                    <button id="confirmationCancel" class="confirmation-btn confirmation-btn-secondary">
                        ❌ Cancelar
                    </button>
                    <button id="confirmationConfirm" class="confirmation-btn confirmation-btn-danger">
                        ✓ Confirmar
                    </button>
                </div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        this.modal = modal;
        this.overlay = overlay;

        this.setupEventListeners();
        this.addStyles();
    }

    /**
     * Setup dos event listeners
     */
    setupEventListeners() {
        const confirmBtn = document.getElementById('confirmationConfirm');
        const cancelBtn = document.getElementById('confirmationCancel');
        const closeBtn = document.getElementById('confirmationClose');

        confirmBtn.addEventListener('click', () => this.confirm());
        cancelBtn.addEventListener('click', () => this.cancel());
        closeBtn.addEventListener('click', () => this.cancel());

        // Fechar ao clicar no overlay
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.cancel();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.cancel();
            }
        });
    }

    /**
     * Mostra o modal com mensagem customizada
     */
    show(title, message, details = [], options = {}) {
        return new Promise((resolve) => {
            this.callback = resolve;

            // Define título
            document.getElementById('confirmationTitle').textContent = title;

            // Define mensagem
            document.getElementById('confirmationMessage').textContent = message;

            // Define ícone
            const icon = options.icon || '⚠️';
            document.getElementById('confirmationIcon').textContent = icon;

            // Define detalhes
            const detailsContainer = document.getElementById('confirmationDetails');
            if (details.length > 0) {
                detailsContainer.innerHTML = `
                    <div class="confirmation-list">
                        ${details.map(d => `<div class="confirmation-item">✓ ${d}</div>`).join('')}
                    </div>
                `;
            } else {
                detailsContainer.innerHTML = '';
            }

            // Define cor do botão confirmação
            const confirmBtn = document.getElementById('confirmationConfirm');
            confirmBtn.className = 'confirmation-btn confirmation-btn-danger';
            if (options.dangerLevel === 'low') {
                confirmBtn.className = 'confirmation-btn confirmation-btn-primary';
            }

            // Mostra modal
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus no botão confirmação
            setTimeout(() => confirmBtn.focus(), 100);
        });
    }

    /**
     * Confirma a ação
     */
    confirm() {
        if (this.callback) {
            this.callback(true);
        }
        this.hide();
    }

    /**
     * Cancela a ação
     */
    cancel() {
        if (this.callback) {
            this.callback(false);
        }
        this.hide();
    }

    /**
     * Esconde o modal
     */
    hide() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.callback = null;
    }

    /**
     * Adiciona estilos CSS ao document
     */
    addStyles() {
        // Verifica se estilos já foram adicionados
        if (document.getElementById('confirmationModalStyles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'confirmationModalStyles';
        style.innerHTML = `
            /* Confirmation Modal Overlay */
            .confirmation-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease;
            }

            .confirmation-overlay.active {
                background: rgba(0, 0, 0, 0.5);
                opacity: 1;
                pointer-events: auto;
            }

            /* Confirmation Modal */
            .confirmation-modal {
                background: var(--bg-primary, #ffffff);
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                width: 90%;
                animation: slideInUp 0.3s ease;
                border: 2px solid var(--accent-primary, #2fbe8f);
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Modal Content */
            .confirmation-content {
                display: flex;
                flex-direction: column;
                padding: 0;
            }

            /* Modal Header */
            .confirmation-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid rgba(47, 190, 143, 0.1);
                background: linear-gradient(135deg, rgba(47, 190, 143, 0.05), rgba(47, 190, 143, 0.02));
            }

            .confirmation-header h3 {
                margin: 0;
                font-size: 1.3rem;
                color: var(--text-primary, #222);
                font-weight: 600;
            }

            .confirmation-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary, #666);
                transition: all 0.2s;
                padding: 0.5rem;
                border-radius: 8px;
            }

            .confirmation-close:hover {
                background: rgba(47, 190, 143, 0.1);
                color: var(--accent-primary, #2fbe8f);
                transform: rotate(90deg);
            }

            /* Modal Body */
            .confirmation-body {
                padding: 2rem;
                text-align: center;
                min-height: 150px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 1rem;
            }

            .confirmation-icon {
                font-size: 3rem;
                margin-bottom: 0.5rem;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            #confirmationMessage {
                font-size: 1.1rem;
                color: var(--text-primary, #222);
                margin: 0;
                font-weight: 500;
            }

            /* Details List */
            .confirmation-details {
                margin-top: 1rem;
                text-align: left;
            }

            .confirmation-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                background: rgba(47, 190, 143, 0.08);
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid var(--accent-primary, #2fbe8f);
            }

            .confirmation-item {
                font-size: 0.95rem;
                color: var(--text-secondary, #555);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .confirmation-item::first-letter {
                color: var(--accent-primary, #2fbe8f);
            }

            /* Modal Footer */
            .confirmation-footer {
                display: flex;
                gap: 1rem;
                padding: 1.5rem;
                border-top: 1px solid rgba(47, 190, 143, 0.1);
                justify-content: flex-end;
            }

            /* Buttons */
            .confirmation-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-size: 0.95rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 140px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .confirmation-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .confirmation-btn:active {
                transform: translateY(0);
            }

            .confirmation-btn-secondary {
                background: var(--bg-secondary, #f5f5f5);
                color: var(--text-primary, #222);
                border: 2px solid var(--text-secondary, #ccc);
            }

            .confirmation-btn-secondary:hover {
                background: var(--bg-secondary, #eee);
                border-color: var(--text-primary, #222);
            }

            .confirmation-btn-primary {
                background: var(--accent-primary, #2fbe8f);
                color: white;
            }

            .confirmation-btn-primary:hover {
                background: #29a86f;
                box-shadow: 0 4px 12px rgba(47, 190, 143, 0.3);
            }

            .confirmation-btn-danger {
                background: #dc3545;
                color: white;
            }

            .confirmation-btn-danger:hover {
                background: #c82333;
                box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
            }

            .confirmation-btn:focus {
                outline: 2px solid var(--accent-primary, #2fbe8f);
                outline-offset: 2px;
            }

            /* Responsivo */
            @media (max-width: 600px) {
                .confirmation-modal {
                    width: 95%;
                }

                .confirmation-header {
                    padding: 1.2rem;
                }

                .confirmation-body {
                    padding: 1.5rem;
                }

                .confirmation-footer {
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .confirmation-btn {
                    min-width: unset;
                    width: 100%;
                }

                .confirmation-icon {
                    font-size: 2.5rem;
                }

                #confirmationMessage {
                    font-size: 1rem;
                }
            }

            /* Dark Theme Support */
            @media (prefers-color-scheme: dark) {
                .confirmation-modal {
                    background: #1a1a1a;
                    border-color: rgba(47, 190, 143, 0.3);
                }

                .confirmation-header {
                    background: linear-gradient(135deg, rgba(47, 190, 143, 0.1), rgba(47, 190, 143, 0.05));
                    border-bottom-color: rgba(47, 190, 143, 0.2);
                }

                .confirmation-header h3 {
                    color: #fff;
                }

                .confirmation-close {
                    color: #aaa;
                }

                .confirmation-close:hover {
                    background: rgba(47, 190, 143, 0.15);
                    color: #2fbe8f;
                }

                #confirmationMessage {
                    color: #ddd;
                }

                .confirmation-btn-secondary {
                    background: #2a2a2a;
                    color: #ddd;
                    border-color: #555;
                }

                .confirmation-btn-secondary:hover {
                    background: #333;
                    border-color: #777;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Instância global
let confirmationModal;

document.addEventListener('DOMContentLoaded', () => {
    confirmationModal = new ConfirmationModal();
    window.confirmationModal = confirmationModal;
    console.log('✅ ConfirmationModal inicializado');
});
