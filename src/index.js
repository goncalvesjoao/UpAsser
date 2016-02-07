const routes = require('./routes');
const express = require('express');
const setupToxy = require('./setupToxy');

const app = express();
const port = 3030;

const toxyConfig = {
  port: 3000,
};

// ******************************* BOOTSTRAP ***********************************

routes(app);

app.listen(port, setupToxy.bind(null, port, toxyConfig));

// app.listen(port, () => {
//   console.log(`Up and kicking ass on port ${ port }`);
// });
