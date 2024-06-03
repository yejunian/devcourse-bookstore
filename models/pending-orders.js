const conn = require('../database/connect/mariadb');

module.exports.read = async (email, pendingOrderId) => {
  const sql = `
    SELECT
      items.book_id,
      items.unit_price,
      items.quantity,
      books.title,
      books.excerpt,
      images.url AS image_url
    FROM
      users
    INNER JOIN pending_orders AS p
      ON users.id = p.user_id
      AND users.email = ?
      AND p.id = ?
    INNER JOIN pending_order_items AS items
      ON p.id = items.pending_order_id
    INNER JOIN books
      ON items.book_id = books.id
    LEFT JOIN book_images AS images
      ON books.thumbnail_id = images.id
  `;
  const values = [email, pendingOrderId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  return results.map((record) => ({
    bookId: record.book_id,
    price: record.unit_price,
    quantity: record.quantity,
    title: record.title,
    image: record.image_url,
    excerpt: record.excerpt,
  }));
};

module.exports.create = async (email) => {
  const sql = `
    INSERT INTO
      pending_orders (user_id)
    SELECT
      id
    FROM
      users
    WHERE
      email = ?
  `;
  const values = [email];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러 (FK 참조 에러, 중복 에러를 구분할 것)
    return false;
  }

  if (!results?.affectedRows) {
    return false;
  }

  return results.insertId;
};

module.exports.createItems = async (email, items, pendingOrderId) => {
  const sql = `
    INSERT INTO
      pending_order_items (pending_order_id, book_id, unit_price, quantity)
    SELECT
      ?,
      cart_items.book_id,
      books.price,
      cart_items.count
    FROM
      users
    INNER JOIN cart_items
      ON users.id = cart_items.user_id
      AND users.email = ?
      AND cart_items.book_id IN (?)
    INNER JOIN books
      ON cart_items.book_id = books.id
  `;
  const values = [pendingOrderId, email, items];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러 (FK 참조 에러, 중복 에러를 구분할 것)
    return false;
  }

  return results.affectedRows !== 0;
};

module.exports.delete = async (pendingOrderId) => {
  const itemDeletionSql = `
    DELETE
    FROM
      pending_order_items
    WHERE
      pending_order_id = ?
  `;
  const itemDeletionValues = [pendingOrderId];

  let itemDeletionResults;

  try {
    [itemDeletionResults] = await conn
      .promise()
      .query(itemDeletionSql, itemDeletionValues);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  if (!itemDeletionResults.affectedRows) {
    return false;
  }

  const idDeletionSql = `
    DELETE
    FROM
      pending_orders
    WHERE
      id = ?
  `;
  const idDeletionValues = [pendingOrderId];

  let idDeletionResults;

  try {
    [idDeletionResults] = await conn
      .promise()
      .query(idDeletionSql, idDeletionValues);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  return idDeletionResults.affectedRows !== 0;
};
