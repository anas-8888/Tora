const express = require('express');
const {
      httpDeleteClient
} = require('./delete.client.controller');

const deleteAClient = express.Router();

deleteAClient.delete('/delete-client/:id', httpDeleteClient);

module.exports = deleteAClient;