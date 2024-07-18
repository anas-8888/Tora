const express = require('express');
const {
      httpGetAllEmployeeProfileInfo,
      httpGetAllStoresInfo,
      httpGetAllEmployeeInfo
} = require('./employee.controller');

const getEmployeeInfo = express.Router();

getEmployeeInfo.get('/employee-profile-info', httpGetAllEmployeeProfileInfo);
getEmployeeInfo.get('/store-keeper-info', httpGetAllStoresInfo);
getEmployeeInfo.get('/emplyees-info', httpGetAllEmployeeInfo);

module.exports = getEmployeeInfo;