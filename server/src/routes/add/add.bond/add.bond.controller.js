const {
      getCashBoxById,
      getShopNameById,
      editCashBox
} = require('../../../models/shop.model');
const {
      getManagerNameById
} = require('../../../models/manager.model');
const {
      addNewBond
} = require('../../../models/bond.model');
const {
      addNewClient,
      getClientByNameAndManagerId
} = require('../../../models/client.model');
const {
      getEmployeeById
} = require('../../../models/employee.model');

async function httpAddPaymentBond(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {

                        let {
                              clientName,
                              clientPhone,
                              price,
                              details,
                              value
                        } = req.body;

                        if (!clientName || !clientPhone || !price || !value) {
                              return res.status(400).json({ message: 'Please fill all the fields' });
                        }

                        details = details || 'No Details';

                        const shopId = value;
                        const cashBox = await getCashBoxById(shopId);
                        const managerName = await getManagerNameById(managerId);
                        const shopName = await getShopNameById(shopId);
                        const oldClient = await getClientByNameAndManagerId(clientName, managerId);

                        if (!oldClient) {
                              return res.status(400).json({ message: 'There is no supplier with this name!' });
                        }
                        if(oldClient.type != 'Supplier') {
                              return res.status(400).json({ message: 'This is not a supplier!' });
                        }
                        if (cashBox < price) {
                              return res.status(400).json({ message: 'Not enough money in the cash box!' });
                        }
                        if (oldClient.DebtPrice < price) {
                              return res.status(400).json({ message: 'The price of the supplier is less than the price of the payment bond!' });
                        }

                        const bond = {
                              type: 'Payment',
                              date: Date.now(),
                              owner: managerId,
                              writerName: managerName,
                              clientName,
                              shopName,
                              price,
                              details,
                        };
                        const client = {
                              type: 'Supplier',
                              name: clientName,
                              phone: clientPhone,
                              owner: managerId,
                              DebtPrice: -price
                        };

                        await addNewBond(bond);
                        await editCashBox(shopId, -price);
                        await addNewClient(client);
                        return res.redirect(`/manager-dashboard/payment-bond/${value}`);
                  }
            }

            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        const type = employeeData.typeOfEmployee;
                        if(type !== 'Accounting Manager') {
                              return res.status(400).json({ message: 'You are not allowed!' });
                        }
                        let {
                              clientName,
                              clientPhone,
                              price,
                              details,
                        } = req.body;

                        if (!clientName || !clientPhone || !price) {
                              return res.status(400).json({ message: 'Please fill all the fields' });
                        }

                        details = details || 'No Details';

                        const shopId = employeeData.shopId;
                        const cashBox = await getCashBoxById(shopId);
                        const employeeName = employeeData.fullName;
                        const shopName = await getShopNameById(shopId);
                        const managerId = employeeData.supervisor;
                        const oldClient = await getClientByNameAndManagerId(clientName, managerId);

                        if (!oldClient) {
                              return res.status(400).json({ message: 'There is no supplier with this name!' });
                        }
                        if(oldClient.type != 'Supplier') {
                              return res.status(400).json({ message: 'This is not a supplier!' });
                        }
                        if (cashBox < price) {
                              return res.status(400).json({ message: 'Not enough money in the cash box!' });
                        }
                        if (oldClient.DebtPrice < price) {
                              return res.status(400).json({ message: 'The price of the supplier is less than the price of the payment bond!' });
                        }

                        const bond = {
                              type: 'Payment',
                              date: Date.now(),
                              owner: managerId,
                              writerName: employeeName,
                              clientName,
                              shopName,
                              price,
                              details,
                        };
                        const client = {
                              type: 'Supplier',
                              name: clientName,
                              phone: clientPhone,
                              owner: managerId,
                              DebtPrice: -price
                        };

                        await addNewBond(bond);
                        await editCashBox(shopId, -price);
                        await addNewClient(client);
                        return res.redirect(`/Accounting-manager-employee-dashboard/payment-bond`);
                  }
            }

            return res.status(400).send('You are not authorized to access this page!');

      } catch (err) {
            console.error(err);
      }
}

async function httpAddReceiptBond(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {

                        let {
                              clientName,
                              clientPhone,
                              price,
                              details,
                              value
                        } = req.body;

                        if (!clientName || !clientPhone || !price || !value) {
                              return res.status(400).json({ message: 'Please fill all the fields' });
                        }

                        details = details || 'No Details';

                        const shopId = value;
                        const managerName = await getManagerNameById(managerId);
                        const shopName = await getShopNameById(shopId);
                        const oldClient = await getClientByNameAndManagerId(clientName, managerId);
                        
                        if (!oldClient) {
                              return res.status(400).json({ message: 'There is no client with this name!' });
                        }
                        if(oldClient.type != 'Client') {
                              return res.status(400).json({ message: 'This is not a client!' });
                        }
                        if (oldClient.DebtPrice < price) {
                              return res.status(400).json({ message: 'The price of the client is less than the price of the receipt bond!' });
                        }

                        const bond = {
                              type: 'Receipt',
                              date: Date.now(),
                              owner: managerId,
                              writerName: managerName,
                              clientName,
                              shopName,
                              price,
                              details,
                        };
                        const client = {
                              type: 'Client',
                              name: clientName,
                              phone: clientPhone,
                              owner: managerId,
                              DebtPrice: -price
                        };
                        
                        await addNewBond(bond);
                        await editCashBox(shopId, +price);
                        await addNewClient(client);
                        return res.redirect(`/manager-dashboard/receipt-bond/${value}`);
                  }
            }

            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if(!employeeData) {
                              return res.status(400).json({ message: "Can't find emplyee!" });
                        }
                        const type = employeeData.typeOfEmployee;
                        if(type !== 'Accounting Manager') {
                              return res.status(400).json({ message: 'You are not allowed!' });
                        }
                        const managerId = employeeData.supervisor;
                        const employeeName = employeeData.fullName;
                        let {
                              clientName,
                              clientPhone,
                              price,
                              details,
                        } = req.body;

                        if (!clientName || !clientPhone || !price  ) {
                              return res.status(400).json({ message: 'Please fill all the fields' });
                        }

                        details = details || 'No Details';

                        const shopId = employeeData.shopId;
                        const shopName = await getShopNameById(shopId);
                        const oldClient = await getClientByNameAndManagerId(clientName, managerId);
                        
                        if (!oldClient) {
                              return res.status(400).json({ message: 'There is no client with this name!' });
                        }
                        if(oldClient.type != 'Client') {
                              return res.status(400).json({ message: 'This is not a client!' });
                        }
                        if (oldClient.DebtPrice < price) {
                              return res.status(400).json({ message: 'The price of the client is less than the price of the receipt bond!' });
                        }

                        const bond = {
                              type: 'Receipt',
                              date: Date.now(),
                              owner: managerId,
                              writerName: employeeName,
                              clientName,
                              shopName,
                              price,
                              details,
                        };
                        const client = {
                              type: 'Client',
                              name: clientName,
                              phone: clientPhone,
                              owner: managerId,
                              DebtPrice: -price
                        };
                        
                        await addNewBond(bond);
                        await editCashBox(shopId, +price);
                        await addNewClient(client);
                        return res.redirect(`/Accounting-manager-employee-dashboard/payment-bond`);
                  }
            }

            return res.status(400).send('You are not authorized to access this page!');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpAddPaymentBond,
      httpAddReceiptBond
};