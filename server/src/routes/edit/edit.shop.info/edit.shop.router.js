const express = require('express');
const {
      httpEditShop
} = require('./edit.shop.controller');

const editAShop = express.Router();

editAShop.post('/edit-shop/:id', httpEditShop);

module.exports = editAShop;