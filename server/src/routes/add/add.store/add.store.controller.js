const {
      addNewStore,
      isOldStore
} = require('../../../models/store.model');

async function httpAddStore(req, res) {
      try {
            var store = req.body;
            store.owner = req.session.manager.userId;
            if (!store.name || !store.location) {
                  return res.status(400).json({ message: 'Pleas fill all fildes!' });
            }

            const oldStore = await isOldStore(store);
            if (oldStore) {
                  return res.status(400).json({ message: 'This shop is old!' });
            }

            await addNewStore(store);

            return res.redirect('/manager-dashboard');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpAddStore,
};