const express = require('express');
const {
      httpDeleteEmployee
} = require('./delete.employee.controller');

const deleteEmployee = express.Router();

deleteEmployee.delete('/employee-delete/:id', httpDeleteEmployee);

module.exports = deleteEmployee;