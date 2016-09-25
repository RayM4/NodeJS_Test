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
// const db_handler = require('./app/db_handler');

// Route Handlers
app.get('/', (request, response) => {
  response.render('home', {
    name: 'John Smith'
  })
});

app.get('/data', function(req, res) {
  pg.connect(conn.database.url, function(err, client) {
    if (err)
      return console.error('error fetching client', err);

    client.query('SELECT * FROM pokemon', function(err, result) {
      if (err)
        return console.error('error with query', err)
      // console.log(result.rows);
      // res.json(result.rows);

      res.render('formatted_table', {
        data: formatTableToHTML(result.rows)
      });
    });
  });
});


//testing callbacks
var cb01 = function(req, res, next) {
  console.log("first callback");
  res.locals.stuff = "from cb01";
  next();
}

var cb02 = function(req, res, next) {
  console.log("second callback");
  res.locals.stuff2 = "from cb02";
  next();
}

app.get('/callbacks', [cb01, cb02], function(req, res, next) {
  console.log("response");
  next();
}, function(req, res) {
  console.log('rendering');
  res.send("Hello World! <br>" + res.locals.stuff + "<br>" + res.locals.stuff2);
});


//path
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

//other functions
var formatTableToHTML = function(data) {
  var rowHeader = "<div class = 'row'>";
  var colHeader = "<div class = 'col-sm-6'>";
  var divCloser = "</div>";
  var table = "";
  for (var i in data) {
    table = table + rowHeader + colHeader + data[i].id;
    table = table + divCloser + colHeader + data[i].name;
    table = table + divCloser + divCloser;
  }
  return table;
};

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

