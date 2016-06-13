var pg = require('pg');
var conection = "postgres://postgres:123456@localhost/imac";

// this initializes a connection pool
// it will keep idle connections open for a (configurable) 30 seconds
// and set a limit of 10 (also configurable)
pg.connect(conection, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    // call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    // output: 1
  });
});

module.exports = conection;
