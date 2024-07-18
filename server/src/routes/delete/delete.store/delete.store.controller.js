const {
      deleteStore,
      isOldStoreById,
      getStoreByIdAndManagerId
} = require('../../../models/store.model');

async function httpDeleteStore(req, res) {
      try {
            const storeId = req.params.id;
            const managerId = req.session.manager.userId;
            const isOldStore = await isOldStoreById(storeId);
            if(!isOldStore) {
                  return res.status(400).json({ message: 'The store was not found' });
            }

            const managerHasStore = await getStoreByIdAndManagerId(storeId, managerId);
            if (managerHasStore) {
                  await deleteStore(storeId);
                  return res.redirect('/manager-dashboard');
            }
            return res.status(400).json({ message: 'An error occurred, the store was not deleted' });

      } catch (err) {
      console.error(err);
}
}

module.exports = {
      httpDeleteStore,
};