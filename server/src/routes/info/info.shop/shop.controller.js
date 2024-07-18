const {
      getShopByIdAndManagerId,
      getShopNameById,
      getCashBoxById,
      isOldShopById,
} = require('../../../models/shop.model');
const {
      getStoreByShopId
} = require('../../../models/store.model');
const {
      getAllBillsByManagerIdAndShopName1,
      getAllBillsByManagerIdAndShopName2
} = require('../../../models/bill.model');
const {
      getEmployeeById,
} = require('../../../models/employee.model');
async function httpGetShopInfo(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const shopId = req.params.id;
                        if (!shopId) {
                              return res.status(400).send('Shop id is required');
                        }
                        else {
                              const shop = await getShopByIdAndManagerId(shopId, managerId);
                              if (shop) {
                                    const type = 'Manager';
                                    return res.status(200).json({
                                          shop,
                                          type
                                    });
                              } else {
                                    return res.status(404).send('Shop not found');
                              }
                        }
                  }
            }

            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              res.status(400).send("Couldn't find employee");
                        }
                        const type = employeeData.typeOfEmployee;
                        let shop;
                        if (type === 'Store Keeper') {
                              shop = {
                                    name: 'All shops',
                                    box: 'No box',
                                    location: 'No location'
                              };
                        } else {
                              const shopId = employeeData.shopId;
                              if (!shopId) {
                                    return res.status(400).send('Shop id is required');
                              }
                              shop = await isOldShopById(shopId);
                              if (!shop) {
                                    res.status(400).send("Couldn't find shop");
                              }
                        }
                        const logDate = employee.logDate;
                        return res.status(200).json({
                              shop,
                              type,
                              logDate
                        });
                  }
            }
            return res.status(404).send('Not found');

      } catch (err) {
            console.log(err);
      }
}

async function httpGetAllBills1(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const shopId = req.params.id;
                        if (!shopId) {
                              return res.status(400).send('Shop id is required');
                        }
                        else {
                              const shopName = await getShopNameById(shopId);
                              const bills = await getAllBillsByManagerIdAndShopName1(managerId, shopName);

                              if (bills) {
                                    return res.status(200).json(bills);
                              } else {
                                    return res.status(404).send('Shop not found');
                              }
                        }
                  }
            }

            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(404).send('No employee found!');
                        }
                        const shopId = employeeData.shopId;
                        const type = employeeData.typeOfEmployee;
                        if (type !== 'CEO' && type !== 'Accounting Manager' && type !== 'Accountant') {
                              return res.status(404).send('Not allowed!');
                        }
                        const shopName = await getShopNameById(shopId);
                        const managerId = employeeData.supervisor;
                        const bills = await getAllBillsByManagerIdAndShopName1(managerId, shopName);

                        if (bills) {
                              const logDate = employee.logDate;
                              return res.status(200).json({
                                    bills,
                                    logDate,
                              });
                        }
                        return res.status(404).send('No bills found!');
                  }
            }
            return res.status(400).send('Not allowed!');
      } catch (err) {
            console.log(err);
      }
}

async function httpGetAllBills2(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  return res.status(400).send('Not allowed');
            }

            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(404).send('No employee found!');
                        }
                        const shopId = employeeData.shopId;
                        const type = employeeData.typeOfEmployee;
                        if (type !== 'Sales') {
                              return res.status(404).send('Not allowed!');
                        }
                        const shopName = await getShopNameById(shopId);
                        const managerId = employeeData.supervisor;
                        const bills = await getAllBillsByManagerIdAndShopName2(managerId, shopName);

                        if (bills) {
                              const logDate = employee.logDate;
                              return res.status(200).json({
                                    bills,
                                    logDate,
                              });
                        }
                        return res.status(404).send('No bills found!');
                  }
            }
            return res.status(400).send('Not allowed!');
      } catch (err) {
            console.log(err);
      }
}

async function httpGetAllProducts(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const shopId = req.params.id;
                        if (!shopId) {
                              return res.status(400).send('Shop id is required');
                        }
                        const store = await getStoreByShopId(shopId);
                        if (!store) {
                              return res.status(404).send('store not found');
                        }
                        const shopCashBox = await getCashBoxById(shopId);
                        return res.status(200).json({
                              store,
                              shopCashBox
                        });
                  }

            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(404).send('Employee not found');
                        }
                        const shopId = employeeData.shopId;
                        if (!shopId) {
                              return res.status(400).send('Shop id is required');
                        }
                        const store = await getStoreByShopId(shopId);
                        if (!store) {
                              return res.status(404).send('store not found');
                        }
                        const shopCashBox = await getCashBoxById(shopId);
                        const logDate = employee.logDate;
                        return res.status(200).json({
                              store,
                              shopCashBox,
                              logDate,
                        });
                  }
            }
            return res.status(401).send('Unauthorized');

      } catch (err) {
            console.log(err);
      }
}

module.exports = {
      httpGetShopInfo,
      httpGetAllBills1,
      httpGetAllBills2,
      httpGetAllProducts
};