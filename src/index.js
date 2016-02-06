const routes = require('./routes');
const express = require('express');
const middleware = require('./middleware');

const app = express();
const port = 3000;

// ******************************* BOOTSTRAP ***********************************

middleware(app, express);
routes(app);

app.listen(port, () => {
  console.log(`UpAsser is kicking ass on port ${ port }`);
});
