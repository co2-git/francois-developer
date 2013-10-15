var env = process.env.npm_config_env;

if ( ! env ) {
	env = require('./package.json').config.env;
}

require('./bin/start')({ env: env }, function (error, status) {
  if ( error ) {
    return console.error(error);
  }
});