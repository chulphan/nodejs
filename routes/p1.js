
module.exports = (app) => {

  var express = require('express');

  var router = express.Router();

  router.get('/r1', (req, res) => {
    console.log('/p1/r1');
    res.send('Hello /p1/r1');
  });

  router.get('/r2', (req, res) => {
    console.log('/p1/r2');
    res.send('Hello /p1/r2');
  });

  app.get('/p3/r1', (req, res) => {
    console.log('/p3/r1');
    res.send('Hello /p3/r1');
  });

//  app.use('/p1', router);

  return router;
};
