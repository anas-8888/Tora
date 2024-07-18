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

            const type = data.type;
            const shopName = data.shop.name;
            const shopCashBox = data.shop.box;
            const shopLocation = data.shop.location;
            const logDate = new Date(data.logDate).toLocaleString('en-US', options1);;
            document.querySelector('#shopName').textContent = `${shopName} | ${shopLocation}`;
            document.querySelector('#shopName').style.display = 'block'
            
            document.querySelector('#cashBox').textContent = `Cash box: ${shopCashBox}`;
            document.querySelector('#cashBox').style.display = 'block';

            document.querySelector('#type').textContent = `${type} Dashboard`;
            document.querySelector('#type').style.display = 'block';

            document.querySelector('#logDate').textContent = logDate;
            document.querySelector('#logDate').style.display = 'block';

            document.querySelector('#loading').style.display = 'none';
      })
      .catch(error => console.error('Error:', error));