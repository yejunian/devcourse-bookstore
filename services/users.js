const usersModel = require('../models/users');

module.exports.create = async ({ email, password }) => {
  const success = await usersModel.create({ email, password });
  return success;
};

module.exports.updatePassword = async ({ email, password }) => {
  const success = await usersModel.updatePassword({ email, password });
  return success;
};
