const fs = require('fs');
const express = require('express');
const { genFid, extractExt } = require('./lib/util');

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/save', (req, res) => {
  const contentType = req.headers['content-type'];
  const fileName = `${genFid()}.${extractExt(contentType)}`;

  const data = [];
  req.on('data', (chunk) => data.push(chunk));

  req.on('end', () => {
    const buffer = Buffer.concat(data);
    fs.writeFile(`files/${fileName}`, buffer, () => {
      res.end(fileName);
    });
  });
});

app.get('/get/:fileName', (req, res) => {
  const { fileName } = req.params;
  fs.readFile(`files/${fileName}`, (err, buffer) => {
    res.end(buffer);
  });
});

app.use('/:filename', (req, res, next) => {
  res.setHeader('Content-Disposition', 'attachment');
  next();
});

app.use(express.static('files'));

const main = (port) => {
  const PORT = port || 5000;
  app.listen(PORT, () => console.log(`listening FS: at ${PORT}`));
};

main(+process.argv[2]);
