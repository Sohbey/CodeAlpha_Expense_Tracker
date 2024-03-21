// Initialize variables
let expenses = [];
let totalAmount = 0;

// DOM elements
const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const editFormContainer = document.getElementById('edit-form-container');
const editCategoryInput = document.getElementById('edit-category');
const editAmountInput = document.getElementById('edit-amount');
const editDateInput = document.getElementById('edit-date');
const saveEditBtn = document.getElementById('save-edit-btn');

// Function to load expenses and total amount from local storage
function loadExpenses() {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses'));
    if (storedExpenses) {
        expenses = storedExpenses;
        totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
        totalAmountCell.textContent = totalAmount; // Update total amount display
    }
}

// Function to save expenses and total amount to local storage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('totalAmount', totalAmount);
}

// Load expenses and total amount from local storage when the page loads
loadExpenses();

// Function to add an expense
function addExpense(category, amount, date) {
    if (category === '' || isNaN(amount) || amount <= 0 || date === '') {
        alert('Please enter valid information.');
        return;
    }

    // Add expense to the array
    expenses.push({ category, amount, date });
    // Update total amount
    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    // Save expenses to local storage
    saveExpenses();
    // Render the new expense
    renderExpense(expenses.length - 1);
}

// Function to render a single expense
function renderExpense(index) {
    const expense = expenses[index];

    const newRow = expenseTableBody.insertRow();

    // Create cells for each column
    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const editCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    // Fill cells with data
    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;

    // Add edit and delete buttons
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', function () {
        showEditForm(index);
    });
    editCell.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function () {
        deleteExpense(index);
    });
    deleteCell.appendChild(deleteBtn);
}

// Function to edit an expense
function editExpense(index) {
    const newCategory = editCategoryInput.value;
    const newAmount = Number(editAmountInput.value);
    const newDate = editDateInput.value;

    if (newCategory === '' || isNaN(newAmount) || newAmount <= 0 || newDate === '') {
        alert('Please enter valid information.');
        return;
    }

    // Calculate the difference in amount for updating the total
    const oldAmount = expenses[index].amount;
    totalAmount = totalAmount - oldAmount + newAmount;
    totalAmountCell.textContent = totalAmount;

    // Update the expense
    expenses[index] = { category: newCategory, amount: newAmount, date: newDate };
    // Save expenses to local storage
    saveExpenses();
    // Clear the table and render expenses
    clearTable();
    expenses.forEach((_, i) => renderExpense(i));

    // Hide the edit form after saving
    editFormContainer.style.display = 'none';
}

// Function to delete an expense
function deleteExpense(index) {
    const deletedAmount = expenses[index].amount;
    totalAmount -= deletedAmount;
    totalAmountCell.textContent = totalAmount;

    expenses.splice(index, 1);
    // Save expenses to local storage
    saveExpenses();
    // Clear the table and render expenses
    clearTable();
    expenses.forEach((_, i) => renderExpense(i));
}

// Function to clear the expense table
function clearTable() {
    while (expenseTableBody.firstChild) {
        expenseTableBody.removeChild(expenseTableBody.firstChild);
    }
}

// Function to show the edit form for an expense
function showEditForm(index) {
    const expense = expenses[index];
    editCategoryInput.value = expense.category;
    editAmountInput.value = expense.amount;
    editDateInput.value = expense.date;
    saveEditBtn.onclick = function () {
        editExpense(index);
    };
    editFormContainer.style.display = 'block';
}

// Event listener for adding an expense
addBtn.addEventListener('click', function () {
    addExpense(categorySelect.value, Number(amountInput.value), dateInput.value);
});

// Populate existing expenses
expenses.forEach((_, i) => renderExpense(i));
