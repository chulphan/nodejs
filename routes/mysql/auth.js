// /auth 접근 처리


module.exports = (passport) => {

  var route = require('express').Router();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var conn = require('../../config/mysql/db')();

  route.get('/login', (req, res) => {
    var sql = 'SELECT id, title FROM topic';

    conn.query(sql, (error, topics, fields_out) => {
      res.render('auth/login', {topics: topics});
    });
  });

   route.post('/login',
        passport.authenticate('local', { successRedirect: '/topic',
                                         failureRedirect: '/auth/login',
                                         failureFlash: false })

    );

    route.get('/facebook',
    passport.authenticate('facebook', {scope: 'email'}));

    route.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
    (req, res) => {
      req.session.save(() => {
        res.redirect('/topic');
      })
    });


  route.get('/logout', (req, res) => {

    req.logout();
    req.session.save(() => {
      res.redirect('/topic');
    });
  });

  route.get('/register', (req, res) => {
    var sql = 'SELECT id, title FROM topic';

    conn.query(sql, (error, topics, fields_out) => {
      res.render('auth/register', {topics: topics});
    });
  });

  route.post('/register', (req, res) => {
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
              res.redirect('/topic');
            });
          });
        }
      });
    });
  });

  return route;
};
