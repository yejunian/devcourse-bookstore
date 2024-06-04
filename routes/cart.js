const express = require('express');
const { StatusCodes } = require('http-status-codes');

const jwtDecoder = require('../middlewares/jwt-decoder');
const validators = require('../middlewares/validators');
const cartService = require('../services/cart');

const cartRouter = express.Router();

cartRouter
  .route('/')

  .get(jwtDecoder.ensureAuthentication, async (req, res) => {
    const email = req.auth?.token?.email;
    const userCart = await cartService.readByEmail(email);

    if (!userCart?.items) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        reasons: ['server : internal server error'],
      });
    }

    if (!userCart.items.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        reasons: ['response : not found'],
        ...userCart,
      });
    }

    return res.status(StatusCodes.OK).json(userCart);
  })

  .post(
    validators.cart['/'].POST,
    jwtDecoder.ensureAuthentication,
    async (req, res) => {
      const email = req.auth?.token?.email;
      const item = {
        bookId: req.body.bookId,
        quantity: req.body.quantity,
      };
      const success = await cartService.createWithEmail(email, item);

      // TODO - 실패 원인 세분화
      if (!success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          reasons: ['body : bad request'],
        });
      }

      return res.status(StatusCodes.CREATED).end();
    }
  );

cartRouter
  .route('/:bookId')

  .put(
    validators.cart['/:bookId'].PUT,
    jwtDecoder.ensureAuthentication,
    async (req, res) => {
      const email = req.auth?.token?.email;
      const bookId = parseInt(req.params.bookId);
      const { quantity } = req.body;
      const success = await cartService.updateWithEmail(
        email,
        bookId,
        quantity
      );

      // TODO - 실패 원인 세분화
      if (!success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          reasons: ['body : bad request'],
        });
      }

      return res.status(StatusCodes.OK).end();
    }
  )

  .delete(
    validators.cart['/:bookId'].DELETE,
    jwtDecoder.ensureAuthentication,
    async (req, res) => {
      const email = req.auth?.token?.email;
      const bookId = parseInt(req.params.bookId);
      const success = await cartService.deleteWithEmail(email, bookId);

      // TODO - 실패 원인 세분화
      if (!success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          reasons: ['body : bad request'],
        });
      }

      return res.status(StatusCodes.OK).end();
    }
  );

module.exports = cartRouter;
