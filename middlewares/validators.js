const { body, param, query } = require('express-validator');

const validate = require('./validate');

const errorMessages = {
  notEmpty: 'omitted',
  isEmail: 'not email format',
  isInt: 'not integer',
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

  books: {
    '/': {
      GET: [
        query('keyword').optional().notEmpty(),
        query('category').optional().notEmpty(),
        query('new').optional().isBoolean(),
        query('page').optional().isInt({ min: 1 }),
        query('page-size').optional().isInt({ min: 1 }),
        validate,
      ],
    },
    '/:bookId': {
      GET: [param('bookId').isInt().withMessage(errorMessages.isInt), validate],
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
