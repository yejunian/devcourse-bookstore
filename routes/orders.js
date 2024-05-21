const express = require('express');

const { sendNotImplementedWith } = require('./middlewares/error-responses');

const ordersRouter = express.Router();

ordersRouter
  .route('/')

  // TODO - 개별 회원의 주문 목록 조회 구현
  .get(sendNotImplementedWith('개별 회원의 주문 목록 조회'))

  // TODO - 개별 회원의 주문 생성 구현
  .post(sendNotImplementedWith('개별 회원의 주문 생성'));

module.exports = ordersRouter;
