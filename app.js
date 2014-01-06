/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fisy = require('fs')
  , util = require('util');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// Return a JSON containing a list of all playable files
app.get('/list', function(req, res) {
  var music_path;
  music_path = path.join(__dirname, 'audio');
  return fisy.readdir(music_path, function(error, files) {
    var file, output, _i, _len;
    output = {};
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      var split = file.split(".");
      if (split[0] !== "")
        output[split[0]] = file;
    }
    return res.json(output);
  });
});

// Stream the selected audio file
app.get('/play/:file', function(req, res, next) {
  var filePath, stat;
  filePath = path.join(__dirname, 'audio', req.param('file'));
  stat = fisy.statSync(filePath);
  res.header('content-type', 'audio/ogg');
  res.header('content-length', stat.size);
  return res.sendfile(filePath);
});

// dispatching public files (css, js, imgs) requests
app.get('/*.(js)', function(req, res){
  res.sendfile("./public/js"+req.url);
});
app.get('/*.(css)', function(req, res){
  res.sendfile("./public/css"+req.url);
});
app.get('/*.(jpg|png|gif)', function(req, res){
  res.sendfile("./public/img"+req.url);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
