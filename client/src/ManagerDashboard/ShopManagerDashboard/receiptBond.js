document.getElementById('loading').style.display = 'none';

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
            value
        };

        fetch('/add-receipt-bond', {

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
