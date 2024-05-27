const cookie = require('cookie');
const express = require('express');
const jwt = require('jsonwebtoken');

const envConfig = require('../config/env');
const likesService = require('../services/likes');
const { StatusCodes } = require('http-status-codes');

const likesRouter = express.Router();

likesRouter
  .route('/:bookId')

  .get(async (req, res) => {
    const { token } = cookie.parse(req.headers.cookie);

    let email;
    try {
      ({ email } = jwt.verify(token, envConfig.jwt.secret));
    } catch (err) {
      email = '';
    }

    const bookId = parseInt(req.params.bookId);
    const result = await likesService.readLikeCount(bookId, email);

    return res.status(StatusCodes.OK).json(result);
  })

  .post(async (req, res) => {
    const { token } = cookie.parse(req.headers.cookie);

    let email;
    try {
      ({ email } = jwt.verify(token, envConfig.jwt.secret));
    } catch (err) {
      // TODO - 토큰 만료 메시지를 분리해야 할까?
      return res.status(StatusCodes.UNAUTHORIZED).json({
        reasons: ['header : unauthorized'],
      });
    }

    const bookId = parseInt(req.params.bookId);
    const success = await likesService.createLike(email, bookId);

    if (!success) {
      // TODO - 실패 원인 분리 필요
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['params.bookId : bad request'],
      });
    }

    return res.status(StatusCodes.CREATED).end();
  })

  .delete(async (req, res) => {
    const { token } = cookie.parse(req.headers.cookie);

    let email;
    try {
      ({ email } = jwt.verify(token, envConfig.jwt.secret));
    } catch (err) {
      // TODO - 토큰 만료 메시지를 분리해야 할까?
      return res.status(StatusCodes.UNAUTHORIZED).json({
        reasons: ['header : unauthorized'],
      });
    }

    const bookId = parseInt(req.params.bookId);
    const success = await likesService.deleteLike(email, bookId);

    if (!success) {
      // TODO - 실패 원인 분리 필요
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['params.bookId : bad request'],
      });
    }

    return res.status(StatusCodes.OK).end();
  });

module.exports = likesRouter;
