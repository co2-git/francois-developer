var path = './lib/';

require('colors');

module.exports = function main (module) {
  var importer = require(path + module),
    sys = require('sys'),
    events = require('events');
  
  for ( var args = [], i = 1; i < arguments.length; i ++ ) {
    args.push(arguments[i]);
  }

  function Asynchronous () {
    process.nextTick(function () {
      importer.apply(this, args);
    }.bind(this));
  }

  sys.inherits(Asynchronous, events.EventEmitter);

  return new Asynchronous();
};