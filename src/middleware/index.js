const formidable = require('./formidable');

function ApplyMiddleware(...args) {
  formidable(...args);
}

module.exports = ApplyMiddleware;
