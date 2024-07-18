const {
      isManagerHasClient,
      nameExist,
      editClientInfo
} = require('../../../models/client.model');
const {
      getEmployeeById
} = require('../../../models/employee.model');

async function httpEditClient(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const {
                              newName,
                              newPhone,
                              clientId
                        } = req.body;
                        if (!clientId) {
                              return res.status(400).json({ message: 'Clint id not found!' });
                        }
                        const managerHasClient = await isManagerHasClient(managerId, clientId);
                        if (!managerHasClient) {
                              return res.status(400).json({ message: 'Manager does not have this client.' });
                        }

                        let newClient = {};
                        if (newName) {
                              const thisNameExist = await nameExist(newName, managerId);
                              if (thisNameExist) {
                                    return res.status(400).json({ message: 'This name already exist.' });
                              }
                              newClient.name = newName;
                        }
                        if (newPhone) {
                              newClient.phone = newPhone;
                        }

                        await editClientInfo(clientId, newClient);
                        return res.redirect('/get-all-client');
                  }
            }
            const employee = req.session.employee;
            if(employee) {
                  const employeeId = employee.userId;
                  if(employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if(!employeeData) {
                              return res.status(404).json('Employee not found!');
                        }
                        const type = employeeData.typeOfEmployee;
                        if(type !== 'Accounting Manager') {
                              return res.status(400).json('Not allowed!');
                        }
                        const managerId = employeeData.supervisor;
                        const {
                              newName,
                              newPhone,
                              clientId
                        } = req.body;
                        if (!clientId) {
                              return res.status(400).json({ message: 'Clint id not found!' });
                        }
                        const managerHasClient = await isManagerHasClient(managerId, clientId);
                        if (!managerHasClient) {
                              return res.status(400).json({ message: 'Manager does not have this client.' });
                        }

                        let newClient = {};
                        if (newName) {
                              const thisNameExist = await nameExist(newName, managerId);
                              if (thisNameExist) {
                                    return res.status(400).json({ message: 'This name already exist.' });
                              }
                              newClient.name = newName;
                        }
                        if (newPhone) {
                              newClient.phone = newPhone;
                        }

                        await editClientInfo(clientId, newClient);
                        return res.redirect('Accounting-manager-employee-dashboard/all-client');
                  }
            }
            return res.status(400).json('Not found!');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpEditClient,
};