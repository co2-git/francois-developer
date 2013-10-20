var express = require('express'),
  app = express(),
  http = require('http'),
  path = require('path'),
  io = require('socket.io'),
  fs = require('fs'),
  packagejson = require('./package.json'),
  isDev = app.get('env') === 'development';

// all environments
app.set('port', + process.env.PORT || 3100);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
if ( isDev ) {
  app.locals.pretty = true;
}
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ( isDev ) {
  app.use(express.errorHandler());
}

app.use(function (err, req, res, next) {
  function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
      res.send(500, { error: 'Something blew up!' });
    } else {
      next(err);
    }
  }
});

// Routes: INDEX
app.get('/', function getIndex (req, res) {
  fs.readFile(__dirname + '/package.json',
    function readPackageJson (error, data) {
      if ( error ) {
        throw error;
      }
      var packagejson = JSON.parse(data.toString());
      res.render('layout', { about: packagejson, env: app.get('env') });
    });
});

// Routes: PARTIALS
app.get('/partials/:partial', function getPartial (req, res) {
  res.render(req.params.partial, {});
});

// Launch server
var server = http.createServer(app);

server.listen(app.get('port'), function onServerStarted (){
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Express environment: ' + app.get('env'));

  // Associate socket.io
  io = io.listen(server);

  io.sockets.on('connection', function onSocketConnected (socket) {
    fs.watch(__dirname + '/package.json', function (event, file) {
      if ( event === 'change' ) {
        fs.readFile(file, function readPackageJson (error, data) {
          if ( error ) {
            return socket.emit('error', error.toString());
          }
          var packagejson = JSON.parse(data.toString());
          socket.emit('version', packagejson.version);
        });
      }
    });
  });
});