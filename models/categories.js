const conn = require('../database/connect/mariadb');

module.exports.readAll = async () => {
  const sql = `
    SELECT
      *
    FROM
      book_categories
    ORDER BY id ASC`;

  let results;

  try {
    [results] = await conn.promise().query(sql);
  } catch (err) {
    // TODO - DB 에러
    console.log(err);
    return false;
  }

  return results.map((record) => ({
    id: record.id,
    name: record.name,
  }));
};
