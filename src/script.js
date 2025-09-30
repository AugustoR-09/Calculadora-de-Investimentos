import { generateReturns } from "./investmentGoals.js";
import Chart from "chart.js/auto";

const finalDistribution = document.getElementById("finalDistribution");
const progression = document.getElementById("progression");
const form = document.getElementById("myForm");
const clearButton = document.getElementById("clearButton");
let resultsChart = {};
let progressionChart = {};

function formatCurrency(value) {
	return value.toFixed(2);
}

function renderProgression(evt) {
	evt.preventDefault();
	resetCharts();

	if (document.querySelector(".error")) {
		return;
	}

	const startingAmount = Number(document.getElementById("initialInvestiment").value);
	const aditionalContribution = Number(document.getElementById("additionalContributions").value);
	const timeAmount = Number(document.getElementById("timeAmount").value);
	const timePeriod = document.getElementById("timeAmountPeriod").value;
	const returnRate = Number(document.getElementById("returnRate").value);
	const returnRatePeriod = document.getElementById("returnRatePeriod").value;
	const profitTax = Number(document.getElementById("profitTax").value);

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
						formatCurrency(finalInvestimentObject.investedAmount),
						formatCurrency(
							finalInvestimentObject.totalInterestReturns * (1 - profitTax / 100)
						),
						formatCurrency(finalInvestimentObject.totalInterestReturns * (profitTax / 100)),
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
					data: returnsArray.map((item) => formatCurrency(item.investedAmount)),
					backgroundColor: "rgb(255, 99, 132)",
				},
				{
					label: "Retorno do investimento",
					data: returnsArray.map((item) => formatCurrency(item.totalInterestReturns)),
					backgroundColor: "rgb(54, 162, 235)",
				},
			],
		},
	});
}

function resetCharts() {
	if (Object.keys(resultsChart).length !== 0 && Object.keys(progressionChart).length !== 0) {
		resultsChart.destroy();
		progressionChart.destroy();
	}
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
}

function validateInput(evt) {
	const value = evt.target.value.replace(",", ".");
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

form.addEventListener("submit", renderProgression);
clearButton.addEventListener("click", clearForm);
