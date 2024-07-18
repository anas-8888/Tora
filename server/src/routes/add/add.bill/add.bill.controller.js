const {
      addSalesBill,
      addSalesReturnBill,
      addPurchasesBill,
      addPurchasesReturnBill
} = require('../../../models/bill.model');

const {
      getManagerNameById
} = require('../../../models/manager.model');

const {
      getShopNameById,
      getCashBoxById
} = require('../../../models/shop.model');

const {
      getQuantityByIndexAndStoreId,
      getStoreIdByShopId
} = require('../../../models/store.model');

const {
      getEmployeeById
} = require('../../../models/employee.model');


async function httpAddNewSalesBill(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        let {
                              date,
                              clientName,
                              clientPhone,
                              paymentType,
                              totalSum,
                              items,
                              value,
                              indexOfProducts
                        } = req.body;
                        const managerName = await getManagerNameById(managerId);

                        // Validate required fields
                        if (!date || !paymentType || !totalSum || !items) {
                              return res.status(400).send('Please fill all fields');
                        }
                        if (paymentType !== 'Cash' && paymentType !== 'Debt') {
                              return res.status(400).send('Payment type must be Cash or Debt');
                        }
                        if (totalSum < 0) {
                              return res.status(400).send('Total sum must be a positive number');
                        }
                        if (items.length === 0) {
                              return res.status(400).send('Please add at least one product to the bill');
                        }
                        if (paymentType === 'Debt' && (!clientName || !clientPhone)) {
                              return res.status(400).send('Please fill client name and phone for debt payment');
                        }

                        // Check product quantities in store
                        const storeId = await getStoreIdByShopId(value);
                        for (let j = 0; j < indexOfProducts.length; j++) {
                              const i = indexOfProducts[j];
                              if (i !== -1) {
                                    const quantityInStore = await getQuantityByIndexAndStoreId(i, storeId);
                                    if (quantityInStore < items[j].quantity) {
                                          return res.status(400).send('Insufficient quantity in store');
                                    }
                              }
                        }

                        // Default values for client name and phone if not provided
                        clientName = clientName || 'Non';
                        clientPhone = clientPhone || 'Non';

                        const shopName = await getShopNameById(value);
                        const newBill = {
                              type: 'Sales',
                              paymentType,
                              date,
                              owner: managerId,
                              writerName: managerName,
                              clientName,
                              clientPhone,
                              shopName,
                              total: totalSum,
                              products: items
                        };

                        await addSalesBill(newBill, value, indexOfProducts, items);
                        return res.redirect(`manager-dashboard/sales-bill/${value}`);
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(400).send('Employee not found');
                        }
                        if (employeeData.typeOfEmployee !== 'Sales' && employeeData.typeOfEmployee !== 'Accountant') {
                              return res.status(400).send('Not allowed!');
                        }
                        const shopId = employeeData.shopId;
                        if (!shopId) {
                              return res.status(400).send('Shop id not found');
                        }
                        let {
                              date,
                              clientName,
                              clientPhone,
                              paymentType,
                              totalSum,
                              items,
                              indexOfProducts
                        } = req.body;
                        const employeeName = employeeData.fullName;
                        const managerId = employeeData.supervisor;

                        if (!date || !paymentType || !totalSum || !items) {
                              return res.status(400).send('Please fill all fields');
                        }
                        if (paymentType !== 'Cash' && paymentType !== 'Debt') {
                              return res.status(400).send('Payment type must be Cash or Debt');
                        }
                        if (totalSum < 0) {
                              return res.status(400).send('Total sum must be a positive number');
                        }
                        if (items.length === 0) {
                              return res.status(400).send('Please add at least one product to the bill');
                        }
                        if (paymentType === 'Debt' && (!clientName || !clientPhone)) {
                              return res.status(400).send('Please fill client name and phone for debt payment');
                        }

                        // Check product quantities in store
                        const storeId = await getStoreIdByShopId(shopId);
                        for (let j = 0; j < indexOfProducts.length; j++) {
                              const i = indexOfProducts[j];
                              if (i !== -1) {
                                    const quantityInStore = await getQuantityByIndexAndStoreId(i, storeId);
                                    if (quantityInStore < items[j].quantity) {
                                          return res.status(400).send('Insufficient quantity in store');
                                    }
                              }
                        }

                        // Default values for client name and phone if not provided
                        clientName = clientName || 'Non';
                        clientPhone = clientPhone || 'Non';

                        const shopName = await getShopNameById(shopId);
                        const newBill = {
                              type: 'Sales',
                              paymentType,
                              date,
                              owner: managerId,
                              writerName: employeeName,
                              clientName,
                              clientPhone,
                              shopName,
                              total: totalSum,
                              products: items
                        };

                        await addSalesBill(newBill, shopId, indexOfProducts, items);
                        if (employeeData.typeOfEmployee === 'Sales') {
                              return res.redirect(`/sales-employee-dashboard/sales-bills`);
                        } else if (employeeData.typeOfEmployee === 'Accountant') {
                              return res.redirect(`/Accountant-employee-dashboard/sales-bills`);
                        } else {
                              return res.status(400).send('Not allowed!');
                        }
                  }
            }
            return res.status(401).send('Unauthorized!');

      } catch (err) {
            console.log('Error in httpAddNewSalesBill:', err);
            return res.status(500).send('Internal Server Error');
      }
}

