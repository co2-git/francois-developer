var actions = ['help', 'version', 'path',
	'build', 'start', 'status',
	'stop', 'update', 'env'];

module.exports = function help() {
  this.emit('message', ('francois-dev { ' + actions.join(' | ') + ' }'));
  this.emit('actions', actions);
  this.emit('done');
};