const argon2 = require('argon2');
const {
      isOldEmployeeById,
      editEmployee,
      employeeEmailIsTaken,
      deleteShopIdFromEmployee,
      getEmployeeById
} = require('../../../models/employee.model');
const {
      getShopIdByName
} = require('../../../models/shop.model');
const {
      managerEmailIsTaken
} = require('../../../models/manager.model');

async function httpEditEmployee(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        var newEmployeeData = {};
                        const newEmployee = req.body;
                        newEmployee._id = req.params.id;
                        if (!newEmployee._id) {
                              throw new Error('Employee id is required')
                        }
                        const oldEmployee = await isOldEmployeeById(newEmployee._id);
                        const managerHasEmployee = oldEmployee.supervisor == managerId;

                        if (!managerHasEmployee) {
                              throw new Error('Manager can not edit his own employee');
                        }

                        if (newEmployee.fullName) {
                              const fullNameVerify = (/^[a-zA-Z\s]+$/.test(newEmployee.fullName));
                              if (!fullNameVerify) {
                                    return res.status(400).json({ message: 'Full name is not valid!' });
                              }
                              newEmployeeData.fullName = newEmployee.fullName;
                        }
                        if (newEmployee.email) {
                              let emailVerify = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(newEmployee.email));
                              emailVerify = emailVerify && !(await managerEmailIsTaken(newEmployee.email)) && !(await employeeEmailIsTaken(newEmployee.email));
                              if (!emailVerify) {
                                    return res.status(400).json({ message: 'Email is not valid!' });
                              }
                              newEmployeeData.email = newEmployee.email;
                        }
                        if (newEmployee.password) {
                              const passwordVerify = newEmployee.password.length < 8;
                              if (passwordVerify) {
                                    return res.status(400).json({ message: 'Password is too short!' });
                              }
                              newEmployee.password = await argon2.hash(newEmployee.password);
                              newEmployeeData.password = newEmployee.password;
                        }
                        if (newEmployee.type) {
                              const typeVerify = newEmployee.type
                              if (typeVerify == "CEO" || typeVerify == "Accounting Manager" || typeVerify == "Accountant" || typeVerify == "Store Keeper" || typeVerify == "Sales") {
                                    newEmployeeData.typeOfEmployee = newEmployee.type;
                              } else {
                                    return res.status(400).json({ message: 'wrong type of employee' });
                              }
                        }
                        if (newEmployee.phoneNumber) {
                              const phoneNumberVerify = (/^\d{10}$/.test(newEmployee.phoneNumber));
                              if (!phoneNumberVerify) {
                                    return res.status(400).json({ message: 'Phone number is not valid!' });
                              }
                              newEmployeeData.phoneNumber = newEmployee.phoneNumber;
                        }
                        if (newEmployee.salary) {
                              const salaryVerify = +newEmployee.salary;
                              if (typeof (salaryVerify) === Number) {
                                    return res.status(400).json({ message: 'Salary is not valid!' });
                              }
                              newEmployeeData.salary = newEmployee.salary;
                        }

                        if (!newEmployee.type && oldEmployee.typeOfEmployee === 'Store Keeper' && newEmployee.shopName) {
                              return res.status(400).json({ message: "You can't set shop to a store keeper employee!" });
                        }

                        if (newEmployee.type === 'Store Keeper') {
                              newEmployee.shopName = '';
                              await deleteShopIdFromEmployee(newEmployee._id);
                        }

                        if (newEmployee.shopName) {
                              const shopId = await getShopIdByName(newEmployee.shopName, managerId);
                              if (!shopId) {
                                    return res.status(400).json({ message: 'Shop name is not valid!' });
                              }
                              newEmployeeData.shopId = shopId;
                        }

                        newEmployeeData._id = newEmployee._id;

                        await editEmployee(newEmployeeData);

                        return res.redirect('/get-all-employee');
                  }
            }
            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        const employeeData = await getEmployeeById(employeeId);
                        if (!employeeData) {
                              return res.status(404).send('Not found!');
                        }
                        const type = employeeData.typeOfEmployee;
                        if (type !== 'CEO') {
                              return res.status(400).send('Not allowed!');
                        }
                        const shopId = employeeData.shopId;
                        var newEmployeeData = {};
                        const newEmployee = req.body;
                        newEmployee._id = req.params.id;
                        if (!newEmployee._id) {
                              throw new Error('Employee id is required');
                        }

                        const oldEmployee = await isOldEmployeeById(newEmployee._id);
                        const oldEmployeeShopId = String(oldEmployee.shopId).trim();
                        const currentShopId = String(shopId).trim();

                        if (oldEmployeeShopId !== currentShopId) {
                              throw new Error('You can not edit this employee');
                        }

                        if (newEmployee.fullName) {
                              const fullNameVerify = (/^[a-zA-Z\s]+$/.test(newEmployee.fullName));
                              if (!fullNameVerify) {
                                    return res.status(400).json({ message: 'Full name is not valid!' });
                              }
                              newEmployeeData.fullName = newEmployee.fullName;
                        }
                        if (newEmployee.email) {
                              let emailVerify = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(newEmployee.email));
                              emailVerify = emailVerify && !(await managerEmailIsTaken(newEmployee.email)) && !(await employeeEmailIsTaken(newEmployee.email));
                              if (!emailVerify) {
                                    return res.status(400).json({ message: 'Email is not valid!' });
                              }
                              newEmployeeData.email = newEmployee.email;
                        }
                        if (newEmployee.password) {
                              const passwordVerify = newEmployee.password.length < 8;
                              if (passwordVerify) {
                                    return res.status(400).json({ message: 'Password is too short!' });
                              }
                              newEmployee.password = await argon2.hash(newEmployee.password);
                              newEmployeeData.password = newEmployee.password;
                        }
                        if (newEmployee.type) {
                              const typeVerify = newEmployee.type
                              if (typeVerify == "CEO" || typeVerify == "Accounting Manager" || typeVerify == "Accountant" || typeVerify == "Store Keeper" || typeVerify == "Sales") {
                                    newEmployeeData.typeOfEmployee = newEmployee.type;
                              } else {
                                    return res.status(400).json({ message: 'wrong type of employee' });
                              }
                        }
                        if (newEmployee.phoneNumber) {
                              const phoneNumberVerify = (/^\d{10}$/.test(newEmployee.phoneNumber));
                              if (!phoneNumberVerify) {
                                    return res.status(400).json({ message: 'Phone number is not valid!' });
                              }
                              newEmployeeData.phoneNumber = newEmployee.phoneNumber;
                        }
                        if (newEmployee.salary) {
                              const salaryVerify = +newEmployee.salary;
                              if (typeof (salaryVerify) === Number) {
                                    return res.status(400).json({ message: 'Salary is not valid!' });
                              }
                              newEmployeeData.salary = newEmployee.salary;
                        }

                        if (newEmployee.type === 'Store Keeper') {
                              await deleteShopIdFromEmployee(newEmployee._id);
                        }

                        newEmployeeData.shopId = shopId;
                        newEmployeeData._id = newEmployee._id;

                        await editEmployee(newEmployeeData);

                        return res.redirect('/ceo-employee-dashboard/all-employees');
                  }
            }

            return res.status(400).send('Not allowed!');
      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpEditEmployee
};