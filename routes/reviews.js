const express = require('express');

const { sendNotImplementedWith } = require('../middlewares/error-responses');

const reviewsRouter = express.Router();

reviewsRouter
  .route('/:bookId')

  // TODO - 개별 도서의 리뷰 전체 조회 구현
  .get(sendNotImplementedWith('개별 도서의 리뷰 전체 조회'));

module.exports = reviewsRouter;
