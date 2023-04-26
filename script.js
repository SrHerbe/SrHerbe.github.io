function procesarDatos() {
    const inputText = document.getElementById("inputText").value;
    const lines = inputText.split("\n");

    let obras = [];
    let i = 7;
    const n = lines.length;

    while (i < n) {
        if (
            lines[i].startsWith("|   ") &&
            lines[i].length >= 9 &&
            lines[i].substring(4, 13).match(/[A-Z0-9]{2,}-[0-9]{4}/)
        ) {
            let obra = {
                numero: `XG.${lines[i].substring(8, 13)}`,
                descripcion: lines[i].substring(13, 62).trim(),
                cliente: lines[i].substring(62, 110).trim(),
                totalCostes: 0,
                facturacionRealEmitida: 0,
                deudoresProduccionFacturable: 0,
            };

            while (!lines[i].startsWith("---") && i < n) {
                if (lines[i].startsWith("|   Total Costes")) {
                    obra.totalCostes = parseFloat(
                        lines[i]
                            .match(/[\d,.]+/g)[2]
                            .replace(".", "")
                            .replace(",", ".")
                    );
                } else if (lines[i].startsWith("|   Facturación Real Emitida")) {
                    obra.facturacionRealEmitida = parseFloat(
                        lines[i]
                            .match(/[\d,.]+/g)[2]
                            .replace(".", "")
                            .replace(",", ".")
                    );
                } else if (
                    lines[i].startsWith("|   Deudores Producción Facturable")
                ) {
                    obra.deudoresProduccionFacturable = parseFloat(
                        lines[i]
                            .match(/[\d,.]+/g)[2]
                            .replace(".", "")
                            .replace(",", ".")
                    );
                }

                i++;
            }

            obras.push(obra);
        } else {
            i++;
        }
    }

    console.log(obras);

    obras.sort((a, b) => {
        const numeroA = parseInt(a.numero.slice(-4));
        const numeroB = parseInt(b.numero.slice(-4));
        return numeroB - numeroA;
    });

    generarTabla(obras);
}

function formatNumber(number) {
    return number
        .toFixed(2)
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " €";
}

function generarTabla(obras) {
    const tbody = document.querySelector("#resultTable tbody");
    tbody.innerHTML = "";

    let totalFacturacionRealEmitida = 0;

    for (const obra of obras) {
        let fila = document.createElement("tr");

        // Número de obra
        let numeroObra = document.createElement("td");
        numeroObra.textContent = obra.numero;
        fila.appendChild(numeroObra);

        // Cliente
        let cliente = document.createElement("td");
        cliente.textContent = obra.cliente;
        fila.appendChild(cliente);

        // Descripción
        let descripcion = document.createElement("td");
        descripcion.textContent = obra.descripcion;
        fila.appendChild(descripcion);

        // Estado
        let estado = document.createElement("td");
        let esCerrado =
            obra.facturacionRealEmitida > 0 &&
            obra.deudoresProduccionFacturable === 0;
        estado.textContent = esCerrado ? "Cerrado" : "En curso";
        fila.appendChild(estado);

        // Coste
        let coste = document.createElement("td");
        coste.textContent = formatNumber(obra.totalCostes);
        fila.appendChild(coste);

        // Facturado
        let importe = document.createElement("td");
        importe.textContent = formatNumber(obra.facturacionRealEmitida);
        fila.appendChild(importe);

        totalFacturacionRealEmitida += obra.facturacionRealEmitida;

        // Aplica la clase 'cerrado' a la fila si el estado es "Cerrado"
        if (esCerrado) {
            fila.classList.add("cerrado");
        }

        tbody.appendChild(fila);
    }

    let filaTotal = document.createElement("tr");

    let celdaTotalTexto = document.createElement("td");
    celdaTotalTexto.colSpan = 5;
    celdaTotalTexto.textContent = "TOTAL Facturación Real Emitida:";
    filaTotal.appendChild(celdaTotalTexto);

    let celdaTotalValor = document.createElement("td");
    celdaTotalValor.textContent = formatNumber(totalFacturacionRealEmitida);
    filaTotal.appendChild(celdaTotalValor);

    tbody.appendChild(filaTotal);
}

function copiarTabla() {
    const range = document.createRange();
    range.selectNode(document.getElementById("resultTable"));

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}
