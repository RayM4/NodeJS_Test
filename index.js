//index.js

//require('./app/index'); //server example

const path = require('path');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 3000;

//postgres
const pg = require('pg');
const conn = require('./settings/db_config');

//Route Handlers
// app.get('/', (request, response) => {
//   response.render('home', {
//     name: 'John Smith'
//   })
// });
//
// app.engine('.hbs', exphbs({
//   defaultLayout: 'main',
//   extname: '.hbs',
//   layoutsDir: path.join(__dirname, 'views/layouts')
// }));
//
// app.set('view engine', '.hbs');
// app.set('views', path.join(__dirname, 'views'));

app.get('/data', function(req, res, next) {
  pg.connect(conn.database.url, function(err, client, done) {
    if (err)
      return console.error('error fetching client', err);

    client.query('SELECT * FROM user', function(err, result) {
      next();
      if (err)
        return console.error('error with query', err)
      console.log(result.rows);
      res.json(result.rows)
      process.exit(0);
    });
  });
});

// //external api
// const rp = require('request-promise');
//
// app.engine('.hbs', exphbs({
//   defaultLayout: 'main',
//   extname: '.hbs',
//   layoutsDir: path.join(__dirname, 'views/layouts')
// }));
//
// app.set('view engine', '.hbs');
// app.set('views', path.join(__dirname, 'views'));
//
// app.get((req, res) => {
//   rp({
//     url: '',
//     json:true
//   })
//   .then((data) => {
//     // res.render(data);
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//     res.render('error');
//   })
// });

app.listen(port);

