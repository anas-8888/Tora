const billData = require('./bill.mongo');
const storeData = require('./store.mongo');
const {
      ObjectId,
} = require('mongoose');
const {
      editCashBox
} = require('./shop.model');
const {
      getStoreIdByShopId,
      addBillTostore
} = require('./store.model');
const {
      addNewClient
} = require('./client.model');

async function getProfitOfAllBillPerDay(managerId, dayInMiliSecond) {
      try {
            const startOfDayDamascus = new Date(dayInMiliSecond);
            startOfDayDamascus.setUTCHours(0, 0, 0, 0); // Set to 00:00:00 UTC
            const utcOffsetInMinutes = 120; // Damascus, Syria is UTC+2
            const startOfDayUTC = new Date(startOfDayDamascus.getTime() - utcOffsetInMinutes * 60000);
            const endOfDayUTC = new Date(startOfDayUTC.getTime() + 24 * 60 * 60 * 1000);

            const bills = await billData.find({
                  type: 'Sales',
                  owner: managerId,
                  date: {
                        $gte: startOfDayUTC,
                        $lt: endOfDayUTC,
                  }
            });

            return bills.reduce((acc, bill) => {
                  const billProfit = bill.products.reduce((productAcc, product) => {
                        const profit = (product.salePrice || 0) - (product.originalPrice || 0);
                        return productAcc + profit * product.quantity;
                  }, 0);
                  return acc + billProfit;
            }, 0);

      } catch (error) {
            console.error('Error fetching bills:', error);
            throw error;
      }
}



async function getProfitOfAllBillPerMonth(managerId, monthInMiliSecond) {
      try {
            const startDate = new Date(monthInMiliSecond);
            const year = startDate.getFullYear();
            const month = startDate.getMonth();

            // Start date is the first day of the month
            const startOfMonth = new Date(year, month, 1);

            // End date is the first day of the next month, which makes it non-inclusive of the first day of the next month
            const endOfMonth = new Date(year, month + 1, 1);

            const bills = await billData.find({
                  type: 'Sales',
                  owner: managerId,
                  date: {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                  }
            });

            return bills.reduce((acc, bill) => {
                  const billProfit = bill.products.reduce((productAcc, product) => {
                        const profit = (product.salePrice || 0) - (product.originalPrice || 0);
                        return productAcc + profit * product.quantity;
                  }, 0);
                  return acc + billProfit;
            }, 0);

      } catch (error) {
            console.error('Error fetching bills:', error);
            throw error;
      }
}

async function getAllBillsByManagerIdAndShopName1(managerId, shopName) {
      try {
            const bills = await billData.find({
                  type: { $in: ['Sales', 'Sales return', 'Purchases', 'Purchases return'] },
                  owner: managerId,
                  shopName: shopName
            }).sort({ date: -1 }); // Sort by date in descending order

            return bills;
      } catch (error) {
            console.error('Error fetching bills:', error);
            throw error;
      }
}

async function getAllBillsByManagerIdAndShopName2(managerId, shopName) {
      try {
            const bills = await billData.find({
                  type: { $in: ['Sales', 'Sales return'] },
                  owner: managerId,
                  shopName: shopName
            }).sort({ date: -1 }); // Sort by date in descending order

            return bills;
      } catch (error) {
            console.error('Error fetching bills:', error);
            throw error;
      }
}

async function isOldBill(billId) {
      try {
            return await billData.find({
                  _id: billId,
            });
      } catch (error) {
            console.error('Error fetching bills:', error);
            throw error;
      }
}

async function addSalesBill(newBill, shopId, indexOfProducts, items) {
      try {
            await billData.updateOne(
                  newBill,
                  newBill,
                  { upsert: true }
            );
            let totalSum = newBill.total;
            if (newBill.paymentType === 'Debt') {
                  totalSum = 0;
            }
            await editCashBox(shopId, +totalSum);

            const store = await getStoreIdByShopId(shopId);
            const storeId = store ? store._id : null;
            if (!storeId) {
                  throw new Error('Store not found');
            }

            const productQuantities = items.reduce((acc, item, index) => {
                  if (indexOfProducts[index] !== -1) {
                        const productId = indexOfProducts[index];
                        acc[productId] = (acc[productId] || 0) + item.quantity;
                  }
                  return acc;
            }, {});

            const updatePromises = Object.keys(productQuantities).map(async (productId) => {
                  const quantity = productQuantities[productId];
                  await addBillTostore(storeId, productId, -quantity);
            });

            await Promise.all(updatePromises);

            if (newBill.paymentType === 'Cash') {
                  newBill.total = 0;
            }

            const client = {
                  type: 'Client',
                  name: newBill.clientName,
                  phone: newBill.clientPhone,
                  owner: newBill.owner,
                  DebtPrice: newBill.total
            };
            if (client.name !== 'Non') {
                  await addNewClient(client);
            }

      } catch (err) {
            console.error('Error processing sales bill:', err);
            throw err;
      }
}

