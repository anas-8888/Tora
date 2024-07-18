const express = require('express');
const {
      httpgetManagerDashboardInfo,
      httpgetManagerEmployeesInfo,
      httpgetManagerProfileInfo
} = require('./manager.controller.js');

const getManagerInfo = express.Router();

getManagerInfo.get('/manager-dashboard-info', httpgetManagerDashboardInfo);
getManagerInfo.get('/manager-emplyees-info', httpgetManagerEmployeesInfo);
getManagerInfo.get('/manager-profile-info', httpgetManagerProfileInfo);

module.exports = getManagerInfo;