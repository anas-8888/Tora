const express = require('express');
const {
      httpEditEmployee
} = require('./edit.employee.info.controller');

const editEmployee = express.Router();

editEmployee.post('/edit-employee/:id', httpEditEmployee);

module.exports = editEmployee;