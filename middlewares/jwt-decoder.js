const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const envConfig = require('../config/env');

const defaultAuthProp = {
  token: null,
};

const decode = (req, res, next) => {
  if (!req.auth) {
    req.auth = {};
  }

  const authorizationHeader = req.headers.authorization ?? '';
  const [type, credential] = authorizationHeader.split(' ');

  if (!type || !credential || type.toLowerCase() !== 'bearer') {
    req.auth = {
      ...req.auth,
      ...defaultAuthProp,
    };
    return next();
  }

  try {
    req.auth = {
      ...req.auth,
      ...defaultAuthProp,
      token: jwt.verify(credential, envConfig.jwt.secret),
    };
  } catch (err) {
    req.auth = {
      ...req.auth,
      ...defaultAuthProp,
    };
  }

  return next();
};

const ensureAuthentication = [
  decode,
  (req, res, next) => {
    if (req.auth?.token) {
      return next();
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        reasons: ['header : unauthorized'],
      });
    }
  },
];

module.exports = {
  decode,
  ensureAuthentication,
};
