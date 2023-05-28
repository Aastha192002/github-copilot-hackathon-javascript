const balance = document.querySelector("#balance");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const trans = document.querySelector("#trans");
const form = document.querySelector("#form");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
// const today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();
let currentDate = new Date();
let cDay = currentDate.getDate();
let cMonth = currentDate.getMonth() + 1;
let cYear = currentDate.getFullYear();
let d="<b>" + cDay + "/" + cMonth + "/" + cYear + "</b>";

const localStorageTrans = JSON.parse(localStorage.getItem("trans"));
let transactions = localStorage.getItem("trans") !== null ? localStorageTrans : [];

function loadTransactionDetails(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "exp" : "inc");
    item.innerHTML = `
    ${transaction.description}
    ${d}
    <span>${sign} ${Math.abs(transaction.amount)}</span>
    <button class="btn-del" onclick="removeTrans(${transaction.id})">x</button>
  `;
    trans.appendChild(item);
    //console.log(transaction);
}

function removeTrans(id) {
    if (confirm("Are you sure you want to delete this transcation?")) {
        transactions = transactions.filter((transaction) => transaction.id != id);
        config();
        updateLocalStorage();
    } else {
        return;
    }
}

function updateAmount() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    balance.innerHTML = `₹  ${total}`;

    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    inc_amt.innerHTML = `₹  ${income}`;

    const expense = amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    exp_amt.innerHTML = `₹  ${Math.abs(expense)}`;
}
function config() {
    trans.innerHTML = "";
    transactions.forEach(loadTransactionDetails);
    updateAmount();
}

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
        };
        transactions.push(transaction);
        loadTransactionDetails(transaction);
        description.value = "";
        amount.value = "";
        updateAmount();
        updateLocalStorage();
    }
}

function uniqueId() {
    return Math.floor(Math.random() * 10000000);
}

form.addEventListener("submit", addTransaction);

window.addEventListener("load", function () {
    config();
});

function updateLocalStorage() {
    localStorage.setItem("trans", JSON.stringify(transactions));
}
