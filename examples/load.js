'use strict';

let http = require('http');

// a little load generate client that generates constant load over
// even if the server cannot keep up

let running = 0;
let twoHundred = 0;
let fiveOhThree = 0;
let yucky = 0;
let avg = 0;

// how many requests per second should we run?
const rps = (process.env['RPS'] || 40) / 40;
let curRPS = rps;
let started = 0;
const startTime = new Date();
let lastMark = startTime;

let ivalnum = 0;

setInterval(function() {
  ivalnum++;
  function startOne() {
    started++;
    running++;
    let start = new Date();
    let endOrError = false;
    function cEndOrError() {
      if (endOrError) console.log("end AND error");
      endOrError = true;
    }
    let req = http.get({
      host: '127.0.0.1',
      port: 3000,
      agent: false,
      path: '/',
      headers: {
        "connection": "close"
      }
    }, function(res) {
      if (res.statusCode === 503) {
        fiveOhThree++;
      } else {
        twoHundred++;
      }
      avg = ((new Date() - start) + avg * started) / (started + 1);
      running--;
      cEndOrError();
    }).on('error', function(e) {
      process.stderr.write(e.toString() + " - " + (new Date() - start) + "ms\n");
      avg = ((new Date() - start) + avg * started) / (started + 1);
      running--;
      yucky++;
      cEndOrError();
    });
  }

  for (let i = 0; i < curRPS ; i++) startOne();

  // report and scale up every 2s
  if (!(ivalnum % (40 * 2))) {
    let delta = (new Date() - lastMark) / 1000.0 ;
    console.log(Math.round((new Date() - startTime) / 1000.0),
                Math.round(started / delta),
                Math.round(twoHundred / delta),
                Math.round(fiveOhThree / delta),
                avg,
                Math.round(yucky / delta));
    curRPS = curRPS + .5;
    started = twoHundred = fiveOhThree = yucky = 0;
    lastMark = new Date();
  }
}, 25);
