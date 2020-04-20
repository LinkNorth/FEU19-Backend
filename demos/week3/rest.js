const express = require('express');
const uuid = require('uuid');
const app = express();

/*
 * User
 * {name: string, id: string}
 */
let users = [];

/*
 * Car
 * {reg: string, brand: string, id: string}
 */
let cars = [];

/*
 * {userId: string, carId: string}
 */
let usersCars = [];

app.use((req, res, next) => {
  let s = Date.now();
  res.once('finish', () => {
    console.log(req.method, req.path, res.statusCode, (Date.now() - s) + 'ms');
  });
  next();
});
app.use(express.json());

let userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.json({users: users});
});

userRouter.get('/:id', (req, res) => {
  let id = req.params.id;
  let user = users.find(user => user.id === id);
  let relations = usersCars.filter(x => x.userId === id);
  
  let carsMap = {};
  for (let car of cars) {
    carsMap[car.id] = car;
  }

  let userCars = relations.map(relation => {
    //let car = cars.find(car => car.id === relation.carId);
    let car = carsMap[relation.carId];
    return car;
  });

  userCars = userCars.filter(x => x);

  if (user) {
    res.json({user: user, userCars: userCars});
  } else {
    res.status(404).end();
  }
});

userRouter.post('/', (req, res) => {
  let user = req.body;
  user.id = uuid.v4();
  users.push(user);
  res.status(201).json(user);
});

userRouter.delete('/:id', (req, res) => {
  let id = req.params.id;
  users = users.filter(user => {
    return user.id !== id;
  });
  res.status(204).end();
});

app.use('/users', userRouter);

let carRouter = express.Router();

carRouter.get('/', (req, res) => {
  res.json({cars: cars});
});

carRouter.get('/:id', (req, res) => {
  let id = req.params.id;
  let car = cars.find(car => car.id === id);
  if (car) {
    res.json({car: car});
  } else {
    res.status(404).end();
  }
});

carRouter.post('/', (req, res) => {
  let car = req.body;
  car.id = uuid.v4();
  cars.push(car);
  res.status(201).json(car);
});

carRouter.delete('/:id', (req, res) => {
  let id = req.params.id;
  cars = cars.filter(car => {
    return car.id !== id;
  });
  res.status(204).end();
});

app.use('/cars', carRouter);

app.post('/users/:userId/cars/:carId', (req, res) => {
  let {userId, carId} = req.params;
  usersCars.push({userId: userId, carId: carId});
  res.status(201).end();
});

app.listen(8090);
