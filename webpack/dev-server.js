import debug from 'debug';
import webpack from 'webpack';
import express from 'express';

import config from './dev.config';

const app = express();
const compiler = webpack(config.webpack);

debug.enable('dev');

app.use(require('webpack-dev-middleware')(compiler, config.server.options));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(config.server.port, '0.0.0.0', function() {
  debug('dev')('`webpack-dev-server` listening on port %s', config.server.port);
});
