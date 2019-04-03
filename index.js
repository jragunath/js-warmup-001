require('dotenv').config();

const fs = require('fs');
const mime = require('mime');
const path  = require('path');
const app = require('express')();
const debug = require('debug')('app');


app.get('/', (req, res) => {
  let filePath;
  if (req.url == '/'){
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + req.url;
  }

  const absPath = `./${filePath}`;
  serveStatic(res, absPath);
});

function send404(res) {
  res.status(404)
    .send('File Not Found');
}

function sendFile(res, filePath, data){
  res.setHeader('content-type', mime.lookup(path.basename(filePath)));
  res.status(200);
  res.end(data);
}

function serveStatic(res, filePath) {
  fs.exists(filePath, (exists) => {
    if (exists) {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return send404(res);
        }
        return sendFile(res, filePath, data);
      });
    } else {
      return send404(res);
    } 
  })
}

app.listen(process.env.PORT, () => debug(`listening at port ${process.env.PORT}`));