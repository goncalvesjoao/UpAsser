'use strict';

var routes = require('./routes');
var express = require('express');
var middleware = require('./middleware');

var app = express();
var port = 3000;

// ******************************* BOOTSTRAP ***********************************

middleware(app, express);
routes(app);

app.listen(port, function () {
  console.log('Up and kicking ass on port ' + port);
});