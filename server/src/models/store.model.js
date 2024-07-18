const storeData = require('./store.mongo');
const employeeData = require('./employee.mongo');
async function getStoresByManagerId(managerId) {
      return await storeData.find({
            owner: managerId,
      }).sort({ _id: -1 });
}


async function isOldStore(store) {
      return await storeData.findOne({
            name: store.name,
            location: store.location,
            owner: store.owner
      });
}

async function isOldStoreById(storeId) {
      return await storeData.findOne({
            _id: storeId
      });
}

async function addNewStore(store) {
      await storeData.updateOne(
            {
                  name: store.name,
                  location: store.location,
                  owner: store.owner
            },
            {
                  name: store.name,
                  location: store.location,
                  owner: store.owner
            },
            {
                  upsert: true,
            }
      );
}

async function deleteStore(storeId) {
      await storeData.deleteOne({
            _id: storeId
      });
}

async function editStore(newStore) {
      storeId = newStore._id;
      await storeData.findByIdAndUpdate(
            storeId,
            {
                  name: newStore.name,
                  location: newStore.location
            },
            { new: true }
      );
}

async function getStoreByIdAndManagerId(storeId, managerId) {
      return await storeData.findOne(
            {
                  _id: storeId,
                  owner: managerId
            }
      );
}

async function barcodeIsExistinStore(storeId, barcode) {
      try {
            const store = await storeData.findById(storeId).exec();
            if (!store) {
                  return false;
            }
            const existingProduct = store.products.find(product => product.barcode === barcode);
            if (existingProduct) {
                  return false;
            } else {
                  return true;
            }
      } catch (error) {
            return false;
      }
}

async function addNewProductToStore(storeId, product) {
      await storeData.updateOne(
            {
                  _id: storeId
            },
            {
                  $push: {
                        products: product
                  }
            }
      );
}

async function getStoresNameAndLocationByManagerId(mangerId) {
      return await storeData.find(
            {
                  owner: mangerId
            },
            {
                  _id: 1,
                  name: 1,
                  location: 1
            }
      ).sort({ _id: -1 });
}

async function productExistInStore(storeId, productIndex) {
      try {
            const store = await storeData.findById(storeId);
            if (!store) {
                  return false;
            }
            if (productIndex < 0 || productIndex >= store.products.length) {
                  return false;
            }

            return true;
      } catch (error) {
            console.error('Error checking product existence:', error);
            return false;
      }
}

async function editProductInStore(productIndex, storeId, newProductData) {
      const store = await storeData.findById(storeId);
      if (!store) {
            return false;
      }
      if (newProductData.barcode) {
            store.products[productIndex].barcode = newProductData.barcode;
      }
      if (newProductData.name) {
            store.products[productIndex].name = newProductData.name;
      }
      if (newProductData.originalPrice) {
            store.products[productIndex].originalPrice = newProductData.originalPrice;
      }
      if (newProductData.salePrice) {
            store.products[productIndex].salePrice = newProductData.salePrice;
      }
      if (newProductData.quantity) {
            store.products[productIndex].quantity = newProductData.quantity;
      }
      if (newProductData.unit) {
            store.products[productIndex].unit = newProductData.unit;
      }
      if (newProductData.expireDate) {
            store.products[productIndex].expireDate = newProductData.expireDate;
      }
      if (newProductData.details) {
            store.products[productIndex].details = newProductData.details;
      }
      await store.save();

}

async function deleteProduct(storeId, productIndex) {
      try {
            const store = await storeData.findById(storeId);
            if (!store) {
                  console.log('There is no store with this id!');
            }
            store.products.splice(productIndex, 1);
            await store.save();
      } catch (err) {
            console.error('Error deleting product:', err);
      }

}

async function getStoreByIdAndEmployeeId(storeId, employeeId) {
      try {
            const store = await storeData.findById(storeId);
            if (!store) {
                  console.log('There is no store with this id!');
            }
            const employee = await employeeData.findById(employeeId);
            if (!employee) {
                  console.log('There is no employee with this id!');
            }
            const shopId = employee.shopId;
            const shopId2 = store.shopRelation;
            if (shopId != shopId2) {
                  console.log('This employee is not working in this store!');
            }
            return store;
      } catch (err) {
            console.error('Error getting store by id and employee id:', err);
      }
}

async function getStoreByShopId(shopId) {
      try {
            const store = await storeData.findOne({ shopRelation: shopId });
            if (!store) {
                  console.log('There is no store with this shop id!');
                  return false;
            }
            return store;
      } catch (err) {
            console.error('Error getting store by shop id:', err);
      }
}

async function getStoreIdByShopId(shopId) {
      try {
            const store = await storeData.findOne({ shopRelation: shopId });
            if (!store) {
                  throw new Error('Store not found');
            }
            return store._id;
      } catch (err) {
            console.error('Error getting store by shop ID:', err);
            throw err;
      }
}

async function addBillTostore(storeId, productIndex, quantity) {
      const store = await storeData.findById(storeId);
      if (!store) {
            throw new Error('Store not found');
      }
      store.products[productIndex].quantity += quantity;
      await store.save();
}

async function getQuantityByIndexAndStoreId(index, storeId) {
      const store = await storeData.findById(storeId);
      if (!store || index < 0) {
            return 0;
      }
      return store.products[index].quantity;
}

module.exports = {
      getStoresByManagerId,
      isOldStore,
      addNewStore,
      deleteStore,
      isOldStoreById,
      editStore,
      getStoreByIdAndManagerId,
      barcodeIsExistinStore,
      addNewProductToStore,
      getStoresNameAndLocationByManagerId,
      productExistInStore,
      editProductInStore,
      deleteProduct,
      getStoreByIdAndEmployeeId,
      getStoreByShopId,
      getStoreIdByShopId,
      addBillTostore,
      getQuantityByIndexAndStoreId,
};