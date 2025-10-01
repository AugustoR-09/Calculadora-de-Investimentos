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

function createTable(columns, data, tableId = undefined, formatFunction = () => {}) {
	if (!isValidArray(columns) || !isValidArray(data) || !tableId) {
		throw new Error("Dados incompletos para a criação da tabela");
	}

	const myTable = document.getElementById(tableId);
	if (!myTable || myTable.nodeName !== "TABLE") {
		throw new Error("Elemento de tabela não encontrado");
	}
}
