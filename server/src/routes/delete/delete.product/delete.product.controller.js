const {
      productExistInStore,
      getStoreByIdAndManagerId,
      deleteProduct,
      getStoreIdByShopId
} = require('./../../../models/store.model');
const {
      getEmployeeById
} = require('./../../../models/employee.model');

async function httpDeleteProduct(req, res) {
      try {

            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const storeId = req.params.storeid;
                        if (!storeId) {
                              throw new Error('Store id is required');
                        }
                        const productIndex = req.params.productid;
                        if (!productIndex) {
                              throw new Error('Product id is required');
                        }

                        const productExist = await productExistInStore(storeId, productIndex);
                        if (!productExist) {
                              return res.status(400).json({ message: "You havn't this productrcode!" });
                        }
                        const managerHasStore = await getStoreByIdAndManagerId(storeId, managerId);
                        if (!managerHasStore) {
                              return res.status(400).json({ message: "You can't edit in this store!" });
                        }

                        await deleteProduct(storeId, productIndex);
                        return res.redirect(`/manager-dashboard/stores/${storeId}`);
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              throw new Error('Employee not found');
                        }
                        const managerId = employeeData.supervisor;
                        const type = employeeData.typeOfEmployee;
                        const storeId = req.params.storeid;
                        if (!storeId) {
                              throw new Error('Store id is required');
                        }
                        const productIndex = req.params.productid;
                        if (!productIndex) {
                              throw new Error('Product id is required');
                        }

                        const productExist = await productExistInStore(storeId, productIndex);
                        if (!productExist) {
                              return res.status(400).json({ message: "You havn't this productrcode!" });
                        }
                        const managerHasStore = await getStoreByIdAndManagerId(storeId, managerId);
                        if (!managerHasStore) {
                              return res.status(400).json({ message: "You can't edit in this store!" });
                        }

                        if (type === 'Store Keeper') {
                              await deleteProduct(storeId, productIndex);
                              return res.redirect(`/store-keeper-employee-dashboard/stores/${storeId}`);
                        } else {
                              const shopId = employeeData.shopId;
                              const employeeStore = await getStoreIdByShopId(shopId);
                              if (employeeStore != storeId) {
                                    return res.status(400).send("You can't edit this product!");
                              }
                              await deleteProduct(storeId, productIndex);
                              if (type === 'CEO') {
                                    return res.redirect(`/ceo-employee-dashboard/stores`);
                              } else if (type === 'Accounting Manager') {
                                    return res.redirect(`/accounting-manager-employee-dashboard/stores`);
                              } else if (type === 'Accountant') {
                                    return res.redirect(`/accountant-employee-dashboard/stores`);
                              }
                        }
                  }
            }
            return res.status(400).send("You can't edit this product!");
      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpDeleteProduct
};