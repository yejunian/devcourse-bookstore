const express = require('express');

const { sendNotImplementedWith } = require('../middlewares/error-responses');

const cartItemsRouter = express.Router();

cartItemsRouter
  .route('/')

  // TODO - 개별 회원의 장바구니 항목 조회 구현
  .get(sendNotImplementedWith('개별 회원의 장바구니 항목 조회'))

  // TODO - 개별 회원의 장바구니 항목 개별 추가 구현
  .post(sendNotImplementedWith('개별 회원의 장바구니 항목 개별 추가'));

cartItemsRouter
  .route('/:bookId')

  // TODO - 개별 회원의 장바구니 항목 개별 수정 구현
  .put(sendNotImplementedWith('개별 회원의 장바구니 항목 개별 수정'))

  // TODO - 개별 회원의 장바구니 항목 개별 삭제 구현
  .delete(sendNotImplementedWith('개별 회원의 장바구니 항목 개별 삭제'));

module.exports = cartItemsRouter;
