const ordersModel = require('../models/orders');

module.exports.read = async (email) => {
  const result = await ordersModel.read(email);

  return result;
};

module.exports.create = async (email, order) => {
  const orderId = await ordersModel.create(email, order);

  if (typeof orderId !== 'number') {
    return false;
  }

  const success = await ordersModel.createItems(email, order, orderId);

  // TODO - id가 `order.pendingOrderId`인 주문 대기 삭제 (개별 항목, 목록)
  // TODO - 장바구니에서 구매한 항목과 수량이 일치하는 항목 삭제

  return success;
};
