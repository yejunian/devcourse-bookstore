const express = require('express');
const { StatusCodes } = require('http-status-codes');

const jwtDecoder = require('../middlewares/jwt-decoder');
const validators = require('../middlewares/validators');
const booksService = require('../services/books');

const booksRouter = express.Router();

booksRouter
  .route('/')

  .get(validators.books['/'].GET, async (req, res) => {
    const query = {
      keyword: req.query.keyword || undefined,
      category: parseInt(req.query.category) || undefined,
      isNew: req.query.new === 'true',
      page: parseInt(req.query.page) || undefined,
      pageSize: parseInt(req.query.limit) || undefined,
    };

    const result = await booksService.readPage(query);

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['query : invalid'],
      });
    }

    if (!result.books?.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        reasons: ['response : not found'],
        ...result,
      });
    }

    return res.status(StatusCodes.OK).json(result);
  });

booksRouter
  .route('/:bookId')

  .get(
    validators.books['/:bookId'].GET,
    jwtDecoder.decode,
    async (req, res) => {
      const bookId = parseInt(req.params.bookId);
      const email = req.auth?.token?.email;
      const book = await booksService.read(bookId, email);

      if (!book) {
        return res.status(StatusCodes.NOT_FOUND).json({
          reasons: ['params.bookId : not found'],
        });
      }

      return res.status(StatusCodes.OK).json(book);
    }
  );

module.exports = booksRouter;
