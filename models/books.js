const conn = require('../database/connect/mariadb');

const isNewComparison = 'DATEDIFF(NOW(), books.pub_date) <= 30';
const categoryComparison = 'books.category = ?';
const orderByPubDate = 'ORDER BY books.pub_date DESC';

// TODO - 도서 검색
module.exports.readPage = async ({
  keyword,
  category,
  isNew,
  page = 1,
  pageSize = 8,
}) => {
  const contentSqlFragments = [
    `
      SELECT
        books.*,
        book_images.url AS thumbnail_url,
        (
          SELECT
            COUNT(*)
          FROM
            likes
          WHERE
            likes.book_id = books.id
        ) AS like_count
      FROM
        books
      LEFT JOIN
        book_images
        ON books.thumbnail_id = book_images.id
    `,
  ];
  const contentSqlValue = [];

  if (isNew && category) {
    contentSqlFragments.push(`
      WHERE
        ${isNewComparison}
        AND ${categoryComparison}
      ${orderByPubDate}
    `);
    contentSqlValue.push(category);
  } else if (isNew) {
    contentSqlFragments.push(`
      WHERE
        ${isNewComparison}
      ${orderByPubDate}
    `);
  } else if (category) {
    contentSqlFragments.push(`
      WHERE
        ${categoryComparison}
    `);
    contentSqlValue.push(category);
  }

  const countSqlFragments = [...contentSqlFragments];
  countSqlFragments[0] = 'SELECT COUNT(id) AS cnt FROM books';
  const countSqlValue = [...contentSqlValue];

  contentSqlFragments.push(`LIMIT ? OFFSET ?`);
  contentSqlValue.push(pageSize, (page - 1) * pageSize);

  const contentSql = contentSqlFragments.join('\n');
  const countSql = countSqlFragments.join('\n');
  let contentResults, countResults;

  try {
    [contentResults] = await conn.promise().query(contentSql, contentSqlValue);
    [countResults] = await conn.promise().query(countSql, countSqlValue);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  const total = countResults[0].cnt;

  return {
    pagination: {
      total,
      current: page,
    },
    books: contentResults.map((record) => ({
      id: record.id,
      thumbnail: record.thumbnail_url,
      title: record.title,
      author: record.author,
      price: record.price,
      pubDate: record.pub_date,
      likes: record.like_count,
      excerpt: record.excerpt,
    })),
  };
};

module.exports.read = async (bookId, email) => {
  const sql = `
    SELECT
      books.*,
      book_images.url AS thumbnail_url,
      (
        SELECT
          COUNT(*)
        FROM
          likes
        WHERE
          book_id = ?
      ) AS like_count,
      (
        EXISTS(
          SELECT
            *
          FROM
            likes
          INNER JOIN
            users
            ON users.email = ?
            AND likes.user_id = users.id AND book_id = ?
        )
      ) AS user_liked
    FROM
      books
    LEFT JOIN
      book_images
      ON books.thumbnail_id = book_images.id
    WHERE
      books.id = ?
    LIMIT 1
  `;
  const values = [bookId, email, bookId, bookId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
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
    likes: bookRecord.like_count,
    userLiked: bookRecord.user_liked === 1,
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
    ORDER BY
      priority ASC
  `;
  const values = [bookId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  if (!results.length) {
    // TODO - 이미지 없음
    return false;
  }

  return results;
};
