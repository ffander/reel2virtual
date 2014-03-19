// Module dependencies.
var express = require('express'),
    routes = require('./routes'),
    play = require('./routes/play'),
    http = require('http'),
    path = require('path'),
    util = require('util');

var app = express();

// Express.js configuration
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

// Development environment only for the moment
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Request handling
app.get('/', routes.index);
app.get('/list', routes.list);
app.get('/play/:file', play.file);


// Dispatching public files (css, js, imgs) requests
app.get('/*.(js)', function(req, res){
  res.sendfile("./public/js"+req.url);
});
app.get('/*.(css|eot|svg|ttf|woff)', function(req, res){
  res.sendfile("./public/css"+req.url);
});
app.get('/*.(jpg|png|gif)', function(req, res){
  res.sendfile("./public/img"+req.url);
});
// Impulse responses for the ConvolverNodes are also served as static files
app.get('/*.(wav)', function(req,res){
  res.sendfile("./public/impulse_responses/"+req.url);
});

// Web Server Startup
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
