const fs = require('fs');
const express = require('express');
const app = express();
const port = 3003;

app.use(express.json());

app.post('/data', (req, res) => {
  let data = req.body;
  console.log('Got data', data);
  res.end();
});

app.post('/user', (req, res) => {
  let user = req.body;
  console.log('Got user', user);
  res.end();
});

app.get('/foo', (req, res) => {
  console.log(req.query);
  res.send('bar');
});

app.get('/users/:userId/books/:bookId', (req, res) => {
  const params = req.params;
  console.log(params);
  res.send('<p>Hello ' + params.userId + ' with book ' + params.bookId + '</p>');
});

app.get('/', (req, res) => {
  fs.readFile('./txt', (err, data) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(data);
    }
  });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
