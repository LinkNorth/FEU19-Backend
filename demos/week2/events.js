const express = require('express');
const app = express();


app.use((req, res, next) => {
  res.once('finish', () => {
    console.log(req.method, req.path, res.statusCode);
  });
  next();
});

app.get('/', (req, res) => {
  res.status(200).end();
});

app.listen(8090);
