const {
    isOldBill,
} = require('../../../models/bill.model');
const {
    addBillToManagerFavorite
} = require('../../../models/manager.model');
const {
    getEmployeeById,
    addBillToEmployeeFavorite
} = require('../../../models/employee.model');

async function httpAddFavoriteBills(req, res) {
    try {
        const manager = req.session.manager;
        if (manager) {
            const managerId = manager.userId;
            if (managerId) {
                let { billId, shopId } = req.body;
                if (!billId) {
                    return res.status(400).send('Bill id is required!');
                }

                const oldBillExists = await isOldBill(billId);
                if (!oldBillExists) {
                    return res.status(400).send('Bill does not exist!');
                }

                await addBillToManagerFavorite(billId, managerId);
                return res.redirect(`/manager-dashboard/all-bills/${shopId}`);
            }
        }

        const employee = req.session.employee;
        if (employee) {
            const employeeId = employee.userId;
            if (employeeId) {
                const employeeData = await getEmployeeById(employeeId);
                const type = employeeData.typeOfEmployee;
                if (type === 'Store Keeper') {
                    return res.status(400).send('Not allowed!');
                }
                if (!employeeData) {
                    return res.status(400).send('Employee does not exist!');
                }
                let { billId } = req.body;
                if (!billId) {
                    return res.status(400).send('Bill id is required!');
                }

                const shopId = employeeData.shopId;
                const oldBillExists = await isOldBill(billId);
                if (!oldBillExists) {
                    return res.status(400).send('Bill does not exist!');
                }

                await addBillToEmployeeFavorite(billId, employeeId);
                if(type === 'CEO') {
                    return res.redirect(`/ceo-employee-dashboard/all-bills`);
                } else if(type === 'Accounting Manager') {
                    return res.redirect(`/accounting-manager-employee-dashboard/all-bills`);
                } else if(type === 'Accountant') {
                    return res.redirect(`/accountant-employee-dashboard/all-bills`);
                } else if(type === 'Sales') {
                    return res.redirect(`/sales-employee-dashboard/all-bills`);
                }
            }
        }

        return res.status(401).send('Unauthorized!');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error!');
    }
}

module.exports = {
    httpAddFavoriteBills
};
