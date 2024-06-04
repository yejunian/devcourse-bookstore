const { body, param, query, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const paymentTypes = ['card', 'mobile-payment', 'without-bankbook'];

const errorMessages = {
  isBoolean: 'not boolean',
  isEmail: 'not email format',
  isNonNegativeInt: 'not non-negative integer',
  isPaymentType: `not in ["${paymentTypes.join('", "')}"]`,
  isPositiveInt: 'not positive integer',
  isTruthyString: 'not truthy string',
  notEmpty: 'is empty',
};

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({
      reasons: err
        .array()
        .map(({ location, path, msg }) => `${location}.${path} : ${msg}`),
    });
  }
};

module.exports = {
  auth: {
    '/token': {
      POST: [
        body('email').isEmail().withMessage(errorMessages.isEmail),
        body('password').matches(/./).withMessage(errorMessages.isTruthyString),
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
      POST: [
        body('pendingOrderId')
          .isInt({ min: 1 })
          .withMessage(errorMessages.isPositiveInt),
        body(['receiver.address', 'receiver.name', 'receiver.phone'])
          .matches(/./)
          .withMessage(errorMessages.isTruthyString),
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
        body('password').matches(/./).withMessage(errorMessages.isTruthyString),
        validate,
      ],
      PUT: [
        body('email').isEmail().withMessage(errorMessages.isEmail),
        body('password').matches(/./).withMessage(errorMessages.isTruthyString),
        validate,
      ],
    },
  },
};
