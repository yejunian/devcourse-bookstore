const express = require('express');
const { StatusCodes } = require('http-status-codes');

const validators = require('../middlewares/validators');
const usersService = require('../services/users');

const usersRouter = express.Router();

usersRouter
  .route('/')

  .post(validators.users['/'].POST, async (req, res) => {
    const { email, password } = req.body;
    const success = await usersService.create({ email, password });

    if (success) {
      return res.status(StatusCodes.CREATED).end();
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        reasons: ['body.email : duplicated'],
      });
    }
  })

  // TODO - 비밀번호 초기화용 인증 토큰을 받아서 검증할 수는 없나?
  .put(validators.users['/'].PUT, async (req, res) => {
    const { email, password } = req.body;

    const success = await usersService.updatePassword({ email, password });

    if (success) {
      return res.status(StatusCodes.OK).end();
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        reasons: ['email : not found'],
      });
    }
  });

module.exports = usersRouter;
