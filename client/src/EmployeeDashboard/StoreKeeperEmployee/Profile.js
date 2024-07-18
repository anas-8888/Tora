const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
}
///////////
document.querySelector('#loading').style.display = 'block';
fetch('https://d27d-94-47-134-176.ngrok-free.app/employee-profile-info')
      .then(response => response.json())
      .then(data => {
            let employeeFullName = data.employeeData.fullName;
            let employeeEmail = data.employeeData.email;
            let employeeSalary = data.employeeData.salary;
            let employeeType = data.employeeData.typeOfEmployee;
            let employeePhone = data.employeeData.phoneNumber;

            let employeeDateOfLogin = new Date(data.logDate).toLocaleString('en-US', options);

            let employeeCompanyName = data.companyName + ' company';
            let employeeManagerName = data.managerName;
            let employeeShopName = data.shopName;

            document.querySelector('#logDate').textContent = employeeDateOfLogin;
            document.querySelector('#logDate').style.display = 'block'

            document.querySelector('#companyName').textContent = employeeCompanyName;
            document.querySelector('#companyName').style.display = 'block'

            document.querySelector('#nameOfEmployee').textContent = employeeFullName;
            document.querySelector('#nameOfEmployee').style.display = 'block'

            document.querySelector('#typeOfEmployee').textContent = 'Type: @' + employeeType;
            document.querySelector('#typeOfEmployee').style.display = 'block'

            document.querySelector('#salaryOfEmployee').textContent = 'Salary: ' + employeeSalary;
            document.querySelector('#salaryOfEmployee').style.display = 'block'

            document.querySelector('#emailOfEmployee').textContent = 'Email: ' + employeeEmail;
            document.querySelector('#emailOfEmployee').style.display = 'block'

            document.querySelector('#shopOfEmployee').textContent = employeeShopName;
            document.querySelector('#shopOfEmployee').style.display = 'block'

            document.querySelector('#managerNameOfEmployee').textContent = 'Manager name: ' + employeeManagerName;
            document.querySelector('#managerNameOfEmployee').style.display = 'block'

            document.querySelector('#phoneOfEmployee').textContent = 'Phone number: ' + employeePhone;
            document.querySelector('#phoneOfEmployee').style.display = 'block'

      })
      .catch(error => console.error('Error:', error));


fetch('https://d27d-94-47-134-176.ngrok-free.app/store-keeper-info')
      .then(response => response.json())
      .then(data => {
            const stores = data.stores;
            const navBar = document.querySelector('.nav-bar');

            stores.forEach(store => {
                  const link = document.createElement('a');
                  link.classList.add('nav-link', 'text-dark');
                  link.href = `/store-keeper-employee-dashboard/stores/${store._id}`;

                  const iconDiv = document.createElement('div');
                  iconDiv.classList.add('sb-nav-link-icon', 'text-dark');

                  const icon = document.createElement('i');
                  icon.classList.add('fas', 'fa-box-open');

                  iconDiv.appendChild(icon);

                  link.appendChild(iconDiv);
                  link.appendChild(document.createTextNode(`Show ${store.name}`));

                  navBar.appendChild(link);
                  document.querySelector('#loading').style.display = 'none';
            });
      })
      .catch(error => console.error('Error:', error));