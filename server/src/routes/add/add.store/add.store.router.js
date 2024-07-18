const express = require('express');
const {
      httpAddStore
} = require('./add.store.controller');

const addStore = express.Router();

addStore.post('/add-new-store', httpAddStore);

module.exports = addStore;