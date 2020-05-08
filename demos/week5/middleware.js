const express = require('express');

const app = express();

app.use(express.json());

app.use(function(req, res, next) {
  let start = Date.now();
  res.once('finish', () => {
    let end = Date.now();
    let timeTook = end - start;
    console.log(req.method, req.path, res.statusCode, timeTook + 'ms');
  });
  next();
});

app.get('/foo', (req, res) => {
  res.send('foo');
});

app.get('/bar', (req, res) => {
  res.send('bar');
});

app.get('/faz', (req, res) => {
  res.send('faz');
});


app.listen(8090, function() {
  console.log('Listening on', 8090);
});


