const express = require('express');

const { sendNotImplementedWith } = require('./middlewares/error-responses');

const authRouter = express.Router();

authRouter
  .route('/token')

  // TODO - 로그인 구현
  .post(sendNotImplementedWith('로그인'))

  // TODO - 로그아웃 구현
  .delete(sendNotImplementedWith('로그아웃'));

authRouter
  .route('/reset-token')

  // TODO - 비밀번호 초기화 이메일 확인 구현
  .post(sendNotImplementedWith('비밀번호 초기화 이메일 확인'));

module.exports = authRouter;
