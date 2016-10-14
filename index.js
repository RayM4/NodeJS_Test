//index.js

//require('./app/index'); //server example

const path = require('path');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 3000;

//postgres
const pg = require('pg');
const promise = require('promise');
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

    client.query(conn.database.select_all, function(err, result) {
      if (err)
        return console.error('error with query', err)
      //console.log(result.rows);
      // res.json(result.rows);

      res.render('formatted_table', {
        data: formatTableToHTML(result.rows)
      });
    });
  });
});

//joins?
app.get('/stat/:dexID', function(req, res) {
  pg.connect(conn.database.url, function(err, client) {
    if (err)
      return console.error('error fetching client', err);

    var sql = conn.database.select_stat + req.params.dexID + ";";
    console.log(sql);
    client.query(sql, function(err, result) {
      if (err)
        return console.error('error with query', err);
      // console.log(result.rows);
      res.render('table_stat', {
        data: formatTableToHTML2(result.rows)
      });
    });
  });
});

app.get('/ability/:dexID', function(req, res) {
  pg.connect(conn.database.url, function(err, client) {
    if (err)
      return console.error('error fetching client', err);

    var sql = conn.database.select_ability + req.params.dexID + ";";
    console.log(sql);
    client.query(sql, function(err, result) {
      if (err)
        return console.error('error with query', err);
      // console.log(result.rows);
      res.render('table_ability', {
        data: formatTableToHTML2(result.rows)
      });
    });
  });
});

app.get('/move/:dexID', function(req, res) {

});

//testing callbacks
var cb01 = function(req, res, next) {
  console.log("first callback");
  res.locals.stuff = "from cb01";
  next();
};

var cb02 = function(req, res, next) {
  console.log("second callback");
  res.locals.stuff2 = "from cb02";
  next();
};

app.get('/callbacks', [cb01, cb02], function(req, res, next) {
  console.log("response");
  next();
}, function(req, res) {
  console.log('rendering');
  res.send("Hello World! <br>" + res.locals.stuff + "<br>" + res.locals.stuff2);
});

//callback + module
var getAbilityData = function(req, res) {
    res.locals.abilities = new promise(conn.database.selectAbility(req.params.dexID), function(response, err){
        if (err)
            promise.reject(err);
        else
            promise.resolve(response);
    });
};

app.get('/ability2/:dexID', [getAbilityData], function (req, res) {
    res.promise(getAbilityData(req, res).then(function(res) {
            res.render('table_ability', {
                data: formatTableToHTML2(res.locals.abilities)
            });
        }
    ));
    // var tableData = res.locals.abilities;

    // res.render('table_ability', {
    //     data: formatTableToHTML2(tableData)
    // });
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

var formatTableToHTML2 = function(data) {
  var rowHeader = "<div class = 'row'>";
  var colHeaderTitle = "<div class = 'col-sm-2'>";
  var divCloser = "</div>";
  var table = "";
  var keys = Object.keys(data[0]);
  var rowSize = 8/(keys.length-2);
  var colHeader = "<div class = 'col-sm-"+rowSize+"'>";
  for (var i in data) {
    table = table + rowHeader;
    for (var j in keys) {
      if (j < 2)
        table = table + colHeaderTitle + data[i][keys[j]] + divCloser;
      else
        table = table + colHeader + data[i][keys[j]] + divCloser;
    }
    table = table + divCloser;
  }
  return table;
};



app.listen(port);

