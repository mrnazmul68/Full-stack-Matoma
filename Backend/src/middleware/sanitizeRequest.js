const { sanitize } = require('express-mongo-sanitize');

function sanitizeRequest(options = {}) {
  return (req, res, next) => {
    ['body', 'params', 'query'].forEach((key) => {
      const value = req[key];

      if (value && typeof value === 'object') {
        sanitize(value, options);
      }
    });

    next();
  };
}

module.exports = {
  sanitizeRequest,
};
