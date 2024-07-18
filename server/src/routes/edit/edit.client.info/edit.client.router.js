const express = require('express');
const {
      httpEditClient
} = require('./edit.client.controller.js');

const editAClient = express.Router();

editAClient.post('/edit-client', httpEditClient);

module.exports = editAClient;