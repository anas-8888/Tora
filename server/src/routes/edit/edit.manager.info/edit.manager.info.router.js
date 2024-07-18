const express = require('express');
const {
      httpEditManagerInfo
} = require('./edit.manager.info.controller.js');

const editManagerInfo = express.Router();

editManagerInfo.post('/manager-profile', httpEditManagerInfo);

module.exports = editManagerInfo;