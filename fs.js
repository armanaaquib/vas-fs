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

    const contentType = req.headers['content-type'];
    const fid = getFid();
    const ext = contentType.split('/')[1];
    const fileName = `${fid}.${ext}`;

    fs.writeFile(`files/${fileName}`, buffer, () => {
      res.end(fileName);
    });
  });
});

app.get('/get/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  fs.readFile(`files/${fileName}`, (err, buffer) => {
    res.end(buffer);
  });
});

app.use(express.static('files'));

const main = (port) => {
  const PORT = port || 5000;
  app.listen(PORT, () => console.log(`listening FS: at ${PORT}`));
};

main();
