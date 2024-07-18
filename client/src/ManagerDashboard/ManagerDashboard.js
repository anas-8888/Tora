const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
}

document.querySelector('#loading').style.display = 'block';

fetch(`https://d27d-94-47-134-176.ngrok-free.app/manager-dashboard-info`)
      .then(response => response.json())
      .then(data => {
            let managerDateOfLogin = new Date(data.logDate).toLocaleString('en-US', options);
            let managerFullName = data.fullName + '\'s dashboard';
            let managerCompanyName = data.companyName + ' company';
            let managerShopsData = data.shops;
            let managerStoresData = data.stores;
            let dataForAmountPerDay = data.ammoutPerDay;
            let datePerDay = data.datePerDay;
            let ammoutPermonth = data.ammoutPermonth;
            let datePermonth = data.datePermonth;

            let shopsList = '';
            managerShopsData.forEach(shop => {
                  shopsList += `
                        <div class="list-group-item list-group-item-action bg-primary text-white" id="shopsContainer">
                              <a href="#!" onclick="deleteShop('${shop._id}', '${shop.name}')" title="Delete this shop">
                                  <i class='fas fa-trash-alt' style="color: red;"></i>
                              </a>

                              <span class="mx-2">|</span>

                              <a href="#!" onclick="editShop('${shop._id}')" title="Edit this shop">
                                  <i class='fas fa-pencil-alt' style="color: white;"></i>
                              </a>

                              <span class="mx-2">|</span>

                              <a class="small text-white stretched-link" href="/manager-dashboard/dashboard/${shop._id}" title="Go to shop">
                                  ${shop.name}
                                  <div class="small text-white float-end">
                                      <i class="fas fa-angle-right"></i>
                                  </div>
                              </a>
                              <span class="mx-2">|</span>
                              Location: ${shop.location}
                        </div>`;
            });

            let storesList = '';
            managerStoresData.forEach(store => {
                  storesList += `
                        <div class="list-group-item list-group-item-action bg-primary text-white">
                              <a href="#!" onclick="deleteStore('${store._id}', '${store.name}')" title="Delete this store">
                                  <i class='fas fa-trash-alt' style="color: red;"></i>
                              </a>

                              <span class="mx-2">|</span>

                              <a href="#!" onclick="editStore('${store._id}')" title="Edit this store">
                                  <i class='fas fa-pencil-alt' style="color: white;"></i>
                              </a>

                              <span class="mx-2">|</span>

                              <a class="small text-white stretched-link" href="/manager-dashboard/stores/${store._id}" title="Go to store">
                                  ${store.name}
                                  <div class="small text-white float-end">
                                      <i class="fas fa-angle-right"></i>
                                  </div>
                              </a>
                              <span class="mx-2">|</span>
                              Location: ${store.location}
                        </div>`;
            });

            // Update DOM elements
            document.querySelector('#logDate').textContent = managerDateOfLogin;
            document.querySelector('#logDate').style.display = 'block';

            document.querySelector('#managerDashboardName').textContent = managerFullName;
            document.querySelector('#managerDashboardName').style.display = 'block';

            document.querySelector('#managerDashboardCompanyName').textContent = managerCompanyName;
            document.querySelector('#managerDashboardCompanyName').style.display = 'block';

            document.querySelector('#managerDashboardShopsData').innerHTML = shopsList;
            document.querySelector('#managerDashboardShopsData').style.display = 'block';

            document.querySelector('#managerDashboardStoresData').innerHTML = storesList;
            document.querySelector('#managerDashboardStoresData').style.display = 'block';

            /////////////////////////

            Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
            Chart.defaults.global.defaultFontColor = '#292b2c';

            var ctx = document.getElementById("myAreaChart");
            var myLineChart = new Chart(ctx, {
                  type: 'line',
                  data: {
                        labels: datePerDay,
                        datasets: [{
                              label: "Sessions",
                              lineTension: 0.3,
                              backgroundColor: "rgba(2,117,216,0.2)",
                              borderColor: "rgba(2,117,216,1)",
                              pointRadius: 5,
                              pointBackgroundColor: "rgba(2,117,216,1)",
                              pointBorderColor: "rgba(255,255,255,0.8)",
                              pointHoverRadius: 5,
                              pointHoverBackgroundColor: "rgba(2,117,216,1)",
                              pointHitRadius: 50,
                              pointBorderWidth: 2,
                              data: dataForAmountPerDay,
                        }],
                  },
                  options: {
                        scales: {
                              xAxes: [{
                                    time: {
                                          unit: 'date'
                                    },
                                    gridLines: {
                                          display: false
                                    },
                                    ticks: {
                                          maxTicksLimit: 7
                                    }
                              }],
                              yAxes: [{
                                    ticks: {
                                          min: 0,
                                          max: Math.ceil(Math.max(...dataForAmountPerDay) / 10000) * 10000,
                                    },
                                    gridLines: {
                                          color: "rgba(0, 0, 0, .125)",
                                    }
                              }],
                        },
                        legend: {
                              display: false
                        }
                  }
            });

            ////////////////////////////////

            Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
            Chart.defaults.global.defaultFontColor = '#292b2c';

            var ctx = document.getElementById("myBarChart");
            var myLineChart = new Chart(ctx, {
                  type: 'bar',
                  data: {
                        labels: datePermonth,
                        datasets: [{
                              label: "Revenue",
                              backgroundColor: "rgba(2,117,216,1)",
                              borderColor: "rgba(2,117,216,1)",
                              data: ammoutPermonth,
                        }],
                  },
                  options: {
                        scales: {
                              xAxes: [{
                                    time: {
                                          unit: 'month'
                                    },
                                    gridLines: {
                                          display: false
                                    },
                                    ticks: {
                                          maxTicksLimit: 6
                                    }
                              }],
                              yAxes: [{
                                    ticks: {
                                          min: 0,
                                          max: Math.ceil(Math.max(...ammoutPermonth) / 10000) * 10000,
                                    },
                                    gridLines: {
                                          display: true
                                    }
                              }],
                        },
                        legend: {
                              display: false
                        }
                  }
            });

            //////////////////////////////

            document.querySelector('#loading').style.display = 'none';

      })
      .catch(error => console.error('Error:', error));

