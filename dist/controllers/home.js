'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var formidable = require('formidable');
var homeView = '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <title></title>\n</head>\n<body>\n  <form action="/" enctype="multipart/form-data" method="post">\n    <input type="text" name="title"><br>\n    <input type="file" name="upload" multiple="multiple"><br>\n    <input type="submit" value="Upload">\n  </form>\n</body>\n</html>';

function root(request, response) {
  response.send(homeView);
}

function upload(request, response) {
  var form = new formidable.IncomingForm();

  form.uploadDir = './tmp/uploads';
  form.multiples = true;
  form.keepExtensions = true;

  form.on('progress', function (bytesReceived, bytesExpected) {
    console.log('-------------------progress bytesReceived', bytesReceived);
    console.log('-------------------progress bytesExpected', bytesExpected);
  });

  debugger;

  form.parse(request, function (error, fields, files) {
    console.log('-------------------parse');
    // response.writeHead(200, { 'content-type': 'text/plain' });
    // response.write('received upload:\n\n');
    // response.end(util.inspect({ fields: fields, files: files }));
    response.send(homeView);

    // `file` is the name of the <input> field of type `file`
    // const old_path = files.file.path;
    // const file_size = files.file.size;
    // const file_ext = files.file.name.split('.').pop();
    // const index = old_path.lastIndexOf('/') + 1;
    // const file_name = old_path.substr(index);
    // const new_path = path.join(process.env.PWD, '/uploads/', file_name + '.' + file_ext);
    //
    // fs.readFile(old_path, function(error, data) {
    //   fs.writeFile(new_path, data, function(error) {
    //     fs.unlink(old_path, function(error) {
    //       if (error) {
    //         response.status(500);
    //         response.json({'success': false});
    //       } else {
    //         response.status(200);
    //         response.json({'success': true});
    //       }
    //     });
    //   });
    // });
  });
}

module.exports = {
  root: root,
  upload: upload
};