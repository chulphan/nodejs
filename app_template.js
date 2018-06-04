var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

app.listen(8001, () => {
  console.log('Connected 8001 port');
});
