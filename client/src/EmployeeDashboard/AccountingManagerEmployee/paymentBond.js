const options1 = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
};

document.querySelector('#loading').style.display = 'block';
fetch(`https://d27d-94-47-134-176.ngrok-free.app/shops-info/emp`)
    .then(response => response.json())
    .then(data => {
        const logDate = new Date(data.logDate).toLocaleString('en-US', options1);;
        document.querySelector('#logDate').textContent = logDate;
        document.querySelector('#logDate').style.display = 'block';

        document.querySelector('#loading').style.display = 'none';
    })
    .catch(error => console.error('Error:', error));


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('paymentBondForm').addEventListener('submit', async function (event) {

        event.preventDefault();
        document.getElementById('loading').style.display = 'block';
        const clientName = document.getElementById('clientName').value;
        const clientPhone = document.getElementById('clientPhone').value;
        const price = document.getElementById('price').value;
        const details = (document.getElementById('details').value || 'No details');
        const formData = {
            clientName: clientName,
            clientPhone: clientPhone,
            price: price,
            details: details,
        };

        fetch('/add-payment-bond', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)

        }).then(response => {

            if (response.redirected) {
                window.location.href = response.url;
            }
            return response.json();

        }).then(data => {
            document.getElementById('loading').style.display = 'none';
            if (data.message) {
                document.querySelector('.handleError').textContent = data.message;
                document.querySelector('.handleError').style.display = 'block';
            }

        }).catch(error => console.error('Error:', error));
    });
});