const {
      removeFavoriteBill
} = require('../../../models/manager.model');

async function httpDeleteFavoriteBill(req, res) {
      try {
            const manager = req.session.manager;
            if (manager) {
                  const managerId = manager.userId;
                  if (managerId) {
                        let {
                              billId,
                              shopId
                        } = req.body;
                        if (!billId) {
                              return res.status(400).send('bill id is require!');
                        }
                        if (!shopId) {
                              return res.status(400).send('shop id is require!');
                        }
                        if (shopId == -1) {
                              await removeFavoriteBill(managerId, billId);
                              return res.redirect(`/manager-favorite`);
                        } else {
                              await removeFavoriteBill(managerId, billId);
                              return res.redirect(`/manager-dashboard/all-bills/${shopId}`);
                        }


                  }
            }

            const employee = req.session.employee;
            if (employee) {
                  const employeeId = employee.userId;
                  if (employeeId) {
                        //TODO
                  }
            }

            return res.status(401).json({ message: 'Unauthorized.' });
      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpDeleteFavoriteBill
};