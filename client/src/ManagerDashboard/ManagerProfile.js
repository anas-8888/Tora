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
document.getElementById("editManagerLink").addEventListener("click", () => {
  document.getElementById("myModal").style.display = "block";
});
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("myModal").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("handleError").style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target === document.getElementById("myModal")) {
    document.getElementById("myModal").style.display = "none";
    document.getElementById("loading").style.display = "none";
    document.getElementById("handleError").style.display = "none";
  }
});

document.querySelector('#edit-manager-info').addEventListener('submit', (event) => {
      document.querySelector('#loading').style.display = 'block';
      event.preventDefault();
      const formData = new FormData(document.querySelector('#edit-manager-info'));
      fetch('/manager-profile', {
            method: 'POST',
            body: JSON.stringify({
                  oldPassword: formData.get('oldManagerPassword'),
                  fullName: formData.get('newManagerFullName'),
                  email: formData.get('newManagerEmail'),
                  password: formData.get('newManagerPassword'),
                  companyName: formData.get('newManagerCompanyName'),
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
            // Display the message from the server
            const errorMessage = document.querySelector('#handleError');
            if (data.message) { // Make sure data.message exists
                  errorMessage.textContent = data.message;
                  errorMessage.style.display = 'block'; // Make sure this element is styled to be visible
            }
            document.querySelector('#loading').style.display = 'none';
      }).catch(error => console.error('Error:', error));
});
///////
document.querySelector('#loading').style.display = 'block';
fetch('https://d27d-94-47-134-176.ngrok-free.app/manager-profile-info')
  .then(response => response.json())
  .then(data => {
    let managerDateOfLogin = new Date(data.logDate).toLocaleString('en-US', options);
    let managerFullName = data.fullName;
    let managerCompanyName = data.companyName + ' company';
    let managerEmail = data.email;
    let managerNumberOfShops = data.numberOfShops;
    let managerNumberOfStores = data.numberOfStores;
    let managerNumberOfEmployee = data.numberOfEmployee;

    document.querySelector('#logDate').textContent = managerDateOfLogin;
    document.querySelector('#logDate').style.display = 'block'

    document.querySelector('#companyName').textContent = managerCompanyName;
    document.querySelector('#companyName').style.display = 'block'

    document.querySelector('#managerEmail').textContent = managerEmail;
    document.querySelector('#managerEmail').style.display = 'block';

    document.querySelector('#managerFullName').textContent = managerFullName;
    document.querySelector('#managerFullName').style.display = 'block';

    document.querySelector('#numberOfShops').textContent = managerNumberOfShops;
    document.querySelector('#numberOfShops').style.display = 'block';

    document.querySelector('#numberOfStores').textContent = managerNumberOfStores;
    document.querySelector('#numberOfStores').style.display = 'block';

    document.querySelector('#numberOfEmployee').textContent = managerNumberOfEmployee;
    document.querySelector('#numberOfEmployee').style.display = 'block';

    document.querySelector('#loading').style.display = 'none';
  })
  .catch(error => console.error('Error:', error));