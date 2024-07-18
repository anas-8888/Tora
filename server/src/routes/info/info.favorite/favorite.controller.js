const {
      getAllFavBillsByManagerId,
} = require('../../../models/manager.model');
const {
      getEmployeeById,
      getAllFavBillsByEmployeeId
} = require('../../../models/employee.model');

async function httpGetAllFavoriteBillsInfo(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {

                        let bills = await getAllFavBillsByManagerId(managerId);
                        if (!bills) {
                              return res.status(404).send('No bills found!');
                        }
                        const logDate = req.session.manager.logDate;

                        return res.json({
                              bills,
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
                              return res.status(404).send('Employee not found!');
                        }
                        const type = employeeData.typeOfEmployee;
                        if (type === 'Store Keeper') {
                              return res.status(404).send('Not allowed!');
                        }

                        let bills = await getAllFavBillsByEmployeeId(employeeId);
                        if (!bills) {
                              return res.status(404).send('No bills found!');
                        }
                        const logDate = req.session.employee.logDate;

                        return res.json({
                              bills,
                              logDate
                        });
                  }
            }

            return res.status(401).json({ message: 'Unauthorized.' });
      } catch (err) {
            console.log(err);
      }
}

module.exports = {
      httpGetAllFavoriteBillsInfo,
};