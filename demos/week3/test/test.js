const request = require('supertest');
const app = require('../servertest');

describe('Server', () => {
  it('GET /', () => {
    request(app)
      .get('/user')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '15')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
      });
  });
});
