var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var fs = require('fs');
var path = require('path');
var database = require('./db/connect').applicationConnection;

var app = express();

var config = fs.readFileSync(path.join(__dirname,'/config/development.json'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded());
app.use('/public', express.static('public'));

var loadSecret = function(path) {
  try{
    var ret = require('fs').readFileSync(path).toString();
    console.log('using secret: ' + ret);
  } catch (e){
  return "GENERATE-A-SESSION-KEY";
  }
};

app.use(session({
  secret: loadSecret(__dirname + '.sessionKey'),
  resave: false,
  saveUninitialized: true,
}));



app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

require('./routeLoader').init(app, database, '/routes');

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(80);
