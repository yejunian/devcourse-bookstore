const conn = require('../database/connect/mariadb');
const hashPassword = require('../utils/hash-password');

module.exports.create = async ({ email, password }) => {
  const { salt, hashedPassword } = hashPassword(password);

  const sql =
    'INSERT INTO `users` (`email`, `password`, `salt`) VALUES (?, ?, ?)';
  const values = [email, hashedPassword, salt];

  try {
    await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - 중복, 기타 DB 에러
    return false;
  }

  return true;
};

module.exports.readByEmail = async (email) => {
  const sql = 'SELECT * FROM `users` WHERE `email` = ?';
  const values = [email];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  if (!results?.length) {
    // TODO - 매치 없음
    return false;
  }

  return results[0];
};

module.exports.updatePassword = async ({ email, password }) => {
  const { salt, hashedPassword } = hashPassword(password);

  const sql = 'UPDATE `users` SET `password` = ?, `salt` = ? WHERE `email` = ?';
  const values = [hashedPassword, salt, email];

  let results;
  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  // TODO - 이메일 없음
  if (!results.affectedRows) {
    return false;
  }

  return true;
};
