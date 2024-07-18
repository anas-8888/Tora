const express = require('express');
const {
      httpAddNewManager,
} = require('./add.manager.controller');

const addManager = express.Router();

addManager.post('/register', httpAddNewManager);

module.exports = addManager;