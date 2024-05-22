const { StatusCodes } = require('http-status-codes');

const sendNotFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    reasons: ['request : not found'],
  });
};

const sendNotImplementedWith = (description) => (req, res) => {
  const { method, originalUrl, baseUrl, url, path, params, query } = req;

  res.status(StatusCodes.NOT_IMPLEMENTED).json({
    reasons: ['server : not implemented'],

    description,

    method,
    originalUrl,
    urlFragments: { baseUrl, url, path, params, query },
  });
};

module.exports = {
  sendNotFound,
  sendNotImplementedWith,
};
