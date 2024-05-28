const conn = require('../database/connect/mariadb');

module.exports.readByEmail = async (email) => {
  const sql = `
    SELECT
      c.id,
      c.book_id, c.count,
      b.title, b.price, b.excerpt,
      i.url AS image_url
    FROM
      cart_items AS c
    INNER JOIN
      users AS u
      ON c.user_id = u.id
      AND u.email = ?
    INNER JOIN
      books AS b
      ON c.book_id = b.id
    LEFT JOIN
      book_images AS i
      ON b.thumbnail_id = i.id
    ORDER BY
      c.id
  `;
  const values = [email];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  return results.map((record) => ({
    count: record.count,
    bookId: record.book_id,
    title: record.title,
    price: record.price,
    image: record.image_url,
    excerpt: record.excerpt,
  }));
};

module.exports.createWithEmail = async (email, item) => {
  const sql = `
    INSERT INTO
      cart_items (user_id, book_id, count)
    SELECT
      id, ?, ?
    FROM
      users
    WHERE
      email = ?
  `;
  const values = [item.bookId, item.quantity, email];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러 (FK 참조 에러, 중복 에러를 구분할 것)
    return false;
  }

  return results.affectedRows !== 0;
};
