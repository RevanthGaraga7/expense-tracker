const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const incomeText = document.getElementById('income-text');
const expenseText = document.getElementById('expense-text');

const localStorageTransactions = JSON.parse(
    localStorage.getItem('transaction')
);

let transaction = localStorage.getItem('transaction') !== null ? localStorageTransactions : [];

function addtransaction(e) {
    e.preventDefault();

    const transactionText = text.value.trim();

    if (transactionText !== "" && !/^[A-Za-z\s]+$/.test(transactionText)) {
        alert("Transaction subject must contain only letters!");
        return;
    }

    if (incomeText.value.trim() !== "") {
        const incomeTransaction = {
            id: generateId(),
            text: transactionText || 'Income',
            amount: +incomeText.value,
            date: new Date().toLocaleString()
        };
        transaction.push(incomeTransaction);
        addTransactionDOM(incomeTransaction);
        updateValues();
        updateLocalStorage();
        incomeText.value = "";
    }
    
    if (expenseText.value.trim() !== "") {
        const expenseTransaction = {
            id: generateId(),
            text: transactionText || 'Expense',
            amount: -expenseText.value,
            date: new Date().toLocaleString()
        };
        transaction.push(expenseTransaction);
        addTransactionDOM(expenseTransaction);
        updateValues();
        updateLocalStorage();
        expenseText.value = "";
    }
    
    text.value = '';
}

function generateId() {
    return Math.floor(Math.random() * 10000000);
}

function addTransactionDOM(transactionItem) {
    const sign = transactionItem.amount < 0 ? '-' : '+';
    const date = transactionItem.date || '';

    const item = document.createElement('li');
    item.classList.add(transactionItem.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transactionItem.text} <span>${sign}${Math.abs(transactionItem.amount)}</span>
        <small>${date}</small>
        <button class="delete-btn" onclick="removeTransaction(${transactionItem.id})">x</button>
    `;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transaction.map(t => t.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

function updateLocalStorage() {
    localStorage.setItem('transaction', JSON.stringify(transaction));
}

function removeTransaction(id) {
    transaction = transaction.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

function init() {
    list.innerHTML = '';
    transaction.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit', function(e) {
    e.preventDefault();

    addtransaction(e);

    incomeText.value = '';
    expenseText.value = '';
    text.value = '';
});

// Reset Button Functionality
const resetBtn = document.getElementById('reset-btn');

if (resetBtn) {
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all transactions? This will clear your balance and transaction history.')) {
            transaction = [];
            localStorage.removeItem('transaction');
            init();
        }
    });
}

// History Button Functionality
const historyBtn = document.getElementById('history-btn');
const historyModal = document.getElementById('history-modal');
const closeHistory = document.getElementById('close-history');
const historyBody = document.getElementById('history-body');

if (historyBtn && historyModal) {
    historyBtn.addEventListener('click', function() {
        historyBody.innerHTML = '';
        
        transaction.forEach(t => {
            const row = document.createElement('tr');
            const credit = t.amount > 0 ? '$' + t.amount : '-';
            const debit = t.amount < 0 ? '$' + Math.abs(t.amount) : '-';
            
            row.innerHTML = `
                <td>${t.text}</td>
                <td>${credit}</td>
                <td>${debit}</td>
            `;
            historyBody.appendChild(row);
        });
        
        historyModal.style.display = 'block';
    });
    
    if (closeHistory) {
        closeHistory.addEventListener('click', function() {
            historyModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === historyModal) {
            historyModal.style.display = 'none';
        }
    });
}
