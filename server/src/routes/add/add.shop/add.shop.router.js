const express = require('express');
const {
      httpAddShop
} = require('./add.shop.controller');

const addShop = express.Router();

addShop.post('/add-new-shop', httpAddShop);

module.exports = addShop;