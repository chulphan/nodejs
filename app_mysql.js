
var app = require('./config/mysql/express')();

var passport = require('./config/mysql/passport')(app);

var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);


var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

app.listen(8000, () => {
  console.log('SERVER RUNNING AT ' + 8000 + '!');
});
