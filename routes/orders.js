const cookie = require('cookie');
const express = require('express');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const envConfig = require('../config/env');
const validators = require('../middlewares/validators');
const ordersService = require('../services/orders');

const ordersRouter = express.Router();

ordersRouter
  .route('/')

  .get(async (req, res) => {
    const { token } = cookie.parse(req.headers.cookie);

    let email;
    try {
      ({ email } = jwt.verify(token, envConfig.jwt.secret));
    } catch (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        reasons: ['header : unauthorized'],
      });
    }

    const result = await ordersService.readAll(email);

    // TODO - 실패 원인 세분화
    if (!result?.orders?.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['request : bad request'],
      });
    }

    return res.status(StatusCodes.OK).json(result);
  })

  .post(validators.orders['/'].POST, async (req, res) => {
    const { token } = cookie.parse(req.headers.cookie);

    let email;
    try {
      ({ email } = jwt.verify(token, envConfig.jwt.secret));
    } catch (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        reasons: ['header : unauthorized'],
      });
    }

    const success = await ordersService.create(email, req.body);

    // TODO - 실패 원인 세분화
    if (!success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['body : bad request'],
      });
    }

    return res.status(StatusCodes.CREATED).end();
  });

ordersRouter
  .route('/:orderId')

  .get(validators.orders['/:orderId'].GET, async (req, res) => {
    const { token } = cookie.parse(req.headers.cookie);

    let email;
    try {
      ({ email } = jwt.verify(token, envConfig.jwt.secret));
    } catch (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        reasons: ['header : unauthorized'],
      });
    }

    const orderId = parseInt(req.params.orderId);
    const result = await ordersService.readItems(email, orderId);

    // TODO - 실패 원인 세분화
    if (!result?.items?.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['request : bad request'],
      });
    }

    return res.status(StatusCodes.OK).json(result);
  });

module.exports = ordersRouter;
