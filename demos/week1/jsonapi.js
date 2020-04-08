const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.json());
app.use((req, res, next) => {
  let data = req.body;
  if (!data.value) {
    res.status(400).end();
    return;
  }
  next();
});

app.get('/', (req, res) => {
  res.send('<p>Hello from server</p>');
});

app.post('/uppercase', (req, res) => {
  let data = req.body;
  let value = data.value.toUpperCase();
  res.json({
    value: value
  });
});

app.post('/lowercase', (req, res) => {
  let data = req.body;
  let value = data.value.toLowerCase();
  res.json({
    value: value
  });
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

app.post('/capitalize', (req, res) => {
  let data = req.body;
  let value = capitalize(data.value);
  res.json({
    value: value
  });
});

app.listen(8080, function() {
  console.log('Started server on 8080');
});
