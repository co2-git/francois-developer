var express   = require('express'),         // the Express Framework
  app         = express(),                  // the App
  http        = require('http'),            // the HTTP module
  path        = require('path'),            // the Path module
  io          = require('socket.io'),       // Socket.io
  fs          = require('fs'),              // File System module
  packagejson = require('./package.json'),  // package.json
  env         = app.get('env');             // environment

// The method to handle error for end-user in production
function onErrorForEndUser (err, req, res, next){
  console.error(err.stack);
  res.render('error', { about: packagejson, env: app.get('env') });
}

// Port
app.set('port', + process.env.PORT || 3100);
// Views directory
app.set('views', __dirname + '/views');
// View engine
app.set('view engine', 'jade');
// Favicon
app.use(express.favicon());
// Logger
app.use(express.logger('dev'));
// Parser ??
app.use(express.bodyParser());
// Override HTTP methods
app.use(express.methodOverride());
// Use default router
app.use(app.router);
// Set static directory
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ( env === 'development' ) {
  // Error handling - maximum verbosity
  app.use(express.errorHandler());
  // Print nice HTML source
  app.locals.pretty = true;
}
// production only
if ( env === 'production' ) {
  // Error handling for end-user
  app.use(onErrorForEndUser);
}

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
  res.render(req.params.partial, { about: packagejson, env: app.get('env') });
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