const conn = require('../database/connect/mariadb');

module.exports.readAll = async (email) => {
  const sql = `
    SELECT
      orders.id AS order_id,
      orders.created_at AS order_created_at,
      orders.receiver_address,
      orders.receiver_name,
      orders.receiver_phone,
      COUNT(items.book_id) AS book_count,
      SUM(items.quantity) AS total_quantity,
      books.title AS first_title,
      orders.delivery_tracking_number,
      orders.payment_amount,
      payment_types.name AS payment_type
    FROM
      users
    INNER JOIN orders
      ON users.id = orders.user_id
      AND users.email = ?
    INNER JOIN payment_types
      ON orders.payment_type = payment_types.id
    INNER JOIN order_items AS items
      ON orders.id = items.order_id
    INNER JOIN books
      ON items.book_id = books.id
    GROUP BY
      orders.created_at DESC
  `;
  const values = [email];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  return {
    orders: results.map((record) => ({
      id: record.order_id,
      createdAt: record.order_created_at,
      receiver: {
        address: record.receiver_address,
        name: record.receiver_name,
        phone: record.receiver_phone,
      },
      items: {
        bookCount: record.book_count,
        totalQuantity: parseInt(record.total_quantity),
        firstTitle: record.first_title,
      },
      delivery: {
        trackingNumber: record.delivery_tracking_number,
      },
      payment: {
        amount: record.payment_amount,
        type: record.payment_type,
      },
    })),
  };
};

module.exports.read = async (email, orderId) => {
  const sql = `
    SELECT
      items.book_id AS book_id,
      books.title AS title,
      items.quantity AS quantity,
      items.unit_price AS unit_price
    FROM
      users
    INNER JOIN orders
      ON users.id = orders.user_id
      AND users.email = ?
      AND orders.id = ?
    INNER JOIN order_items AS items
      ON orders.id = items.order_id
    INNER JOIN books
      ON items.book_id = books.id
    ORDER BY
      items.id
  `;
  const values = [email, orderId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  if (!results?.length) {
    return false;
  }

  return results.map((item) => ({
    bookId: item.book_id,
    title: item.title,
    quantity: item.quantity,
    unitPrice: item.unit_price,
  }));
};

module.exports.create = async (email, data) => {
  const sql = `
    INSERT INTO
      orders (
        user_id,
        phase_id,
        receiver_address,
        receiver_name,
        receiver_phone,
        delivery_cost,
        delivery_tracking_number,
        payment_type,
        payment_amount
      )
    SELECT
      users.id,
      ?,
      ?,
      ?,
      ?,
      3000,
      ?,
      payment_types.id,
      ?
    FROM
      users
    CROSS JOIN
      payment_types
      ON users.email = ?
      AND payment_types.name = ?
  `;
  const values = [
    data.payment.type === 'without-bankbook' ? 1 : 2,
    data.receiver.address,
    data.receiver.name,
    data.receiver.phone,
    data.payment.type === 'without-bankbook' ? 'NULL' : 'SOME RANDOM CODE',
    data.payment.amount,
    email,
    data.payment.type,
  ];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  if (!results?.affectedRows) {
    return false;
  }

  return results.insertId;
};

module.exports.createItems = async (items, orderId) => {
  const sql = `
    INSERT INTO
      order_items (order_id, book_id, unit_price, quantity)
    SELECT
      ?,
      pending_items.book_id,
      books.price,
      pending_items.quantity
    FROM
      users
    INNER JOIN pending_orders
      ON users.id = pending_orders.user_id
      AND pending_orders.id = ?
    INNER JOIN pending_order_items AS pending_items
      ON pending_orders.id = pending_items.pending_order_id
    INNER JOIN books
      ON pending_items.book_id = books.id
  `;
  const values = [orderId, items.pendingOrderId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러 (FK 참조 에러, 중복 에러를 구분할 것)
    return false;
  }

  return results.affectedRows !== 0;
};
