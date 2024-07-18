const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      
      fetch('/employee-login', {
            method: 'POST',
            body: JSON.stringify({
                  email: formData.get('email'),
                  password: formData.get('password')
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
      }).catch(error => console.error('Error:', error));
});