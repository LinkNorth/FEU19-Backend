const express = require('express');

const app = express();

app.use(function(req, res, next) {
  let start = Date.now();
  res.once('finish', () => {
    let end = Date.now();
    let time = end - start;
    console.log(req.method, req.path, res.statusCode, time + 'ms'); 
  });
  next();
});

app.get('/', (req, res) => {
  res.json({ok: true});
});

app.post('/hello', (req, res) => {
  res.status(201).json({foo: 'bar'});
});

app.listen(8090, () => {
  console.log('Started on 8090');
});