async function httpAddNewSalesReturnBill(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        let {
                              date,
                              clientName,
                              clientPhone,
                              totalSum,
                              items,
                              value,
                              indexOfProducts
                        } = req.body;
                        const managerName = await getManagerNameById(managerId);
                        const paymentType = 'Cash';
                        // Validate required fields
                        if (!date || !paymentType || !totalSum || !items) {
                              return res.status(400).send('Please fill all fields');
                        }
                        if (paymentType !== 'Cash' && paymentType !== 'Debt') {
                              return res.status(400).send('Payment type must be Cash or Debt');
                        }
                        if (totalSum < 0) {
                              return res.status(400).send('Total sum must be a positive number');
                        }
                        if (items.length === 0) {
                              return res.status(400).send('Please add at least one product to the bill');
                        }
                        if (paymentType === 'Debt' && (!clientName || !clientPhone)) {
                              return res.status(400).send('Please fill client name and phone for debt payment');
                        }

                        // Check product quantities in store
                        const storeId = await getStoreIdByShopId(value);
                        for (let j = 0; j < indexOfProducts.length; j++) {
                              const i = indexOfProducts[j];
                              if (i !== -1) {
                                    const quantityInStore = await getQuantityByIndexAndStoreId(i, storeId);
                                    if (quantityInStore < items[j].quantity) {
                                          return res.status(400).send('Insufficient quantity in store!');
                                    }
                              }
                        }

                        // Default values for client name and phone if not provided
                        clientName = clientName || 'Non';
                        clientPhone = clientPhone || 'Non';

                        const shopName = await getShopNameById(value);
                        const newBill = {
                              type: 'Sales return',
                              paymentType,
                              date,
                              owner: managerId,
                              writerName: managerName,
                              clientName,
                              clientPhone,
                              shopName,
                              total: totalSum,
                              products: items
                        };

                        const shopCashBox = await getCashBoxById(value);
                        if (shopCashBox < totalSum) {
                              return res.status(400).send('Cash box is not enough!');
                        }

                        await addSalesReturnBill(newBill, value, indexOfProducts, items);
                        return res.redirect(`manager-dashboard/sales-return-bill/${value}`);
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(400).send('Employee not found');
                        }
                        if (employeeData.typeOfEmployee !== 'Sales' && employeeData.typeOfEmployee !== 'Accountant') {
                              return res.status(400).send('Not allowed!');
                        }
                        const shopId = employeeData.shopId;
                        if (!shopId) {
                              return res.status(400).send('Shop id not found');
                        }
                        let {
                              date,
                              clientName,
                              clientPhone,
                              totalSum,
                              items,
                              indexOfProducts
                        } = req.body;
                        const employeeName = employeeData.fullName;
                        const managerId = employeeData.supervisor;
                        paymentType = 'Cash';

                        if (!date || !paymentType || !totalSum || !items) {
                              return res.status(400).send('Please fill all fields');
                        }
                        if (paymentType !== 'Cash' && paymentType !== 'Debt') {
                              return res.status(400).send('Payment type must be Cash or Debt');
                        }
                        if (totalSum < 0) {
                              return res.status(400).send('Total sum must be a positive number');
                        }
                        if (items.length === 0) {
                              return res.status(400).send('Please add at least one product to the bill');
                        }
                        if (paymentType === 'Debt' && (!clientName || !clientPhone)) {
                              return res.status(400).send('Please fill client name and phone for debt payment');
                        }

                        // Check product quantities in store
                        const storeId = await getStoreIdByShopId(shopId);
                        for (let j = 0; j < indexOfProducts.length; j++) {
                              const i = indexOfProducts[j];
                              if (i !== -1) {
                                    const quantityInStore = await getQuantityByIndexAndStoreId(i, storeId);
                                    if (quantityInStore < items[j].quantity) {
                                          return res.status(400).send('Insufficient quantity in store');
                                    }
                              }
                        }

                        clientName = clientName || 'Non';
                        clientPhone = clientPhone || 'Non';

                        const shopName = await getShopNameById(shopId);
                        const newBill = {
                              type: 'Sales return',
                              paymentType,
                              date,
                              owner: managerId,
                              writerName: employeeName,
                              clientName,
                              clientPhone,
                              shopName,
                              total: totalSum,
                              products: items
                        };

                        const shopCashBox = await getCashBoxById(shopId);
                        if (shopCashBox < totalSum) {
                              return res.status(400).send('Cash box is not enough!');
                        }


                        await addSalesReturnBill(newBill, shopId, indexOfProducts, items);
                        if (employeeData.typeOfEmployee === 'Sales') {
                              return res.redirect(`/sales-employee-dashboard/sales-return-bills`);
                        } else if (employeeData.typeOfEmployee === 'Accountant') {
                              return res.redirect(`/Accountant-employee-dashboard/sales-return-bills`);
                        } else {
                              return res.status(400).send('Not allowed!');
                        }
                  }
            }
            return res.status(401).send('Unauthorized!');

      } catch (err) {
            console.log('Error in httpAddNewSalesBill:', err);
            return res.status(500).send('Internal Server Error');
      }
}

