const {
      getStoreByIdAndManagerId,
      getStoreIdByShopId,
      getStoresByManagerId
} = require('./../../../models/store.model');
const {
      getEmployeeById
} = require('./../../../models/employee.model');

async function httpGetProducts(req, res) {
      try {

            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const storeId = req.params.id;
                        if (!storeId) {
                              return res.status(400).json({ message: 'Store id is required.' });
                        }
                        const store = await getStoreByIdAndManagerId(storeId, managerId);
                        if (!store) {
                              return res.status(400).json({ message: 'Store not found.' });
                        }
                        const products = store.products;
                        const logDate = manager.logDate;
                        const name = store.name;
                        const location = store.location;
                        return res.json({
                              products,
                              logDate,
                              name,
                              location,
                              storeId,
                        });
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        const type = employeeData.typeOfEmployee;
                        if (type !== 'CEO' && type !== 'Accounting Manager' && type !== 'Accountant' && type !== 'Store Keeper') {
                              return res.status(400).send('You are not authorized to view this page!');
                        }
                        const managerId = employeeData.supervisor;
                        const shopId = employeeData.shopId;
                        if (type === 'Store Keeper') {
                              const storeId = req.params.id;
                              if (!storeId) {
                                    return res.status(400).json({ message: 'Store id is required.' });
                              }
                              const store = await getStoreByIdAndManagerId(storeId, managerId);
                              if (!store) {
                                    return res.status(400).json({ message: 'Store not found.' });
                              }
                              const products = store.products;
                              const logDate = employee.logDate;
                              const name = store.name;
                              const location = store.location;
                              return res.json({
                                    products,
                                    logDate,
                                    name,
                                    location,
                                    storeId,
                              });
                        } else {
                              const storeId = await getStoreIdByShopId(shopId);
                              if (!storeId) {
                                    return res.status(400).json({ message: 'Store id is required.' });
                              }
                              const store = await getStoreByIdAndManagerId(storeId, managerId);
                              if (!store) {
                                    return res.status(400).json({ message: 'Store not found.' });
                              }
                              const products = store.products;
                              const logDate = employee.logDate;
                              const name = store.name;
                              const location = store.location;
                              return res.json({
                                    products,
                                    logDate,
                                    name,
                                    location,
                                    storeId,
                              });
                        }
                  }
            }
            return res.status(400).send('Not allowed!');
      } catch (err) {
            console.log(err);
      }
}

module.exports = {
      httpGetProducts
};