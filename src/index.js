"use strict";

const routes = require('./routes');
const express = require('express');
const setupToxy = require('./setupToxy');

const app = express();
const port = 3030;
let toxyOn = true;

if (process.env.PORT) { toxyOn = false; }

const toxyConfig = {
  port: process.env.PORT || 3000,
};

// ******************************* BOOTSTRAP ***********************************

routes(app);

app.use(express.static('./tmp'));

if (toxyOn) {
  app.listen(port, setupToxy.bind(null, port, toxyConfig));
} else {
  app.listen(toxyConfig.port, () => {
    console.log(`Up and kicking ass on port ${ toxyConfig.port }`);
  });
}
