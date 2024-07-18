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
fetch(`https://d27d-94-47-134-176.ngrok-free.app/manager-profile-info`)
      .then(response => response.json())
      .then(data => {
            let managerDateOfLogin = new Date(data.logDate).toLocaleString('en-US', options);
            
            document.querySelector('#logDate').textContent = managerDateOfLogin;
            document.querySelector('#logDate').style.display = 'block';

            document.querySelector('#loading').style.display = 'none';

      })
      .catch(error => console.error('Error:', error));
