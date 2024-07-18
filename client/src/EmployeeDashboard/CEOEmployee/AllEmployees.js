const options1 = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
}
const options2 = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
}


async function loadData() {
      await fetch('https://d27d-94-47-134-176.ngrok-free.app/emplyees-info')
            .then(response => {
                  if (!response.ok) {
                        throw new Error('Network response was not ok');
                  }
                  return response.json();
            })
            .then(data => {
                  let logDate = new Date(data.logDate).toLocaleString('en-US', options1);
                  const tableBody = document.querySelector('#myTable tbody');
                  tableBody.innerHTML = ''; // Clear existing rows (optional)
                  let i = 0;
                  data.employees.forEach(employee => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td>
                              ${i + 1}
                        </td>
                        <td>
                              ${employee.fullName}
                        </td>
                        <td>
                              ${employee.email}
                        </td>
                        <td>
                              ${employee.typeOfEmployee}
                        </td>
                        <td>
                              ${employee.phoneNumber}
                        </td>
                        <td>
                              ${employee.salary}
                        </td>
                        <td>
                              ${new Date(employee.startDate).toLocaleString('en-US', options2)}
                        </td>
                        <td>
                              <a onclick="editEmployee('${employee._id}')" title="Edit this Employee" class="d-flex justify-content-center align-items-center">
                                  <i class='fas fa-pencil-alt' style="color: blue;"></i>
                              </a>
                        </td>
                        <td>
                              <a onclick="deleteEmployee('${employee._id}')" title="Delete this Employee" class="d-flex justify-content-center align-items-center">
                                  <i class='fas fa-trash-alt' style="color: red;"></i>
                              </a>
                        </td>
                  `;
                        tableBody.appendChild(row);
                        i++;
                  });
                  document.querySelector('#logDate').textContent = logDate;
                  document.querySelector('#logDate').style.display = 'block';
            })
            .catch(error => {
                  console.error('Error fetching data:', error);
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
                        select: 7,
                        sortable: false,
                  },
                  {
                        select: 8,
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
async function editEmployee(employeeId) {
      document.getElementById("myModal1").style.display = "block";
      document.querySelector('#edit-employee-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const newemployeeData = new FormData(document.querySelector('#edit-employee-form'));
            fetch(`/edit-employee/${employeeId}`, {
                  method: 'POST',
                  body: JSON.stringify({
                        fullName: newemployeeData.get('employeeFullName'),
                        email: newemployeeData.get('employeeEmail'),
                        password: newemployeeData.get('employeePassword'),
                        type: newemployeeData.get('employeeType'),
                        phoneNumber: newemployeeData.get('employeePhoneNumber'),
                        salary: newemployeeData.get('employeeSalary'),
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
                  document.querySelector('#loading').style.display = 'none';

            }).catch(error => console.error('Error:', error));

      });
}

async function deleteEmployee(employeeId) {
      const entered = prompt('Write yes to delete it, note that: all bills and bounds that made by this employee, will stay.');
      if (entered === 'yes' || entered === 'Yes' || entered === 'YES') {
            await fetch(`/employee-delete/${employeeId}`, {
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
async function addEmployee() {
      document.getElementById("myModal2").style.display = "block";
      const addNewEmplyeeForm = document.querySelector('#add-employee-form');

      addNewEmplyeeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const employeeData = new FormData(addNewEmplyeeForm);
            fetch('/add-new-employee', {
                  method: 'POST',
                  body: JSON.stringify({
                        fullName: employeeData.get('employeeFullName'),
                        email: employeeData.get('employeeEmail'),
                        password: employeeData.get('employeePassword'),
                        typeOfEmployee: employeeData.get('employeeType'),
                        phoneNumber: employeeData.get('employeePhoneNumber'),
                        salary: employeeData.get('employeeSalary'),
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

            }).catch(error => console.error('Error:', error));

      });
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

document.getElementById('printAllProducts').addEventListener("click", () => {
      simpleDatatablesExam.print();
});