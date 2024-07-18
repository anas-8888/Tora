
const {
      addNewManagerReminder
} = require('../../../models/manager.model');

const {
      addNewEmployeeReminder
} = require('../../../models/employee.model');

async function httpAddReminder(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        const reminder = req.body;
                        if (!reminder) {
                              return res.status(400).send('Pleas fill all field!');
                        }
                        if(reminder.date < Date.now()) {
                              return res.status(400).send('Date must be in the future!');
                        }
                        await addNewManagerReminder(managerId, reminder);
                        return res.redirect(`/manager-reminders`);
                  }
            }

            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  const type = employee.typeOfEmployee;
                  if (employeeId) {
                        const reminder = req.body;
                        if (!reminder) {
                              return res.status(400).send('Pleas fill all field!');
                        }
                        if(reminder.date < Date.now()) {
                              return res.status(400).send('Date must be in the future!');
                        }
                        await addNewEmployeeReminder(employeeId, reminder);
                        
                        if (type === 'CEO') {
                              return res.redirect(`/ceo-employee-dashboard/reminders`);
                        } else if (type === 'Accounting Manager') {
                              return res.redirect(`/accounting-manager-employee-dashboard/reminders`);
                        } else if (type === 'Accountant') {
                              return res.redirect(`/accountant-employee-dashboard/reminders`);
                        } else if (type === 'Sales') {
                              return res.redirect(`/sales-employee-dashboard/reminders`);
                        } else if (type === 'Store Keeper') {
                              return res.redirect(`/store-keeper-employee-dashboard/reminders`);
                        }
                  }
            }

            return res.status(400).send('You are not authorized to access this page!');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpAddReminder
};