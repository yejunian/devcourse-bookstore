const { body, param, query } = require('express-validator');

const validate = require('./validate');

const paymentTypes = ['card', 'mobile-payment', 'without-bankbook'];

const errorMessages = {
  isBoolean: 'not boolean',
  isEmail: 'not email format',
  isNonNegativeInt: 'not non-negative integer',
  isPaymentType: `not in ["${paymentTypes.join('", "')}"]`,
  isPositiveInt: 'not positive integer',
  isString: 'not string',
  notEmpty: 'omitted',
};

module.exports = {
  auth: {
    '/token': {
      POST: [
        body('email').isEmail().withMessage(errorMessages.isEmail),
        body('password')
          .isString()
          .withMessage(errorMessages.isString)
          .notEmpty()
          .withMessage(errorMessages.notEmpty),
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
        query(['keyword', 'category'])
          .optional()
          .notEmpty()
          .withMessage(errorMessages.notEmpty),
        query('new')
          .optional()
          .isBoolean()
          .withMessage(errorMessages.isBoolean),
        query('page', 'page-size')
          .optional()
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        validate,
      ],
    },
    '/:bookId': {
      GET: [
        param('bookId')
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        validate,
      ],
    },
  },

  cart: {
    '/': {
      POST: [
        body(['bookId', 'quantity'])
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        validate,
      ],
    },
  },

  likes: {
    '/:bookId': {
      GET: [
        param('bookId')
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        validate,
      ],
      POST: [
        param('bookId')
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        validate,
      ],
      DELETE: [
        param('bookId')
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        validate,
      ],
    },
  },

  orders: {
    '/': {
      // GET: [],
      POST: [
        body('pendingOrderId')
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        body(['receiver.address', 'receiver.name', 'receiver.phone'])
          .isString()
          .withMessage(errorMessages.isString)
          .notEmpty()
          .withMessage(errorMessages.notEmpty),
        body('payment.type')
          .isIn(paymentTypes)
          .withMessage(errorMessages.isPaymentType),
        body('payment.amount')
          .isInt({ min: 0 })
          .withMessage(errorMessages.isNonNegativeInt),
        validate,
      ],
    },
    '/:orderId': {
      GET: [
        param('orderId')
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
      ],
    },
  },

  'pending-orders': {
    '/': {
      POST: [
        body('cartItems')
          .isArray({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        validate,
      ],
    },
    '/:pendingOrderId': {
      GET: [
        param('pendingOrderId')
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        validate,
      ],
    },
  },

  users: {
    '/': {
      POST: [
        body('email').isEmail().withMessage(errorMessages.isEmail),
        body('password')
          .isString()
          .withMessage(errorMessages.isString)
          .notEmpty()
          .withMessage(errorMessages.notEmpty),
        validate,
      ],
      PUT: [
        body('email').isEmail().withMessage(errorMessages.isEmail),
        body('password')
          .isString()
          .withMessage(errorMessages.isString)
          .notEmpty()
          .withMessage(errorMessages.notEmpty),
        validate,
      ],
    },
  },
};
