const express = require('express');
const {
      httpAddPaymentBond,
      httpAddReceiptBond
} = require('./add.bond.controller');

const addBond = express.Router();

addBond.post('/add-payment-bond', httpAddPaymentBond);
addBond.post('/add-receipt-bond', httpAddReceiptBond);

module.exports = addBond;