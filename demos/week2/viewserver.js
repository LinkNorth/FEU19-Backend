const express = require('express');

const app = express();

let fruits = [];

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));

app.get('/', (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let size = parseInt(req.query.size) || 2;
  res.render('index', {
    fruits: fruits.slice((page - 1) * size, page * size),
    page: page,
    size: size,
  });
});

app.get('/fruits', (req, res) => {
  res.send({fruits: fruits});
});

// {name: 'Banana'}
app.post('/fruits', (req, res) => {
  if (!req.body.name) {
    res.status(400).end();
  }

  let fruit = req.body.name;
  fruits.push(fruit);
  res.redirect('/');
  //res.status(201).send(req.body);
});

app.listen(8090, () => {
  console.log('Started on 8090');
});
