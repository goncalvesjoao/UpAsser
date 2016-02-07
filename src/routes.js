const HomeController = require('./controllers/home');

function routes(app) {
  app.get('/', HomeController.root);
  app.post('/upload', HomeController.upload);
  app.get('/upload_progress', HomeController.uploadProgress);
}

module.exports = routes;
