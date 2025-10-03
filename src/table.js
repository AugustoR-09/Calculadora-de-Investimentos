// Regras:
// 1. Deve usar o tailwindcss
// 2. Deve ter um elemento table
// 3. Deve ter 2 arrays,
//    3.1 Um array de dados
//    3.2 Outro com objetos que caracterizam as colunas
//    3.3 Pode receber uma função de formatação para os dados

function isValidArray(arr) {
	return Array.isArray(arr) && arr.length > 0;
}

export function createTable(columns, data, tableId = undefined) {
	if (!isValidArray(columns) || !isValidArray(data) || !tableId) {
		throw new Error("Dados incompletos para a criação da tabela");
	}

	const myTable = document.getElementById(tableId);
	if (!myTable || myTable.nodeName !== "TABLE") {
		throw new Error("Elemento de tabela não encontrado");
	}

	createTableHeader(myTable, columns);
	createTableBody(myTable, data, columns);
}

function createTableHeader(tableElement, columnsArray) {
	function createTheadElement(tableElement) {
		const thead = document.createElement("thead");
		tableElement.appendChild(thead);
		return thead;
	}
	const tableHeader = document.querySelector("thead") ?? createTheadElement(tableElement);
	const tr = document.createElement("tr");
	for (const columnObject of columnsArray) {
		const th = /*html*/ `<th class="text-center" >${columnObject.columnLabel}</th>`;
		tr.innerHTML += th;
	}

	tableHeader.appendChild(tr);
}

function createTableBody(tableElement, tableItems, columnArray) {
	function createTbodyElement(tableElement) {
		const tbody = document.createElement("tbody");
		tableElement.appendChild(tbody);
		return tbody;
	}
	const tbody = document.querySelector("tbody") ?? createTbodyElement(tableElement);

	for (const [itemIndex, item] of tableItems.entries()) {
		const tr = document.createElement("tr");

		for (const columnObject of columnArray) {
			const formatFn = columnObject.format ?? ((value) => value);
			tr.innerHTML += /*html*/ `<td class="text-center">${formatFn(
				item[columnObject.accessor]
			)}</td>`;
		}

		tbody.appendChild(tr);
	}
}
