var express = require('express');
var app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '111111',
    database: 'o2'
};

var sessionStore = new MySQLStore(options);

app.use(bodyParser.urlencoded({ extended:false }));

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.get('/auth/login', (req, res) => {
  var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="id"
        placeholder="username">
      </p>
      <p>
        <input type="password" name="password"
        placeholder="password">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `;

  res.send(output);
});

app.post('/auth/login', (req, res) => {

  var user = {
    username : 'hello',
    password : 'merongkkk',
    displayName : 'ANTIL'
  };
  var userName = req.body.id;
  var password = req.body.password;

  if (userName === user.username && password === user.password){
    req.session.displayName = user.displayName;
    req.session.save((err) => {
      res.redirect('/welcome');
    });
  }else{
    res.send('Login Failed <a href="/auth/login">login</a>');
  }
});

app.get('/welcome', (req, res) => {
  console.log('WELCOME ' + req.session.displayName); // ANTIL
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">logout</a>
      `);
  }else{
    res.send(`
      <h1>Welcome!</h1>
      <a href="/auth/login">Login</a>
      `);
  }
});

app.get('/auth/logout', (req, res) => {

  delete req.session.displayName;
  req.session.save((err) => {
    res.redirect('/welcome');
  });
});

app.get('/count', (req, res) => {

  if(req.session.count){
    req.session.count++;
  }else{
    req.session.count = 1;
  }

  res.send('count : ' + req.session.count);
});

app.listen(8001, () => {
  console.log('Connected 8001 port');
});
