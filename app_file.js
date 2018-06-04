const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');

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

app.set('views', './views_file');
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

app.get('/topic/new', (req, res) => {

    fs.readdir('data', (err, files) => {
      if (err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }

      res.render('new', {topics : files});
    });
});

app.get(['/topic', '/topic/:topic'], (req, res) => {


    fs.readdir('data', (err, files) => {
      if (err){
        console.log(err);
        res.status(500).send('Internal Sever Error');
      }

      var topic = req.params.topic;
      var path = 'data/'+topic;

      if (topic){
        fs.readFile(path, 'utf8', (err, data) => {
          if (err){
            console.log(err);
            res.status(500).send('Internal server Error');
          }

          res.render('view', { title : topic, content : data, topics : files });
        });
      }else{
        res.render('view', { topics : files });
      }

    });
});

app.post('/topic', (req, res) => {

  var title = req.body.title;
  var desc = req.body.description;

  fs.writeFile('data/'+title, desc, (err) => {
    if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }

    res.redirect('/topic');
  });


});

app.listen(8000, () => {
  console.log('SERVER RUNNING AT ' + 8000 + '!');
});
