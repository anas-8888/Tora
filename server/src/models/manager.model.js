const managerData = require('./manager.mongo');
const billData = require('./bill.mongo');

async function editManager(oldmanagerId, newManagerData) {
      try {
            await managerData.findByIdAndUpdate(
                  oldmanagerId,
                  newManagerData,
                  { new: true }
            );
      } catch (error) {
            console.log(error);
            return null;
      }
}


async function addNewManager(manager) {
      await managerData.updateOne(
            {
                  email: manager.email,
            },
            {
                  fullName: manager.fullName,
                  companyName: manager.companyName,
                  email: manager.email,
                  password: manager.password,
            },
            {
                  upsert: true,
            }
      );
}

async function isOldManager(manager) {
      return await managerData.findOne({
            email: manager.email,
      });
}

async function getManagerById(managerId) {
      return await managerData.findOne({
            _id: managerId,
      });
}

async function managerEmailIsTaken(managerEmail) {
      return await managerData.findOne({
            email: managerEmail,
      });
}

async function getAllFavBillsByManagerId(managerId) {
      try {
            let billsData = [];
            const manager = await managerData.findOne({ _id: managerId }); // Replace with the actual collection name
            const billsId = manager.favorite;
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

async function addBillToManagerFavorite(billId, managerId) {
      try {
            const manager = await managerData.findOne({ _id: managerId });
            if (!manager) {
                  throw new Error('Manager not found');
            }

            // Check if the billId already exists in the favorite array
            const alreadyFavorited = manager.favorite.some(favorite => favorite.billId.toString() == billId);

            if (!alreadyFavorited) {
                  manager.favorite.push({ billId: billId });
                  await manager.save();
            }
      } catch (err) {
            console.error('Error adding bill to manager favorite:', err);
      }
}

async function removeFavoriteBill(managerId, billId) {
      try {
            const manager = await managerData.findOne({ _id: managerId });
            if (!manager) {
                  throw new Error('Manager not found');
            }

            const index = manager.favorite.findIndex(favorite => favorite.billId.toString() === billId);
            if (index != -1) {
                  manager.favorite.splice(index, 1);
                  await manager.save();
            }

      } catch (err) {
            console.error('Error removing favorite bill:', err);
      }
}

async function getManagerNameById(managerId) {
      try {
            const manager = await managerData.findOne({ _id: managerId });
            if (!manager) {
                  throw new Error('Manager not found');
            }
            return manager.fullName;
      } catch (err) {
            console.error('Error getting manager name:', err);
            throw err;
      }
}

async function getAllManagerReminders(managerId) {
      const manager = await managerData.findOne(
            {
                  _id: managerId,
            }
      );
      return manager.reminder.reverse();
}

async function addNewManagerReminder(managerId, reminder) {
      try {
            const manager = await managerData.findOne({ _id: managerId });
            if (!manager) {
                  throw new Error('Manager not found');
            }
            manager.reminder.push(reminder);
            await manager.save();
      } catch (err) {
            console.error('Error adding new reminder:', err);
      }
}

module.exports = {
      isOldManager,
      addNewManager,
      getManagerById,
      editManager,
      managerEmailIsTaken,
      getAllFavBillsByManagerId,
      addBillToManagerFavorite,
      removeFavoriteBill,
      getManagerNameById,
      getAllManagerReminders,
      addNewManagerReminder
};