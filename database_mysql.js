const mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});

connection.connect();
/*
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) throw error;
  else{
    for (var i = 0; i < results.length; i++){
      console.log(results[i]);
    }
  }

});
*/

/*
var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graphittie'];

connection.query(sql, params, (error, rows, fields) => {
  if (error) throw error;
  else{
    console.log(rows);
  }
});
*/

/*
var sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
var params = ['Angular with Type Script', 'Anonymous', '1'];

connection.query(sql, params, (error, rows, fields) =>{
  if (error) throw error;
  else{
    console.log(rows);
  }
});
*/

var sql = 'DELETE FROM topic WHERE id=?'
var params = ['5'];

connection.query(sql, params, (error, rows, fields) =>{
  if (error) throw error;
  else{
    console.log(rows);
    console.log(fields);
  }
});
connection.end();
