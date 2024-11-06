document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchAwbButton");
    const awbInput = document.getElementById("awbInput");
    const resultContainer = document.getElementById("resultContainer");

    searchButton.addEventListener("click", async function () {
        const awbNumber = awbInput.value;
        if (!awbNumber) {
            alert("Te rog introdu un număr AWB.");
            return;
        }

        // Detalii API Shopify
        const shopUrl = "https://mounique.ro";
        const apiUrl = `${shopUrl}/admin/api/2023-01/orders.json`;
        const token = "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";

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Eroare la preluarea datelor. Verifică token-ul sau permisiunile.");
            }

            const data = await response.json();
            const orders = data.orders;

            // Căutăm comanda care conține numărul AWB specificat
            let foundOrder = null;
            for (const order of orders) {
                for (const fulfillment of order.fulfillments || []) {
                    if (fulfillment.tracking_number === awbNumber) {
                        foundOrder = order;
                        break;
                    }
                }
                if (foundOrder) break;
            }

            // Afișăm rezultatele
            resultContainer.innerHTML = "";
            if (foundOrder) {
                resultContainer.innerHTML = `
                    <h2>Produse pentru comanda AWB ${awbNumber}</h2>
                    <ul>
                        ${foundOrder.line_items.map(item => `<li>${item.title} - Cantitate: ${item.quantity}</li>`).join("")}
                    </ul>
                `;
            } else {
                resultContainer.innerHTML = "<p>Nu am găsit nicio comandă cu acest număr AWB.</p>";
            }
        } catch (error) {
            console.error("Eroare API:", error);
            resultContainer.innerHTML = "<p>Eroare la preluarea datelor. Verifică setările API.</p>";
        }
    });
});
