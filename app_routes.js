var express = require('express');
var app = express();

// Router-level Middleware.

var p1 = require('./routes/p1')(app);

app.use('/p1', p1);

var p2 = require('./routes/p2')(app);

app.use('/p2', p2);

app.listen(8001, () => {
  console.log('Connect 8001 Port');
});
