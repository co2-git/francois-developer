module.exports = function copy (from, to) {
  var fs = require('fs'),
    self = this;

  self.emit('message', ['Copying file', from.grey, to.grey].join('  '));

  fs.ReadStream(from)
    .pipe(fs.WriteStream(to, { flags: 'w+' }))
    .on('close', function () {
      self.emit('done');
    })
    .on('error', function (error) {
      self.emit('error', error);
    });
};