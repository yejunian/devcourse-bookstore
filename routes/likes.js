const express = require('express');
const { StatusCodes } = require('http-status-codes');

const jwtDecoder = require('../middlewares/jwt-decoder');
const likesService = require('../services/likes');

const likesRouter = express.Router();

likesRouter
  .route('/:bookId')

  .get(jwtDecoder.decode, async (req, res) => {
    const email = req.auth?.token?.email;
    const bookId = parseInt(req.params.bookId);
    const like = await likesService.readLike(bookId, email);

    return res.status(StatusCodes.OK).json(like);
  })

  .post(jwtDecoder.ensureAuthentication, async (req, res) => {
    const email = req.auth?.token?.email;
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

  .delete(jwtDecoder.ensureAuthentication, async (req, res) => {
    const email = req.auth?.token?.email;
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
