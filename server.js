var env = process.env.npm_config_env;

if ( ! env ) {
	env = require('./package.json').config.env;
}

require('./main')('start', { env: env })
  .on('message', function (message) {
    console.log(message);
  })
  .on('error', function (error) {
    throw error;
  });