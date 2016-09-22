// app/index.js
// const http = require('http');
// const port = 3000;

// const requestHandler = (request, response) => {
//   console.log(request.url);
//   response.end("Hello connection established.");
// }

// const server = http.createServer(requestHandler);

// server.listen(port, (err) => {
//   if (err)
//     return console.log("Error: ", err);
//   console.log("Listening on port: " + port)
// });

const express = require('express');
const app = express();
const port = 3000;

//Middlewares 1st, 2nd, and 3rd
//sends header
app.use((request, response, next) => {
  console.log(request.headers);
  next();
});

//calculations
app.use((request, response, next) => {
  request.chance = Math.floor(Math.random() * 100);
  next();
})

//sends json response 
app.get('/', (request, response) => {
  response.json({
    chance: request.chance
  });
});

//testing error handling
app.get('/err', (request, response) => {  
  throw new Error('oops');
});

app.use((err, request, response, next) => {  
  // log the error, for now just console.log
  console.log(err);
  response.status(500).send('Something broke!');
});

// app.get('/', (request, response) => {
//   response.send("Connected to Node/Express Server.");
// });

// app.listen(port, (err) => {
//   if(err)
//     return console.log("Error: ", err);
//   console.log('Server listening on port ' + port);
// });

app.listen(port);