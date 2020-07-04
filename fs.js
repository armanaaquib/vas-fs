const fs = require('fs');
const express = require('express');
const getFid = require('./lib/getFid');

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

    const fid = getFid();
    fs.writeFile(`files/${fid}`, buffer, () => {
      res.end(fid);
    });
  });
});

app.get('/:fid', (req, res) => {
  const fid = req.params.fid;

  fs.readFile(`files/${fid}`, (err, buffer) => {
    res.end(buffer);
  });
});

const main = (port) => {
  const PORT = port || 5000;
  app.listen(PORT, () => console.log(`listening FS: at ${PORT}`));
};

main();
