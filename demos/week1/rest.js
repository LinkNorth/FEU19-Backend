const fs = require('fs');
const express = require('express');

const DB_PATH = 'db.json';
const app = express();
let movies;
try {
  movies = JSON.parse(fs.readFileSync(DB_PATH));
} catch (e) {
  movies = [];
  save();
}
let ID = 0;
for (let movie of movies) {
  if (movie.id > ID) {
    ID = movie.id;
  }
}
ID += 1;

// {id: 0, title: 'Star wars'}

function save() {
  return new Promise((resolve, reject) => {
    fs.writeFile(DB_PATH, JSON.stringify(movies), function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello');
});

const movieRouter = express.Router();

movieRouter.use((req, res, next) => {
  console.log('Got a movie route');
  next();
});

movieRouter.get('/', (req, res) => {
  res.json({
    data: movies
  });
});

movieRouter.get('/:id', (req, res) => {
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
movieRouter.post('/', (req, res) => {
  let movie = req.body;
  if (!movie.title) {
    res.status(400).end();
    return;
  }

  movie.id = ID;
  movies.push(movie);
  ID++;
  save()
    .then(() => {
      res.status(201).send(movie);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

// {title: 'Star wars'}
movieRouter.put('/:id', (req, res) => {
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
  save()
    .then(() => {
      res.status(200).send(movie);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

movieRouter.delete('/:id', (req, res) => {
  let id = parseInt(req.params.id);

  let movieIndex = movies.findIndex(function(movie) {
    return movie.id === id;
  });

  if (movieIndex === -1) {
    res.status(404).end();
    return;
  }

  movies.splice(movieIndex, 1);
  save()
    .then(() => {
      res.status(204).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.use('/movies', movieRouter);

function find(arr, f) {
  for (let x of arr) {
    if (f(x)) return x;
  }
  return null;
}

app.listen(8080, function() {
  console.log('Started server on 8080');
});
