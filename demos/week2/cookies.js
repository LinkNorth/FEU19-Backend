const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());



app.get('/setCookie', (req, res) => {
  const name = req.query.name;
  if (name) {
    res.cookie('NAME', name);
  }
  res.status(200).end();
});

app.get('/getCookie', (req, res) => {
  if (req.cookies && req.cookies.NAME) {
    res.send('Hello ' + req.cookies.NAME);
  } else {
    res.status(404).end();
  }
});

app.listen(8090, () => console.log('started on 8090'));
