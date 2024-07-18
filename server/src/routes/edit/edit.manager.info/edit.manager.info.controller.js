const {
      editManager,
      getManagerById,
      managerEmailIsTaken
} = require('./../../../models/manager.model');
const {
      employeeEmailIsTaken
} = require('./../../../models/employee.model');
const argon2 = require('argon2');

async function httpEditManagerInfo(req, res) {
      try {
            var newManagerData = {};

            const manager = req.body;
            
            const oldManagerId = req.session.manager.userId; 
            const oldManager = await getManagerById(oldManagerId);

            if(!manager.oldPassword) {
                  return res.status(400).json({ message: 'Old password is required' });
            }
            
            const validPassword = await argon2.verify(oldManager.password, manager.oldPassword);
            
            if(!validPassword) {
                  return res.status(400).json({ message: 'Old password is wrong' });
            }

            if (manager.fullName) {
                  const fullNameVerify = (/^[a-zA-Z\s]+$/.test(manager.fullName));
                  if (!fullNameVerify) {
                        return res.status(400).json({ message: 'Full name is not valid!' });
                  }
                  newManagerData.fullName = manager.fullName;
            }

            if (manager.companyName) {
                  newManagerData.companyName = manager.companyName;
            }

            if (manager.email) {
                  let emailVerify = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(manager.email));
                  emailVerify = emailVerify && !(await managerEmailIsTaken(manager.email)) && !(await employeeEmailIsTaken(manager.email));
                  if (!emailVerify) {
                        return res.status(400).json({ message: 'Email is not valid!' });
                  }
                  newManagerData.email = manager.email;
            }

            if (manager.password) {
                  const passwordVerify = manager.password.length < 8;
                  if (passwordVerify) {
                        return res.status(400).json({ message: 'Password is too short!' });
                  }
                  manager.password = await argon2.hash(manager.password);
                  newManagerData.password = manager.password;
            }

            await editManager(oldManagerId, newManagerData);

            return res.redirect('/manager-profile');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpEditManagerInfo
};