"use strict";

function root(request, response) {
  console.log('-------------------home');

  response.sendFile(process.cwd() + '/public/index.html');
}

module.exports = {
  root,
};
