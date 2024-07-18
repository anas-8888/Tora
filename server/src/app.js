const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');

const addBill = require('./routes/add/add.bill/add.bill.router');
const addBond = require('./routes/add/add.bond/add.bond.router');
const addShop = require('./routes/add/add.shop/add.shop.router');
const getShopInfo = require('./routes/info/info.shop/shop.router');
const addStore = require('./routes/add/add.store/add.store.router');
const getStoreInfo = require('./routes/info/info.store/store.router');
const getAllClient = require('./routes/info/info.client/client.router');
const addManager = require('./routes/add/add.manager/add.manager.router');
const addProduct = require('./routes/add/add.product/add.product.router');
const editAShop = require('./routes/edit/edit.shop.info/edit.shop.router');
const getManagerInfo = require('./routes/info/info.manager/manager.router');
const getReminders = require('./routes/info/info.reminder/reminder.router');
const addReminder = require('./routes/add/add.reminder/add.reminder.router');
const addEmployee = require('./routes/add/add.employee/add.employee.router');
const deleteAShop = require('./routes/delete/delete.shop/delete.shop.router');
const authManager = require('./routes/auth/auth.manager/auth.manager.router');
const editAStore = require('./routes/edit/edit.store.info/edit.store.router');
const getEmployeeInfo = require('./routes/info/info.employee/employee.router');
const authEmployee = require('./routes/auth/auth.employee/auth.employee.router');
const deleteAStore = require('./routes/delete/delete.store/delete.store.router');
const editAClient = require('./routes/edit/edit.client.info/edit.client.router');
const AddFavoriteBills = require('./routes/add/add.favorite/add.favorite.router');
const deleteAClient = require('./routes/delete/delete.client/delete.client.router');
const deleteProduct = require('./routes/delete/delete.product/delete.product.router');
const GetAllFavoriteBillsInfo = require('./routes/info/info.favorite/favorite.router');
const editProduct = require('./routes/edit/edit.product.info/edit.product.info.router');
const deleteEmployee = require('./routes/delete/delete.employee/delete.employee.router');
const editEmployee = require('./routes/edit/edit.employee.info/edit.employee.info.router');
const editManagerInfo = require('./routes/edit/edit.manager.info/edit.manager.info.router');
const deleteFavoriteBill = require('./routes/delete/delete.favorite/delete.favorite.router');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const app = express(); 

dotenv.config();

app.use(cors());

// app.use(morgan('combined'));

app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //set true when we use https
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "..", "client", "src")));

app.use('/', addManager);
app.use('/', authManager);
app.use('/', authEmployee);
app.use('/', getManagerInfo);
app.use('/', addShop);
app.use('/', addStore);
app.use('/', editManagerInfo);
app.use('/', deleteAShop);
app.use('/', deleteAStore);
app.use('/', editAShop);
app.use('/', editAStore);
app.use('/', editEmployee);
app.use('/', deleteEmployee);
app.use('/', addEmployee);
app.use('/', getStoreInfo);
app.use('/', addProduct);
app.use('/', editProduct);
app.use('/', deleteProduct);
app.use('/', GetAllFavoriteBillsInfo);
app.use('/', AddFavoriteBills);
app.use('/', getShopInfo);
app.use('/', deleteFavoriteBill);
app.use('/', addBill);
app.use('/', addBond);
app.use('/', getAllClient);
app.use('/', deleteAClient);
app.use('/', editAClient);
app.use('/', getEmployeeInfo);
app.use('/', getReminders);
app.use('/', addReminder);




////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkSessionManager(req, res, next) {
    if (req.session.manager) {
        next();
    } else {
        res.redirect('/manager-login');
    }
}

function checkNotloginManager(req, res, next) {
    if (req.session.manager) {
        res.redirect('/manager-dashboard');
    } else {
        next();
    }
}

function checkSessionSalesEmployee(req, res, next) {
    if (req.session.employee) {
        if (req.session.employee.typeOfEmployee === 'Sales') {
            next();
        } else {
            res.redirect('/employee-login');
        }
    } else {
        res.redirect('/employee-login');
    }
}

function checkSessionCEOEmployee(req, res, next) {
    if (req.session.employee) {
        if (req.session.employee.typeOfEmployee === 'CEO') {
            next();
        } else {
            res.redirect('/employee-login');
        }
    } else {
        res.redirect('/employee-login');
    }
}

