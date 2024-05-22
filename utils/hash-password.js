const crypto = require('crypto');

const hashPassword = (password, saltInput) => {
  const salt = saltInput || crypto.randomBytes(36).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 100000, 72, 'sha512')
    .toString('base64');

  return { salt, hashedPassword };
};

module.exports = hashPassword;
