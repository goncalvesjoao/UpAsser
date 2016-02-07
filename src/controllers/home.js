"use strict";

function root(request, response) {
  response.send(homeView);
}

function uploadProgress(request, response) {
  const tempId = request.query.temp_id;
  const temporaryFile = temporaryFiles[tempId];

  // console.log('-------------------uploadProgress', temporaryFile);

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
  root,
  upload,
  uploadProgress,
};

// ******************************** PROTECTED **********************************

const temporaryFiles = {};
let start = process.hrtime();

const homeView = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Up your assets</title>
  <script src="//code.jquery.com/jquery-2.2.0.min.js"></script>
</head>
<body>
  <p>&nbsp</p>
  <form id="ass_form" action="/upload" enctype="multipart/form-data" method="post" onsubmit="monitorUploadProgress(this)">
    <input type="file" name="upload" multiple="multiple" onchange="onFileChange(this);">
    <input type="submit" value="Upload">
    <span id="upload_progress">0</span>%
  </form>

  <a href="/"><h1>reload!</h1></a>

  <script>
    function onFileChange(element) {
      var file = element.files[0];
      var tempId = (+(new Date())) + file.size + file.name;

      $('#ass_form').data('temp_id', tempId);
      $('#ass_form').attr('action', '/upload?temp_id=' + tempId);
    }

    function monitorUploadProgress(element) {
      var tempId = $('#ass_form').data('temp_id');

      setInterval(function() {
        $.getJSON('/upload_progress?temp_id=' + tempId, function(data, textStatus) {
          $('#upload_progress').html(data.progress);
        });
      }, 250);
    }
  </script>
</body>
</html>`;

function elapsedTime(note) {
  const precision = 3;
  const elapsed = process.hrtime(start)[1] / 1000000;

  console.log(note + ' (' + process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms)"); // print message + time
  start = process.hrtime();
}
