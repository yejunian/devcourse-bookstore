const cookie = require('cookie');
const express = require('express');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const envConfig = require('../config/env');
const validators = require('../middlewares/validators');
const pendingOrdersService = require('../services/pending-orders');

const pendingOrdersRouter = express.Router();

pendingOrdersRouter
  .route('/')

  // TODO - 유효성 검사
  .post(validators['pending-orders']['/'].POST, async (req, res) => {
    const { token } = cookie.parse(req.headers.cookie);

    let email;
    try {
      ({ email } = jwt.verify(token, envConfig.jwt.secret));
    } catch (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        reasons: ['header : unauthorized'],
      });
    }

    // TODO - 빈 배열 예외 처리
    const items = req.body.cartItems.filter(
      (id) => typeof id === 'number' && id > 0
    );
    const success = await pendingOrdersService.create(email, items);

    // TODO - 실패 원인 세분화
    if (!success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['body : bad request'],
      });
    }

    return res.status(StatusCodes.CREATED).end();
  });

pendingOrdersRouter
  .route('/:pendingOrderId')

  .get(
    validators['pending-orders']['/:pendingOrderId'].GET,
    async (req, res) => {
      const { token } = cookie.parse(req.headers.cookie);

      let email;
      try {
        ({ email } = jwt.verify(token, envConfig.jwt.secret));
      } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          reasons: ['header : unauthorized'],
        });
      }

      const pendingOrderId = parseInt(req.params.pendingOrderId);
      const result = await pendingOrdersService.read(email, pendingOrderId);

      // TODO - 실패 원인 세분화
      if (!result?.items?.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          reasons: ['request : bad request'],
        });
      }

      return res.status(StatusCodes.OK).json(result);
    }
  );

module.exports = pendingOrdersRouter;
