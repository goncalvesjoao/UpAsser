"use strict";

function root(request, response) {
  console.log('-------------------home');

  response.sendFile(process.cwd() + '/public/index.html');
}

function files(request, response) {
  let filesList = '';
  const fs = require('fs');
  const uploads = fs.readdirSync(process.cwd() + '/tmp/uploads');

  uploads.forEach((upload) => {
    if (upload[0] === '.') { return; }

    filesList += `<li><img style="width: 150px" src="/uploads/${ upload }" /></li>`;
  });

  response.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Up your assets</title>
</head>
<body>
  <ul>
    ${ filesList }
  </ul>
</body>
</html>
`);
}

module.exports = {
  root,
  files,
};
