const {
      getAllClient
} = require('../../../models/client.model');
const {
      getEmployeeById
} = require('../../../models/employee.model');

async function httpGetAllClient(req, res) {
      const manager = req.session.manager;
      if (manager) {
            const managerId = manager.userId;
            if (managerId) {
                  const clients = await getAllClient(managerId);
                  const logDate = manager.logDate;
                  return res.json({
                        clients,
                        logDate
                  });
            }
      }
      const employee = req.session.employee;
      if (employee) {
            const employeeId = employee.userId;
            if (employeeId) {
                  const employeeData = await getEmployeeById(employeeId);
                  if(!employeeData) {
                        return res.status(404).send('Not found!');
                  }
                  const type = employeeData.typeOfEmployee;
                  if(type !== 'Accounting Manager') {
                        return res.status(400).send('Not allowed!');
                  }
                  const managerId = employeeData.supervisor;
                  const clients = await getAllClient(managerId);
                  const logDate = employee.logDate;
                  return res.json({
                        clients,
                        logDate
                  });

            }
      }
      return res.status(401).send('Unauthorized!');

}

module.exports = {
      httpGetAllClient
};