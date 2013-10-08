var express = require('express'),
  app = express(),
  http = require('http'),
  path = require('path');

// all environments
app.set('port', + process.env.PORT || 3100);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY', store: new express.session.MemoryStore()}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(function(err, req, res, next) {
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
  res.render('layout', {});
});

// Routes: PARTIALS
app.get('/partials/:partial', function getPartial (req, res) {
  res.render(req.params.partial, {});
});

// Launch server
http.createServer(app).listen(app.get('port'), function onServerStarted (){
  console.log('Express server listening on port ' + app.get('port'));
});