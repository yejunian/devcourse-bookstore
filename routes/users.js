const express = require('express');

const { sendNotImplementedWith } = require('../middlewares/error-responses');

const usersRouter = express.Router();

usersRouter
  .route('/')

  // TODO - 회원 가입 구현
  .post(sendNotImplementedWith('회원 가입'));

usersRouter
  .route('/:userId')

  // TODO - 비밀번호 초기화 적용 구현
  .put(sendNotImplementedWith('비밀번호 초기화 적용'));

module.exports = usersRouter;
