const express = require('express');
const {
      httpEditStore
} = require('./edit.store.controller.js');

const editAStore = express.Router();

editAStore.post('/edit-store/:id', httpEditStore);

module.exports = editAStore;