const express = require('express');
const {
      httpGetManager,
} = require('./auth.manager.controller');

const authManager = express.Router();

authManager.post('/manager-login', httpGetManager);

module.exports = authManager;