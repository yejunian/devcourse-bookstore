const jwt = require('jsonwebtoken');

const envConfig = require('../config/env');
const usersModel = require('../models/users');
const hashPassword = require('../utils/hash-password');

module.exports.createLoginToken = async ({ email, password }) => {
  const user = await usersModel.readByEmail(email);

  // TODO - 이메일 불일치
  if (!user) {
    return false;
  }

  const { hashedPassword } = hashPassword(password, user.salt);

  // TODO - 비밀번호 불일치
  if (user.password !== hashedPassword) {
    return false;
  }

  const jwtPayload = { email: user.email };
  const token = jwt.sign(jwtPayload, envConfig.jwt.secret, {
    expiresIn: '10m',
    issuer: 'yejunian',
  });

  return token;
};

module.exports.createResetToken = async ({ email }) => {
  const user = await usersModel.readByEmail(email);

  if (!user) {
    return false;
  }

  const jwtPayload = { email: user.email };
  const token = jwt.sign(jwtPayload, envConfig.jwt.secret, {
    expiresIn: '5m',
    issuer: 'yejunian',
    // TODO - 로그인 토큰과 구별되어야 함
  });

  return token;
};
