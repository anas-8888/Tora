const {
      deleteEmployee,
      isOldEmployeeById,
      getEmployeeById,
} = require('../../../models/employee.model');

async function httpDeleteEmployee(req, res) {
      try {

            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const employeeId = req.params.id;
                        const oldEmployee = await isOldEmployeeById(employeeId);
                        if (!oldEmployee) {
                              throw new Error('Employee not found');
                        }

                        const managerHasEmployee = oldEmployee.supervisor == managerId;
                        if (!managerHasEmployee) {
                              throw new Error("You can't delete this employee!");
                        }
                        await deleteEmployee(employeeId);
                        return res.redirect('/get-all-employee');
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        const type = employeeData.typeOfEmployee;
                        if (!employeeData) {
                              return res.status(404).send('Not found!');
                        }
                        const employeeIdParam = req.params.id;
                        if (!employeeIdParam) {
                              return res.status(404).send('Employee id not found!');
                        }
                        if (type != 'CEO') {
                              return res.status(400).send('Not allowed!');
                        }
                        const shopId = employeeData.shopId;
                        const oldEmployee = await isOldEmployeeById(employeeIdParam);
                        if (!oldEmployee) {
                              throw new Error('Employee not found');
                        }

                        const oldEmployeeShopId = String(oldEmployee.shopId).trim();
                        const currentShopId = String(shopId).trim();

                        if (oldEmployeeShopId !== currentShopId) {
                              throw new Error('You can not edit this employee');
                        }

                        await deleteEmployee(employeeIdParam);
                        return res.redirect('/ceo-employee-dashboard/all-employees');
                  }
            }
      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpDeleteEmployee,
};