const HomeController = require('./controllers/home');

function routes(app) {
  app.get('/', HomeController.root);
  app.post('/upload', HomeController.upload);
}

module.exports = routes;
