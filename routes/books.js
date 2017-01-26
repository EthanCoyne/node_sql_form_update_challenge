var express = require('express');
var router = express.Router();
// these 2 lines could also be done in one like:
// var router = require('express').Router();


//requiring postgres
var pg = require('pg');

//this creates a config object to pass into the pg.Pool constructor.
var config = {
  database: 'library'
};

//this is what we use to connect and talk to the database
//intitialize connection Pool
var pool = new pg.Pool(config);

router.get('/', function(req, res) {

  //err - error object, will be non-null if there was some Error
  //    connecting to the DB. DB not running or config is incorrect

  //client - used to make the queries to DB

  //done - function to call when we are finished
  //  returns the connection back to the pool so others can use it.
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      // no error occurred, time to query

      // client.query takes 2 arguments:
      // 1st arg - SQL query we want to running
      // 2nd arg- callback - function to run after DB gives us our result
            // takes an err object and result object as it's arguments
      client.query('SELECT * FROM books ORDER BY title;', function(err, result){
        done();
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
        } else {
          console.log('Got info from DB', result.rows);
          res.send(result.rows);
        }
      }); // end client.query
    }
  }); // end pool connection
}); // end router.get

router.post('/', function(req, res) {

    //err - error object, will be non-null if there was some Error
    //    connecting to the DB. DB not running or config is incorrect

    //client - used to make the queries to DB

    //done - function to call when we are finished
    //  returns the connection back to the pool so others can use it.
    pool.connect(function(err, client, done) {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        done();
      } else {
        // no error occurred, time to query

        // client.query takes 2 arguments:
        // 1st arg - SQL query we want to running
        // 2nd arg- callback - function to run after DB gives us our result
              // takes an err object and result object as it's arguments
        client.query('INSERT INTO books (title, author, publication_date, edition, publisher) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [req.body.title, req.body.author, req.body.published, req.body.edition, req.body.publisher],
        function(err, result){
          done();
          if (err) {
            console.log('Error querying DB', err);
            res.sendStatus(500);
          } else {
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        }); // end client.query
      }
    }); // end pool connection
}); // end router.post

//localhost:300/books/4
//req.params.id === '4'
router.put('/:id', function(req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('UPDATE books SET title=$2, author=$3, publication_date=$4, edition=$5, publisher=$6  WHERE id = $1 RETURNING *',
      [req.params.id, req.body.title, req.body.author, req.body.published, req.body.edition, req.body.publisher],
      function(err, result) {
        if (err) {
          console.log("Error deleting book", err);
          sendStatus(500);
        } else {
          res.send(result.rows);
        }
        done();
      });
    }
  });// end pool
}); // end router.put

router.delete('/:id', function(req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('DELETE FROM books WHERE id = $1', [req.params.id],
      function(err, result) {
        if (err) {
          console.log("Error deleting book", err);
          sendStatus(500);
        } else {
          res.sendStatus(204);
        }
        done();
      });
    }
  });// end pool
});// end router.delete()





module.exports = router;
