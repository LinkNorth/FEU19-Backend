const express = require('express');
const app = express();


app.use(express.json());

app.use(function(req, res, next) {
  console.log('Got request', req.method, req.url);
  next();
});

app.post('/uppercase', (req, res) => {
  let data = req.body;
  if (!data.value) {
    res.status(400).end();
  } else {
    let answer = {
      value: data.value.toUpperCase(),
    };
    res.json(answer);
  }
});


const port = 3003;
app.listen(port, function() {
  console.log('Started server');
});
