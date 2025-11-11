class DateManager {
    constructor() {
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.updateDisplay();
        this.setupListeners();
    }

    setupListeners() {
        document.getElementById('prevMonthBtn')?.addEventListener('click', () => this.prevMonth());
        document.getElementById('prevDayBtn')?.addEventListener('click', () => this.prevDay());
        document.getElementById('nextDayBtn')?.addEventListener('click', () => this.nextDay());
        document.getElementById('todayBtn')?.addEventListener('click', () => this.setToday());
    }

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.currentDate.setDate(1);
        this.updateDisplay();
    }

    prevDay() {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.updateDisplay();
    }

    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.updateDisplay();
    }

    setToday() {
        this.currentDate = new Date();
        this.updateDisplay();
    }

    updateDisplay() {
        const day = String(this.currentDate.getDate()).padStart(2, '0');
        const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
        const year = this.currentDate.getFullYear();

        // Update date value
        document.getElementById('dateValue').textContent = `${day}/${month}/${year}`;

        // Update date input
        const dateInput = document.getElementById('dataInput');
        if (dateInput) {
            dateInput.value = `${year}-${month}-${day}`;
        }

        // Update date message
        this.updateDateMessage();
    }

    updateDateMessage() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatted = this.currentDate.toLocaleDateString('pt-BR', options);
        const capitalize = formatted.charAt(0).toUpperCase() + formatted.slice(1);

        const message = document.getElementById('dateMessage');
        if (message) {
            message.innerHTML = `Data selecionada: <strong>${capitalize}</strong><br>Todas as evoluções pendentes serão registradas nesta data.`;
        }
    }

    getDate() {
        return this.currentDate;
    }

    getDateString() {
        const day = String(this.currentDate.getDate()).padStart(2, '0');
        const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
        const year = this.currentDate.getFullYear();
        return `${year}-${month}-${day}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dateManager = new DateManager();
});
