const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});

connection.connect();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    var expension = file.originalname.substring(file.originalname.indexOf('.'));
    cb(null, file.fieldname + '-' + Date.now() + expension);
  }
})

var upload = multer({ storage: storage })


app.locals.pretty = true;

app.set('views', './views_mysql');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended:false }));

app.use('/user', express.static('data'));

app.get('/upload', (req, res) => {
  res.render('uploadForm');
});

app.post('/upload', upload.single('userfile'), (req, res) => {
  console.log(req.file);
  res.send('uploadForm : ' + req.file.filename);
});

app.get('/topic/add', (req, res) => {

    var sql = 'SELECT id, title FROM topic';
    connection.query(sql, (error, topics, fields) =>{
      if (error){
        console.log(error);
        res.status(500).send('Internal Sever Error');
      }else{
        res.render('add', {topics : topics});
      }
    });
});

app.get(['/topic/:id/edit'], (req, res) => {
  var sql = "SELECT id, title FROM topic";
  connection.query(sql, (error, topics, fields) => {
    var id = req.params.id;
    if (id){
      var sql = "SELECT * FROM topic WHERE id=?";
      connection.query(sql, id, (error, topic, fields) => {
        if (error){
          console.log(error);
          res.status(500).send('Internal Server Error');
        }else{
          res.render('edit', {topics:topics, topic:topic[0]});
        }
      });
    }else{
      res.render('edit', {topics:topics});
    }
  });
});

app.post(['/topic/:id/edit'], (req, res) => {
  var id = req.params.id;
  var title = req.body.title;
  var desc = req.body.description;
  var author = req.body.author;

  var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?'
  var params = [title, desc, author, id];

  connection.query(sql, params, (error, result, fields) => {
    if (error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }else{
      res.redirect('/topic/' + id);
    }
  });
});

app.get(['/topic/:id/delete'], (req, res) => {


    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?'

    connection.query(sql, id, (error, result, fields) => {
      if (error){
        console.log(error);
        res.status(500).send('Internal Server Error');
      }else{
        res.redirect('/topic');
      }
    });

});

app.get(['/topic', '/topic/:topic'], (req, res) => {
  var sql = 'SELECT id, title FROM topic';

  connection.query(sql, (error, topics, fields_out) => {
    var id = req.params.topic;
    if (id){
      var sql = 'SELECT * FROM topic WHERE id=?';
      connection.query(sql, id, (err, topic, fields_in) =>{
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else{
          res.render('view', {topics:topics, topic:topic[0]})
        }
      });
    }else{
      res.render('view', {topics:topics});
    }
  });
});

app.post('/topic', (req, res) => {
  /*
  var title = req.body.title;
  var desc = req.body.description;

  fs.writeFile('data/'+title, desc, (err) => {
    if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }

    res.redirect('/topic');
  });
  */

  var title = req.body.title;
  var author = req.body.author;
  var desc = req.body.description;

  var sql = "INSERT INTO topic (title, description, author) VALUES (?, ?, ?)";
  var params = [title, desc, author];

  connection.query(sql, params, (error, rows, fields) => {
    if (error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }else{
      res.redirect('/topic/'+rows.insertId);
    }
  });

});

app.listen(8000, () => {
  console.log('SERVER RUNNING AT ' + 8000 + '!');
});
