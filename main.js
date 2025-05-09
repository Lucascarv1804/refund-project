// Inputs do formulário
const expenseForm = document.querySelector(".refund-form");
const inputTitle = document.querySelector("#expense-title");
const inputCategory = document.querySelector("#category");
const inputAmount = document.querySelector("#amount");

// Elementos de saída (output)
const counterDisplay = document.querySelector("aside header p span");
const totalAmountDisplay = document.querySelector("aside header h2");
const expenseListContainer = document.querySelector(".expense-container");

let expenseCount = 0;

// Formatação do input de valor em tempo real
inputAmount.addEventListener("input", () => {
    const numericValue = inputAmount.value.replace(/\D/g, "");
    const formattedValue = Number(numericValue) / 100;
    inputAmount.value = formatCurrencyBRL(formattedValue);
});

// Evento de envio do formulário
expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addExpense(inputTitle.value, inputCategory.value, inputAmount.value);
});

// Evento para remoção de despesa
expenseListContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("ph-x")) {
        const expenseItem = e.target.closest(".expense");
        expenseItem.remove();
        expenseCount--;
        updateSummaryHeader();
    }
});

// Adiciona nova despesa na interface
function addExpense(title, categoryKey, amount) {
    const categories = {
        food: { label: "Alimentação", icon: "ph-fork-knife" },
        accommodation: { label: "Hospedagem", icon: "ph-bed" },
        services: { label: "Serviços", icon: "ph-wrench" },
        transport: { label: "Transporte", icon: "ph-car" },
        others: { label: "Outros", icon: "ph-receipt" },
    };

    const category = categories[categoryKey] || { label: "Indefinido", icon: "ph-question" };

    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");
    expenseItem.innerHTML = `
        <i class="ph-fill ${category.icon}"></i>
        <div class="expense-info">
            <strong>${title}</strong>
            <span>${category.label}</span>
        </div>
        <p class="expense-price"><span class="currency">R$</span>${sanitizeAmount(amount)}</p>
        <i class="ph ph-x"></i>
    `;

    expenseListContainer.appendChild(expenseItem);

    clearForm();
    expenseCount++;
    updateSummaryHeader();
}

// Atualiza o cabeçalho com contagem e valor total
function updateSummaryHeader() {
    const items = expenseListContainer.children;

    counterDisplay.textContent = `${expenseCount} ${items.length === 1 ? 'despesa' : 'despesas'}`;

    let total = 0;

    for (let item of items) {
        const priceElement = item.querySelector(".expense-price");
        const value = parseFloat(
            priceElement.textContent.replace(/[^\d,]/g, "").replace(",", ".")
        );

        if (isNaN(value)) {
            return alert("Erro ao calcular total. Valor inválido.");
        }

        total += value;
    }

    totalAmountDisplay.innerHTML = `
        <h2><span class="currency">R$</span>${formatCurrencyBRL(total).replace("R$", "").trim()}</h2>
    `;
}

// Utilitário: formata número para moeda brasileira
function formatCurrencyBRL(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

// Utilitário: limpa o formulário
function clearForm() {
    inputTitle.value = "";
    inputAmount.value = "";
    inputCategory.value = "";
    inputTitle.focus();
}

// Utilitário: remove "R$" e espaços extras
function sanitizeAmount(amount) {
    return amount.replace("R$", "").trim();
}