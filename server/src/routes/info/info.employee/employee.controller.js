const {
      getEmployeeById,
      getAllEmployeesByManagerIdAndShopId
} = require('../../../models/employee.model');
const {
      getShopNameById
} = require('../../../models/shop.model');
const {
      getManagerById
} = require('../../../models/manager.model');
const {
      getStoresNameAndLocationByManagerId
} = require('../../../models/store.model');

async function httpGetAllEmployeeProfileInfo(req, res) {
      const employee = req.session.employee;
      if (employee) {
            const employeeId = employee.userId;
            if (employeeId) {
                  const employeeData = await getEmployeeById(employeeId);
                  const logDate = employee.logDate;
                  if (employeeData.typeOfEmployee === 'Store Keeper') {
                        const managerId = employeeData.supervisor;
                        const managerData = await getManagerById(managerId);
                        const managerName = managerData.fullName;
                        const companyName = managerData.companyName;
                        return res.json({
                              employeeData,
                              logDate,
                              shopName: 'All stores',
                              managerName,
                              companyName
                        });
                  } else {
                        const shopId = employeeData.shopId;
                        const shopName = await getShopNameById(shopId);
                        const managerId = employeeData.supervisor;
                        const managerData = await getManagerById(managerId);
                        const managerName = managerData.fullName;
                        const companyName = managerData.companyName;
                        return res.json({
                              employeeData,
                              logDate,
                              shopName,
                              managerName,
                              companyName
                        });
                  }
            }
      }
      return res.status(401).send('Unauthorized!');
}

async function httpGetAllStoresInfo(req, res) {
      try {
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(404).send('Employee not found!');
                        }
                        const logDate = employee.logDate;
                        if (employeeData.typeOfEmployee === 'Store Keeper') {
                              const managerId = employeeData.supervisor;
                              const stores = await getStoresNameAndLocationByManagerId(managerId);
                              return res.json({
                                    logDate,
                                    stores
                              });
                        }
                  }
            }
            return res.status(404).send('Employee not found!');
      } catch (err) {
            console.log(err);
      }
}

async function httpGetAllEmployeeInfo(req, res) {
      try {
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(404).send('Employee not found!');
                        }
                        const logDate = employee.logDate;
                        const type = employeeData.typeOfEmployee;
                        const managerId = employeeData.supervisor;
                        if (type === 'CEO') {
                              const shopId = employeeData.shopId;
                              const employees = await getAllEmployeesByManagerIdAndShopId(managerId, shopId, employeeId);
                              return res.json({
                                    logDate,
                                    employees
                              });
                        }
                  }
            }
            return res.status(400).send('Not allowed!');
      } catch (err) {
            console.log(err);
      }
}

module.exports = {
      httpGetAllEmployeeProfileInfo,
      httpGetAllStoresInfo,
      httpGetAllEmployeeInfo
};