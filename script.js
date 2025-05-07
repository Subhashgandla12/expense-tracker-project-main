class ExpenseTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.form = document.getElementById('transaction-form');
        this.transactionList = document.getElementById('transaction-list');
        
        this.initializeEventListeners();
        this.updateUI();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });
    }

    addTransaction() {
        const transaction = {
            id: Date.now(),
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            type: document.getElementById('type').value,
            category: document.getElementById('category').value,
            date: document.getElementById('date').value
        };

        this.transactions.push(transaction);
        this.saveToLocalStorage();
        this.updateUI();
        this.form.reset();
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.updateUI();
    }

    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    calculateTotals() {
        let income = 0;
        let expenses = 0;

        this.transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                income += transaction.amount;
            } else {
                expenses += transaction.amount;
            }
        });

        return {
            income,
            expenses,
            balance: income - expenses
        };
    }

    updateUI() {
        const { income, expenses, balance } = this.calculateTotals();
        
        document.getElementById('total-income').textContent = `₹${income.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `₹${expenses.toFixed(2)}`;
        document.getElementById('balance').textContent = `₹${balance.toFixed(2)}`;
        
        this.renderTransactionList();
    }

    renderTransactionList() {
        this.transactionList.innerHTML = '';
        
        this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
            .forEach(transaction => {
                const element = document.createElement('div');
                element.classList.add('transaction-item');
                
                element.innerHTML = `
                    <div>
                        <strong>${transaction.description}</strong>
                        <span class="category-tag">${transaction.category}</span>
                        <br>
                        <small>${transaction.date}</small>
                    </div>
                    <span style="color: ${transaction.type === 'income' ? 'green' : 'red'}">
                        ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
                    </span>
                    <button onclick="expenseTracker.deleteTransaction(${transaction.id})">Delete</button>
                `;
                
                this.transactionList.appendChild(element);
            });
    }
}

const expenseTracker = new ExpenseTracker();
