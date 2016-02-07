const HomeController = require('./controllers/home');
const UploadController = require('./controllers/upload');

function routes(app) {
  app.get('/', HomeController.root);

  app.post('/upload', UploadController.upload);
  app.get('/upload/:id/progress', UploadController.progress);
}

module.exports = routes;