async function httpAddNewPurchasesBill(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        let {
                              date,
                              clientName,
                              clientPhone,
                              paymentType,
                              totalSum,
                              items,
                              value,
                              indexOfProducts
                        } = req.body;
                        const managerName = await getManagerNameById(managerId);

                        // Validate required fields
                        if (!date || !paymentType || !totalSum || !items) {
                              return res.status(400).send('Please fill all fields');
                        }
                        if (paymentType !== 'Cash' && paymentType !== 'Debt') {
                              return res.status(400).send('Payment type must be Cash or Debt');
                        }
                        if (totalSum < 0) {
                              return res.status(400).send('Total sum must be a positive number');
                        }
                        if (items.length === 0) {
                              return res.status(400).send('Please add at least one product to the bill');
                        }
                        if (paymentType === 'Debt' && (!clientName || !clientPhone)) {
                              return res.status(400).send('Please fill client name and phone for debt payment');
                        }

                        // Default values for client name and phone if not provided
                        clientName = clientName || 'Non';
                        clientPhone = clientPhone || 'Non';

                        const shopName = await getShopNameById(value);
                        const newBill = {
                              type: 'Purchases',
                              paymentType,
                              date,
                              owner: managerId,
                              writerName: managerName,
                              clientName,
                              clientPhone,
                              shopName,
                              total: totalSum,
                              products: items
                        };

                        const shopCashBox = await getCashBoxById(value);
                        if(paymentType == 'Cash') {
                              if (shopCashBox < totalSum) {
                                    return res.status(400).send('Cash box is not enough!');
                              }
                        }

                        await addPurchasesBill(newBill, value, indexOfProducts, items);
                        return res.redirect(`manager-dashboard/purchases-bill/${value}`);
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(400).send('Employee not found');
                        }
                        if (employeeData.typeOfEmployee !== 'Accountant') {
                              return res.status(400).send('Not allowed!');
                        }
                        const shopId = employeeData.shopId;
                        if (!shopId) {
                              return res.status(400).send('Shop id not found');
                        }

                        let {
                              date,
                              clientName,
                              clientPhone,
                              paymentType,
                              totalSum,
                              items,
                              indexOfProducts
                        } = req.body;
                        const employeeName = employeeData.fullName;

                        if (!date || !paymentType || !totalSum || !items) {
                              return res.status(400).send('Please fill all fields');
                        }
                        if (paymentType !== 'Cash' && paymentType !== 'Debt') {
                              return res.status(400).send('Payment type must be Cash or Debt');
                        }
                        if (totalSum < 0) {
                              return res.status(400).send('Total sum must be a positive number');
                        }
                        if (items.length === 0) {
                              return res.status(400).send('Please add at least one product to the bill');
                        }
                        if (paymentType === 'Debt' && (!clientName || !clientPhone)) {
                              return res.status(400).send('Please fill client name and phone for debt payment');
                        }

                        clientName = clientName || 'Non';
                        clientPhone = clientPhone || 'Non';

                        const managerId = employeeData.supervisor;
                        const shopName = await getShopNameById(shopId);
                        const newBill = {
                              type: 'Purchases',
                              paymentType,
                              date,
                              owner: managerId,
                              writerName: employeeName,
                              clientName,
                              clientPhone,
                              shopName,
                              total: totalSum,
                              products: items
                        };

                        const shopCashBox = await getCashBoxById(shopId);
                        if(paymentType == 'Cash') {
                              if (shopCashBox < totalSum) {
                                    return res.status(400).send('Cash box is not enough!');
                              }
                        }
                        
                        await addPurchasesBill(newBill, shopId, indexOfProducts, items);

                        if (employeeData.typeOfEmployee === 'Accountant') {
                              return res.redirect(`/accountant-employee-dashboard/purchases-bills`);
                        } else {
                              return res.status(400).send('Not allowed!');
                        }
                  }
            }
            return res.status(401).send('Unauthorized!');

      } catch (err) {
            console.log('Error in httpAddNewSalesBill:', err);
            return res.status(500).send('Internal Server Error');
      }
}

