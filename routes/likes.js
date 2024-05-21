const express = require('express');

const { sendNotImplementedWith } = require('./middlewares/error-responses');

const likesRouter = express.Router();

likesRouter
  .route('/:bookId')

  // TODO - 개별 도서의 좋아요 수 조회 구현
  .get(sendNotImplementedWith('개별 도서의 좋아요 수 조회'))

  // TODO - 개별 회원의 개별 도서 좋아요 활성화 구현
  .post(sendNotImplementedWith('개별 회원의 개별 도서 좋아요 활성화'))

  // TODO - 개별 회원의 개별 도서 좋아요 취소 구현
  .delete(sendNotImplementedWith('개별 회원의 개별 도서 좋아요 취소'));

module.exports = likesRouter;
