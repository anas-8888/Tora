const {
      editProductInStore,
      barcodeIsExistinStore,
      productExistInStore,
      getStoreByIdAndManagerId,
} = require('./../../../models/store.model');
const {
      getEmployeeById
} = require('./../../../models/employee.model');

async function httpEditProduct(req, res) {
      try {

            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  const logDate = manager.logDate;
                  if (managerId) {
                        const storeId = req.params.storeid;
                        if (!storeId) {
                              return res.status(404).send('Store id not found');
                        }
                        const productIndex = req.params.productid;
                        if (!productIndex) {
                              return res.status(404).send('Product index not found');
                        }
                        const {
                              barcode,
                              name,
                              originalPrice,
                              salePrice,
                              unit,
                              expireDate,
                              details,
                        } = req.body;
                        let newProductData = {};
                        if (barcode) {
                              const barcodeIsExist = await barcodeIsExistinStore(storeId, barcode);
                              if (!barcodeIsExist) {
                                    return res.status(400).json({ message: 'You have an old product with same barcode!' });
                              }
                              newProductData.barcode = barcode;
                        }
                        if (name) {
                              newProductData.name = name;
                        }
                        if (originalPrice) {
                              newProductData.originalPrice = originalPrice;
                        }
                        if (salePrice) {
                              newProductData.salePrice = salePrice;
                        }
                        if (unit) {
                              newProductData.unit = unit;
                              if (unit !== 'Piece' && unit !== 'Crate' && unit !== 'Carton' && unit !== 'Can' && unit !== 'Bag' && unit !== 'Pallet' && unit !== 'Barrel' && unit !== 'Tube' && unit !== 'Jar') {
                                    return res.status(400).json({ message: 'pleas fill a true unit!' });
                              }
                        }
                        if (expireDate) {
                              newProductData.expireDate = expireDate;
                              if (new Date(expireDate).getTime() < Date.now()) {
                                    return res.status(400).json({ message: 'pleas Enter a well expire date!' });
                              }
                        }
                        if (details) {
                              newProductData.details = details;
                        }
                        const productExist = await productExistInStore(storeId, productIndex);
                        if (!productExist) {
                              return res.status(400).json({ message: "You havn't this productrcode!" });
                        }
                        const managerHasStore = await getStoreByIdAndManagerId(storeId, managerId);
                        if (!managerHasStore) {
                              return res.status(400).json({ message: "You can't edit in this store!" });
                        }
                        await editProductInStore(productIndex, storeId, newProductData);

                        return res.redirect(`/manager-dashboard/stores/${storeId}`);
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(404).send('Not found!');
                        }
                        const type = employeeData.typeOfEmployee;
                        const storeId = req.params.storeid;
                        const managerId = employeeData.supervisor;
                        if (!storeId) {
                              return res.status(404).send('Store id not found');
                        }
                        const productIndex = req.params.productid;
                        if (!productIndex) {
                              return res.status(404).send('Product index not found');
                        }
                        const {
                              barcode,
                              name,
                              originalPrice,
                              salePrice,
                              unit,
                              expireDate,
                              details,
                        } = req.body;
                        let newProductData = {};
                        if (barcode) {
                              const barcodeIsExist = await barcodeIsExistinStore(storeId, barcode);
                              if (!barcodeIsExist) {
                                    return res.status(400).json({ message: 'You have an old product with same barcode!' });
                              }
                              newProductData.barcode = barcode;
                        }
                        if (name) {
                              newProductData.name = name;
                        }
                        if (originalPrice) {
                              newProductData.originalPrice = originalPrice;
                        }
                        if (salePrice) {
                              newProductData.salePrice = salePrice;
                        }
                        if (unit) {
                              newProductData.unit = unit;
                              if (unit !== 'Piece' && unit !== 'Crate' && unit !== 'Carton' && unit !== 'Can' && unit !== 'Bag' && unit !== 'Pallet' && unit !== 'Barrel' && unit !== 'Tube' && unit !== 'Jar') {
                                    return res.status(400).json({ message: 'pleas fill a true unit!' });
                              }
                        }
                        if (expireDate) {
                              newProductData.expireDate = expireDate;
                              if (new Date(expireDate).getTime() < Date.now()) {
                                    return res.status(400).json({ message: 'pleas Enter a well expire date!' });
                              }
                        }
                        if (details) {
                              newProductData.details = details;
                        }
                        const productExist = await productExistInStore(storeId, productIndex);
                        if (!productExist) {
                              return res.status(400).json({ message: "You havn't this product barcode!" });
                        }
                        const managerHasStore = await getStoreByIdAndManagerId(storeId, managerId);
                        if (!managerHasStore) {
                              return res.status(400).json({ message: "You can't edit in this store!" });
                        }
                        await editProductInStore(productIndex, storeId, newProductData);
                        if (type === 'CEO') {
                              return res.redirect(`/ceo-employee-dashboard/stores`);
                        } else if (type === 'Accounting Manager') {
                              return res.redirect(`/accounting-manager-employee-dashboard/stores`);
                        } else if (type === 'Accountant') {
                              return res.redirect(`/accountant-employee-dashboard/stores`);
                        } else if (type === 'Store Keeper') {
                              return res.redirect(`/store-keeper-employee-dashboard/stores/${storeId}`);
                        }
                  }
            }
            return res.status(400).send('Not allowed!');
      } catch (err) {
            console.log(err);
      }

}

module.exports = {
      httpEditProduct,
};