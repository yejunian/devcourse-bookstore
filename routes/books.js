const express = require('express');

const { sendNotImplementedWith } = require('../middlewares/error-responses');

const booksRouter = express.Router();

booksRouter
  .route('/')

  // TODO - 도서 전체 조회 구현
  .get(sendNotImplementedWith('도서 전체 조회'));

booksRouter
  .route('/:bookId')

  // TODO - 도서 개별 조회 구현
  .get(sendNotImplementedWith('도서 개별 조회'));

module.exports = booksRouter;
