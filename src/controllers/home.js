"use strict";

function root(request, response) {
  response.send(homeView);
}

function upload(request, response) {
  const formidable = require('formidable');
  const form = new formidable.IncomingForm();

  console.log('-------------------upload started');
  start = process.hrtime();

  form.uploadDir = './tmp/uploads';
  form.multiples = true;
  form.keepExtensions = true;

  form.on('progress', (bytesReceived, bytesExpected) => {
    const percentage = Math.round((bytesReceived / bytesExpected) * 100);

    console.log(`percentage ${ percentage }%`);
  });

  form.parse(request, function(error, fields, files) {
    elapsedTime('-------------------upload ended')

    response.status(200).send(homeView);
  });
}

module.exports = {
  root,
  upload
};

// ******************************** PROTECTED **********************************

let start = process.hrtime();

const homeView = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
</head>
<body>
  <p>When selecting a 30KB file like <b>${ process.cwd() }/dummy_data/30K</b></p>
  <p>we will see the server receiving chunks of data</p>
  <p>&nbsp</p>
  <p>When selecting a 70KB file like <b>${ process.cwd() }/dummy_data/70K</b></p>
  <p>the server doesn't get contacted (sometimes is does, but most of the times doesn't)</p>
  <p>&nbsp</p>
  <p>and selecting the 100KB file like <b>${ process.cwd() }/dummy_data/100K</b></p>
  <p>the server doesn't get contacted (ever)</p>
  <hr/>
  <form action="/upload" enctype="multipart/form-data" method="post">
    <input type="text" name="title"><br>
    <input type="file" name="upload" multiple="multiple"><br>
    <input type="submit" value="Upload">
  </form>

  <a href="/"><h1>reload!</h1></a>
</body>
</html>`;

function elapsedTime(note) {
  const precision = 3;
  const elapsed = process.hrtime(start)[1] / 1000000;

  console.log(note + ' (' + process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms)"); // print message + time
  start = process.hrtime();
}
