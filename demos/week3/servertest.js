const express = require('express');

const app = express();

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'john' });
});

if (require.main === module) {
  app.listen(8090, function() {
    console.log('Started server');
  });
} else {
  module.exports = app;
}
