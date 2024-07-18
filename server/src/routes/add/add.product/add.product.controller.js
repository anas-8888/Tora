const {
      barcodeIsExistinStore,
      getStoreByIdAndManagerId,
      addNewProductToStore,
      isOldStoreById,
      getStoreIdByShopId,
} = require('../../../models/store.model');
const {
      getEmployeeById
} = require('../../../models/employee.model');


async function httpAddNewProduct(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        let {
                              barcode,
                              name,
                              originalPrice,
                              salePrice,
                              quantity,
                              unit,
                              expireDate,
                              details,
                              storeId
                        } = req.body;
                        quantity = 0;
                        if (!barcode || !name || !originalPrice || !salePrice || !unit || !expireDate || !details || !storeId) {
                              return res.status(400).json({ message: 'pleas fill all fildes!' });
                        }
                        if (unit !== 'Piece' && unit !== 'Crate' && unit !== 'Carton' && unit !== 'Can' && unit !== 'Bag' && unit !== 'Pallet' && unit !== 'Barrel' && unit !== 'Tube' && unit !== 'Jar') {
                              return res.status(400).json({ message: 'pleas fill all fildes!' });
                        }
                        if (new Date(expireDate).getTime() < Date.now()) {
                              return res.status(400).json({ message: 'pleas Enter a well expire date!' });
                        }
                        const storeExist = await isOldStoreById(storeId);
                        if (!storeExist) {
                              return res.status(400).json({ message: 'There is no store to add products to it!' });
                        }
                        const barcodeIsExist = await barcodeIsExistinStore(storeId, barcode);
                        if (!barcodeIsExist) {
                              return res.status(400).json({ message: 'You have an old product with same barcode!' });
                        }

                        const managerHasStore = await getStoreByIdAndManagerId(storeId, managerId);
                        if (!managerHasStore) {
                              return res.status(400).json({ message: "You can't add to this store!" });
                        }
                        let product = {
                              barcode,
                              name,
                              originalPrice,
                              salePrice,
                              quantity,
                              unit,
                              expireDate,
                              details
                        };

                        await addNewProductToStore(storeId, product);
                        return res.redirect(`/manager-dashboard/stores/${storeId}`);
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(404).json({ message: 'Employee not found!' });
                        }
                        const managerId = employeeData.supervisor;
                        const type = employeeData.typeOfEmployee;
                        if (type === 'Store Keeper') {
                              let {
                                    barcode,
                                    name,
                                    originalPrice,
                                    salePrice,
                                    quantity,
                                    unit,
                                    expireDate,
                                    details,
                                    storeId
                              } = req.body;
                              quantity = 0;
                              if (!barcode || !name || !originalPrice || !salePrice || !unit || !expireDate || !details || !storeId) {
                                    return res.status(400).json({ message: 'pleas fill all fildes!' });
                              }
                              if (unit !== 'Piece' && unit !== 'Crate' && unit !== 'Carton' && unit !== 'Can' && unit !== 'Bag' && unit !== 'Pallet' && unit !== 'Barrel' && unit !== 'Tube' && unit !== 'Jar') {
                                    return res.status(400).json({ message: 'pleas fill all fildes!' });
                              }
                              if (new Date(expireDate).getTime() < Date.now()) {
                                    return res.status(400).json({ message: 'pleas Enter a well expire date!' });
                              }
                              const storeExist = await isOldStoreById(storeId);
                              if (!storeExist) {
                                    return res.status(400).json({ message: 'There is no store to add products to it!' });
                              }
                              const barcodeIsExist = await barcodeIsExistinStore(storeId, barcode);
                              if (!barcodeIsExist) {
                                    return res.status(400).json({ message: 'You have an old product with same barcode!' });
                              }

                              const managerHasStore = await getStoreByIdAndManagerId(storeId, managerId);
                              if (!managerHasStore) {
                                    return res.status(400).json({ message: "You can't add to this store!" });
                              }
                              let product = {
                                    barcode,
                                    name,
                                    originalPrice,
                                    salePrice,
                                    quantity,
                                    unit,
                                    expireDate,
                                    details
                              };

                              await addNewProductToStore(storeId, product);
                              return res.redirect(`/store-keeper-employee-dashboard/stores/${storeId}`);
                        } else {
                              const shopId = employeeData.shopId;
                              let {
                                    barcode,
                                    name,
                                    originalPrice,
                                    salePrice,
                                    quantity,
                                    unit,
                                    expireDate,
                                    details,
                              } = req.body;
                              quantity = 0;
                              if (!barcode || !name || !originalPrice || !salePrice || !unit || !expireDate || !details) {
                                    return res.status(400).json({ message: 'pleas fill all fildes!' });
                              }
                              if (unit !== 'Piece' && unit !== 'Crate' && unit !== 'Carton' && unit !== 'Can' && unit !== 'Bag' && unit !== 'Pallet' && unit !== 'Barrel' && unit !== 'Tube' && unit !== 'Jar') {
                                    return res.status(400).json({ message: 'pleas fill all fildes!' });
                              }
                              if (new Date(expireDate).getTime() < Date.now()) {
                                    return res.status(400).json({ message: 'pleas Enter a well expire date!' });
                              }
                              const storeId = await getStoreIdByShopId(shopId);
                              const barcodeIsExist = await barcodeIsExistinStore(storeId, barcode);
                              if (!barcodeIsExist) {
                                    return res.status(400).json({ message: 'You have an old product with same barcode!' });
                              }

                              const managerHasStore = await getStoreByIdAndManagerId(storeId, managerId);
                              if (!managerHasStore) {
                                    return res.status(400).json({ message: "You can't add to this store!" });
                              }
                              const employeeStore = await getStoreIdByShopId(shopId);
                              let product = {
                                    barcode,
                                    name,
                                    originalPrice,
                                    salePrice,
                                    quantity,
                                    unit,
                                    expireDate,
                                    details
                              };
                              await addNewProductToStore(storeId, product);
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
            return res.status(401).json({ message: 'You are not logged in.' })
      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpAddNewProduct
};