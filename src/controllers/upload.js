"use strict";

function progress(request, response) {
  const tempId = request.query.temp_id;
  const temporaryFile = temporaryFiles[tempId];

  console.log('-------------------uploadProgress', temporaryFile);

  if (temporaryFile) {
    response.status(200).json(temporaryFile);
  } else {
    response.status(404);
  }
}

function upload(request, response) {
  const formidable = require('formidable');
  const tempId = request.query.temp_id;
  const form = new formidable.IncomingForm();

  console.log('-------------------upload started');
  start = process.hrtime();
  temporaryFiles[tempId] = { progress: 0 };

  form.uploadDir = './tmp/uploads';
  form.multiples = true;
  form.keepExtensions = true;

  form.on('progress', (bytesReceived, bytesExpected) => {
    const percentage = Math.round((bytesReceived / bytesExpected) * 100);

    console.log(`percentage ${ percentage }%`);
    temporaryFiles[tempId].progress = percentage;
  });

  form.parse(request, function(error, fields, files) {
    elapsedTime('-------------------upload ended');
    delete temporaryFiles[tempId];

    console.log('temporaryFiles.length: ', Object.keys(temporaryFiles).length);

    response.redirect('/');
  });
}

module.exports = {
  upload,
  progress,
};

// ******************************** PROTECTED **********************************

const temporaryFiles = {};
let start = process.hrtime();

function elapsedTime(note) {
  const precision = 3;
  const elapsed = process.hrtime(start)[1] / 1000000;

  console.log(note + ' (' + process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms)"); // print message + time
  start = process.hrtime();
}