//function block:
async function deleteShop(shopId, shopName) {
      const shopNameEntered = prompt('Enter the name of the shop to delete it, Note that: when you delete a shop, all employees working in it, all clients that have been saved on it, the store that related with this shop and all his products, will be delete.');
      if (shopNameEntered === shopName) {
            await fetch(`/shop-delete/${shopId}`, {
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
      } if (shopNameEntered !== shopName && shopNameEntered) {
            alert('The name you entered is not correct');
      }
}
async function editShop(shopId) {
      document.getElementById("myModal3").style.display = "block";
      document.querySelector('#edit-shop-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const newShopData = new FormData(document.querySelector('#edit-shop-form'));
            fetch(`/edit-shop/${shopId}`, {
                  method: 'POST',
                  body: JSON.stringify({
                        name: newShopData.get('shopName'),
                        location: newShopData.get('shopLocation')
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
                  const errorMessage = document.querySelectorAll('.handleError');
                  if (data.message) { // Make sure data.message exists
                        errorMessage.forEach(div => {
                              div.textContent = data.message;
                              div.style.display = 'block';
                        });
                  }
            }).catch(error => console.error('Error:', error));
      });
}
async function addNewShop() {
      document.getElementById("myModal1").style.display = "block";
      const addNewShopForm = document.querySelector('#add-new-shop-form');
      addNewShopForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const shopData = new FormData(addNewShopForm);
            fetch('/add-new-shop', {
                  method: 'POST',
                  body: JSON.stringify({
                        name: shopData.get('ShopName'),
                        location: shopData.get('ShopLocation')
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
                  const errorMessage = document.querySelectorAll('.handleError');
                  if (data.message) { // Make sure data.message exists
                        errorMessage.forEach(div => {
                              div.textContent = data.message;
                              div.style.display = 'block';
                        });
                  }

            }).catch(error => console.error('Error:', error));

      });
}
async function deleteStore(storeId, storeName) {
      const storeNameEntered = prompt('Enter the name of the store to delete it, note that: when you delete a store, all his products will be delete.');
      if (storeNameEntered === storeName) {
            await fetch(`/store-delete/${storeId}`, {
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
      } else if (storeNameEntered !== storeName && storeNameEntered) {
            alert('The name you entered is not correct');
      }
}

async function editStore(storeId) {
      document.getElementById("myModal4").style.display = "block";
      document.querySelector('#edit-store-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const newStoreData = new FormData(document.querySelector('#edit-store-form'));
            fetch(`/edit-store/${storeId}`, {
                  method: 'POST',
                  body: JSON.stringify({
                        name: newStoreData.get('storeName'),
                        location: newStoreData.get('storeLocation')
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
                  const errorMessage = document.querySelectorAll('.handleError');
                  if (data.message) { // Make sure data.message exists
                        errorMessage.forEach(div => {
                              div.textContent = data.message;
                              div.style.display = 'block';
                        });
                  }
            }).catch(error => console.error('Error:', error));
      });
}
async function addNewStore() {
      document.getElementById("myModal2").style.display = "block";
      const addNewStoreForm = document.querySelector('#add-new-store-form');
      addNewStoreForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const storeData = new FormData(addNewStoreForm);
            fetch('/add-new-store', {
                  method: 'POST',
                  body: JSON.stringify({
                        name: storeData.get('storeName'),
                        location: storeData.get('storeLocation')
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
                  const errorMessage = document.querySelectorAll('.handleError');
                  if (data.message) { // Make sure data.message exists
                        errorMessage.forEach(div => {
                              div.textContent = data.message;
                              div.style.display = 'block';
                        });
                  }

            }).catch(error => console.error('Error:', error));

      });
}


//moudal block:
const closeModalButtons = document.querySelectorAll(".closeModal");
closeModalButtons.forEach((button) => {
      button.addEventListener("click", () => {
            document.getElementById("myModal1").style.display = "none";
            document.getElementById("myModal2").style.display = "none";
            document.getElementById("myModal3").style.display = "none";
            document.getElementById("myModal4").style.display = "none";
            document.querySelectorAll('.handleError').forEach(div => {
                  div.style.display = 'none';
            });
            document.querySelector('#loading').style.display = 'none';
      });
});

window.addEventListener("click", (event) => {
      if (event.target === document.getElementById("myModal1") ||
            event.target === document.getElementById("myModal2") ||
            event.target === document.getElementById("myModal3") ||
            event.target === document.getElementById("myModal4")) {
            document.getElementById("myModal1").style.display = "none";
            document.getElementById("myModal2").style.display = "none";
            document.getElementById("myModal3").style.display = "none";
            document.getElementById("myModal4").style.display = "none";
            document.querySelectorAll('.handleError').forEach(div => {
                  div.style.display = 'none';
            });
            document.querySelector('#loading').style.display = 'none';
      }
});