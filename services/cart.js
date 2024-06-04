const cartModel = require('../models/cart');

module.exports.readByEmail = async (email) => {
  const userCart = await cartModel.readByEmail(email);

  if (!userCart) {
    return false;
  }

  return {
    items: userCart,
  };
};

module.exports.createWithEmail = async (email, item) => {
  const success = await cartModel.createWithEmail(email, item);

  return success;
};

module.exports.updateWithEmail = async (email, bookId, quantity) => {
  const success = await cartModel.updateWithEmail(email, bookId, quantity);

  return success;
};

module.exports.deleteWithEmail = async (email, bookId) => {
  const success = await cartModel.deleteWithEmail(email, bookId);

  return success;
};
