'use strict';

var HomeController = require('./controllers/home');

function routes(app) {
  app.get('/', HomeController.root);
  app.post('/', HomeController.upload);
}

module.exports = routes;