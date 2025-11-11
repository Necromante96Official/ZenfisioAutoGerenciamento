/**
 * COMO USAR - MODAL FLUTUANTE
 * Gerencia a exibição e interatividade do modal de instruções
 */

class HowToUseModal {
    constructor() {
        this.modal = document.getElementById('howToUseModal');
        this.howToUseBtn = document.getElementById('howToUseBtn');
        this.closeBtn = document.getElementById('closeHowToUse');
        this.init();
    }

    init() {
        if (!this.modal || !this.howToUseBtn) return;
        
        this.howToUseBtn.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());
        
        // Fechar ao clicar fora do modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.howToUseModal = new HowToUseModal();
});
