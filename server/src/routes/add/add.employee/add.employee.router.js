const express = require('express');
const {
      httpAddNewEmployee,
} = require('./add.employee.controller');

const addEmployee = express.Router();

addEmployee.post('/add-new-employee', httpAddNewEmployee);

module.exports = addEmployee;