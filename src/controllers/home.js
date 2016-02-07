"use strict";

function root(request, response) {
  console.log('-------------------home');

  response.send(homeView);
}

function uploadProgress(request, response) {
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
</head>
<body>
  <form id="ass_form" action="/upload" enctype="multipart/form-data" method="post" onsubmit="monitorUploadProgress(this)">
    <ul>
      <li>
        <input type="file" name="upload" multiple="multiple" onchange="onFileChange(this);">
      </li>

      <li>
        <input type="submit" value="Normal upload">
        <progress id="polling_progress" value="0" max="100"></progress>
      </li>

      <li>
        <input type="button" onclick="asyncSubmit(this)" value="Ajax upload">
        <progress id="xhr_progress" value="0" max="100"></progress>
      </li>
    </ul>
  </form>

  <script>
    function onFileChange(element) {
      var file = element.files[0];
      var tempId = (+(new Date())) + file.size + file.name;

      var formElement = document.querySelector('#ass_form');
      formElement.attributes.data = { tempId: tempId };
      formElement.action = '/upload?temp_id=' + tempId;
    }

    function monitorUploadProgress(element) {
      var formElement = document.querySelector('#ass_form');
      var tempId = formElement.attributes.data.tempId;

      setInterval(function() {
        makeRequest(
          '/upload_progress?temp_id=' + tempId,
          'GET',
          {},
          function(event) {
            var data = JSON.parse(this.response);
            document.querySelector('#polling_progress').value = data.progress;
          }
        );
      }, 250);
    }

    function asyncSubmit(element) {
      var formElement = document.querySelector('#ass_form');
      var formData = new FormData(formElement);

      makeRequest(
        '/upload',
        'POST',
        formData,
        function() { window.location.reload(); },
        progressHandlingFunction
      );
    }

    function progressHandlingFunction(event) {
      if (event.lengthComputable) {
        console.log(event.loaded, event.total);

        var progressElement = document.querySelector('#xhr_progress');
        progressElement.value = event.loaded;
        progressElement.max = event.total;
      }
    }

    function makeRequest(url, httpVerb, data, onLoad, onProgress) {
      var xhr = new XMLHttpRequest();

      xhr.open(httpVerb, url, true);
      xhr.onload = onLoad;
      xhr.upload.onprogress = onProgress;

      xhr.send(data);
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
