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
        // TODO - 오류 메시지
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

  cart: {
    '/': {
      POST: [
        body('bookId').isInt({ min: 1 }).withMessage(errorMessages.isInt),
        body('quantity').isInt({ min: 1 }).withMessage(errorMessages.isInt),
        validate,
      ],
    },
  },

  likes: {
    '/:bookId': {
      GET: [param('bookId').isInt().withMessage(errorMessages.isInt), validate],
      POST: [
        param('bookId').isInt().withMessage(errorMessages.isInt),
        validate,
      ],
      DELETE: [
        param('bookId').isInt().withMessage(errorMessages.isInt),
        validate,
      ],
    },
  },

  'pending-orders': {
    '/': {
      // TODO - 오류 메시지
      POST: [body('cartItems').isArray({ min: 1 }), validate],
    },
    '/:pendingOrderId': {
      GET: [
        param('pendingOrderId')
          .isInt({ min: 1 })
          .withMessage(errorMessages.isInt),
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
