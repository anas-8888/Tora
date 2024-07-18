const {
      getManagerById
} = require('./../../../models/manager.model');
const {
      getShopsNameAndLocationByManagerId,
      isOldShopById
} = require('./../../../models/shop.model');
const {
      getStoresNameAndLocationByManagerId
} = require('./../../../models/store.model');
const {
      getProfitOfAllBillPerDay,
      getProfitOfAllBillPerMonth
} = require('./../../../models/bill.model');

const {
      getAllEmployeeFromManagerId,
      getNumberOfAllEmployeesByManagerId
} = require('./../../../models/employee.model');


function getBeginningOfCurrentDay() {
      let now = new Date();
      now.setHours(0, 0, 0, 0);
      let utcTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      return utcTime.toISOString().slice(0, -1) + 'Z'; // Fixed: slice(0, -1) to remove milliseconds correctly
}


function generateDateList(numDays) {
      const dateList = [];
      const today = new Date(getBeginningOfCurrentDay()); // Convert to Date object

      for (let i = 0; i < numDays; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() - i);
            dateList.unshift(currentDate.toISOString().split('T')[0] + 'T00:00:00Z');
      }

      return dateList;
}


function getMonthsAgo(numMonths) {
      const today = new Date(getBeginningOfCurrentDay());
      const monthsAgoDates = [];

      for (let i = 0; i < numMonths; i++) {
            let currentDate = new Date(today);
            currentDate.setMonth(today.getMonth() - i);
            const monthYear = currentDate.toISOString().split('-');
            monthsAgoDates.unshift(monthYear[0] + '-' + monthYear[1] + '-01T00:00:00Z');
      }

      return monthsAgoDates;
}


function formatDate(date) {
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
}

function formatDateForMonth(date) {
      return date.toLocaleDateString('en-US', { month: 'short' });
}

async function httpgetManagerDashboardInfo(req, res) {
      try {
            const id = req.session.manager.userId;
            const logDate = req.session.manager.logDate;
            const user = await getManagerById(id);

            if (!user) {
                  return res.status(404).json({ message: 'Manager not found' });
            }

            const [shops, stores] = await Promise.all([
                  getShopsNameAndLocationByManagerId(id),
                  getStoresNameAndLocationByManagerId(id)
            ]);

            const listOfMonthAgo = getMonthsAgo(6);
            const dates = generateDateList(13);
            const ammoutPermonth = [];
            const ammoutPerDay = [];
            const datePermonth = [];
            const datePerDay = [];

            // Process daily profits
            for (let i = 12; i > 0; i--) {
                  const dayInMiliSecond = new Date(dates[i]).getTime();
                  ammoutPerDay.unshift(await getProfitOfAllBillPerDay(id, dayInMiliSecond));
                  datePerDay.unshift(formatDate(new Date(dayInMiliSecond)));
            }

            // Process monthly profits
            for (let i = 5; i >= 0; i--) {
                  const monthInMiliSecond = new Date(listOfMonthAgo[i]).getTime();
                  ammoutPermonth.unshift(await getProfitOfAllBillPerMonth(id, monthInMiliSecond));
                  datePermonth.unshift(formatDateForMonth(new Date(monthInMiliSecond)));
            }

            const userInfo = {
                  logDate,
                  fullName: user.fullName,
                  companyName: user.companyName,
                  shops,
                  stores,
                  ammoutPerDay,
                  datePerDay,
                  ammoutPermonth,
                  datePermonth,
            };

            return res.json(userInfo);
      } catch (err) {
            console.error(err);
      }
}




async function httpgetManagerEmployeesInfo(req, res) {
      try {
            const id = req.session.manager.userId;
            const user = await getManagerById(id);
            if (!user) {
                  return res.status(404).json({
                        message: 'Manager not found',
                  });
            }

            const logDate = req.session.manager.logDate;
            const employees = await getAllEmployeeFromManagerId(id);
            const shops = await getShopsNameAndLocationByManagerId(id);

            let employeesShops = [];
            for (let i = 0; i < employees.length; i++) {
                  if (employees[i].shopId) {
                        const shop = (await isOldShopById(employees[i].shopId));
                        if (shop) {
                              employeesShops[i] = shop.name;
                        } else {
                              employeesShops[i] = 'Shop not found';
                        }
                  }
                  else {
                        employeesShops[i] = 'All shops';
                  }
            }

            const userInfo = {
                  logDate,
                  employees,
                  employeesShops,
                  shops
            };

            return res.json(userInfo);
      } catch (err) {
            console.error(err);
      }
}

async function httpgetManagerProfileInfo(req, res) {
      try {
            const id = req.session.manager.userId;
            const logDate = req.session.manager.logDate;
            const user = await getManagerById(id);
            if (!user) {
                  return res.status(404).json({
                        message: 'Manager not found',
                  });
            }

            const shops = await getShopsNameAndLocationByManagerId(id);
            const stores = await getStoresNameAndLocationByManagerId(id);
            const employeesNumber = await getNumberOfAllEmployeesByManagerId(id);

            const email = user.email;
            const fullName = user.fullName;
            const companyName = user.companyName;
            const numberOfEmployee = employeesNumber;
            const numberOfShops = shops.length;
            const numberOfStores = stores.length;

            const userInfo = {
                  logDate,
                  fullName,
                  email,
                  companyName,
                  numberOfShops,
                  numberOfStores,
                  numberOfEmployee,
            };

            return res.json(userInfo);
      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpgetManagerDashboardInfo,
      httpgetManagerEmployeesInfo,
      httpgetManagerProfileInfo
};