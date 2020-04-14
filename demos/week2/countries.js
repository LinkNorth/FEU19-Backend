const express = require('express');
const countries = require('./countries.json');


const app = express();
const PORT = process.env.PORT || 8080;

app.get('/countries', (req, res) => {
  let page;
  if ('page' in req.query) {
    page = parseInt(req.query.page);
  } else {
    page = 1;
  }

  let size = parseInt(req.query.size) || 20;

  res.json({
    data: countries.slice((page - 1) * size, page * size)
  });
});

app.listen(PORT, function() {
  console.log('Listening on ' + PORT);
});
