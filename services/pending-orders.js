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
