const express = require('express');
const {
      httpGetReminders,
} = require('./reminder.controller');

const getReminders = express.Router();

getReminders.get('/reminders', httpGetReminders);

module.exports = getReminders;