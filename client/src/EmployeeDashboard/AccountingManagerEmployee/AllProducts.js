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

let storeId;
async function loadData() {
      try {
            const response = await fetch(`https://d27d-94-47-134-176.ngrok-free.app/stores-info/emp`);
            if (!response.ok) {
                  throw new Error(`Network response was not ok (status ${response.status})`);
            }
            const data = await response.json();

            const logDate = new Date(data.logDate).toLocaleString('en-US', options1);
            document.querySelector('#logDate').textContent = logDate;
            document.querySelector('#logDate').style.display = 'block';

            document.querySelector('#storeName').textContent = data.name + ' store,';
            document.querySelector('#storeName').style.display = 'block';
            document.querySelector('#storeLocation').textContent = data.location;
            document.querySelector('#storeLocation').style.display = 'block';

            const products = data.products;
            storeId = data.storeId;
            const tableBody = document.querySelector('#myTable tbody');
            let i = 0;

            products.forEach(product => {
                  const row = document.createElement('tr');
                  row.innerHTML = `
                  <td>
                        <div class="d-flex justify-content-center align-items-center">
                              ${i + 1}
                        </div>
                  </td>
                  <td>
                        <div class="d-flex justify-content-center align-items-center">
                              ${product.barcode}
                        </div>
                  </td>
                  <td>
                        <div class="d-flex justify-content-center align-items-center">
                              ${product.name}
                        </div>
                  </td>
                  <td>
                        <div class="d-flex justify-content-center align-items-center">
                              ${product.originalPrice}
                        </div>
                  </td>
                  <td>
                        <div class="d-flex justify-content-center align-items-center">
                              ${product.salePrice}
                        </div>
                  </td>
                  <td>
                        <div class="d-flex justify-content-center align-items-center">
                              ${product.quantity}
                        </div>
                  </td>
                  <td>

                        <div class="d-flex justify-content-center align-items-center">
                              ${product.unit}
                        </div>
                  </td>
                  <td>

                        <div class="d-flex justify-content-center align-items-center">
                              ${new Date(product.expireDate).toLocaleString('en-US', options2)}
                        </div>
                  </td>
                  <td>
                        <div class="d-flex justify-content-center align-items-center">
                              ${product.details}
                        </div>
                  </td>
                  <td>
                        <div class="d-flex justify-content-center align-items-center">
                              <a onclick="editProduct('${storeId}', '${i}')" title="Edit this product">
                                    <i class='fas fa-pencil-alt' style="color: blue;"></i>
                              </a>
                        </div>
                  </td>
                  <td>
                        <div class="d-flex justify-content-center align-items-center">
                              <a onclick="deleteProduct('${storeId}', '${i}')" title="Delete this product">
                                    <i class='fas fa-trash-alt' style="color: red;"></i>
                              </a>
                        </div>
                  </td>
              `;
                  tableBody.appendChild(row);
                  i++;
            });
      } catch (error) {
            console.error('Error:', error);
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
                        select: 8,
                        sortable: false,
                  },
                  {
                        select: 9,
                        sortable: false,
                  },
                  {
                        select: 10,
                        sortable: false,
                  },
            ],
      });
      
}

async function go() {
      document.querySelector('#myTableStyle').style.display = 'none';
      document.querySelector('#loading').style.display = 'block';
      await loadData();
      await drawTable();
      document.querySelector('#myTableStyle').style.display = 'block';
      document.querySelector('#loading').style.display = 'none';
}

go();


//funcion block:
async function addProduct() {
      document.getElementById("myModal1").style.display = "block";
      const addNewProduct = document.querySelector('#add-product-form');

      addNewProduct.addEventListener('submit', (event) => {
            event.preventDefault();
            const productData = new FormData(addNewProduct);
            fetch('/add-new-product', {
                  method: 'POST',
                  body: JSON.stringify({
                        barcode: productData.get('productbarcode'),
                        name: productData.get('productName'),
                        originalPrice: productData.get('productOriginalPrice'),
                        salePrice: productData.get('productSalePrice'),
                        quantity: 0,
                        unit: productData.get('productUnit'),
                        expireDate: productData.get('productExpireDate'),
                        details: (productData.get('productDetails') || 'No details'),
                  }),
                  headers: {
                        'Content-Type': 'application/json'
                  }
            }).then(response => {
                  if (response.redirected) {
                        window.location.href = response.url;
                  }
                  return response.json(); // Parse and return the response as JSON
            }).then(data => {
                  const errorMessage = document.querySelector('#handleError1');
                  if (data.message) { // Make sure data.message exists
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = 'block'; // Make sure this element is styled to be visible
                  }

            }).catch(error => console.error('Error:', error));

      });
}
async function editProduct(storeId, i) {
      document.getElementById("myModal2").style.display = "block";
      document.querySelector('#edit-product-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const newProductData = new FormData(document.querySelector('#edit-product-form'));
            fetch(`/edit-product/${storeId}/${i}`, {
                  method: 'POST',
                  body: JSON.stringify({
                        barcode: newProductData.get('productbarcode'),
                        name: newProductData.get('productName'),
                        originalPrice: newProductData.get('productOriginalPrice'),
                        salePrice: newProductData.get('productSalePrice'),
                        unit: newProductData.get('productUnit'),
                        expireDate: newProductData.get('productExpireDate'),
                        details: newProductData.get('productDetails'),
                  }),
                  headers: {
                        'Content-Type': 'application/json'
                  }
            }).then(response => {
                  if (response.redirected) {
                        window.location.href = response.url;
                  }
                  return response.json(); // Parse and return the response as JSON
            }).then(data => {
                  const errorMessage = document.querySelector('#handleError2');
                  if (data.message) { // Make sure data.message exists
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = 'block'; // Make sure this element is styled to be visible
                  }
                  document.querySelector('#loading').style.display = 'none';

            }).catch(error => console.error('Error:', error));

      });
}
async function deleteProduct(storeId, i) {
      const entered = prompt('Write yes to delete it');
      if (entered === 'yes' || entered === 'Yes' || entered === 'YES') {
            await fetch(`/product-delete/${storeId}/${i}`, {
                  method: 'DELETE',
            }).then(response => {
                  if (response.redirected) {
                        window.location.href = response.url;
                  }
                  return response.json();
            }).then(data => {
                  if (data.message) {
                        alert(data.message);
                  }
            }).catch(error => console.error('Error:', error));
      } else if (entered) {
            alert('The name you entered is not correct');
      }
}

//modal block:

const closeModalButtons = document.querySelectorAll(".closeModal");
closeModalButtons.forEach((button) => {
      button.addEventListener("click", () => {
            document.getElementById("myModal1").style.display = "none";
            document.getElementById("myModal2").style.display = "none";
            document.getElementById('loading').style.display = 'none';
            document.querySelector('.handleError').style.display = "none";
      });
});

window.addEventListener("click", (event) => {
      if (event.target === document.getElementById("myModal1") ||
            event.target === document.getElementById("myModal2")) {
            document.getElementById("myModal1").style.display = "none";
            document.getElementById("myModal2").style.display = "none";
            document.getElementById('loading').style.display = 'none';
            document.querySelector('.handleError').style.display = "none";
      }
});

const inputField1 = document.getElementById('mybarcodeInput1');
inputField1.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
      }
});
const inputField2 = document.getElementById('mybarcodeInput2');
inputField2.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            document.getElementById('inputProductName').focus(); 
      }
});

document.getElementById('printAllProducts').addEventListener("click", () => {
      simpleDatatablesExam.print();
});