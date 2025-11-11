/**
 * NOTIFICATIONS.JS
 * Sistema de notificações flutuantes no topo direito da tela
 */

class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
        this.notifications = []; // Array para rastrear notificações ativas
        this.addStyles(); // Adiciona as animações CSS
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
            display: flex;
            flex-direction: column-reverse;
            gap: 20px;
            align-items: flex-end;
            max-width: 450px;
            width: calc(100% - 40px);
            max-height: 90vh;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 10px;
            box-sizing: border-box;
        `;
        document.body.appendChild(container);
        return container;
    }

    addStyles() {
        // Estilos já estão definidos em animations.css
        // Este método existe para garantir compatibilidade
    }

    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Ícones por tipo
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const icon = icons[type] || 'ℹ️';
        
        // Estilos da notificação com melhor espaçamento
        notification.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 12px;
            min-width: 300px;
            max-width: 420px;
            padding: 16px 18px;
            background: ${this.getBackgroundColor(type)};
            color: ${this.getTextColor(type)};
            border: 1px solid ${this.getBorderColor(type)};
            border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
            font-size: 0.95rem;
            font-weight: 500;
            pointer-events: all;
            cursor: pointer;
            word-wrap: break-word;
            overflow-wrap: break-word;
            line-height: 1.5;
            flex-shrink: 0;
            will-change: transform, opacity;
            backface-visibility: hidden;
            -webkit-font-smoothing: antialiased;
            margin: 0;
        `;

        // Cria elemento para o ícone
        const iconSpan = document.createElement('span');
        iconSpan.className = 'notification-icon';
        iconSpan.textContent = icon;
        iconSpan.style.cssText = `
            flex-shrink: 0;
            font-size: 1.2em;
            margin-top: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
        `;

        // Cria elemento para o texto
        const textSpan = document.createElement('span');
        textSpan.className = 'notification-text';
        textSpan.textContent = message;
        textSpan.style.cssText = `
            flex-grow: 1;
            word-break: break-word;
            white-space: normal;
        `;

        // Adiciona ícone e texto à notificação
        notification.appendChild(iconSpan);
        notification.appendChild(textSpan);

        // Adiciona ao container e rastreia
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Auto-remove após duration
        const timeoutId = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        // Click para remover
        notification.addEventListener('click', () => {
            clearTimeout(timeoutId);
            this.removeNotification(notification);
        });

        return notification;
    }

    removeNotification(notification) {
        notification.classList.add('exit');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            // Remove do array de rastreamento
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 350);
    }

    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    getBackgroundColor(type) {
        const colors = {
            success: 'rgba(76, 175, 80, 0.95)',
            error: 'rgba(244, 67, 54, 0.95)',
            warning: 'rgba(255, 193, 7, 0.95)',
            info: 'rgba(47, 190, 143, 0.95)'
        };
        return colors[type] || colors.info;
    }

    getTextColor(type) {
        const colors = {
            success: '#ffffff',
            error: '#ffffff',
            warning: '#000000',
            info: '#ffffff'
        };
        return colors[type] || colors.info;
    }

    getBorderColor(type) {
        const colors = {
            success: 'rgba(76, 175, 80, 0.4)',
            error: 'rgba(244, 67, 54, 0.4)',
            warning: 'rgba(255, 193, 7, 0.4)',
            info: 'rgba(47, 190, 143, 0.4)'
        };
        return colors[type] || colors.info;
    }
}

// Instância global
let notificationSystem;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!notificationSystem) {
            notificationSystem = new NotificationSystem();
            window.notify = notificationSystem;
        }
    });
} else {
    // Já está pronto
    if (!notificationSystem) {
        notificationSystem = new NotificationSystem();
        window.notify = notificationSystem;
    }
}

