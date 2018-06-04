var express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
//var md5 = require('md5');
//var sha256 = require('sha256');

var bkfd2Password = require("pbkdf2-password");

var hasher = bkfd2Password();
var assert = require("assert");


var app = express();

app.use(bodyParser.urlencoded({ extended:false }));

app.use(session({
  secret: '17@3@fdf#$#$@#$asfdfsdff$234123',
  resave: false,
  saveUninitialized: true,
  store: new FileStore({path : './sessions'})
}));

var user = [
  {
    username : 'hello',
    password : 'pxMcA02T9A+aqcUybQvB/4sRcHoVuMfrQasRSo+b3xV8Mar1jh3GdNBxugMlyIgLOvf2aUpyKj6tKkMkNv83Flaoqn6FHt5BWXPkt/W4iBtC60VMKtlzv7Krx2MAQ6jQAJZKb2up7OM7WYXcbLMGfArnR3CWh7thZIZhY60j1EY=',
    salt : '0i4qcSgk0LjkLLVX7sUIFFZF9KlitsDomREr9H+7wWOyaecp41I3GZKlYcxEkwYlhOpeiUnB4LnK/vdLbsgvog==',
    displayName : 'ANTIL'
  }
];

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

  var userName = req.body.id;
  var password = req.body.password;

  for(var i = 0; i < user.length; i++){

    if (userName === user[i].username){
      return hasher({password: password, salt: user[i].salt}, (err, pass, salt, hash) => {
        if (hash === user[i].password){
          req.session.displayName = user[i].displayName;
          req.session.save(() => {
            res.redirect('/welcome');
          });
        }else{
          res.send('Login Failed <a href="/auth/login">login</a>');
        }
      });
    }

    //if (userName === user[i].username && sha256(password+user[i].salt) === user[i].password){
    //  req.session.displayName = user[i].displayName;
    //  return req.session.save(() => {
    //    res.redirect('/welcome');
    //  });
    //}
  }
    res.send('Login Failed <a href="/auth/login">login</a>');
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
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/register">Register</a></li>
      </ul>
      `);
  }
});

app.get('/auth/logout', (req, res) => {

  delete req.session.displayName;
  req.session.save(() => {
    res.redirect('/welcome');
  });


});

app.get('/register', (req, res) => {

  var output = `
      <h1>Register!!</h1>
      <form action="/register" method="post">
        <p>
          <input type="text" name="id" placeholder="id">
        </p>
        <p>
          <input type="password" name="password" placeholder="password">
        </p>
        <p>
          <input type="text" name="displayname" placeholder="displayname">
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
  `;

  res.send(output);
});

app.post('/register', (req, res) => {
  var userName = req.body.id;
  var password = req.body.password;
  var displayName = req.body.displayname;

  return hasher({password: password}, (err, pass, salt, hash) => {
    var newUser = {
      username : userName,
      password : hash,
      salt : salt,
      displayName : displayName
    }

    user.push(newUser);

    req.session.displayName = displayName;
    req.session.save(() => {
      res.redirect('/welcome');
    });
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
