module.exports = function liveUpdate (config) {
  if ( typeof config === 'undefined' ) {
    config = {};
  }

  var fs = require('fs'),
    cp = require('child_process'),
    path = require('path'),
    main = require('../main'),
    json = require('../package.json'),
    base = path.dirname(__dirname),
    self = this;

  function next(seq) {
    if ( seq ) {
      for( var i in arguments ) {
        next.sequence.push(arguments[i]);
      }
    }

    if ( next.sequence.length ) {
        next[next.sequence[0]].call(null);
        next.sequence.shift();
      }
  }

  next.sequence = [];

  next.init = function init() {
    self.emit('message.cli', 'Initializing git folder');

    var spawn = cp.spawn('git', ['init'], { cwd: base });
        
    spawn.on('error', function (error) {
      self.emit('message.cli', error.toString().red);
      self.emit('error', error);
    });

    return spawn.on('close', function (code) {
      if ( code ) {
        self.emit('message.cli', 'Could not initialize git folder'.red);
        return self.emit('error', spawn.stderr);
      }

      self.emit('message.cli', 'Git folder created'.green);

      next();
    });
  };

  next.ignore = function ignore() {
    self.emit('message.cli', 'Building gitignore');
    return next();
    // main('copy', path.join(base, '.npmignore'), path.join('.gitignore'))
      
    //   .on('error', function (error) {
    //     self.emit('message.cli', error.toString().red);
    //     return self.emit('error', error);
    //   })

    //   .on('done', function () {
    //     self.emit('message.cli', 'gitignore built'.green);

    //     next();
    //   });
  };

  next.add = function add() {
    self.emit('message.cli', 'Staging files');

    var spawn = cp.spawn('git', ['add', '-A'], { cwd: base });

    spawn.on('error', function (error) {
      self.emit('message.cli', error.toString().red);
      self.emit('error', error);
    });

    spawn.on('close', function (code) {
      if ( code ) {
        self.emit('message.cli','Could not stage files'.red);
        return self.emit('error', spawn.stderr);
      }

      self.emit('message.cli', 'Files staged'.green);

      next();
    });
  };

  next.remote = function remote() {
    self.emit('message.cli', 'Adding origin');

    var spawn = cp.spawn('git', ['remote', 'add', 'origin',
      json.repository.url], { cwd: base });

    spawn.on('error', function (error) {
      self.emit('message.cli', error.toString().red);
      self.emit('error', error);
    });

    spawn.on('close', function (code) {
      if ( code ) {
        self.emit('message.cli', 'Could not add origin'.red);
        return self.emit('error', spawn.stderr);
      }

      self.emit('message.cli', 'Origin added'.green);

      next();
    });
  };

  next.pull = function pull() {
    if ( ! config.commit ) {
      config.commit = 'master';
    }

     self.emit('message.cli', 'Pulling from origin:' + config.commit);

    var spawn = cp.spawn('git', ['pull', '-f', 'origin', config.commit],
      { cwd: base });

    spawn.on('error', function (error) {
      self.emit('message.cli', error.toString().red);
      self.emit('error', error);
    });

    spawn.on('close', function (code) {
      if ( code ) {
        self.emit('message.cli', 'Could not pull'.red);
        console.log(spawn.stderr);
        return self.emit('error', spawn.stderr);
      }

      self.emit('message.cli', 'Pulled'.green);
    });
  };

  fs.stat(path.join(base, '.git'), function (error, gitFolder) {
    if ( error ) {
      if ( error.code === 'ENOENT' ) {
        next('init', 'ignore', 'add', 'remote', 'pull');
      }
      else {
        return self.emit('error', error);
      }
    }
    else {
      next('pull');
    }
  });
};