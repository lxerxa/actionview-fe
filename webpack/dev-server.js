import debug from 'debug';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import config from './dev.config';

const compiler = webpack(config.webpack);
const devServer = new WebpackDevServer(compiler, config.server.options);

debug.enable('dev');
devServer.listen(config.server.port, '0.0.0.0', function() {
  debug('dev')('`webpack-dev-server` listening on port %s', config.server.port);
});
