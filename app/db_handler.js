module.exports = function() {
  const pg = require('pg');
  const conn = require('../settings/db_config');


// pg.connect(conn.database.url, function(err, client, done) {
//   if (err)
//     return console.error('error fetching client', err);
//
//   client.query('SELECT * FROM users', function(err, result) {
//     done();
//     if (err)
//       return console.error('error with query', err)
//     console.log(result.rows);
//     // res.json(result.rows);
//     process.exit(0);
//   });
// });

  function getData()  {
    pg.connect(conn.database.url, function (err, client) {
      if (err)
        return console.error('error fetching client', err);

      client.query('SELECT * FROM pokemon', function (err, result) {
        if (err)
          return console.error('error with query', err)

        return result.rows;
      });
    });
  }

  return module;
}