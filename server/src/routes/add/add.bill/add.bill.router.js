const express = require('express');
const {
      httpAddNewSalesBill,
      httpAddNewSalesReturnBill,
      httpAddNewPurchasesBill,
      httpAddNewPurchasesReturnBill
} = require('./add.bill.controller');

const addBill = express.Router();

addBill.post('/add-sales-bill', httpAddNewSalesBill);
addBill.post('/add-sales-return-bill', httpAddNewSalesReturnBill);
addBill.post('/add-purchases-bill', httpAddNewPurchasesBill);
addBill.post('/add-purchases-return-bill', httpAddNewPurchasesReturnBill);

module.exports = addBill;