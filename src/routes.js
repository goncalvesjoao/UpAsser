const HomeController = require('./controllers/home');
const UploadsController = require('./controllers/uploads');

function routes(app) {
  app.get('/', HomeController.root);
  app.get('/files', HomeController.files);

  app.post('/uploads', UploadsController.create);
  app.get('/uploads/:id/status', UploadsController.status);
}

module.exports = routes;
