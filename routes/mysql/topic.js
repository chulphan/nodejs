module.exports = () => {

  var route = require('express').Router();
  var conn = require('../../config/mysql/db')();

  route.get('/add', (req, res) => {

      var sql = 'SELECT id, title FROM topic';
      conn.query(sql, (error, topics, fields) =>{
        if (error){
          console.log(error);
          res.status(500).send('Internal Sever Error');
        }else{
          res.render('topic/add', {topics : topics, user: req.user});
        }
      });
  });

  route.get(['/:id/edit'], (req, res) => {
    var sql = "SELECT id, title FROM topic";
    conn.query(sql, (error, topics, fields) => {
      var id = req.params.id;
      if (id){
        var sql = "SELECT * FROM topic WHERE id=?";
        conn.query(sql, id, (error, topic, fields) => {
          if (error){
            console.log(error);
            res.status(500).send('Internal Server Error');
          }else{
            res.render('topic/edit', {topics:topics, topic:topic[0], user: req.user});
          }
        });
      }else{
        res.render('topic/edit', {topics:topics, user: req.user});
      }
    });
  });

  route.post(['/:id/edit'], (req, res) => {
    var id = req.params.id;
    var title = req.body.title;
    var desc = req.body.description;
    var author = req.body.author;

    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?'
    var params = [title, desc, author, id];

    conn.query(sql, params, (error, result, fields) => {
      if (error){
        console.log(error);
        res.status(500).send('Internal Server Error');
      }else{
        res.redirect('/' + id);
      }
    });
  });

  route.get(['/:id/delete'], (req, res) => {


      var id = req.params.id;
      var sql = 'DELETE FROM topic WHERE id=?'

      conn.query(sql, id, (error, result, fields) => {
        if (error){
          console.log(error);
          res.status(500).send('Internal Server Error');
        }else{
          res.redirect('');
        }
      });

  });

  route.get(['/', '/:topic'], (req, res) => {
    var sql = 'SELECT id, title FROM topic';

    conn.query(sql, (error, topics, fields_out) => {
      var id = req.params.topic;
      if (id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, id, (err, topic, fields_in) =>{
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else{
            res.render('topic/view', {topics:topics, topic:topic[0], user: req.user})
          }
        });
      }else{
        res.render('topic/view', {topics:topics, user: req.user});
      }
    });
  });

  route.post('/', (req, res) => {
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

    conn.query(sql, params, (error, rows, fields) => {
      if (error){
        console.log(error);
        res.status(500).send('Internal Server Error');
      }else{
        res.redirect('/topic/'+rows.insertId);
      }
    });

  });

  return route;
};
