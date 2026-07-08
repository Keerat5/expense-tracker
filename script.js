const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const addBtn = document.getElementById("addBtn");

const expenseList = document.getElementById("expenseList");

const total = document.getElementById("total");
const monthTotal = document.getElementById("monthTotal");
const count = document.getElementById("count");

const filterCategory = document.getElementById("filterCategory");

// ===== Chart =====
const expenseChart = document.getElementById("expenseChart");

// ===== Data =====
let chart;

let expenses=JSON.parse(localStorage.getItem("expenses"))||[];

function addExpense(){
    const title=titleInput.value.trim();
    const amount=Number(amountInput.value.trim());
    const category=categoryInput.value;
    const date=dateInput.value;

    if(!title || !amount || !date){
        alert("Please fill all the fields")
        return;
    }

    expenses.push({
        id:Date.now(),
        title,
        amount,
        category,
        date
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    renderExpenses();
    updateSummary();
    clearInputs();
}

function renderExpenses(){
    expenseList.innerHTML="";

    expenses.forEach(expense => {
        const row=document.createElement("tr");

        row.innerHTML=`
        <td>${expense.title}</td>
        <td>${expense.category}</td>
        <td>${expense.amount}</td>
        <td>${expense.date}</td>
        <td>
            <button
                class="edit-btn"
                onclick="editExpenses(${expense.id})">
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteExpense(${expense.id})">
                Delete
            </button>       
        </td>
        `
        expenseList.appendChild(row);
    });
}

function deleteExpense(id){
    expenses=expenses.filter((x) => x.id!==id);

    localStorage.setItem("expenses",JSON.stringify(expenses));

    renderExpenses();
    updateSummary();
}

function editExpenses(id){
    const expense=expenses.find((x)=>x.id===id)

    titleInput.value = expense.title;
    amountInput.value = expense.amount;
    categoryInput.value = expense.category;
    dateInput.value = expense.date;

    deleteExpense(id);

}

function updateSummary(){
    let totalExpense=0;
    let monthlyExpense=0;
    const currentDate = new Date();

    expenses.forEach(expense => {
        totalExpense+=expense.amount;
        const expenseDate=new Date(expense.date);       //String-> new Date()-> Date Object-> Now we can use date methods
        if(
            expenseDate.getMonth() === currentDate.getMonth() &&
            expenseDate.getFullYear() === currentDate.getFullYear()
        ){

            monthlyExpense += expense.amount;

        }

    });
    total.textContent=totalExpense;
    monthTotal.textContent=monthlyExpense;
    count.textContent=expenses.length;

}

function clearInputs(){

    titleInput.value="";
    amountInput.value="";
    categoryInput.selectedIndex=0;
    dateInput.value="";

}

function filterExpenses(){

    const category = filterCategory.value;

    if(category==="All"){

        renderExpenses();

        return;

    }

    const filteredExpenses = expenses.filter(expense=>
        expense.category===category
    );

    expenseList.innerHTML="";

    filteredExpenses.forEach(expense=>{

        const row=document.createElement("tr");

        row.innerHTML=`
        <td>${expense.title}</td>
        <td>${expense.category}</td>
        <td>${expense.amount}</td>
        <td>${expense.date}</td>
        <td>
            <button class="edit-btn" onclick="editExpenses(${expense.id})">Edit</button>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
        </td>
        `;

        expenseList.appendChild(row);

    });

}

filterCategory.addEventListener("change",filterExpenses);

addBtn.addEventListener("click",addExpense);

renderExpenses();
filterExpenses();
updateSummary();
clearInputs();