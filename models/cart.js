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

module.exports.updateWithEmail = async (email, bookId, quantity) => {
  const sql = `
    UPDATE
      cart_items
    INNER JOIN
      users
      ON users.id = cart_items.user_id
      AND users.email = ?
    INNER JOIN
      books
      ON books.id = cart_items.book_id
      AND books.id = ?
    SET
      cart_items.count = ?
  `;
  const values = [email, bookId, quantity];

  let result;

  try {
    [result] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  if (!result?.affectedRows) {
    // TODO - 수정할 항목이 없음: 다른 사용자의 것인지, 내 것인데 없는 건지는 모름
    return false;
  }

  return result.affectedRows > 0;
};

module.exports.deleteWithEmail = async (email, bookId) => {
  const sql = `
    DELETE cart_items
    FROM
      cart_items
    INNER JOIN
      users
      ON users.id = cart_items.user_id
      AND users.email = ?
    INNER JOIN
      books
      ON books.id = cart_items.book_id
      AND books.id = ?
  `;
  const values = [email, bookId];

  let result;

  try {
    [result] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  if (!result?.affectedRows) {
    // TODO - 삭제할 항목이 없음: 다른 사용자의 것인지, 내 것인데 없는 건지는 모름
    return false;
  }

  return result.affectedRows > 0;
};

module.exports.deleteOrdered = async (pendingOrderId) => {
  const sql = `
    DELETE cart_items
    FROM
      pending_orders
    INNER JOIN
      pending_order_items
      ON pending_orders.id = pending_order_items.pending_order_id
      AND pending_orders.id = ?
    INNER JOIN
      cart_items
      ON pending_orders.user_id = cart_items.user_id
      AND pending_order_items.book_id = cart_items.book_id
      AND pending_order_items.quantity = cart_items.count
  `;
  const values = [pendingOrderId];

  try {
    await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  return true;
};
