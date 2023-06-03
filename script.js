const balance = document.querySelector("#balance");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const trans = document.querySelector("#trans");
const form = document.querySelector("#form");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#trans-type");
const sortBy = document.querySelector("#sortBy");
const chartContainer = document.querySelector(".chart-container");
let chart;

// Retrieve transactions from localStorage or initialize an empty array
const localStorageTrans = JSON.parse(localStorage.getItem("trans"));
let transactions = localStorage.getItem("trans") !== null ? localStorageTrans : [];

// Function to create and update the waterfall chart
function createChart() {
    if (chart) {
        chart.destroy();
    }

    const labels = transactions.map((transaction) => transaction.description);
    const amounts = transactions.map((transaction) => transaction.amount);
    const backgroundColors = transactions.map((transaction) =>
        transaction.type === "income" ? "rgba(75, 192, 192, 0.8)" : "rgba(255, 99, 132, 0.8)"
    );

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Transactions",
                data: amounts,
                backgroundColor: backgroundColors,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                label: "Transaction"
            },
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const transaction = transactions[context.dataIndex];
                        return `${transaction.description}: ₹ ${transaction.amount}`;
                    },
                },
            },
        },
    };

    chart = new Chart("chart", {
        type: "line",
        data: data,
        options: options,
    });
}

// Show created transaction
function loadTransactionDetails(transaction) {
    const sign = transaction.type === "expense" ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.type === "expense" ? "exp" : "inc");
    item.innerHTML = `
    ${transaction.description}
    <span>${sign} ${Math.abs(transaction.amount)}</span>
    <button class="btn-del" onclick="removeTrans(${transaction.id})">x</button>
  `;
    trans.appendChild(item);

    createChart();
    updateAmount();
}

// Remove created transactions using the unique id
function removeTrans(id) {
    if (confirm("Are you sure you want to delete this transaction?")) {
        transactions = transactions.filter((transaction) => transaction.id != id);
        config();
        updateLocalStorage();
    } else {
        return;
    }
}

// Update the added transaction to the final amount
function updateAmount() {
    const t = transactions.map((transaction) => transaction);
    const total = t.reduce((acc, item) => {
        if (item.type == "expense") return acc - item.amount;
        else return acc + item.amount;
    }, 0).toFixed(2);
    balance.innerHTML = `₹  ${total}`;

    const income = t
        .filter((item) => item.type == "income")
        .reduce((acc, item) => (acc += item.amount), 0)
        .toFixed(2);
    inc_amt.innerHTML = `₹  ${income}`;

    const expense = t
        .filter((item) => item.type == "expense")
        .reduce((acc, item) => (acc += item.amount), 0)
        .toFixed(2);
    exp_amt.innerHTML = `₹  ${Math.abs(expense)}`;
}

// Show every new transaction in the display pane
function config() {
    trans.innerHTML = "";
    transactions.forEach(loadTransactionDetails);
}

// Function to create new transactions
function addTransaction(e) {
    e.preventDefault();
    if (
        description.value.trim() == "" ||
        amount.value.trim() == "" ||
        type.value.trim() == ""
    ) {
        alert("Please enter all the fields");
    } else {
        const transaction = {
            id: uniqueId(),
            description: description.value,
            amount: +amount.value,
            type: type.value,
        };
        transactions.push(transaction);
        loadTransactionDetails(transaction);
        description.value = "";
        amount.value = "";
        type.value = "";
        updateLocalStorage();
    }
}

// Define random unique id for every transaction
function uniqueId() {
    return Math.floor(Math.random() * 10000000);
}

form.addEventListener("submit", addTransaction);

window.addEventListener("load", function () {
    config();
});

// Updating amounts in the local storage
function updateLocalStorage() {
    localStorage.setItem("trans", JSON.stringify(transactions));
}

// Function for sorting the transactions (dropdown)
function sort() {
    // Function to compare array object values by name
    function compareByName(a, b) {
        const name1 = a.description.toUpperCase();
        const name2 = b.description.toUpperCase();

        let comparison = 0;

        if (name1 > name2) {
            comparison = 1;
        } else if (name1 < name2) {
            comparison = -1;
        }
        return comparison;
    }

    // Function to compare array object value by date
    function compareByDate(a, b) {
        const date1 = new Date(a.date);
        const date2 = new Date(b.date);

        return date1 - date2;
    }

    // Function to compare array object by transaction type
    function compareByType(a, b) {
        const type1 = a.type;
        const type2 = b.type;

        let comparison = 0;

        if (type1 === "income" && type2 === "expense") comparison = -1;
        else if (type1 === "expense" && type2 === "income") comparison = 1;

        return comparison;
    }

    // Common Code
    const arr = transactions.map((sort) => sort);

    // Check for the case where no value is selected
    if (sortBy.value === "") alert("Please select the required sorting");

    // Sorting by name
    else if (sortBy.value === "name") arr.sort(compareByName);

    // Sorting by date
    else if (sortBy.value === "date") arr.sort(compareByDate);

    // Sorting by transaction type
    else if (sortBy.value === "type") arr.sort(compareByType);

    transactions = arr;

    config();
    updateLocalStorage();

    sortBy.value = "";
}