function checkSessionAccountingManagerEmployee(req, res, next) {
    if (req.session.employee) {
        if (req.session.employee.typeOfEmployee === 'Accounting Manager') {
            next();
        } else {
            res.redirect('/employee-login');
        }
    } else {
        res.redirect('/employee-login');
    }
}

function checkSessionAccountantEmployee(req, res, next) {
    if (req.session.employee) {
        if (req.session.employee.typeOfEmployee === 'Accountant') {
            next();
        } else {
            res.redirect('/employee-login');
        }
    } else {
        res.redirect('/employee-login');
    }
}

function checkSessionStoreKeeperEmployee(req, res, next) {
    if (req.session.employee) {
        if (req.session.employee.typeOfEmployee === 'Store Keeper') {
            next();
        } else {
            res.redirect('/employee-login');
        }
    } else {
        res.redirect('/employee-login');
    }
}

function checkNotloginEmployee(req, res, next) {
    if (req.session.employee) {
        if (req.session.employee.typeOfEmployee === 'Sales')
            res.redirect('/sales-employee-dashboard');
        else if (req.session.employee.typeOfEmployee === 'Accountant')
            res.redirect('/accountant-employee-dashboard');
        else if (req.session.employee.typeOfEmployee === 'Accounting Manager')
            res.redirect('/accounting-manager-employee-dashboard');
        else if (req.session.employee.typeOfEmployee === 'CEO')
            res.redirect('/ceo-employee-dashboard');
        else if (req.session.employee.typeOfEmployee === 'Store Keeper')
            res.redirect('/store-keeper-employee-dashboard');
    } else {
        next();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', checkNotloginEmployee, checkNotloginManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "HomePage", "HomePage.html"));
});

app.get('/register', checkNotloginEmployee, checkNotloginManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerSignUp", "ManagerSignUp.html"));
});

app.get('/manager-login', checkNotloginEmployee, checkNotloginManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerLogin", "ManagerLogin.html"));
});

app.get('/manager-dashboard', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", "ManagerDashboard.html"));
});

app.get('/manager-profile', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", "ManagerProfile.html"));
});

app.get('/manager-notifications', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", "ManagerNotifications.html"));
});

app.get('/employee-login', checkNotloginEmployee, checkNotloginManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeLogin", "EmployeeLogin.html"));
});

app.get('/get-all-employee', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", "ManagerAllEmployees.html"));
});

app.get('/manager-dashboard/stores/*', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", "ReviewStores.html"));
});

app.get('/manager-reminders', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", "reminders.html"));
});

app.get('/manager-favorite', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", "favorite.html"));
});

app.get('/get-all-client', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", "ManagerAllClients.html"));
});

app.get('/manager-dashboard/dashboard/*', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", 'ShopManagerDashboard' ,'ShopManagerDashboard.html'));
});

app.get('/manager-dashboard/all-bills/*', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", 'ShopManagerDashboard' ,'allBills.html'));
});

app.get('/manager-dashboard/sales-bill/*', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", 'ShopManagerDashboard' ,'salesBill.html'));
});

app.get('/manager-dashboard/sales-return-bill/*', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", 'ShopManagerDashboard' ,'salesReturnBill.html'));
});

app.get('/manager-dashboard/purchases-bill/*', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", 'ShopManagerDashboard' ,'purchasesBill.html'));
});

app.get('/manager-dashboard/purchases-return-bill/*', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", 'ShopManagerDashboard' ,'purchasesReturnBill.html'));
});

app.get('/manager-dashboard/payment-bond/*', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", 'ShopManagerDashboard' ,'paymentBond.html'));
});

app.get('/manager-dashboard/receipt-bond/*', checkSessionManager, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "ManagerDashboard", 'ShopManagerDashboard' ,'receiptBond.html'));
});







app.get('/sales-employee-dashboard', checkSessionSalesEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "SalseEmployee", "SalesEmployee.html"));
});

app.get('/sales-employee-dashboard/profile', checkSessionSalesEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "SalseEmployee", "Profile.html"));
});

app.get('/sales-employee-dashboard/notifications', checkSessionSalesEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "SalseEmployee", "Notifications.html"));
});

app.get('/sales-employee-dashboard/reminders', checkSessionSalesEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "SalseEmployee", "Reminders.html"));
});

app.get('/sales-employee-dashboard/sales-bills', checkSessionSalesEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "SalseEmployee", "AddSalesBills.html"));
});

app.get('/sales-employee-dashboard/sales-return-bills', checkSessionSalesEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "SalseEmployee", "AddSalesReturnBills.html"));
});

