const express = require('express');

const app = express();
app.use(express.json());

const {getClient, getDB, createObjectId} = require('./db');

app.get('/users/', (req, res) => {
  const db = getDB();
  db.collection('myCollection')
    .find({})
    .toArray()
    .then(data => {
      res.send(data);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.get('/users/:id', (req, res) => {
  let userId = req.params.id;

  const db = getDB();
  db.collection('myCollection')
    .findOne({_id: createObjectId(userId)})
    .then(user => {
      res.send(user);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

function validate(user) {
  return !!user.name;
}

app.post('/users/', (req, res) => {
  const db = getDB();
  let data = req.body;
  if (validate(data) === false) return res.status(400).end();

  db.collection('myCollection')
    .insertOne(data)
    .then(result => {
      data._id = result.insertedId;
      res.status(201).send(data);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.patch('/users/:id', (req, res) => {
  let userId = req.params.id;
  const db = getDB();
  let data = req.body;

  if (!userId) {
    return res.status(400).end();
  }

  db.collection('myCollection')
    .updateOne(
      {_id: createObjectId(userId)},
      {$set: data}
    )
    .then(result => {
      res.send({result: true});
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.delete('/users/:id', (req, res) => {
  let userId = req.params.id;
  const db = getDB();

  db.collection('myCollection')
    .remove({_id: createObjectId(userId)})
    .then(() => {
      res.status(204).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.listen(8090, () => {
  console.log('Started on 8090');
});
