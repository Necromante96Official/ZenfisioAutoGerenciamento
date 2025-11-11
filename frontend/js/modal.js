class TermsModal {
    constructor() {
        this.modal = document.getElementById('termsModal');
        this.termsBtn = document.getElementById('termsBtn');
        this.closeBtn = document.getElementById('closeTerms');
        this.init();
    }

    init() {
        if (!this.modal || !this.termsBtn) return;
        
        this.termsBtn.addEventListener('click', () => this.open());
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
    window.termsModal = new TermsModal();
});
