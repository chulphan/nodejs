

module.exports = (app) => {

  var conn = require('./db')();

  var bkfd2Password = require("pbkdf2-password");
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var hasher = bkfd2Password();
  var assert = require("assert");

  app.use(passport.initialize());
  app.use(passport.session());

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

  return passport;
};
