const express = require('express');
const {
      httpDeleteProduct
} = require('./delete.product.controller');

const deleteProduct = express.Router();

deleteProduct.delete('/product-delete/:storeid/:productid', httpDeleteProduct);

module.exports = deleteProduct;