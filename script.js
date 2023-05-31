const balance = document.querySelector("#balance");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const trans = document.querySelector("#trans");
const form = document.querySelector("#form");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector('#trans-type');
// const sortBy = document.querySelector('#sortBy')

// const today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();
let currentDate = new Date();
let cDay = currentDate.getDate();
let cMonth = currentDate.getMonth() + 1;
let cYear = currentDate.getFullYear();
let d = "<b>" + cDay + "/" + cMonth + "/" + cYear + "</b>";

const localStorageTrans = JSON.parse(localStorage.getItem("trans"));
let transactions = localStorage.getItem("trans") !== null ? localStorageTrans : [];

//Show created transaction
function loadTransactionDetails(transaction) {
    // const sign = transaction.amount < 0 ? "-" : "+";
    const sign = transaction.type == 'expense' ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.type == 'expense' ? "exp" : "inc");
    item.innerHTML = `
    ${transaction.description}
    ${d}
    <span>${sign} ${Math.abs(transaction.amount)}</span>
    <button class="btn-del" onclick="removeTrans(${transaction.id})">x</button>
  `;
    trans.appendChild(item);
    //console.log(transaction);
}

//Remove created transactionsusing the unique id
function removeTrans(id) {
    if (confirm("Are you sure you want to delete Transcation?")) {
        transactions = transactions.filter((transaction) => transaction.id != id);
        config();
        updateLocalStorage();
    } else {
        return;
    }
}

//Update the added transaction to the final amount
function updateAmount() {
    const t = transactions.map((transaction) => transaction);
    const total = t.reduce((acc, item) => {
        if (item.type == 'expense')
            return acc - item.amount
        else
            return acc + item.amount
    }, 0).toFixed(2);
    balance.innerHTML = `₹  ${total}`;

    const income = t
        .filter((item) => item.type == 'income')
        .reduce((acc, item) => (acc += item.amount), 0)
        .toFixed(2);
    inc_amt.innerHTML = `₹  ${income}`;

    const expense = t
        .filter((item) => item.type == 'expense')
        .reduce((acc, item) => (acc += item.amount), 0)
        .toFixed(2);
    exp_amt.innerHTML = `₹  ${Math.abs(expense)}`;
}

//Show every new transaction in the display pane
function config() {
    trans.innerHTML = "";
    transactions.forEach(loadTransactionDetails);
    updateAmount();
}

//function to create new transactions
function addTransaction(e) {
    e.preventDefault();
    if (description.value.trim() == "" || amount.value.trim() == "") {
        alert("Please Enter Description and amount");
    }
    else {
        const transaction = {
            id: uniqueId(),
            description: description.value,
            date: currentDate,
            amount: +amount.value,
            type: type.value
        };
        transactions.push(transaction);
        loadTransactionDetails(transaction);
        description.value = "";
        amount.value = "";
        updateAmount();
        updateLocalStorage();
    }
}

//Define random unique id forevery transaction
function uniqueId() {
    return Math.floor(Math.random() * 10000000);
}

form.addEventListener("submit", addTransaction);

window.addEventListener("load", function () {
    config();
});

//Updating amounts in the local storage
function updateLocalStorage() {
    localStorage.setItem("trans", JSON.stringify(transactions));
}

//Function for sorting the transctions (dropdown)
// function sort() {
//     if (sortBy.value == 'name') {
//         const arr = transactions.map((sort) => sort.description)
//         arr.sort()
//         console.log(arr)
//         loadTransactionDetails(arr)
//     }
// }