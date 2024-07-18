const {
      isOldShopById,
      editShop,
      getShopByIdAndManagerId
} = require('../../../models/shop.model');

async function httpEditShop(req, res) {
      try {
            const newShop = req.body;
            if(!newShop) {
                  return res.status(400).json({ message: 'Invalid data' });
            }

            const managerId = req.session.manager.userId
            if (!managerId) {
                  throw new Error('Manager id is required')
            }
            
            newShop._id = req.params.id
            if (!newShop._id) {
                  throw new Error('Shop id is required')
            }
            
            const oldShop = await isOldShopById(newShop._id);
            if (!oldShop) {
                  return res.status(400).json({ message: 'This shop is not exist!' });
            }

            let newShopData ={};
            newShopData._id = newShop._id;
            
            const managerHasShop = await getShopByIdAndManagerId(newShop._id, managerId);
            if (!managerHasShop) {
                  return res.status(400).json({ message: "You can't access to this shop!" });
            }
            
            if(newShop.name) {
                  newShopData.name = newShop.name;
            }
            if(newShop.location) {
                  newShopData.location = newShop.location;
            }
            
            await editShop(newShopData);
            return res.redirect('/manager-dashboard');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpEditShop,
};