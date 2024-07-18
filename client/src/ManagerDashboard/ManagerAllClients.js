const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
};

document.addEventListener('DOMContentLoaded', function () {
      document.querySelector('#loading').style.display = 'block';
      const apiUrl = 'https://d27d-94-47-134-176.ngrok-free.app/all-client';
      const tableBody = document.querySelector('#myTable tbody');
      let clients = [];

      async function fetchClients() {
            try {
                  const response = await fetch(apiUrl);
                  if (!response.ok) {
                        document.querySelector('#loading').style.display = 'none';
                        throw new Error('Failed to fetch clients');
                  }
                  const data = await response.json();
                  clients = data.clients;
                  const logDate = data.logDate;
                  let managerDateOfLogin = new Date(logDate).toLocaleString('en-US', options);
                  document.querySelector('#logDate').textContent = managerDateOfLogin;
                  document.querySelector('#logDate').style.display = 'block';
                  await populateTable(clients);
                  await drawTable();
                  document.querySelector('#loading').style.display = 'none';
            } catch (error) {
                  document.querySelector('#loading').style.display = 'none';
                  console.error('Error fetching clients:', error);
                  alert('Failed to fetch clients. Please try again later.');
            }
      }

      async function populateTable(clients) {
            tableBody.innerHTML = '';

            clients.forEach((client, index) => {
                  const row = document.createElement('tr');

                  row.innerHTML = `
                  <td>
                      <div class="d-flex justify-content-center align-items-center">${index + 1}</div>
                  </td>
                  <td>
                      <div class="d-flex justify-content-center align-items-center">${client.type}</div>
                  </td>
                  <td>
                      <div class="d-flex justify-content-center align-items-center">${client.name}</div>
                  </td>
                  <td>
                      <div class="d-flex justify-content-center align-items-center">${client.phone}</div>
                  </td>
                  <td>
                      <div class="d-flex justify-content-center align-items-center">
                          ${client.type === 'Client' ? `debtor: ${client.DebtPrice}` : `Creditor: ${client.DebtPrice}`}
                      </div>
                  </td>
                  <td>
                      <a class="d-flex justify-content-center align-items-center edit-client" href="#!" data-id="${client._id}">
                          <i class='fas fa-pencil-alt' style="color: blue;"></i>
                      </a>
                  </td>
                  <td>
                      <a class="d-flex justify-content-center align-items-center delete-client" href="#!" data-id="${client._id}" data-debt="${client.DebtPrice}">
                          <i class='fas fa-trash-alt' style="color: red;"></i>
                      </a>
                  </td>
              `;

                  tableBody.appendChild(row);
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('td a.delete-client').forEach(deleteButton => {
                  deleteButton.addEventListener('click', handleDelete);
            });

            // Add event listeners for edit buttons
            document.querySelectorAll('td a.edit-client').forEach(editButton => {
                  editButton.addEventListener('click', handleEdit);
            });
      }

      async function handleDelete(event) {
            event.preventDefault();

            const clientId = this.getAttribute('data-id');
            const clientDebt = parseFloat(this.getAttribute('data-debt'));

            if (clientDebt !== 0) {
                  alert("You can't delete this client if his account is not clear!");
                  return;
            }

            const confirmation = confirm('Are you sure you want to delete this client?');
            if (!confirmation) return;

            document.querySelector('#loading').style.display = 'block';
            fetch(`/delete-client/${clientId}`, {
                  method: 'DELETE'
            }).then(response => {
                  if (response.redirected) {
                        window.location.href = response.url;
                  }
            }).catch(error => alert('Field to delete!'));
            document.querySelector('#loading').style.display = 'none';
      }


      async function handleEdit(event) {
            event.preventDefault();

            const clientId = this.getAttribute('data-id');
            const client = clients.find(c => c._id === clientId);

            if (!client) {
                  alert('Client not found');
                  return;
            }

            // Show modal with form
            const modalHtml = `
                  <div class="modal" id="editClientModal">
                      <div class="modal-content">
                            <span class="closeModal" style="width: 40px;">&times;</span>
                            <h3 class="text-dark d-flex justify-content-center align-items-center">
                                Edit client informations
                            </h3>
                            <br />
                            <h6>
                                Just fill the field you want
                            </h6>
                            <br />
                            <div class="row d-flex justify-content-center align-items-center">
                                <form class="col-sm-12" id="editClientForm">
                                    <div class="form-group row">
                                        <div class="col-sm-12">
                                            <input type="text" class="form-control" placeholder="New client name" id="newName" name="newName">
                                        </div>
                                        <br />
                                        <div class="col-sm-12">
                                            <input type="text" class="form-control" placeholder="New client phone" id="newPhone" name="newPhone">
                                        </div>
                                        <br />
                                        <br />
                                        <br />
                                        <div class="handleError"></div>
                                        <div class="col-xs-1 text-center">
                                            <button type="submit" class="btn btn-primary">Update</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                      </div>
                  </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            const modal = document.getElementById('editClientModal');
            const closeModal = document.querySelector('.closeModal');

            modal.style.display = 'block';

            closeModal.addEventListener('click', () => {
                  modal.remove();
            });

            window.addEventListener('click', (event) => {
                  if (event.target === modal) {
                        modal.remove();
                  }
            });

            document.getElementById('editClientForm').addEventListener('submit', async function (event) {
                  event.preventDefault();
                  const newName = document.getElementById('newName').value;
                  const newPhone = document.getElementById('newPhone').value;
                  document.querySelector('#loading').style.display = 'block';
                  fetch('/edit-client', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                              newName,
                              newPhone,
                              clientId
                        })
                  }).then(response => {
                        if (response.redirected) {
                              window.location.href = response.url;
                        }
                        return response.json(); // Parse and return the response as JSON
                  }).then(data => {
                        const errorMessage = document.querySelector('.handleError');
                        if (data.message) { // Make sure data.message exists
                              errorMessage.textContent = data.message;
                              errorMessage.style.display = 'block'; // Make sure this element is styled to be visible
                        }
                        fetchClients(); // Refresh the table
                        document.querySelector('#loading').style.display = 'none';
                  }).catch(error => console.error('Error:', error));
                  document.querySelector('#loading').style.display = 'none';



            });
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
                              select: 5,
                              sortable: false,
                        },
                        {
                              select: 6,
                              sortable: false,
                        },
                  ],
            });
      }

      document.getElementById('printAllClient').addEventListener("click", () => {
            simpleDatatablesExam.print();
      });

      fetchClients();
});