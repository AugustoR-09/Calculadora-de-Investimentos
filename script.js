import { generateReturns } from "./src/investmentGoals.js";
import Chart from "chart.js/auto";
import { createTable } from "./src/table.js";

const finalDistribution = document.getElementById("finalDistribution");
const progression = document.getElementById("progression");
const form = document.getElementById("myForm");
const clearButton = document.getElementById("clearButton");

let resultsChart = {};
let progressionChart = {};

const columnsArray = [
	{
		columnLabel: "Mês",
		accessor: "month",
	},
	{
		columnLabel: "TotalInvestido",
		accessor: "investedAmount",
		format: (value) => formatCurrencyTable(value),
	},
	{
		columnLabel: "Rendimento Mensal",
		accessor: "interestReturns",
		format: (value) => formatCurrencyTable(value),
	},
	{
		columnLabel: "Rendimento Total",
		accessor: "totalInterestReturns",
		format: (value) => formatCurrencyTable(value),
	},
	{
		columnLabel: "Quantia total",
		accessor: "totalAmount",
		format: (value) => formatCurrencyTable(value),
	},
];

function parseCurrency(value) {
	return Number(value.replace(/[R$\s.%]/g, "").replace(",", "."));
}

function formatCurrencyGraph(value) {
	return Number(value.toFixed(2));
}

function formatCurrencyTable(value) {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderProgression(evt) {
	evt.preventDefault();
	resetCharts();
	resetTable();

	if (document.querySelector(".error")) {
		return;
	}

	const startingAmount = parseCurrency(document.getElementById("initialInvestiment").value);
	const aditionalContribution = parseCurrency(
		document.getElementById("additionalContributions").value
	);
	const timeAmount = parseCurrency(document.getElementById("timeAmount").value);
	const timePeriod = document.getElementById("timeAmountPeriod").value;
	const returnRate = parseCurrency(document.getElementById("returnRate").value);
	const returnRatePeriod = document.getElementById("returnRatePeriod").value;
	const profitTax = parseCurrency(document.getElementById("profitTax").value);

	const returnsArray = generateReturns(
		startingAmount,
		timeAmount,
		timePeriod,
		aditionalContribution,
		returnRate,
		returnRatePeriod
	);

	const finalInvestimentObject = returnsArray[returnsArray.length - 1];

	resultsChart = new Chart(finalDistribution, {
		type: "pie",
		data: {
			labels: ["Total investido", "Rendimento", "Imposto"],
			datasets: [
				{
					data: [
						formatCurrencyGraph(finalInvestimentObject.investedAmount),
						formatCurrencyGraph(
							finalInvestimentObject.totalInterestReturns * (1 - profitTax / 100)
						),
						formatCurrencyGraph(
							finalInvestimentObject.totalInterestReturns * (profitTax / 100)
						),
					],
					backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
					hoverOffset: 3,
				},
			],
		},
	});

	progressionChart = new Chart(progression, {
		type: "bar",
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
		data: {
			labels: returnsArray.map((item) => item.month),
			datasets: [
				{
					label: "Total investido",
					data: returnsArray.map((item) => formatCurrencyGraph(item.investedAmount)),
					backgroundColor: "rgb(255, 99, 132)",
				},
				{
					label: "Retorno do investimento",
					data: returnsArray.map((item) => formatCurrencyGraph(item.totalInterestReturns)),
					backgroundColor: "rgb(54, 162, 235)",
				},
			],
		},
	});

	createTable(columnsArray, returnsArray, "tableResults");
}

function resetCharts() {
	if (Object.keys(resultsChart).length !== 0 && Object.keys(progressionChart).length !== 0) {
		resultsChart.destroy();
		progressionChart.destroy();
	}
}

function resetTable() {
	const tableEl = document.getElementById("tableResults");
	tableEl.innerHTML = "";
}

function clearForm() {
	for (const element of form) {
		if (element.tagName === "INPUT" && !element.hasAttribute("disabled")) {
			element.value = "";

			if (element.parentElement.classList.contains("error")) {
				element.parentElement.classList.remove("error");
				element.parentElement.parentElement.querySelector("p").remove();
			}
		}
	}

	resetCharts();
	resetTable();
}

function validateInput(evt) {
	const value = evt.target.value.trim().replace(",", ".");
	const parentElement = evt.target.parentElement;
	const grandParentElement = parentElement.parentElement;

	if (isNaN(value) || value <= 0) {
		if (!parentElement.classList.contains("error")) {
			const errorMessage = document.createElement("p");
			errorMessage.classList.add("text-red-600", "text-sm");
			errorMessage.innerText = "Insira um valor numérico maior que zero";

			parentElement.classList.add("error");
			grandParentElement.appendChild(errorMessage);
		}
	} else if (parentElement.classList.contains("error")) {
		grandParentElement.querySelector("p").remove();
		parentElement.classList.remove("error");
	}
}

for (const element of form) {
	if (element.tagName === "INPUT" && !element.hasAttribute("disabled")) {
		element.addEventListener("blur", validateInput);
	}
}

const mainEl = document.querySelector("main");
const carouselEl = document.getElementById("carousel");
const slideArrowRight = document.getElementById("slide-arrow-right");
const slideArrowLeft = document.getElementById("slide-arrow-left");

slideArrowRight.addEventListener("click", () => {
	carouselEl.scrollBy({ left: mainEl.offsetWidth, behavior: "smooth" });
});

slideArrowLeft.addEventListener("click", () => {
	carouselEl.scrollBy({ left: -mainEl.offsetWidth, behavior: "smooth" });
});

form.addEventListener("submit", renderProgression);
clearButton.addEventListener("click", clearForm);
