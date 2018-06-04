var express = require('express');
var route = express.Router();

route.get('/r1', (req, res) => {
  res.send('/p1/r1');
});

route.get('/r2', (req, res) => {
  res.send('/p1/r2');
});

module.exports = route;
