const {
      getAllManagerReminders
} = require('../../../models/manager.model');
const {
      getAllEmployeeReminders
} = require('../../../models/employee.model');

async function httpGetReminders(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const reminders = await getAllManagerReminders(managerId);
                        const logDate = manager.logDate;
                        return res.json({
                              reminders,
                              logDate
                        });                     
                  }
            }

            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const reminders = await getAllEmployeeReminders(employeeId);
                        const logDate = employee.logDate;
                        return res.json({
                              reminders,
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
      httpGetReminders,
};