async function addSalesReturnBill(newBill, shopId, indexOfProducts, items) {
      try {
            await billData.updateOne(
                  newBill,
                  newBill,
                  { upsert: true }
            );
            let totalSum = newBill.total;
            await editCashBox(shopId, -totalSum);

            const store = await getStoreIdByShopId(shopId);
            const storeId = store ? store._id : null;
            if (!storeId) {
                  throw new Error('Store not found');
            }

            const productQuantities = items.reduce((acc, item, index) => {
                  if (indexOfProducts[index] !== -1) {
                        const productId = indexOfProducts[index];
                        acc[productId] = (acc[productId] || 0) + item.quantity;
                  }
                  return acc;
            }, {});

            const updatePromises = Object.keys(productQuantities).map(async (productId) => {
                  const quantity = productQuantities[productId];
                  await addBillTostore(storeId, productId, +quantity);
            });

            await Promise.all(updatePromises);

            const client = {
                  type: 'Client',
                  name: newBill.clientName,
                  phone: newBill.clientPhone,
                  owner: newBill.owner,
                  DebtPrice: 0
            };
            if (client.name !== 'Non') {
                  await addNewClient(client);
            }

      } catch (err) {
            console.error('Error processing sales bill:', err);
            throw err;
      }
}

async function addPurchasesBill(newBill, shopId, indexOfProducts, items) {
      try {
            await billData.updateOne(newBill, newBill, { upsert: true });

            let totalSum = newBill.total;
            if (newBill.paymentType === 'Debt') {
                  totalSum = 0;
            }
            await editCashBox(shopId, -totalSum);

            const store = await getStoreIdByShopId(shopId);
            const storeId = store ? store._id : null;
            if (!storeId) {
                  throw new Error('Store not found');
            }

            const storeDatas = await storeData.findOne({ _id: storeId });
            if (!storeDatas) {
                  throw new Error('Store data not found');
            }

            items.forEach((item, index) => {
                  const productIndex = indexOfProducts[index];
                  if (productIndex !== -1 && storeDatas.products[productIndex]) {
                        storeDatas.products[productIndex].quantity += item.quantity;
                        storeDatas.products[productIndex].originalPrice = item.originalPrice;
                  }
            });

            await storeDatas.save();

            if (newBill.paymentType === 'Cash') {
                  newBill.total = 0;
            }

            const client = {
                  type: 'Supplier',
                  name: newBill.clientName,
                  phone: newBill.clientPhone,
                  owner: newBill.owner,
                  DebtPrice: newBill.total
            };
            if (client.name !== 'Non') {
                  await addNewClient(client);
            }

      } catch (err) {
            console.error('Error processing sales bill:', err);
            throw err;
      }
}




async function addPurchasesReturnBill(newBill, shopId, indexOfProducts, items) {
      try {
            await billData.updateOne(
                  newBill,
                  newBill,
                  { upsert: true }
            );
            let totalSum = newBill.total;
            await editCashBox(shopId, +totalSum);

            const store = await getStoreIdByShopId(shopId);
            const storeId = store ? store._id : null;
            if (!storeId) {
                  throw new Error('Store not found');
            }

            const productQuantities = items.reduce((acc, item, index) => {
                  if (indexOfProducts[index] !== -1) {
                        const productId = indexOfProducts[index];
                        acc[productId] = (acc[productId] || 0) + item.quantity;
                  }
                  return acc;
            }, {});

            const updatePromises = Object.keys(productQuantities).map(async (productId) => {
                  const quantity = productQuantities[productId];
                  await addBillTostore(storeId, productId, -quantity);
            });

            await Promise.all(updatePromises);

            if (newBill.paymentType === 'Cash') {
                  newBill.total = 0;
            }

            const client = {
                  type: 'Supplier',
                  name: newBill.clientName,
                  phone: newBill.clientPhone,
                  owner: newBill.owner,
                  DebtPrice: newBill.total
            };
            if (client.name !== 'Non') {
                  await addNewClient(client);
            }

      } catch (err) {
            console.error('Error processing sales bill:', err);
            throw err;
      }
}

module.exports = {
      getProfitOfAllBillPerDay,
      getProfitOfAllBillPerMonth,
      getAllBillsByManagerIdAndShopName1,
      getAllBillsByManagerIdAndShopName2,
      isOldBill,
      addSalesBill,
      addSalesReturnBill,
      addPurchasesBill,
      addPurchasesReturnBill
}