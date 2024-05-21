const sendNotFound = (req, res) => {
  res.status(404).json({
    reasons: ['request : not found'],
  });
};

const sendNotImplementedWith = (description) => (req, res) => {
  const { method, originalUrl, baseUrl, url, path, params, query } = req;

  res.status(501).json({
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
