const express = require('express');
const {
      httpGetShopInfo,
      httpGetAllBills1,
      httpGetAllBills2,
      httpGetAllProducts
} = require('./shop.controller');

const getShopInfo = express.Router();

getShopInfo.get('/shops-info/:id', httpGetShopInfo);
getShopInfo.get('/all-bills1/:id', httpGetAllBills1);
getShopInfo.get('/all-bills2/:id', httpGetAllBills2);
getShopInfo.get('/all-products/:id', httpGetAllProducts);

module.exports = getShopInfo;