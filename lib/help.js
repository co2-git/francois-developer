var actions = ['help', 'version', 'path',
	'build', 'start', 'status',
	'stop', 'update', 'env'];

module.exports = function help() {
  this.emit('message', ('francois-dev { ' + actions.join(' | ') + ' }'));
  this.emit('done', actions);
};