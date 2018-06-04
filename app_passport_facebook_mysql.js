var express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '111111',
    database: 'o2'
};

var sessionStore = new MySQLStore(options);

var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var hasher = bkfd2Password();
var assert = require("assert");

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});

conn.connect();

var app = express();

app.use(bodyParser.urlencoded({ extended:false }));

app.use(session({
    secret: '12333!@#!#fdaf%$!$!@$32fdc12333',
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/login', (req, res) => {
  var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="username"
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
    <a href="/auth/facebook">Facebook Login</a>
  `;

  res.send(output);
});

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  return done(null, user.authId);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser', id);

  var sql = 'SELECT * FROM users WHERE authId=?';

  conn.query(sql, [id], (err, results) => {
    if (err){
      console.log(err);
      return done('Error');
    }else{
      return done(null, results[0]);
    }
  });
});

passport.use(new LocalStrategy(
  (username, password, done) => {
      var userName = username;
      var password = password;

      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, [ 'local:'+userName ], (err, results) => {
        console.log(results);
        if (err){
          console.log(err);
          return done('There is no user');
        }
        var user = results[0];
        return hasher({password: password, salt: user.salt}, (err, pass, salt, hash) => {
            if (hash === user.password){
              console.log('LocalStrategy', user);
              return done(null, user);
            }else{
              return done(null, false);
            }
          });
        });
  }
));

passport.use(new FacebookStrategy({
    clientID: '2119011948110175',
    clientSecret: 'f18795aec7ada71826128467f98b12ff',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    var authId = 'facebook:'+profile.id; // 사용자의 고유한 값으로 facebook 사용자라는 것을 식별.

    var sql = 'SELECT * FROM users WHERE authId=?';

    conn.query(sql, [authId], (err, results) => {
      if (err){
        console.log(err);
      }else{
        if (results.length > 0){
          cb(null, results[0]);
        }else{
          var newUser = {
            authId : authId,
            displayName : profile.displayName,
            email : profile.emails[0].value
          };
          var sql = 'INSERT INTO users SET ?';
          conn.query(sql, newUser, (err, results) => {
            if(err){
              console.log(err);
              cb('error');
            }else{
              console.log(results[0]);
              cb(null, newUser);
            }
          });
        }
      }
    });
  }
));

 app.post('/auth/login',
      passport.authenticate('local', { successRedirect: '/welcome',
                                       failureRedirect: '/auth/login',
                                       failureFlash: false })
                                       // (req, res) => {
                                       //
                                       //     res.redirect('/welcome');
                                       //
                                       // }
  );

  app.get('/auth/facebook',
  passport.authenticate('facebook', {scope: 'email'}));

  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
  (req, res) => {
    req.session.save(() => {
      res.redirect('/welcome');
    })
  });
//
//   var userName = req.body.id;
//   var password = req.body.password;
//
//   for(var i = 0; i < user.length; i++){
//
//     if (userName === user[i].username){
//       return hasher({password: password, salt: user[i].salt}, (err, pass, salt, hash) => {
//         if (hash === user[i].password){
//           req.session.displayName = user[i].displayName;
//           req.session.save(() => {
//             res.redirect('/welcome');
//           });
//         }else{
//           res.send('Login Failed <a href="/auth/login">login</a>');
//         }
//       });
//     }
//
//     //if (userName === user[i].username && sha256(password+user[i].salt) === user[i].password){
//     //  req.session.displayName = user[i].displayName;
//     //  return req.session.save(() => {
//     //    res.redirect('/welcome');
//     //  });
//     //}
//   }
//     res.send('Login Failed <a href="/auth/login">login</a>');
// });



app.get('/welcome', (req, res) => {

  if(req.user && req.user.displayName){
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
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

  req.logout();
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
      authId: 'local:'+userName,
      username : userName,
      password : hash,
      salt : salt,
      displayName : displayName
    }

    var sql = 'INSERT INTO users SET ?';
    conn.query(sql, newUser, (err, result, fields) => {
      if (err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
        req.login(newUser, (err) => {
          req.session.save(() => {
            res.redirect('/welcome');
          });
        });
      }
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
