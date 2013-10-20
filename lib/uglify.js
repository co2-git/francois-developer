module.exports = function uglify (u) {
  var self = this,
    cp = require('child_process'),
    path = require('path'),
    base = path.dirname(__dirname),
    args = ['node_modules/.bin/uglifyjs'];

  u.input.forEach(function (input) {
    args.push(input);
  });

  args = args.concat(['-o', u.out]);

  args.push('-c');

  var uglifyjs = cp.spawn('node', args, { cwd: base });

  uglifyjs.on('error', function (error) {
    self.emit('error', error);
  });

  uglifyjs.on('close', function (code) {
    if ( code ) {
      console.log(['node'].concat(args).join(' ').bold);
      return self.emit('error', new Error('Uglify failed with code ' + code));
    }
    self.emit('done');
  });
};