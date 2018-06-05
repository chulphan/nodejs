module.exports = () => {
  var express = require('express');
  const bodyParser = require('body-parser');
  const session = require('express-session');

  var MySQLStore = require('express-mysql-session')(session);

  var app = express();

  app.locals.pretty = true;

  app.set('views', './views/mysql');
  app.set('view engine', 'pug');

  app.use(bodyParser.urlencoded({ extended:false }));

  app.use(session({
      secret: '12333!@#!#fdaf%$!$!@$32fdc12333',
      store: new MySQLStore(
        {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '111111',
            database: 'o2'
        }
      ),
      resave: false,
      saveUninitialized: true
  }));
  return app;
}
