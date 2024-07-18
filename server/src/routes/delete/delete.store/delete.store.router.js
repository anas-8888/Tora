const express = require('express');
const {
      httpDeleteStore
} = require('./delete.store.controller');

const deleteAStore = express.Router();

deleteAStore.delete('/store-delete/:id', httpDeleteStore);

module.exports = deleteAStore;