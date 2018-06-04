var express = require('express');
var app = express();

var p1 = require('./routes/p1t');

app.use('/p1', p1);

var p2 = require('./routes/p2t');

app.use('/p2', p2);

app.listen(8001, ()=>{
  console.log('8001 port');
});
