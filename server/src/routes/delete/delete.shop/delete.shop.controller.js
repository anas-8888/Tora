const {
      deleteShop,
      isOldShopById,
      getShopByIdAndManagerId
} = require('./../../../models/shop.model');

async function httpDeleteShop(req, res) {
      try {
            const shopId = req.params.id;
            const managerId = req.session.manager.userId;
            const isOldShop = await isOldShopById(shopId);
            if(!isOldShop) {
                  return res.status(400).json({message: 'Shop is not found'});
            }

            const managerHasShop = await getShopByIdAndManagerId(shopId, managerId);
            if (managerHasShop) {
                  await deleteShop(shopId);
                  return res.redirect('/manager-dashboard');
            }
            return res.status(400).json({ message: 'An error occurred, the shop was not deleted' });

      } catch (err) {
      console.error(err);
}
}

module.exports = {
      httpDeleteShop,
};