async function httpAddNewPurchasesReturnBill(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        let {
                              date,
                              clientName,
                              clientPhone,
                              totalSum,
                              items,
                              value,
                              indexOfProducts
                        } = req.body;
                        const managerName = await getManagerNameById(managerId);
                        const paymentType = 'Cash';
                        // Validate required fields
                        if (!date || !paymentType || !totalSum || !items) {
                              return res.status(400).send('Please fill all fields');
                        }
                        if (paymentType !== 'Cash' && paymentType !== 'Debt') {
                              return res.status(400).send('Payment type must be Cash or Debt');
                        }
                        if (totalSum < 0) {
                              return res.status(400).send('Total sum must be a positive number');
                        }
                        if (items.length === 0) {
                              return res.status(400).send('Please add at least one product to the bill');
                        }
                        if (paymentType === 'Debt' && (!clientName || !clientPhone)) {
                              return res.status(400).send('Please fill client name and phone for debt payment');
                        }

                        // Check product quantities in store
                        const storeId = await getStoreIdByShopId(value);
                        for (let j = 0; j < indexOfProducts.length; j++) {
                              const i = indexOfProducts[j];
                              if (i !== -1) {
                                    const quantityInStore = await getQuantityByIndexAndStoreId(i, storeId);
                                    if (quantityInStore < items[j].quantity) {
                                          return res.status(400).send('Insufficient quantity in store');
                                    }
                              }
                        }

                        // Default values for client name and phone if not provided
                        clientName = clientName || 'Non';
                        clientPhone = clientPhone || 'Non';

                        const shopName = await getShopNameById(value);
                        const newBill = {
                              type: 'Purchases return',
                              paymentType,
                              date,
                              owner: managerId,
                              writerName: managerName,
                              clientName,
                              clientPhone,
                              shopName,
                              total: totalSum,
                              products: items
                        };

                        await addPurchasesReturnBill(newBill, value, indexOfProducts, items);
                        return res.redirect(`manager-dashboard/purchases-return-bill/${value}`);
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        let {
                              date,
                              clientName,
                              clientPhone,
                              totalSum,
                              items,
                              indexOfProducts
                        } = req.body;
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(400).send('Employee not found');
                        }
                        if (employeeData.typeOfEmployee !== 'Accountant') {
                              return res.status(400).send('Not allowed!');
                        }
                        const shopId = employeeData.shopId;
                        if (!shopId) {
                              return res.status(400).send('Shop id not found');
                        }

                        const employeeName = employeeData.fullName;
                        const paymentType = 'Cash';
                        // Validate required fields
                        if (!date || !paymentType || !totalSum || !items) {
                              return res.status(400).send('Please fill all fields');
                        }
                        if (totalSum < 0) {
                              return res.status(400).send('Total sum must be a positive number');
                        }
                        if (items.length === 0) {
                              return res.status(400).send('Please add at least one product to the bill');
                        }

                        const storeId = await getStoreIdByShopId(shopId);
                        for (let j = 0; j < indexOfProducts.length; j++) {
                              const i = indexOfProducts[j];
                              if (i !== -1) {
                                    const quantityInStore = await getQuantityByIndexAndStoreId(i, storeId);
                                    if (quantityInStore < items[j].quantity) {
                                          return res.status(400).send('Insufficient quantity in store');
                                    }
                              }
                        }

                        // Default values for client name and phone if not provided
                        clientName = clientName || 'Non';
                        clientPhone = clientPhone || 'Non';

                        const managerId = employeeData.supervisor;
                        const shopName = await getShopNameById(shopId);
                        const newBill = {
                              type: 'Purchases return',
                              paymentType,
                              date,
                              owner: managerId,
                              writerName: employeeName,
                              clientName,
                              clientPhone,
                              shopName,
                              total: totalSum,
                              products: items
                        };

                        await addPurchasesReturnBill(newBill, shopId, indexOfProducts, items);


                        if (employeeData.typeOfEmployee === 'Accountant') {
                              return res.redirect(`/accountant-employee-dashboard/purchases-bills`);
                        }
                  }
            }
            return res.status(401).send('Unauthorized!');

      } catch (err) {
            console.log('Error in httpAddNewSalesBill:', err);
            return res.status(500).send('Internal Server Error');
      }
}

module.exports = {
      httpAddNewSalesBill,
      httpAddNewSalesReturnBill,
      httpAddNewPurchasesBill,
      httpAddNewPurchasesReturnBill,
}