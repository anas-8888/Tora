const {
      employeeEmailIsTaken,
      addNewEmployee,
      getEmployeeById
} = require('../../../models/employee.model');
const {
      getShopIdByName
} = require('../../../models/shop.model');
const {
      managerEmailIsTaken
} = require('../../../models/manager.model');
const argon2 = require('argon2');


async function httpAddNewEmployee(req, res) {
      try {

            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        let {
                              fullName,
                              email,
                              password,
                              typeOfEmployee,
                              phoneNumber,
                              salary,
                              shopName,
                        } = req.body;
                        const supervisor = managerId;
                        const startDate = Date.now();
                        if (!fullName || !email || !password || !typeOfEmployee || !typeOfEmployee || !phoneNumber || !salary) {
                              return res.status(400).json({ message: 'pleas fill all fildes!' });
                        }
                        if (typeOfEmployee !== 'Store Keeper' && !shopName) {
                              return res.status(400).json({ message: 'pleas fill all fildes!' });
                        }

                        const fullNameVerify = (/^[a-zA-Z\s]+$/.test(fullName));
                        if (!fullNameVerify) {
                              return res.status(400).json({ message: 'Full name is not valid!' });
                        }

                        const emailVerify = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email));
                        if (!emailVerify) {
                              return res.status(400).json({ message: 'Email is not valid!' });
                        }

                        const passwordVerify = password.length < 8;
                        if (passwordVerify) {
                              return res.status(400).json({ message: 'Password is too short!' });
                        }
                        const isExist = await managerEmailIsTaken(email) || await employeeEmailIsTaken(email);
                        if (isExist) {
                              return res.status(400).json({ message: 'Email is already exists' });
                        }
                        password = await argon2.hash(password);
                        let shopId = (await getShopIdByName(shopName, supervisor));
                        if (shopId) {
                              shopId = shopId._id;
                        }
                        let newEmployee = {};
                        if (typeOfEmployee === 'Store Keeper') {
                              newEmployee = {
                                    fullName,
                                    email,
                                    password,
                                    typeOfEmployee,
                                    phoneNumber,
                                    salary,
                                    supervisor,
                                    startDate
                              };
                        } else {
                              newEmployee = {
                                    fullName,
                                    email,
                                    password,
                                    typeOfEmployee,
                                    phoneNumber,
                                    salary,
                                    shopId,
                                    supervisor,
                                    startDate
                              };
                        }
                        await addNewEmployee(newEmployee);
                        return res.redirect('/get-all-employee');
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(404).send('Not found');
                        }
                        let {
                              fullName,
                              email,
                              password,
                              typeOfEmployee,
                              phoneNumber,
                              salary,
                        } = req.body;
                        const supervisor = employeeData.supervisor;
                        const startDate = Date.now();
                        if (!fullName || !email || !password || !typeOfEmployee || !typeOfEmployee || !phoneNumber || !salary) {
                              return res.status(400).json({ message: 'pleas fill all fildes!' });
                        }

                        const fullNameVerify = (/^[a-zA-Z\s]+$/.test(fullName));
                        if (!fullNameVerify) {
                              return res.status(400).json({ message: 'Full name is not valid!' });
                        }

                        const emailVerify = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email));
                        if (!emailVerify) {
                              return res.status(400).json({ message: 'Email is not valid!' });
                        }

                        const passwordVerify = password.length < 8;
                        if (passwordVerify) {
                              return res.status(400).json({ message: 'Password is too short!' });
                        }
                        const isExist = await managerEmailIsTaken(email) || await employeeEmailIsTaken(email);
                        if (isExist) {
                              return res.status(400).json({ message: 'Email is already exists' });
                        }
                        password = await argon2.hash(password);
                        let shopId = employeeData.shopId;
                        let newEmployee = {};
                        if (typeOfEmployee === 'Store Keeper') {
                              newEmployee = {
                                    fullName,
                                    email,
                                    password,
                                    typeOfEmployee,
                                    phoneNumber,
                                    salary,
                                    supervisor,
                                    startDate
                              };
                        } else {
                              newEmployee = {
                                    fullName,
                                    email,
                                    password,
                                    typeOfEmployee,
                                    phoneNumber,
                                    salary,
                                    shopId,
                                    supervisor,
                                    startDate
                              };
                        }
                        await addNewEmployee(newEmployee);
                        return res.redirect('/ceo-employee-dashboard/all-employees');
                  }
            }
            return res.status(400).send('Not allowed!');
      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpAddNewEmployee
};