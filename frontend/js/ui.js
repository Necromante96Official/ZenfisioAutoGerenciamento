// UI Helper Functions
class UI {
    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} animate-slide-down`;
        notification.innerHTML = `
            <div class="notification-content">
                ${this.getIcon(type)}
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
        
        return notification;
    }

    static getIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return `<span class="notification-icon">${icons[type] || icons.info}</span>`;
    }

    static formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    static formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    }

    static formatNumber(num) {
        return new Intl.NumberFormat('pt-BR').format(num);
    }

    static showLoading(element) {
        element.classList.add('animate-pulse');
    }

    static hideLoading(element) {
        element.classList.remove('animate-pulse');
    }

    static smoothScroll(element, offset = 100) {
        setTimeout(() => {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            window.scrollBy(0, -offset);
        }, 100);
    }

    static createTable(headers, rows) {
        let html = '<table class="data-table"><thead><tr>';
        
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        
        html += '</tr></thead><tbody>';
        
        rows.forEach((row, i) => {
            html += `<tr class="stagger-item" style="animation-delay: ${i * 20}ms">`;
            Object.values(row).forEach(cell => {
                html += `<td>${cell}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        return html;
    }

    static toggleElement(element, show = true) {
        if (show) {
            element.classList.remove('hidden');
            element.classList.add('animate-slide-down');
        } else {
            element.classList.add('animate-slide-up');
            setTimeout(() => element.classList.add('hidden'), 300);
        }
    }

    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copiado para a área de transferência!', 'success');
        });
    }
}

// Add stylesheet for data tables (notification CSS removed - using notifications.js instead)
const style = document.createElement('style');
style.textContent = `
    .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }

    .data-table th,
    .data-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--border);
    }

    .data-table th {
        background-color: var(--bg-hover);
        font-weight: 600;
        color: var(--text-primary);
    }

    .data-table tr:hover {
        background-color: rgba(74, 158, 255, 0.05);
    }

    @media (max-width: 768px) {
        .data-table {
            font-size: 0.85rem;
        }
    }
`;
document.head.appendChild(style);
