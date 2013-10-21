module.exports = function liveUpdate () {
  var fs = require('fs'),
    cp = require('child_process'),
    path = require('path'),
    base = path.dirname(__dirname),
    self = this;

  fs.stat(path.join(base, '.git2'), function (error, gitFolder) {
    if ( error ) {
      if ( error.code === 'ENOENT' ) {
        self.emit('message', 'Initializing git folder');
        
        var initGit = cp.spawn('git', ['init'], { cwd: base });
        
        initGit.on('error', function (error) {
          self.emit('error', error);
        });

        initGit.on('close', function (code) {
          if ( code ) {
            return self.emit('error', initGit.stderr);
          }

          main('copy', path.join(base, '.npmignore'), path.join('.gitignore'))
            
            .on('error', function (error) {
              return self.emit('error', error);
            })

            .on('done', function () {
              var gitAddA = cp.spawn('git', ['add', '-A']);

              gitAddA.on('error', function (error) {
                self.emit('error', error);
              });

              gitAddA.on('close', function (code) {
                if ( code ) {
                  return self.emit('error', gitAddA.stderr);
                }

                var gitAddRemote = cp.spawn('git', ['remote', 'add', 'origin',
                  'https://github.com/co2-git/francois-developer.git']);

                gitAddRemote.on('error', function (error) {
                  self.emit('error', error);
                });

                gitAddRemote.on('close', function (code) {
                  if ( code ) {
                    return self.emit('error', gitAddRemote.stderr);
                  }

                  var gitPull = cp.spawn('git', ['-f', 'pull', 'origin', 'master']);

                  gitPull.on('error', function (error) {
                    self.emit('error', error);
                  });

                  gitPull.on('close', function (code) {
                    if ( code ) {
                      return self.emit('error', error);
                    }

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


  });
};