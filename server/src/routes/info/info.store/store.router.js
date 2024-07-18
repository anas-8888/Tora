const express = require('express');
const {
      httpGetProducts,
} = require('./store.controller.js');

const getStoreinfo = express.Router();

getStoreinfo.get('/stores-info/:id', httpGetProducts);

module.exports = getStoreinfo;