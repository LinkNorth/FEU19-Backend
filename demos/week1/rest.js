const express = require('express');

const app = express();
const movies = [{id: 0, title: 'Star wars'}];
let ID = 1;

// {id: 0, title: 'Star wars'}

app.use(express.json());

app.get('/movies', (req, res) => {
  res.json({
    data: movies
  });
});

app.get('/movies/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let movie = movies.find(function(movie) {
    return movie.id === id;
  });

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).end();
  }
});

// {title: 'Star wars'}
app.post('/movies', (req, res) => {
  let movie = req.body;
  if (!movie.title) {
    res.status(400).end();
    return;
  }

  movie.id = ID;
  movies.push(movie);
  ID++;
  res.status(201).send(movie);
});

// {title: 'Star wars'}
app.put('/movies/:id', (req, res) => {
  let movie = req.body;
  let id = parseInt(req.params.id);
  if (!movie.title || movie.id !== id) {
    res.status(400).end();
    return;
  }

  let movieIndex = movies.findIndex(function(movie) {
    return movie.id === id;
  });

  if (movieIndex === -1) {
    res.status(404).end();
    return;
  }

  movies[movieIndex] = movie;
  res.status(200).send(movie);
});

app.delete('/movies/:id', (req, res) => {
  let id = parseInt(req.params.id);

  let movieIndex = movies.findIndex(function(movie) {
    return movie.id === id;
  });

  if (movieIndex === -1) {
    res.status(404).end();
    return;
  }

  movies.splice(movieIndex, 1);
  res.status(204).end();
});

function find(arr, f) {
  for (let x of arr) {
    if (f(x)) return x;
  }
  return null;
}

app.listen(8000, function() {
  console.log('Started server on 8000');
});
