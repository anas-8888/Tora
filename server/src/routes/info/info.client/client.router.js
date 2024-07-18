const express = require('express');
const {
      httpGetAllClient
} = require('./client.controller');

const getAllClient = express.Router();

getAllClient.get('/all-client', httpGetAllClient);

module.exports = getAllClient;