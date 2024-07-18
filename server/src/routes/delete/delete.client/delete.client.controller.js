const {
      isManagerHasClient,
      deleteClient
} = require('../../../models/client.model');
const {
      getEmployeeById
} = require('../../../models/employee.model');

async function httpDeleteClient(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const {
                              id
                        } = req.params;
                        if (!id) {
                              return res.status(400).send('id is required!');
                        }
                        const clientId = id;
                        const managerHasClient = await isManagerHasClient(managerId, clientId);
                        if (!managerHasClient) {
                              return res.status(400).send('manager has not this client!');
                        }
                        if (managerHasClient.DebtPrice != 0) {
                              return res.status(400).send('Client account is not clear!');
                        }
                        await deleteClient(clientId);
                        return res.redirect('/get-all-client');
                  }
            }
            const employee = req.session.employee;
            if(employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if(!employeeData) {
                              return res.status(400).send('employee not found!');
                        }
                        const type = employeeData.typeOfEmployee;
                        if(type !== 'Accounting Manager') {
                              return res.status(400).send('employee is not Accounting Manager!');
                        }
                        const managerId = employeeData.supervisor;
                        const {
                              id
                        } = req.params;
                        if (!id) {
                              return res.status(400).send('id is required!');
                        }
                        const clientId = id;
                        const managerHasClient = await isManagerHasClient(managerId, clientId);
                        if (!managerHasClient) {
                              return res.status(400).send('manager has not this client!');
                        }
                        if (managerHasClient.DebtPrice != 0) {
                              return res.status(400).send('Client account is not clear!');
                        }
                        await deleteClient(clientId);
                        return res.redirect('/Accounting-manager-employee-dashboard/all-client');
                  }
            }
            return res.status(400).send('Not allowed!');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpDeleteClient,
};