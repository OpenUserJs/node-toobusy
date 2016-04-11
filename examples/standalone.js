'use strict';

// first, we want to be able to get cpu usage stats in terms of percentage
let loaded = false;
let toobusy = require('..');

let work = 524288;

function worky() {
  let howBusy = toobusy();
  if (howBusy) {
    work /= 4;
    console.log("I can't work! I'm too busy:", toobusy.lag() + "ms behind");
  }
  work *= 2;
  for (let i = 0; i < work;) i++;
  console.log("worked:",  work);
};

var interval = setInterval(worky, 100);

process.on('SIGINT', function() {
  clearInterval(interval);
  toobusy.shutdown();
  process.exit(0);
});
