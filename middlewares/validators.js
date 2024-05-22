const { body } = require('express-validator');

const validate = require('./validate');

const errorMessages = {
  notEmpty: 'omitted',
  isEmail: 'not email format',
  isString: 'not string',
};

module.exports = {
  auth: {
    '/token': {
      POST: [
        body('email').isEmail().withMessage(errorMessages.isEmail),
        body('password')
          .notEmpty()
          .withMessage(errorMessages.notEmpty)
          .isString()
          .withMessage(errorMessages.isString),
        validate,
      ],
    },
    '/reset-token': {
      POST: [
        body('email').isEmail().withMessage(errorMessages.isEmail),
        validate,
      ],
    },
  },

  users: {
    '/': {
      POST: [
        body('email').isEmail().withMessage(errorMessages.isEmail),
        body('password')
          .notEmpty()
          .withMessage(errorMessages.notEmpty)
          .isString()
          .withMessage(errorMessages.isString),
        validate,
      ],
      PUT: [
        body('email').isEmail().withMessage(errorMessages.isEmail),
        body('password')
          .notEmpty()
          .withMessage(errorMessages.notEmpty)
          .isString()
          .withMessage(errorMessages.isString),
        validate,
      ],
    },
  },
};
