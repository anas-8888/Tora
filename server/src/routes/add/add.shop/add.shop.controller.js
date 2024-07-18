const {
      addNewShop,
      isOldShop
} = require('./../../../models/shop.model');

async function httpAddShop(req, res) {
      try {
            var shop = req.body; 
            shop.owner = req.session.manager.userId;

            if (!shop.name || !shop.location) {
                  return res.status(400).json({ message: 'Pleas fill all fildes!' });
            }

            const oldShop = await isOldShop(shop);
            if (oldShop) {
                  return res.status(400).json({ message: 'This shop is old!' });
            }

            await addNewShop(shop);

            return res.redirect('/manager-dashboard');

      } catch (err) {
            console.error(err);
      }
}

module.exports = {
      httpAddShop,
};