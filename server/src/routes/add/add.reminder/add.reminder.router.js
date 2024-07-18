const express = require('express');
const {
      httpAddReminder
} = require('./add.reminder.controller');

const addReminder = express.Router();

addReminder.post('/add-reminders', httpAddReminder);

module.exports = addReminder;