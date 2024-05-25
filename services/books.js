const booksModel = require('../models/books');

module.exports.readPage = async (query) => {
  const result = await booksModel.readPage(query);

  // TODO - 개별 도서의 좋아요 수 포함

  return result;
};

module.exports.read = async (bookId) => {
  const bookRecord = await booksModel.read(bookId);

  if (!bookRecord) {
    // TODO - 도서 없음
    return false;
  }

  const imagesRecords = await booksModel.readImagesByBookId(bookId);

  return {
    ...bookRecord,
    images: imagesRecords?.length ? imagesRecords.map(({ url }) => url) : [],
    // TODO - 개별 도서의 좋아요 수, 유저의 개별 도서 좋아요 여부
    // likes: number,
    // userLiked: boolean,
  };
};
