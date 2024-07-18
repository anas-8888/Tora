const options1 = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
};
const options2 = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
};

async function getFavoriteData() {
      const managerResponse = await fetch('https://d27d-94-47-134-176.ngrok-free.app/favorite-data');
      return await managerResponse.json();
}

async function loadData(managerData) {
      try {
            const response = await fetch(`https://d27d-94-47-134-176.ngrok-free.app/all-bills2/emp`);
            if (!response.ok) {
                  throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data) {
                  const favoriteBills = managerData.bills.map(bill => bill._id);
                  const logDate = new Date(data.logDate).toLocaleString('en-US', options1);
                  document.querySelector('#logDate').textContent = logDate;
                  document.querySelector('#logDate').style.display = 'block';
                  const tableBody = document.querySelector('#myTable tbody');
                  tableBody.innerHTML = ''; // Clear existing rows (optional)
                  let i = 0;

                  data.bills.forEach(bill => {
                        const isFavorite = favoriteBills.includes(bill._id);
                        const row = document.createElement('tr');
                        row.innerHTML = `
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${i + 1}
                          </div>
                      </td>
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${bill._id}
                          </div>
                      </td>
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${bill.type}
                          </div>
                      </td>
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${bill.paymentType}
                          </div>
                      </td>
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${new Date(bill.date).toLocaleString('en-US', options2)}
                          </div>
                      </td>
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${bill.writerName}
                          </div>
                      </td>
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${bill.clientName || 'Non'}
                          </div>
                      </td>
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${bill.clientPhone || 'Non'}
                          </div>
                      </td>
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${bill.products.length}
                          </div>
                      </td>
                      <td>
                          <div class="d-flex justify-content-center align-items-center">
                              ${bill.total}
                          </div>
                      </td>
                      <td>
                          <a href="#!" data-products='${JSON.stringify(bill.products)}' data-date="${bill.date}" data-id="${bill._id}" title="Show details" class="d-flex justify-content-center align-items-center show-details">
                              <i class='far fa-eye' style="color: blue;"></i>
                          </a>
                      </td>
                      <td>
                          <a href="#!" data-id="${bill._id}" heart-icon="${isFavorite ? 'fas fa-heart' : 'far fa-heart'}" title="${isFavorite ? 'Remove from favorite' : 'Add to favorite'}" class="d-flex justify-content-center align-items-center addToFavorite">
                              <i class='${isFavorite ? 'fas fa-heart' : 'far fa-heart'}' style="color: blue;"></i>
                          </a>
                      </td>
                  `;
                        tableBody.appendChild(row);
                        i++;
                  });
            }
      } catch (error) {
            console.error('Error fetching data:', error);
      }
}

let simpleDatatablesExam;
async function drawTable() {
      const datatablesSimple = document.getElementById('myTable');
      simpleDatatablesExam = new simpleDatatables.DataTable(datatablesSimple, {
            perPage: 5,
            paging: true,
            columns: [
                  {
                        select: 0,
                        sortable: false,
                  },
                  {
                        select: 10,
                        sortable: false,
                  },
                  {
                        select: 11,
                        sortable: false,
                  }
            ],
      });
}

async function go() {
      document.querySelector('#myTableStyle').style.display = 'none';
      document.querySelector('#loading').style.display = 'block';
      const managerData = await getFavoriteData();
      await loadData(managerData);
      await drawTable();
      document.querySelector('#myTableStyle').style.display = 'block';
      document.querySelector('#loading').style.display = 'none';
}

go();

// Function block:
function showProducts(products, date, id) {
      document.getElementById("myModal1").style.display = "block";

      // Setting the date and bill ID
      document.getElementById("billDate").textContent = new Date(date).toLocaleDateString('en-US', options2);
      document.getElementById("billId").textContent = id;

      // Populate the products table
      const tbody = document.getElementById("productsTable").getElementsByTagName('tbody')[0];
      tbody.innerHTML = ""; // Clear any existing rows

      let totalBillAmount = 0;
      let index = 1;
      products.forEach(product => {
            const row = tbody.insertRow();
            const cells = [
                  index,
                  product.name,
                  (product.salePrice || product.originalPrice),
                  product.quantity,
                  (product.salePrice || product.originalPrice) * product.quantity
            ];
            index++;

            cells.forEach(cellData => {
                  const cell = row.insertCell();
                  cell.style.padding = '8px';
                  cell.style.textAlign = 'center';
                  cell.appendChild(document.createTextNode(cellData));
            });

            totalBillAmount += (product.salePrice || product.originalPrice) * product.quantity;
      });

      // Set the total amount in the footer
      document.getElementById("totalBillAmount").textContent = totalBillAmount.toFixed(2);
}

async function toggleFavorite(billId, heartIcon) {
      try {
            const isFavorite = heartIcon == 'fas fa-heart' ? true : false;
            const url = isFavorite ? '/remove-favorite-bill' : '/favorite-bills';
            const method = isFavorite ? 'DELETE' : 'POST';
            document.querySelector('#loading').style.display = 'block';
            const response = await fetch(url, {
                  method: method,
                  headers: {
                        'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                        billId
                  }),
            });

            if (response.redirected) {
                  window.location.href = response.url;
                  return;
            }

            if (!response.ok) {
                  throw new Error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
            }

      } catch (error) {
            console.error(`Error`, error);
      }
}

// Event delegation for dynamic content
document.querySelector('#myTable').addEventListener('click', event => {
      if (event.target.closest('.show-details')) {
            event.preventDefault();
            const link = event.target.closest('.show-details');
            const products = JSON.parse(link.getAttribute('data-products'));
            const date = link.getAttribute('data-date');
            const id = link.getAttribute('data-id');
            showProducts(products, date, id);
      }

      if (event.target.closest('.addToFavorite')) {
            event.preventDefault();
            const link = event.target.closest('.addToFavorite');
            const billId = link.getAttribute('data-id');
            const heartIcon = link.getAttribute('heart-icon');
            toggleFavorite(billId, heartIcon);
      }
});

const closeModalButtons = document.querySelectorAll(".closeModal");
closeModalButtons.forEach((button) => {
      button.addEventListener("click", () => {
            document.getElementById("myModal1").style.display = "none";
      });
});

window.addEventListener("click", (event) => {
      if (event.target === document.getElementById("myModal1")) {
            document.getElementById("myModal1").style.display = "none";
      }
});

document.getElementById('printButton').addEventListener("click", () => {
      const productsTable = document.getElementById("productsTablePrint");
      const originalContents = document.body.innerHTML;
      const printContents = productsTable.outerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to reset the page state
});

document.getElementById('printAllBills').addEventListener("click", () => {
      simpleDatatablesExam.print();
});
