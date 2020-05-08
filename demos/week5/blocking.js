const express = require('express');
const blocked = require('blocked');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  blocked(function(ms) {
    console.log('Blocked for', ms);
  });
}

app.get('/slow', function(req, res) {
  let sum = 0;
  for (let i = 0; i < 1E10; i += 1) {
    sum += i;
  }
  res.send(sum.toString());
});

app.get('/fast', function(req, res) {
  res.send('Hello');
});

app.listen(8090, function() {
  console.log('Started on 8090');
});
