"use strict";

const fs = require('fs-extra');
const uploadDir = './tmp/uploads/';

function statusResponse(response, data) {
  console.log('-------------------uploadProgress', data);
  return response.status(200).json(data);
}

function status(request, response) {
  const id = request.params.id;
  const temporaryFile = temporaryFiles[id];
  const responseData = { id: id, progress: null, status: null };

  if (temporaryFile) {
    responseData.progress = temporaryFile.progress;
    responseData.status = 'temporary';

    return statusResponse(response, responseData);
  }

  fs.access(process.cwd() + '/' + uploadDir + id + '_failed', fs.F_OK, function(error) {
    if (!error) {
      responseData.status = 'failed';
      return statusResponse(response, responseData);
    }

    fs.access(process.cwd() + '/' + uploadDir + id, fs.F_OK, function(error) {
      const fileExists = !error;

      if (fileExists) {
        responseData.progress = 100;
        responseData.status = 'persisted';
      } else {
        responseData.status = 'not_found';
      }

      statusResponse(response, responseData);
    });
  });

}

function create(request, response) {
  const formidable = require('formidable');
  const id = request.query.id;
  const form = new formidable.IncomingForm();
  const newFileName = uploadDir + id;

  console.log('-------------------upload started');
  start = process.hrtime();
  temporaryFiles[id] = { progress: 0 };

  // form.uploadDir = uploadDir;
  form.multiples = true;
  form.keepExtensions = true;

  fs.ensureFile(newFileName + '_failed', error => error);

  form.on('progress', (bytesReceived, bytesExpected) => {
    // const percentage = Math.round((bytesReceived / bytesExpected) * 100);
    const percentage = (bytesReceived / bytesExpected);

    console.log(`percentage ${ Math.round(percentage * 100) }%`);
    temporaryFiles[id].progress = percentage;
  });

  form.parse(request, function(error, fields, files) {
    if (!error) {
      const fileName = files.file.path;
      const extension = fileName.substr(fileName.lastIndexOf('.'));
      const options = { clobber: true };

      fs.remove(newFileName + '_failed', error => error);

      fs.move(fileName, newFileName, options, (error) => {
        if (error) {
          console.error(error);
        }
      });
    }
  });

  form.on('aborted', function() {
    delete temporaryFiles[id];
  });

  form.on('end', function() {
    delete temporaryFiles[id];

    elapsedTime('-------------------upload ended');

    console.log('temporaryFiles.length: ', Object.keys(temporaryFiles).length);

    response.redirect('/');
  });
}

module.exports = {
  create,
  status,
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
