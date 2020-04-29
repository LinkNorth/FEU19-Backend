const knex = require('knex')({
  client: 'postgres',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '',
    database: 'ec'
  }
});

module.exports = knex;
