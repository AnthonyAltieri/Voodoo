/**
 * @author Anthony Altieri on 10/15/16.
 */

const express = require('express');
const path = require('path');

const app = express();

app.use(function(req, res, next) {
  console.log(req.url);
  next();
});

app.use('/static', express.static(path.join(__dirname, '../dist')));

app.get('/', function(req, res) {
  console.log('test');
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/test', function(req, res) {
  console.log('message body', JSON.stringify(req.body, null, 2))
});

app.post('/isAlive', function(req, res) {
  // Respond with 200 Ok
  res.sendStatus(200)
});

const PORT = 9000;

app.listen(PORT, function() {
  console.log('Server listening on localhost:' + PORT);
});

