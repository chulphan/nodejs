var express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
var app = express();

app.use(bodyParser.urlencoded({ extended:false }));

app.use(session({
  secret: '17@3@fdf#$#$@#$asfdfsdff$234123',
  resave: false,
  saveUninitialized: true
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
    res.redirect('/welcome');
  }else{
    res.send('Login Failed <a href="/auth/login">login</a>');
  }
});

app.get('/welcome', (req, res) => {
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
  delete req.session.displayName
  res.redirect('/welcome');
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
