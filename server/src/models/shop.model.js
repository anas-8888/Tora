const shopData = require('./shop.mongo');
const storeData = require('./store.mongo');
const clientData = require('./client.mongo');
const employeeData = require('./employee.mongo');

async function getShopsByManagerId(managerId) {
      return await shopData.find({
            owner: managerId,
      }).sort({ _id: -1 });
}


async function isOldShop(shop) {
      return await shopData.findOne({
            name: shop.name,
            location: shop.location,
            owner: shop.owner
      });
}

async function isOldShopById(shopId) {
      return await shopData.findOne({
            _id: shopId
      });
}

async function addNewShop(shop) {
      await shopData.updateOne(
            {
                  name: shop.name,
                  location: shop.location,
                  owner: shop.owner
            },
            {
                  name: shop.name,
                  location: shop.location,
                  owner: shop.owner
            },
            {
                  upsert: true,
            }
      );
      const shopId = await isOldShop(shop);
      await storeData.updateOne(
            {
                  name: shop.name,
                  location: shop.location,
                  owner: shop.owner,
                  shopRelation: shopId
            },
            {
                  name: shop.name,
                  location: shop.location,
                  owner: shop.owner,
                  shopRelation: shopId
            },
            {
                  upsert: true,
            }
      );
}

async function deleteShop(shopId) {
      await shopData.deleteOne(
            {
                  _id: shopId
            }
      );
      await storeData.deleteOne(
            {
                  shopRelation: shopId
            }
      );
      await clientData.deleteOne(
            {
                  owner: shopId
            }
      );
      await employeeData.deleteOne(
            {
                  shopId: shopId
            }
      );
}

async function editShop(newShop) {
      try {
            shopId = newShop._id;
            await shopData.findByIdAndUpdate(
                  shopId,
                  newShop,
                  { new: true }
            );
      } catch (error) {
            console.log(error);
            return null;
      }
}

async function getShopIdByName(shopName, managerId) {
      return await shopData.findOne(
            {
                  name: shopName,
                  owner: managerId
            }
      );
}

async function getShopByIdAndManagerId(shopId, managerId) {
      return await shopData.findOne(
            {
                  _id: shopId,
                  owner: managerId
            }
      );
}

async function getShopsNameAndLocationByManagerId(mangerId) {
      return await shopData.find(
            {
                  owner: mangerId
            },
            {
                  _id: 1,
                  name: 1,
                  location: 1
            }
      ).sort({ _id: -1 });
}

async function getShopNameById(shopId) {
      const shop = await shopData.findOne({ _id: shopId });
      return shop ? shop.name : null;
}


async function editCashBox(shopId, total) {
      const shop = await shopData.findOne({ _id: shopId });
      if (!shop) {
            throw new Error('Shop not found');
      }
      shop.box += total;
      if (shop.box < 0) {
            throw new Error('Shop box is negative');
      }
      await shopData.updateOne({ _id: shopId }, shop);
}

async function getCashBoxById(shopId) {
      const shop = await shopData.findOne({ _id: shopId });
      return shop ? shop.box : null;
}

module.exports = {
      getShopsByManagerId,
      addNewShop,
      isOldShop,
      isOldShopById,
      deleteShop,
      editShop,
      getShopIdByName,
      getShopByIdAndManagerId,
      getShopsNameAndLocationByManagerId,
      getShopNameById,
      editCashBox,
      getCashBoxById,
};