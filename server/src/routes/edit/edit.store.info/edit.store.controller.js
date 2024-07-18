const {
      isOldStoreById,
      getStoreByIdAndManagerId,
      editStore
} = require('../../../models/store.model');

async function httpEditStore(req, res) {
      try {
            const newStore = req.body;
            if(!newStore) {
                  return res.status(400).json({ message: 'Invalid data' });
            }

            const managerId = req.session.manager.userId
            if (!managerId) {
                  throw new Error('Manager id is required')
            }
            
            newStore._id = req.params.id
            if (!newStore._id) {
                  throw new Error('Store id is required')
            }
            
            const oldStore = await isOldStoreById(newStore._id);
            if (!oldStore) {
                  return res.status(400).json({ message: 'This store is not exist!' });
            }

            let newStoreData ={};
            newStoreData._id = newStore._id;
            
            const managerHasStore = await getStoreByIdAndManagerId(newStore._id, managerId);
            if (!managerHasStore) {
                  return res.status(400).json({ message: "You can't access to this store!" });
            }
            
            if(newStore.name) {
                  newStoreData.name = newStore.name;
            }
            if(newStore.location) {
                  newStoreData.location = newStore.location;
            }
            
            await editStore(newStoreData);
            return res.redirect('/manager-dashboard');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpEditStore,
};