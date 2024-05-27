const likesModel = require('../models/likes');
const usersModel = require('../models/users');

module.exports.readLikeCount = async (bookId, email) => {
  const result = await likesModel.readLikeCount(bookId, email);

  return result;
};

// TODO - 오류 내용 분리 필요
module.exports.createLike = async (email, bookId) => {
  const user = await usersModel.readByEmail(email);
  const userId = user?.id;

  if (!userId) {
    return false;
  }

  const success = await likesModel.createLike(userId, bookId);

  return success;
};

// TODO - 오류 내용 분리 필요
module.exports.deleteLike = async (email, bookId) => {
  const user = await usersModel.readByEmail(email);
  const userId = user?.id;

  if (!userId) {
    return false;
  }

  const success = await likesModel.deleteLike(userId, bookId);

  return success;
};
