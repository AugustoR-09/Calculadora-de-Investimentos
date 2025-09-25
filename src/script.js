import { generateReturns } from "./investmentGoals.js";
const form = document.getElementById("myForm");
const clearButton = document.getElementById("clearButton");

function renderProgression(evt) {
	evt.preventDefault();

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

	alert("Executando");
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
