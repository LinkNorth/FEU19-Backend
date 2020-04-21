const assert = require('assert');
const request = require('supertest');
const app = require('../rest');
describe('Rest', () => {
  describe('/users', () => {
    describe('GET /users', () => {
      it('Can fetch all users when non exist', () => {
        return request(app)
          .get('/users')
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            assert.deepStrictEqual(res.body, {users: []});
          });
      });

      it('Can fetch all users when some exists', () => {
        let numUsers = 10;
        let promises = [];
        for (let i = 0; i < numUsers; i += 1) {
          let promise = request(app)
            .post('/users')
            .send({name: 'Viktor'});

          promises.push(promise);
        }

        return Promise.all(promises)
          .then(() => {
            return request(app)
              .get('/users')
              .expect(200)
              .expect('Content-Type', /json/)
              .then(res => {
                assert.ok(res.body.users.length === 10);
                assert.ok(res.body.users[0].name);
                assert.ok(res.body.users[0].id);
              });
          });
      });
    });

    describe('GET /users/:id', () => {
      it('Can fetch user by userId', () => {
        return request(app)
          .post('/users')
          .send({name: 'Viktor'})
          .then(res => {
            let userId = res.body.id;
            return request(app)
              .get('/users/' + userId)
              .expect(200)
              .expect('Content-Type', /json/)
              .then(res => {
                assert.deepStrictEqual(res.body, {user: {name: 'Viktor', id: userId}, userCars: []});
                return request(app)
                  .delete('/users/' + userId);
              });
            });
      });
    });

    describe('POST /users', () => {
      it('Can create a user', () => {
        return request(app)
          .post('/users')
          .send({name: 'Viktor'})
          .expect(201)
          .expect('Content-Type', /json/)
          .then(res => {
            assert.ok(res.body.id);
            assert.strictEqual(res.body.name, 'Viktor');
            assert.ok(res.body.id.length > 0);

            return request(app)
              .delete('/users/' + res.body.id);
          });
      });

      it('Will return with 400 on invalid user', () => {
        return request(app)
          .post('/users')
          .send({})
          .expect(400);
      });
    });

    describe('DELETE /users/:id', () => {
      it('Can delete a user', () => {
        return request(app)
          .post('/users')
          .send({name: 'Viktor'})
          .then(res => {
            let userId = res.body.id;
            return request(app)
              .get('/users/' + userId)
              .expect(200)
              .then(() => {
                return request(app)
                  .delete('/users/' + userId)
                  .expect(204);
              })
              .then(res => {
                return request(app)
                  .get('/users/' + userId)
                  .expect(404);
              });
          });
        });
    });
  });

  describe('/users/:userId/cars/:carId', () => {
    it('Can create user and car and connect them', () => {
      return Promise.all([
        request(app)
          .post('/users')
          .send({name: 'Viktor'}),
        request(app)
          .post('/cars')
          .send({reg: 'ABC123', brand: 'Volvo'}),
        request(app)
          .post('/cars')
          .send({reg: 'ABC124', brand: 'Audi'})
      ])
      .then(results => {
        let [userRes, carRes, carRes2] = results;
        let userId = userRes.body.id;
        let carId = carRes.body.id;
        let carId2 = carRes2.body.id;
        assert.ok(userId);
        assert.ok(carId);
        assert.ok(carId2);

        return Promise.all([
          request(app)
            .post(`/users/${userId}/cars/${carId}`)
            .expect(201),
          request(app)
            .post(`/users/${userId}/cars/${carId2}`)
            .expect(201)
        ])
          .then(() => {
            return request(app)
              .get('/users/' + userId)
              .expect(200)
              .expect('Content-Type', /json/)
              .then(res => {
                let data = res.body;
                assert.strictEqual(data.user.id, userId);
                assert.equal(data.userCars.length, 2);
                assert.strictEqual(data.userCars[0].id, carId);
                assert.strictEqual(data.userCars[1].id, carId2);
              });
          });
      });
    });
  });
});







