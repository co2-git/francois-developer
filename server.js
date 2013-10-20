var env = process.env.npm_config_env,
  json = require('./package.json');

if ( ! env ) {
	env = json.config.env;
}

require('./main')('start', { env: env })
  .on('message', function (message) {
    console.log(message);
  })
  .on('error', function (error) {
    throw error;
  })
  .on('done', function (done) {
    console.log();
    console.log(('francois-dev v' + json.version).grey);
  });