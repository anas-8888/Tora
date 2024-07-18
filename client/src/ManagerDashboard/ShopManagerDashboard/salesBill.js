let storeId;
let products = [];
let indexOfProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProductsAndInitializeTable();
    new simpleDatatables.DataTable("#productTable", {
        searchable: false,
        fixedHeight: true,
        paging: false,
        columns: [
            { select: 0, sortable: false },
            { select: 1, sortable: false },
            { select: 2, sortable: false },
            { select: 3, sortable: false },
            { select: 4, sortable: false },
            { select: 5, sortable: false },
        ],
    });
    updateTotalSum();
});

function fetchProductsAndInitializeTable() {
    document.querySelector('#loading').style.display = 'block';
    fetch(`https://d27d-94-47-134-176.ngrok-free.app/all-products/${value}`)
        .then(response => response.json())
        .then(data => {
            storeId = data.store._id;
            const shopCashBox = data.shopCashBox;
            products = data.store.products.map(product => ({
                barcode: product.barcode,
                name: product.name,
                salePrice: product.salePrice,
                originalPrice: product.originalPrice,
                quantity: product.quantity
            }));
            document.querySelector('#loading').style.display = 'none';
        });
}

function printBill() {
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const rows = productTable.getElementsByTagName('tr');
    const newTable = createNewTable(rows);

    const container = createPrintContainer(newTable);

    document.body.appendChild(container);
    addPrintStyles();
    window.print();
    document.body.removeChild(container);
    document.head.removeChild(document.head.lastChild);
}

function createNewTable(rows) {
    const newTable = document.createElement('table');
    newTable.border = '1';
    newTable.style.width = '100%';
    newTable.style.borderCollapse = 'collapse';
    newTable.style.tableLayout = 'fixed';
    newTable.style.fontSize = '9px';
    newTable.style.margin = 'auto';

    const headers = ['#', 'Name', 'Price', 'Quantity', 'Total'];
    const headerRow = newTable.insertRow();
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.style.padding = '8px';
        headerCell.style.textAlign = 'center';
        headerCell.style.width = '20%';
        headerCell.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(headerCell);
    });

    let totalSum = 0;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.querySelector('.name').value) {
            const name = row.querySelector('.name').value;
            const price = row.querySelector('.price').value;
            const quantity = row.querySelector('.quantity').value;
            const total = row.querySelector('.total').value;
            totalSum += parseFloat(total) || 0;

            const newRow = newTable.insertRow();
            const cells = [i + 1, name, price, quantity, total];
            cells.forEach(cellData => {
                const newCell = newRow.insertCell();
                newCell.style.padding = '8px';
                newCell.style.textAlign = 'center';
                newCell.appendChild(document.createTextNode(cellData));
            });
        }
    }

    const footerRow = newTable.insertRow();
    const footerCell = footerRow.insertCell();
    footerCell.colSpan = 4;
    footerCell.style.padding = '8px';
    footerCell.style.textAlign = 'right';
    footerCell.appendChild(document.createTextNode('Total:'));
    const totalCell = footerRow.insertCell();
    totalCell.style.padding = '8px';
    totalCell.style.textAlign = 'center';
    totalCell.appendChild(document.createTextNode(totalSum.toFixed(2)));

    return newTable;
}

function createPrintContainer(newTable) {
    const container = document.createElement('div');
    container.className = 'print-area';

    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    const billId = 'BILL-' + date.getTime();

    const headerDiv = document.createElement('div');
    headerDiv.style.textAlign = 'center';
    headerDiv.style.marginBottom = '20px';
    headerDiv.style.fontWeight = 'bold';
    headerDiv.style.fontSize = '16px';
    headerDiv.appendChild(document.createTextNode('Tora for accounting'));
    headerDiv.appendChild(document.createElement('br'));
    headerDiv.appendChild(document.createTextNode(`Date: ${formattedDate} - Time: ${formattedTime}`));
    headerDiv.appendChild(document.createElement('br'));
    headerDiv.appendChild(document.createTextNode(`Bill ID: ${billId}`));

    container.appendChild(headerDiv);
    container.appendChild(newTable);

    return container;
}

function addPrintStyles() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';
    style.appendChild(document.createTextNode(`
        @page {
            size: auto;
            margin: 10mm;
        }
        body {
            margin: 0;
            padding: 0;
            font-size: 14px;
        }
        table {
            width: 100%;
            page-break-inside: avoid;
        }
        th, td {
            padding: 8px;
        }
    `));
    document.head.appendChild(style);
}

