const express = require('express');
const {
      httpGetEmployee,
} = require('./auth.employee.controller');

const authEmployee = express.Router();

authEmployee.post('/employee-login', httpGetEmployee);

module.exports = authEmployee;