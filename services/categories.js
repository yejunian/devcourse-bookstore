const categoriesModel = require('../models/categories');

module.exports.readAll = async () => {
  const categories = await categoriesModel.readAll();

  if (!categories?.length) {
    return false;
  }

  return { categories };
};
