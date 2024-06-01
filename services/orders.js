const cartModel = require('../models/cart');
const ordersModel = require('../models/orders');
const pendingOrdersModel = require('../models/pending-orders');

module.exports.readAll = async (email) => {
  const result = await ordersModel.readAll(email);

  return result;
};

module.exports.readItems = async (email, orderId) => {
  const result = await ordersModel.read(email, orderId);

  return {
    items: result,
  };
};

module.exports.create = async (email, order) => {
  const orderId = await ordersModel.create(email, order);
  if (typeof orderId !== 'number') {
    return false;
  }

  const creationSuccess = await ordersModel.createItems(order, orderId);
  if (!creationSuccess) {
    return false;
  }

  await cartModel.deleteOrdered(order.pendingOrderId);
  await pendingOrdersModel.delete(order.pendingOrderId);

  return creationSuccess;
};
