const booksModel = require('../models/books');

module.exports.readPage = async (query) => {
  const result = await booksModel.readPage(query);

  return result;
};

module.exports.read = async (bookId, email) => {
  const bookRecord = await booksModel.read(bookId, email);

  if (!bookRecord) {
    // TODO - 도서 없음
    return false;
  }

  const imagesRecords = await booksModel.readImagesByBookId(bookId);

  return {
    ...bookRecord,
    images: imagesRecords?.length ? imagesRecords.map(({ url }) => url) : [],
  };
};
