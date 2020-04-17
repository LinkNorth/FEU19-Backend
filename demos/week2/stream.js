const express = require('express');

const app = express();
//app.use(express.json({limit: '4MB'}));
app.use((req, res, next) => {
  // Check that Content-Type: application/json
  if (req.is('json')) {
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });

    req.on('end', () => {
      try {
        data = JSON.parse(data);
        req.body = data;
        next();
      } catch(e) {
        res.status(400).end();
      }
    });
  } else {
    next();
  }
});

app.get('/hello', (req, res) => {
  for (let i = 0; i < 1000; i += 1) {
    setTimeout(() => {
      res.write('Hello ' + i);
    }, i);
  }

  setTimeout(() => {
    res.write(' World!');
    res.end();
  }, 10000);
});

app.post('/hello', (req, res) => {
  let countries = req.body;
  res.end();
});

app.listen(8090, () => {
  console.log('listening on 8090');
});
