const fs = require('fs');
const express = require('express');
const getFid = require('./lib/getFid');

const types = {};

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/save', (req, res) => {
  const data = [];
  req.on('data', (chunk) => data.push(chunk));

  req.on('end', () => {
    const buffer = Buffer.concat(data);

    const contentType = req.headers['content-type'];
    const fid = getFid();
    types[fid] = contentType;

    fs.writeFile(`files/${fid}`, buffer, () => {
      res.end(fid);
    });
  });
});

app.get('get/:fid', (req, res) => {
  const fid = req.params.fid;

  fs.readFile(`files/${fid}`, (err, buffer) => {
    res.setHeader('Content-Type', types[fid]);
    res.end(buffer);
  });
});

const main = (port) => {
  const PORT = port || 5000;
  app.listen(PORT, () => console.log(`listening FS: at ${PORT}`));
};

main();
