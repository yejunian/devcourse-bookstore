const express = require('express');
const { StatusCodes } = require('http-status-codes');

const { sendNotImplementedWith } = require('../middlewares/error-responses');
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
  .route('/:cartItemId')

  // TODO - 개별 회원의 장바구니 항목 개별 수정 구현
  .put(sendNotImplementedWith('개별 회원의 장바구니 항목 개별 수정'))

  // TODO - 개별 회원의 장바구니 항목 개별 삭제 구현
  .delete(sendNotImplementedWith('개별 회원의 장바구니 항목 개별 삭제'));

module.exports = cartRouter;
