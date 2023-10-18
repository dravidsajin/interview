const xss = require('xss');

function xssMiddleware(req, res, next) {
  // Check request body, query parameters, and any other user inputs
  if (req.body) {
    req.body = sanitizeRequest(req.body);
  }
  if (req.query) {
    req.query = sanitizeRequest(req.query);
  }
  next();
}

function sanitizeRequest(input) {
  if (typeof input === 'object') {
    // If the input is an object, recursively sanitize its properties
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        input[key] = sanitizeRequest(input[key]);
      }
    }
    return input;
  } else if (typeof input === 'string') {
    // Sanitize strings using the xss library
    return xss(input);
  } else {
    // If it's not an object or a string, leave it as is
    return input;
  }
}

module.exports = xssMiddleware;
