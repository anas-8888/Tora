const express = require('express');
const {
      httpEditProduct
} = require('./edit.product.info.controller.js');

const editProduct = express.Router();

editProduct.post('/edit-product/:storeid/:productid', httpEditProduct);

module.exports = editProduct;