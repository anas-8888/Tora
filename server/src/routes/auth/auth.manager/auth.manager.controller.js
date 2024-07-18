const {
      isOldManager,
} = require('./../../../models/manager.model');
const argon2 = require('argon2');

async function httpGetManager(req, res) {
      try {
            const manager = req.body;
            if (!manager.email || !manager.password) {
                  return res.status(400).json({ message: 'pleas fill all fildes!' });
            }

            const emailVerify = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(manager.email));
            if (!emailVerify) {
                  return res.status(400).json({ message: 'Email is not valid!' });
            }

            const passwordVerify = manager.password.length < 8;
            if (passwordVerify) {
                  return res.status(400).json({ message: 'Password is not valid!' });
            }

            const user = await isOldManager(manager);
            if (user) {
                  const validPassword = await argon2.verify(user.password, manager.password);
                  if (validPassword) {
                        const logDate = Date.now();
                        const userId = user._id;
                        req.session.manager = {
                              userId,
                              logDate
                        };
                        return res.redirect('/manager-dashboard');
                  } else {
                        return res.status(400).json({ message: 'Email or password is wrong!' });
                  }
            } else {
                  return res.status(400).json({ message: 'Email or password is wrong!' });
            }
      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpGetManager
};