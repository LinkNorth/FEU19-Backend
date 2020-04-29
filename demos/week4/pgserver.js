const express = require('express');
const db = require('./pgdb');

const app = express();
app.use(express.json());

app.get('/users', (req, res, next) => {
  db.from('users')
    .select('*')
    .then(users => {
      res.json({users: users});
    })
    .catch(next);
});

app.get('/users/:id', (req, res, next) => {
  let userId = req.params.id;
  db.from('users')
    .select('*')
    .where('id', userId)
    .then(users => {
      if (users.length === 1) {
        res.status(200).send(users[0]);
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

function validate(user) {
  return !!user.name;
}

app.post('/users', (req, res, next) => {
  let data = req.body;
  if (!validate(data)) {
    return res.status(400).end();
  }

  db('users')
    .insert(data)
    .returning('id')
    .then(result => {
      data.id = result[0];
      res.status(201).json(data);
    })
    .catch(next);
});

app.patch('/users/:id', (req, res, next) => {
  let userId = req.params.id;
  let data = req.body;
  db('users')
    .where('id', userId)
    .update(data)
    .then(() => {
      res.status(200).end();
    })
    .catch(next);
});

app.delete('/users/:id', (req, res, next) => {
  let userId = req.params.id;
  db('users')
    .where('id', userId)
    .del()
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

app.listen(8090, function() {
  console.log('Started server on 8090');
});
