const {
      managerEmailIsTaken,
      addNewManager,
} = require('../../../models/manager.model');
const {
      employeeEmailIsTaken
} = require('../../../models/employee.model');
const argon2 = require('argon2');

async function httpAddNewManager(req, res) {
      try {
            const manager = req.body;
            if (!manager.fullName || !manager.companyName || !manager.email || !manager.password || !manager.confirmPassword) {
                  return res.status(400).json({ message: 'pleas fill all fildes!' });
            }

            const fullNameVerify = (/^[a-zA-Z\s]+$/.test(manager.fullName));
            if (!fullNameVerify) {
                  return res.status(400).json({ message: 'Full name is not valid!' });
            }

            const emailVerify = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(manager.email));
            if (!emailVerify) {
                  return res.status(400).json({ message: 'Email is not valid!' });
            }

            const passwordVerify = manager.password.length < 8;
            if (passwordVerify) {
                  return res.status(400).json({ message: 'Password is too short!' });
            }

            if (manager.password !== manager.confirmPassword) {
                  return res.status(400).json({ message: 'confirm password is wrong!' });
            }
            
            const isExist = await managerEmailIsTaken(manager.email) || await employeeEmailIsTaken(manager.email);
            if (isExist) {
                  return res.status(400).json({ message: 'Email is already exists' });
            }

            manager.password = await argon2.hash(manager.password);
            await addNewManager(manager);
            return res.redirect('/manager-login');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpAddNewManager,
};