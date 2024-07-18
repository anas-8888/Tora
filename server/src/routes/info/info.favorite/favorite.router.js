const express = require('express');
const {
      httpGetAllFavoriteBillsInfo,
} = require('./favorite.controller');

const GetAllFavoriteBillsInfo = express.Router();

GetAllFavoriteBillsInfo.get('/favorite-data', httpGetAllFavoriteBillsInfo);

module.exports = GetAllFavoriteBillsInfo;