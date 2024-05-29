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

    const result = await ordersService.read(email);

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

module.exports = ordersRouter;
