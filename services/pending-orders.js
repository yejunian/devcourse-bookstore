const pendingOrdersModel = require('../models/pending-orders');

module.exports.read = async (email, pendingOrderId) => {
  const pendingOrderItems = await pendingOrdersModel.read(
    email,
    pendingOrderId
  );

  if (!pendingOrderItems) {
    return false;
  }

  return {
    items: pendingOrderItems,
  };
};

module.exports.create = async (email, items) => {
  if (!items.length) {
    return false;
  }

  const pendingOrderId = await pendingOrdersModel.create(email);

  if (!pendingOrderId) {
    return false;
  }

  const success = await pendingOrdersModel.createItems(
    email,
    items,
    pendingOrderId
  );

  return success;
};
