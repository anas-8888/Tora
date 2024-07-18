const express = require('express');
const {
      httpDeleteShop
} = require('./delete.shop.controller');

const deleteAShop = express.Router();

deleteAShop.delete('/shop-delete/:id', httpDeleteShop);

module.exports = deleteAShop;