app.get('/sales-employee-dashboard/all-bills', checkSessionSalesEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "SalseEmployee", "AllBills.html"));
});






app.get('/ceo-employee-dashboard', checkSessionCEOEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "CEOEmployee", "CEOEmployee.html"));
});

app.get('/ceo-employee-dashboard/profile', checkSessionCEOEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "CEOEmployee", "Profile.html"));
});

app.get('/ceo-employee-dashboard/notifications', checkSessionCEOEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "CEOEmployee", "Notifications.html"));
});

app.get('/ceo-employee-dashboard/reminders', checkSessionCEOEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "CEOEmployee", "Reminders.html"));
});

app.get('/ceo-employee-dashboard/all-bills', checkSessionCEOEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "CEOEmployee", "AllBills.html"));
});

app.get('/ceo-employee-dashboard/all-employees', checkSessionCEOEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "CEOEmployee", "AllEmployees.html"));
});

app.get('/ceo-employee-dashboard/stores', checkSessionCEOEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "CEOEmployee", "AllProducts.html"));
});






app.get('/Accounting-manager-employee-dashboard', checkSessionAccountingManagerEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountingManagerEmployee", "AccountingManagerEmployee.html"));
});

app.get('/Accounting-manager-employee-dashboard/profile', checkSessionAccountingManagerEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountingManagerEmployee", "Profile.html"));
});

app.get('/Accounting-manager-employee-dashboard/notifications', checkSessionAccountingManagerEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountingManagerEmployee", "Notifications.html"));
});

app.get('/Accounting-manager-employee-dashboard/reminders', checkSessionAccountingManagerEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountingManagerEmployee", "Reminders.html"));
});

app.get('/Accounting-manager-employee-dashboard/all-bills', checkSessionAccountingManagerEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountingManagerEmployee", "AllBills.html"));
});

app.get('/Accounting-manager-employee-dashboard/all-client', checkSessionAccountingManagerEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountingManagerEmployee", "AllClient.html"));
});

app.get('/Accounting-manager-employee-dashboard/stores', checkSessionAccountingManagerEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountingManagerEmployee", "AllProducts.html"));
});

app.get('/Accounting-manager-employee-dashboard/payment-bond', checkSessionAccountingManagerEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountingManagerEmployee", "paymentBond.html"));
});

app.get('/Accounting-manager-employee-dashboard/receipt-bond', checkSessionAccountingManagerEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountingManagerEmployee", "receiptBond.html"));
});






app.get('/accountant-employee-dashboard', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "AccountantEmployee.html"));
});

app.get('/accountant-employee-dashboard/profile', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "Profile.html"));
});

app.get('/accountant-employee-dashboard/notifications', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "Notifications.html"));
});

app.get('/accountant-employee-dashboard/reminders', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "Reminders.html"));
});

app.get('/accountant-employee-dashboard/all-bills', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "AllBills.html"));
});

app.get('/accountant-employee-dashboard/stores', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "AllProducts.html"));
});

app.get('/accountant-employee-dashboard/sales-bills', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "AddSalesBills.html"));
});

app.get('/accountant-employee-dashboard/sales-return-bills', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "AddSalesReturnBills.html"));
});

app.get('/accountant-employee-dashboard/purchases-bills', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "AddPurchasesBills.html"));
});

app.get('/accountant-employee-dashboard/purchases-return-bills', checkSessionAccountantEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "AccountantEmployee", "AddPurchasesReturnBills.html"));
});






app.get('/store-keeper-employee-dashboard', checkSessionStoreKeeperEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "StoreKeeperEmployee", "StoreKeeperEmployee.html"));
});

app.get('/store-keeper-employee-dashboard/profile', checkSessionStoreKeeperEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "StoreKeeperEmployee", "Profile.html"));
});

app.get('/store-keeper-employee-dashboard/notifications', checkSessionStoreKeeperEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "StoreKeeperEmployee", "Notifications.html"));
});

app.get('/store-keeper-employee-dashboard/reminders', checkSessionStoreKeeperEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "StoreKeeperEmployee", "Reminders.html"));
});

app.get('/store-keeper-employee-dashboard/stores/*', checkSessionStoreKeeperEmployee, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "src", "EmployeeDashboard", "StoreKeeperEmployee", "AllProducts.html"));
});







app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "..", "..", "client", "src", "404.html"));
});

module.exports = app;