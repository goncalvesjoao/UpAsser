const HomeController = require('./controllers/home');
const UploadController = require('./controllers/upload');

function routes(app) {
  app.get('/', HomeController.root);
  app.get('/files', HomeController.files);

  app.post('/upload', UploadController.upload);
  app.get('/upload/:id/progress', UploadController.progress);
}

module.exports = routes;
