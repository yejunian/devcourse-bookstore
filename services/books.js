const booksModel = require('../models/books');

module.exports.readPage = async (query) => {
  const records = await booksModel.readPage(query);

  const books = records.map((record) => ({
    ...record,
    // TODO - 개별 도서의 좋아요 수
    // likeCount: number,
  }));

  return {
    // TODO - 페이지 정보
    // totalCount: number,
    // page: {
    //   total: number,
    //   current: number,
    // },
    books,
  };
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
