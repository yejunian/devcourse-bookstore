const express = require('express');
const { StatusCodes } = require('http-status-codes');

const validators = require('../middlewares/validators');
const authService = require('../services/auth');

const authRouter = express.Router();

authRouter
  .route('/token')

  .post(validators.auth['/token'].POST, async (req, res) => {
    const { email, password } = req.body;
    const createdToken = await authService.createLoginToken({
      email,
      password,
    });

    if (!createdToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['body : authentication failed'],
      });
    }

    return res.status(StatusCodes.CREATED).json({ token: createdToken });
  })

authRouter
  .route('/reset-token')

  .post(validators.auth['/reset-token'].POST, async (req, res) => {
    const { email } = req.body;
    const createdToken = await authService.createResetToken({ email });

    if (!createdToken) {
      return res.status(StatusCodes.NOT_FOUND).json({
        reasons: ['body.email : not found'],
      });
    }

    // TODO - 인증을 위한 토큰
    // res.cookie('token', createdToken, { httpOnly: true });
    return res.status(StatusCodes.CREATED).json({ email });
  });

module.exports = authRouter;
