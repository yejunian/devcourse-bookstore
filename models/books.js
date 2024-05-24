const conn = require('../database/connect/mariadb');

module.exports.readPage = async ({
  keyword,
  category,
  isNew,
  page = 1,
  pageSize = 8,
}) => {
  const sql = `
    SELECT
      b.*, i.url AS thumbnail_url
    FROM
      books AS b
        LEFT JOIN
      book_images AS i ON b.thumbnail_id = i.id
    ORDER BY b.id ASC
    LIMIT ? OFFSET ?`;
  const values = [pageSize, (page - 1) * pageSize];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    console.log(err);
    return false;
  }

  return results.map((record) => ({
    id: record.id,
    thumbnail: record.thumbnail_url,
    title: record.title,
    author: record.author,
    excerpt: record.excerpt,
    price: record.price,
    pubDate: record.pub_date,
  }));
};

module.exports.read = async (bookId) => {
  const sql = `
    SELECT
      b.*, i.url AS thumbnail_url
    FROM
      books AS b
        LEFT JOIN
      book_images AS i ON b.thumbnail_id = i.id
    WHERE
      b.id = ?
    LIMIT 1`;
  const values = [bookId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    console.log(err);
    return false;
  }

  if (!results.length) {
    // TODO - 도서 없음
    return false;
  }

  const bookRecord = results[0];

  return {
    title: bookRecord.title,
    category: bookRecord.category,
    form: bookRecord.form,
    author: bookRecord.author,
    isbn: bookRecord.isbn,
    pages: bookRecord.pages,
    price: bookRecord.price,
    thumbnail: bookRecord.thumbnail_url,
    excerpt: bookRecord.excerpt,
    toc: bookRecord.toc,
    content: bookRecord.content,
  };
};

module.exports.readImagesByBookId = async (bookId) => {
  const sql = `
    SELECT
      *
    FROM
      book_images
    WHERE
      book_id = ?
    ORDER BY priority ASC`;
  const values = [bookId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    console.log(err);
    return false;
  }

  if (!results.length) {
    // TODO - 이미지 없음
    return false;
  }

  return results;
};
