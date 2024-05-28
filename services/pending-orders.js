const pendingOrdersModel = require('../models/pending-orders');

module.exports.read = async (email, pendingOrderId) => {
  const pendingOrder = await pendingOrdersModel.read(email, pendingOrderId);

  if (!pendingOrder) {
    return false;
  }

  return {
    items: pendingOrder,
  };
};

module.exports.create = async (email, items) => {
  const isPendingOrderCreated = await pendingOrdersModel.create(email);

  if (!isPendingOrderCreated) {
    return false;
  }

  const records = await pendingOrdersModel.createItems(email, items);

  if (!records?.length) {
    return false;
  }

  return {
    items: records,
  };
};
