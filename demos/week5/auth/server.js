const express = require('express');
const app = express();
const crypto = require('crypto');
const session = require('express-session');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

// {email: string, password: string, fruits: [string]}
let users = [];

app.use(express.static('public', {extensions: ['html']}));
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
  let user = null;
  if (req.session.email) {
    let sessionEmail = req.session.email;
    user = users.find(x => x.email === sessionEmail);
  }
  user = user || {};
  res.render('index', {user: user});
});

app.post('/fruits', (req, res) => {
  let user = null;
  if (req.session.email) {
    let sessionEmail = req.session.email;
    user = users.find(x => x.email === sessionEmail);
  }

  if (!user) {
    return res.status(401).end();
  }

  let body = req.body;
  user.fruits.push(body.fruit);
  res.redirect('/');
});

app.post('/logout', (req, res) => {
  req.session.destroy(function() {
    res.redirect('/login');
  });
});

app.post('/login', (req, res) => {
  let body = req.body;
  if (!body.email || !body.password) {
    return res.status(400).end();
  }

  const hash = crypto.createHash('sha256');
  hash.update(body.password);
  let hashedPw = hash.digest('hex');
  let user = users.find(x => x.email === body.email);

  if (!user || user.password !== hashedPw) {
    return res.status(400).end();
  }

  // Login success
  req.session.email = user.email;

  res.redirect('/');
});

app.post('/register', (req, res) => {
  let body = req.body;
  if (!body.email || !body.password || body.password !== body.confirmpassword) {
    return res.status(400).end();
  }

  const hash = crypto.createHash('sha256');
  hash.update(body.password);
  let hashedPw = hash.digest('hex');
  let user = {
    email: body.email,
    password: hashedPw,
    fruits: [],
  };
  users.push(user);
  res.redirect('/login');
});

app.listen(8090, function() {
  console.log('Started on 8090');
});
