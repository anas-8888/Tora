const clientData = require('./client.mongo');

async function addNewClient(client) {
      const isOldClient = await clientData.findOne({ name: client.name, owner: client.owner });
      if (isOldClient) {
            isOldClient.DebtPrice = (+isOldClient.DebtPrice) + (+client.DebtPrice);
            await isOldClient.save();
      } else {
            await clientData.updateOne(client, client, { upsert: true });
      }
}

async function getClientByNameAndManagerId(clientName, managerId) {
      const client = await clientData.findOne({ name: clientName, owner: managerId });
      return client;
}

async function getAllClient(managerId) {
      const clients = await clientData.find({ owner: managerId }).sort({ _id: -1 });
      return clients;
}

async function isManagerHasClient(managerId, clientId) {
      const client = await clientData.findOne({ owner: managerId, _id: clientId });
      return client;
}

async function deleteClient(clientId) {
      await clientData.deleteOne({ _id: clientId });
}

async function nameExist(newName, managerId) {
      const client = await clientData.findOne({ name: newName, owner: managerId });
      return client;
}

async function editClientInfo(clientId, newClient) {
      await clientData.updateOne(
            {
                  _id: clientId,
            },
            newClient
      );
}

module.exports = {
      addNewClient,
      getClientByNameAndManagerId,
      getAllClient,
      isManagerHasClient,
      deleteClient,
      nameExist,
      editClientInfo
};
