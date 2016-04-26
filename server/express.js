import serialize from 'serialize-javascript';
import path from 'path';
import debug from 'debug';
import express from 'express';
import helmet from 'helmet';

import createLocation from 'history/lib/createLocation';

import ApiClient from '../shared/api-client';
import universalRender from '../shared/universal-render';

import createStore from 'redux/create';

const { NODE_ENV = 'development', PORT = 3000 } = process.env;
const server = express();

if (NODE_ENV !== 'production') {
  debug.enable('dev,server');
} else {
  debug.enable('server');
}

// expressjs middlewares
server.use(require('response-time')());
server.use(require('morgan')('tiny'));

// helmet middlewares / security
server.use(helmet.xframe());
server.use(helmet.xssFilter());
server.use(helmet.nosniff());
server.use(helmet.ienoopen());
server.disable('x-powered-by');

// enable body parser
server.use(require('body-parser').json());

// Should be placed before express.static
server.use(require('compression')({
  // only compress files for the following content types
  filter: function(req, res) {
    return (/json|text|javascript|css/)
      .test(res.getHeader('Content-Type'));
  },
  // zlib option for compression level
  level: 3
}));

// serve favicon
server.use(require('serve-favicon')(path.resolve(__dirname, '../app/images/favicon.ico')));

server.use('/assets', express.static(path.resolve(__dirname, '../dist')));
server.set('views', path.resolve(__dirname, 'views'));
server.set('view engine', 'ejs');

// Run requests through api router first
const apiRouter = express.Router(); /* eslint new-cap:0 */
require('./api/routes')(apiRouter);
server.use('/api', apiRouter);

// Run requests through react-router next
server.use(async function(req, res) {
  try {
    // Initialize Redux
    const client = new ApiClient(req);
    const location = createLocation(req.path, req.query);
    const store = createStore(client, {});
    const locale = req.acceptsLanguages(['en', 'fr']) || 'en';

    //const { body, state } = await universalRender({ location, store, client, locale });
    const body = '', state = serialize({});

    // Load assets paths from `webpack-stats`
    // remove cache on dev env
    const assets = require('./webpack-stats.json');
    if (NODE_ENV === 'development') {
      delete require.cache[require.resolve('./webpack-stats.json')];
    }

    return res.render('index.ejs', { assets, body, state });
  } catch (error) {
    debug('server')('error with rendering');
    debug('server')(error);

    return res.status(500).send(error.stack);
  }
});

server.listen(PORT);
debug('server')('express server listening on %s', PORT);

if (process.send) process.send('online');
