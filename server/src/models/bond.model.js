const bondData = require('./bond.mongo');

async function addNewBond(bond) {
      try {
            await bondData.updateOne(
                  bond,
                  bond,
                  { upsert: true }
            );

      } catch (err) {
            console.log(err);
      }
}


module.exports = {
      addNewBond
}