

module.exports = (app) => {
  var express = require('express');

  var router = express.Router();

  app.use(router);

  router.get('/r1', (req, res) => {
    console.log('/p2/r1');
    res.send('Hello /p2/r1');
  });

  router.get('/r2', (req, res) => {
    console.log('/p1/r2');
    res.send('Hello /p2/r2');
  });

  app.get('/p4/r1', (req, res) => {
    console.log('/p4/r1');
    res.send('Hello /p4/r1');
  });

  //app.use('/p2', router);

  return router;
};
