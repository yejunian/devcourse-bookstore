const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).end();
  }
};

module.exports = validate;
