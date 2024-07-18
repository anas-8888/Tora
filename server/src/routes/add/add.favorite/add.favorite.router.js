const express = require('express');
const {
      httpAddFavoriteBills
} = require('./add.favorite.controller');

const AddFavoriteBills = express.Router();

AddFavoriteBills.post('/favorite-bills', httpAddFavoriteBills);

module.exports = AddFavoriteBills;