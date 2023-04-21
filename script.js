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
                facturacionRealEmitida: 0,
                deudoresProduccionFacturable: 0,
            };

            while (!lines[i].startsWith("---") && i < n) {
                if (lines[i].startsWith("|   Facturación Real Emitida")) {
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

function generarTabla(obras) {
    const tbody = document.querySelector("#resultTable tbody");
    tbody.innerHTML = "";

    let totalFacturacionRealEmitida = 0;

    for (const obra of obras) {
        let fila = document.createElement("tr");

        let numeroObra = document.createElement("td");
        numeroObra.textContent = obra.numero;
        fila.appendChild(numeroObra);

        let estado = document.createElement("td");
        let esFacturado =
            obra.facturacionRealEmitida > 0 &&
            obra.deudoresProduccionFacturable === 0;
        estado.textContent = esFacturado ? "Facturado" : "No Facturado";
        fila.appendChild(estado);

        if (esFacturado) {
            fila.classList.add("facturado");
            let importe = document.createElement("td");
            importe.textContent = obra.facturacionRealEmitida.toFixed(2)+ " €";
            fila.appendChild(importe);

            totalFacturacionRealEmitida += obra.facturacionRealEmitida;
        }

        tbody.appendChild(fila);
    }

    let filaTotal = document.createElement("tr");

    let celdaTotalTexto = document.createElement("td");
    celdaTotalTexto.colSpan = 2;
    celdaTotalTexto.textContent = "TOTAL Facturación Real Emitida:";
    filaTotal.appendChild(celdaTotalTexto);

    let celdaTotalValor = document.createElement("td");
    celdaTotalValor.textContent = totalFacturacionRealEmitida.toFixed(2);
    filaTotal.appendChild(celdaTotalValor);

    tbody.appendChild(filaTotal);
}
