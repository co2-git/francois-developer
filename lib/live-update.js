module.exports = function liveUpdate () {
  var fs = require('fs'),
    cp = require('child_process'),
    path = require('path'),
    main = require('../main'),
    json = require('../package.json'),
    base = path.dirname(__dirname),
    self = this;

  fs.stat(path.join(base, '.git'), function (error, gitFolder) {
    if ( error ) {
      if ( error.code === 'ENOENT' ) {
        self.emit('message', 'Initializing git folder');
        
        var initGit = cp.spawn('git', ['init'], { cwd: base });
        
        initGit.on('error', function (error) {
          self.emit('message', error.toString().red);
          self.emit('error', error);
        });

        return initGit.on('close', function (code) {
          if ( code ) {
            self.emit('message', 'Could not initialize git folder'.red);
            return self.emit('error', initGit.stderr);
          }

          self.emit('message', 'Git folder created'.green);

          self.emit('message', 'Building gitignore');

          main('copy', path.join(base, '.npmignore'), path.join('.gitignore'))
            
            .on('error', function (error) {
              self.emit('message', error.toString().red);
              return self.emit('error', error);
            })

            .on('done', function () {
              self.emit('message', 'gitignore built'.green);

              self.emit('message', 'Staging files');

              var gitAddA = cp.spawn('git', ['add', '-A'], { cwd: base });

              gitAddA.on('error', function (error) {
                self.emit('message', error.toString().red);
                self.emit('error', error);
              });

              gitAddA.on('close', function (code) {
                if ( code ) {
                  self.emit('message','Could not stage files'.red);
                  return self.emit('error', gitAddA.stderr);
                }

                self.emit('message', 'Files staged'.green);

                self.emit('message', 'Adding origin');

                var gitAddRemote = cp.spawn('git', ['remote', 'add', 'origin',
                  json.repository.url], { cwd: base });

                gitAddRemote.on('error', function (error) {
                  self.emit('message', error.toString().red);
                  self.emit('error', error);
                });

                gitAddRemote.on('close', function (code) {
                  if ( code ) {
                    self.emit('message', 'Could not add origin'.red);
                    return self.emit('error', gitAddRemote.stderr);
                  }

                  self.emit('message', 'Origin added'.green);

                  self.emit('message', 'Pulling from origin');

                  var gitPull = cp.spawn('git', ['pull', '-f', 'origin', 'master'],
                    { cwd: base });

                  gitPull.on('error', function (error) {
                    self.emit('message', error.toString().red);
                    self.emit('error', error);
                  });

                  gitPull.on('close', function (code) {
                    if ( code ) {
                      self.emit('message', 'Could not pull'.red);
                      console.log(gitPull.stderr);
                      return self.emit('error', gitPull.stderr);
                    }

                    self.emit('message', 'Pulled'.green);

                    self.emit('done');
                  });
                });
              });
            });
        });
      }
      else {
        return self.emit('error', error);
      }
    }
    else {
      var gitPull = cp.spawn('git', ['pull', '-f', 'origin', 'master'],
        { cwd: base });

      gitPull.on('error', function (error) {
        self.emit('message', error.toString().red);
        self.emit('error', error);
      });

      gitPull.on('close', function (code) {
        if ( code ) {
          self.emit('message', 'Could not pull'.red);
          console.log(gitPull.stderr);
          return self.emit('error', gitPull.stderr);
        }

        self.emit('message', 'Pulled'.green);

        self.emit('done');
      });
    }
  });
};