function deleteRow(icon) {
    const row = icon.closest('tr');
    row.remove();
    updateTotalSum();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        const barcodeInput = event.target;
        const barcode = barcodeInput.value;
        let i = 0;
        const product = products.find((p) => {
            if (p.barcode === barcode) {
                return p;
            }
            i++;
        });

        const row = barcodeInput.closest('tr');
        if (product) {
            row.querySelector('.name').value = product.name;
            row.querySelector('.price').value = product.salePrice;
            row.querySelector('.quantity').value = 1;
            row.querySelector('.total').value = (product.salePrice * 1).toFixed(2);
            indexOfProducts.push(i);
        } else {
            showProductNotFoundAlert(row);
            indexOfProducts.push(-1);
        }
        updateTotalSum();
        addNewRow();
    }
}

function showProductNotFoundAlert(row) {
    if (confirm("You haven't this product. Do you want to add it?")) {
        window.location.href = `/manager-dashboard/stores/${storeId}`;
    } else {
        row.remove();
        updateTotalSum();
    }
}

function addNewRow() {
    const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><i class="fas fa-trash trash-icon" onclick="deleteRow(this)"></i></td>
        <td><input type="text" class="barcode form-control" onkeypress="handleKeyPress(event)"></td>
        <td><input type="text" class="name form-control" readonly></td>
        <td><input type="text" class="price form-control" oninput="updateTotal(this)" readonly></td>
        <td><input type="number" class="quantity form-control" oninput="checkQuantity(this)"></td>
        <td><input type="text" class="total form-control" readonly></td>
    `;
    newRow.querySelector('.barcode').focus();
}

function checkQuantity(input) {
    const row = input.closest('tr');
    const quantity = parseFloat(input.value) || 0;
    const name = row.querySelector('.name').value;
    const product = products.find(p => p.name === name);

    if (product && quantity > product.quantity) {
        alert("You haven't this quantity in the store.");
        input.value = product.quantity;
    } else {
        updateTotal(input);
    }
}

function updateTotal(input) {
    const row = input.closest('tr');
    const price = parseFloat(row.querySelector('.price').value) || 0;
    const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
    row.querySelector('.total').value = (price * quantity).toFixed(2);
    updateTotalSum();
}

function updateTotalSum() {
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const rows = productTable.getElementsByTagName('tr');
    let totalSum = 0;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const total = parseFloat(row.querySelector('.total').value) || 0;
        totalSum += total;
    }
    document.getElementById('totalSumDiv').textContent = 'Total: ' + totalSum.toFixed(2);
}

function addWithPrint() {
    if (!validateForm()) {
        return;
    }
    processBill(true);
}

function addWithoutPrint() {
    if (!validateForm()) {
        return;
    }
    processBill(false);
}

function validateForm() {
    const paymentType = document.getElementById('paymentType').value;
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;

    if (paymentType === 'Debt' && (!clientName || !clientPhone)) {
        alert('Client name and phone are required for debt payment type.');
        return false;
    }
    return true;
}

function processBill(withPrint) {
    document.querySelector('#loading').style.display = 'block';
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const rows = productTable.getElementsByTagName('tr');

    const billData = [];
    let totalSum = 0;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const nameInput = row.querySelector('.name');
        if (nameInput && nameInput.value) {
            const name = nameInput.value;
            const barcode = parseFloat(row.querySelector('.barcode').value) || 0;
            const salePrice = parseFloat(row.querySelector('.price').value) || 0;
            const originalPrice = products.find(p => p.name === name)?.originalPrice || 0;
            const quantity = parseInt(row.querySelector('.quantity').value) || 0;
            const total = parseFloat(row.querySelector('.total').value) || 0;
            totalSum += total;

            billData.push({ barcode, name, salePrice, originalPrice, quantity, total });
        }
    }

    const date = new Date();
    const paymentType = document.getElementById('paymentType').value;
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const payload = {
        date: date,
        items: billData,
        totalSum: totalSum.toFixed(2),
        paymentType,
        clientName,
        clientPhone,
        value,
        indexOfProducts
    };

    const postUrl = '/add-sales-bill';
    fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (withPrint) {
            document.querySelector('#loading').style.display = 'none';
            printBill();
        }
        if (response.redirected) {
            window.location.href = response.url;
        }
    });
}
