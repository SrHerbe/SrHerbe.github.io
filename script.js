function processText() {
    const inputText = document.getElementById("inputText").value;
    const lines = inputText.split("\n");
    const projects = [];
    let currentProject = null;

    lines.forEach((line) => {
        const tokens = line.split("\t");
        if (
            tokens.length > 1 &&
            /^\d/.test(tokens[1]) &&
            tokens[1].length === 9
        ) {
            if (currentProject) {
                projects.push(currentProject);
            }
            const projectNumber = tokens[1].replace(/^[A-Z0-9]{4}-/, "XG.");
            currentProject = { obra: projectNumber };
        } else if (currentProject) {
            if (line.includes("Real Emitida")) {
                currentProject.facturacionRealEmitida = parseFloat(
                    line.split("\t").pop().replace(".", "").replace(",", ".")
                );
            } else if (line.includes("Deudores")) {
                currentProject.deudoresProduccionFacturable = parseFloat(
                    line.split("\t").pop().replace(".", "").replace(",", ".")
                );
            }
        }
    });

    if (currentProject) {
        projects.push(currentProject);
    }

    // Ordenar proyectos por número de obra
    projects.sort((a, b) => {
        const numA = parseInt(a.obra.split(".")[1], 10);
        const numB = parseInt(b.obra.split(".")[1], 10);
        return numA - numB;
    });

    createTable(projects);
}

function createTable(projects) {
    const output = document.getElementById("output");
    output.innerHTML = "";

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    const obraHeader = document.createElement("th");
    obraHeader.textContent = "Obra";
    headerRow.appendChild(obraHeader);

    const statusHeader = document.createElement("th");
    statusHeader.textContent = "Estado";
    headerRow.appendChild(statusHeader);

    // Agregar nueva columna "Importe"
    const importeHeader = document.createElement("th");
    importeHeader.textContent = "Importe";
    headerRow.appendChild(importeHeader);

    table.appendChild(headerRow);

    projects.forEach((project) => {
        const row = document.createElement("tr");
        const obraCell = document.createElement("td");
        const statusCell = document.createElement("td");
        const importeCell = document.createElement("td");

        obraCell.textContent = project.obra;

        if (
            project.facturacionRealEmitida > 0 &&
            project.deudoresProduccionFacturable === 0
        ) {
            statusCell.textContent = "FACTURADO";
            row.classList.add("facturado");

            // Mostrar importe solo si la obra está facturada
            importeCell.textContent = project.facturacionRealEmitida.toFixed(2)+" €";
        } else {
            statusCell.textContent = "NO FACTURADO";
            row.classList.add("no-facturado");

            // Dejar la celda vacía si la obra no está facturada
            importeCell.textContent = "";
        }

        row.appendChild(obraCell);
        row.appendChild(statusCell);
        row.appendChild(importeCell); // Agregar la celda "Importe" a la fila
        table.appendChild(row);
    });

    output.appendChild(table);
}
