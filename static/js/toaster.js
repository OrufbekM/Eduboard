// Toaster Notification System
class Toaster {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create toaster container if it doesn't exist
        if (!document.querySelector('.toaster-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toaster-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toaster-container');
        }
    }

    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Icons for different types
        const icons = {
            error: '❌',
            success: '✅',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${this.escapeHtml(message)}</span>
            <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
        `;

        this.container.appendChild(toast);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        }

        return toast;
    }

    remove(toast) {
        if (toast && toast.parentNode) {
            toast.classList.add('removing');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize toaster
const toaster = new Toaster();

// Make toaster available globally
window.toaster = toaster;
