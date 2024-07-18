const express = require('express');
const {
      httpAddNewProduct,
} = require('./add.product.controller.js');

const addProduct = express.Router();

addProduct.post('/add-new-product', httpAddNewProduct);

module.exports = addProduct;