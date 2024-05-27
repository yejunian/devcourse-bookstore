const conn = require('../database/connect/mariadb');

module.exports.readLikeCount = async (bookId, email) => {
  const sql = `
    SELECT
      COUNT(*) AS like_count,
      (EXISTS( SELECT
          *
        FROM
          likes AS l
            LEFT JOIN
          users AS u ON u.email = ?
        WHERE
          l.user_id = u.id AND book_id = ?)) AS user_liked
    FROM
      likes
    WHERE
      book_id = ?;`;
  const values = [email, bookId, bookId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    console.log(err);
    return false;
  }

  if (typeof results[0]?.like_count !== 'number') {
    return false;
  }

  return {
    likes: results[0].like_count,
    userLiked: results[0].user_liked,
  };
};

module.exports.createLike = async (userId, bookId) => {
  const sql = `
    INSERT
      INTO likes (user_id, book_id)
      VALUES (?, ?)`;
  const values = [userId, bookId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    if (err.code.startsWith('ER_NO_REFERENCED_ROW')) {
      // TODO - 책 없음
    } else if (err.code === 'ER_DUP_ENTRY') {
      // TODO - 이미 좋아요 활성화
    } else {
      // TODO - DB 에러
    }
    return false;
  }

  return results.affectedRows === 1;
};

module.exports.deleteLike = async (userId, bookId) => {
  const sql = `
    DELETE
      FROM likes
      WHERE user_id = ? AND book_id = ?`;
  const values = [userId, bookId];

  let results;

  try {
    [results] = await conn.promise().query(sql, values);
  } catch (err) {
    // TODO - DB 에러
    return false;
  }

  // TODO - 책 없음, 이미 좋아요 해제 -> 두 가지 분리 가능한가? 안 되면 400/409로 뭉뚱그리나?
  return results.affectedRows === 1;
};
