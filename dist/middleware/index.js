'use strict';

var formidable = require('./formidable');

function ApplyMiddleware() {
  formidable.apply(undefined, arguments);
}

module.exports = ApplyMiddleware;