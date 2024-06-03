const express = require('express');
const { StatusCodes } = require('http-status-codes');

const jwtDecoder = require('../middlewares/jwt-decoder');
const validators = require('../middlewares/validators');
const pendingOrdersService = require('../services/pending-orders');

const pendingOrdersRouter = express.Router();

pendingOrdersRouter
  .route('/')

  .post(
    validators['pending-orders']['/'].POST,
    jwtDecoder.ensureAuthentication,
    async (req, res) => {
      const email = req.auth?.token?.email;

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
    }
  );

pendingOrdersRouter
  .route('/:pendingOrderId')

  .get(
    validators['pending-orders']['/:pendingOrderId'].GET,
    jwtDecoder.ensureAuthentication,
    async (req, res) => {
      const email = req.auth?.token?.email;
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
