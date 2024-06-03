const express = require('express');
const { StatusCodes } = require('http-status-codes');

const jwtDecoder = require('../middlewares/jwt-decoder');
const validators = require('../middlewares/validators');
const ordersService = require('../services/orders');

const ordersRouter = express.Router();

ordersRouter
  .route('/')

  .get(jwtDecoder.ensureAuthentication, async (req, res) => {
    const email = req.auth?.token?.email;
    const result = await ordersService.readAll(email);

    // TODO - 실패 원인 세분화
    if (!result?.orders?.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['request : bad request'],
      });
    }

    return res.status(StatusCodes.OK).json(result);
  })

  .post(
    validators.orders['/'].POST,
    jwtDecoder.ensureAuthentication,
    async (req, res) => {
      const email = req.auth?.token?.email;
      const success = await ordersService.create(email, req.body);

      // TODO - 실패 원인 세분화
      if (!success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          reasons: ['body : bad request'],
        });
      }

      return res.status(StatusCodes.CREATED).end();
    }
  );

ordersRouter
  .route('/:orderId')

  .get(
    validators.orders['/:orderId'].GET,
    jwtDecoder.ensureAuthentication,
    async (req, res) => {
      const email = req.auth?.token?.email;
      const orderId = parseInt(req.params.orderId);
      const result = await ordersService.readItems(email, orderId);

      // TODO - 실패 원인 세분화
      if (!result?.items?.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          reasons: ['request : bad request'],
        });
      }

      return res.status(StatusCodes.OK).json(result);
    }
  );

module.exports = ordersRouter;
