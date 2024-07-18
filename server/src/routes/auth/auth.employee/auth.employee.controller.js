const {
      isOldEmployee,
} = require('./../../../models/employee.model');
const argon2 = require('argon2');

async function httpGetEmployee(req, res) {
      try {
            var employee = req.body;
            if (!employee.email || !employee.password) {
                  return res.status(400).json({ message: 'pleas fill all fildes!' });
            }

            const emailVerify = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(employee.email));
            if (!emailVerify) {
                  return res.status(400).json({ message: 'Email is not valid!' });
            }

            const passwordVerify = employee.password.length < 8;
            if (passwordVerify) {
                  return res.status(400).json({ message: 'Password is not valid!' });
            }
            const user = await isOldEmployee(employee);
            if (user) {
                  const validPassword = await argon2.verify(user.password, employee.password);
                  if (validPassword) {
                        const logDate = Date.now();
                        const userId = user._id;
                        const typeOfEmployee = user.typeOfEmployee; 
                        req.session.employee = {
                              userId,
                              logDate,
                              typeOfEmployee
                        };
                        if (user.typeOfEmployee === 'Sales')
                              return res.redirect('/sales-employee-dashboard');
                        else if (user.typeOfEmployee === 'Accountant')
                              return res.redirect('/accountant-employee-dashboard');
                        else if (user.typeOfEmployee === 'Accounting Manager')
                              return res.redirect('/accounting-manager-employee-dashboard');
                        else if (user.typeOfEmployee === 'CEO')
                              return res.redirect('/ceo-employee-dashboard');
                        else if (user.typeOfEmployee === 'Store Keeper')
                              return res.redirect('/store-keeper-employee-dashboard');
                  } else {
                        return res.status(400).json({ message: 'Email or password is wrong!' });
                  }
            }
            return res.status(400).json({ message: 'Email or password is wrong!' });
      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpGetEmployee,
};