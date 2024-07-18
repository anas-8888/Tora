const employeeData = require('./employee.mongo');
const billData = require('./bill.mongo');

async function addNewEmployee(employee) {
      await employeeData.updateOne(
            employee,
            employee,
            {
                  upsert: true,
            }
      );
}

async function isOldEmployeeById(employeeId) {
      return await employeeData.findOne({
            _id: employeeId,
      });
}

async function isOldEmployee(employee) {
      return await employeeData.findOne({
            email: employee.email,
      });
}

async function getAllEmployeeFromManagerId(managerId) {
      return await employeeData.find({
            supervisor: managerId,
      }).sort({ _id: -1 });
}

async function editEmployee(newEmployeeData) {
      try {
            const oldEmployeeId = newEmployeeData._id;
            await employeeData.findByIdAndUpdate(
                  oldEmployeeId,
                  newEmployeeData,
                  { new: true }
            );
      } catch (error) {
            console.log(error);
            return null;
      }
}

async function employeeEmailIsTaken(employeeEmail) {
      return await employeeData.findOne(
            {
                  email: employeeEmail
            }
      );
}

async function deleteShopIdFromEmployee(employeeId) {
      return await employeeData.findOneAndUpdate(
            {
                  _id: employeeId
            }, // Replace with the actual employee ID
            {
                  $unset: {
                        shopId: 1
                  }
            }, // Use 1 to unset the field
            {
                  new: true
            } // Return the updated document
      )
}

async function deleteEmployee(employeeId) {
      try {
            return await employeeData.findByIdAndDelete(employeeId);
      } catch (err) {
            console.log(err);
      }
}

async function getNumberOfAllEmployeesByManagerId(mangerId) {
      return await employeeData.countDocuments(
            {
                  supervisor: mangerId
            }
      );
}

async function getEmployeeById(employeeId) {
      return await employeeData.findOne(
            {
                  _id: employeeId
            }
      );
}

async function getAllFavBillsByEmployeeId(employeeId) {
      try {
            let billsData = [];
            const employee = await employeeData.findOne({ _id: employeeId }); // Replace with the actual collection name
            const billsId = employee.favorite;
            for (const id of billsId) {
                  let bill = await billData.findOne({ _id: id.billId }); // Replace with the actual collection name
                  if (!bill) {
                        console.log("Bill not found");
                        continue;
                  }
                  if (!bill.clientName) {
                        bill.clientName = 'Non';
                  }
                  if (!bill.clientPhone) {
                        bill.clientPhone = 'Non';
                  }
                  billsData.push(bill);
            }
            billsData = billsData.reverse();
            return billsData;
      } catch (error) {
            console.error('Error fetching bills:', error);
            throw error;
      }
}

async function addBillToEmployeeFavorite(billId, employeeId) {
      try {
            const employee = await employeeData.findOne({ _id: employeeId });
            if (!employee) {
                  throw new Error('Employee not found');
            }

            const alreadyFavorited = employee.favorite.some(favorite => favorite.billId.toString() == billId);

            if (!alreadyFavorited) {
                  employee.favorite.push({ billId: billId });
                  await employee.save();
            }
      } catch (err) {
            console.error('Error adding bill to employee favorite:', err);
      }
}

async function getAllEmployeesByManagerIdAndShopId(managerId, shopId, myId) {
      try {
            return await employeeData.find(
                  {
                        $and: [
                              {
                                    $or: [
                                          {
                                                supervisor: managerId,
                                                shopId: shopId
                                          },
                                          {
                                                supervisor: managerId,
                                                shopId: { $exists: false }
                                          }
                                    ]
                              },
                              {
                                    _id: { $ne: myId }
                              }
                        ]
                  }
            ).sort({ _id: -1 });
      } catch (err) {
            console.error('Error getting all employees by manager id and shop id:', err);
      }
}

async function getAllEmployeeReminders(employeeId) {
      const employee = await employeeData.findOne(
            {
                  _id: employeeId,
            }
      );
      return employee.reminder.reverse();
}

async function addNewEmployeeReminder(employeeId, reminder) {
      try {
            const employee = await employeeData.findOne({ _id: employeeId });
            if (!employee) {
                  throw new Error('Manager not found');
            }
            employee.reminder.push(reminder);
            await employee.save();
      } catch (err) {
            console.error('Error adding new reminder:', err);
      }
}

module.exports = {
      isOldEmployee,
      getAllEmployeeFromManagerId,
      isOldEmployeeById,
      editEmployee,
      employeeEmailIsTaken,
      deleteShopIdFromEmployee,
      deleteEmployee,
      addNewEmployee,
      getNumberOfAllEmployeesByManagerId,
      getEmployeeById,
      getAllFavBillsByEmployeeId,
      addBillToEmployeeFavorite,
      getAllEmployeesByManagerIdAndShopId,
      getAllEmployeeReminders,
      addNewEmployeeReminder
};