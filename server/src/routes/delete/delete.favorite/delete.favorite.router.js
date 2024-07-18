const express = require('express');
const {
      httpDeleteFavoriteBill
} = require('./delete.favorite.controller');

const deleteFavoriteBill = express.Router();

deleteFavoriteBill.delete('/remove-favorite-bill', httpDeleteFavoriteBill);

module.exports = deleteFavoriteBill;