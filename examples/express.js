'use strict';

let toobusy = require('..'),
    express = require('express');

let app = express();

// Have grace under load
app.use(function(req, res, next) {
  if (toobusy()) {
    res.status(503).send("I'm busy right now, sorry.");
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  // processing the request requires some work!
  let i = 0;
  while (i < 1e5) i++;
  res.send("I counted to " + i);
});

let server = app.listen(3000);

process.on('SIGINT', function() {
  server.close();
  toobusy.shutdown();
  process.exit(0);
});
