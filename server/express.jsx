import path from 'path';
import debug from 'debug';
import express from 'express';

import Location from 'react-router/lib/Location';

import client from '../app/redux/api-client';
import createStore from '../app/redux/create';
import universalRender from '../shared/universal-render';

const PORT = parseInt(process.env.PORT, 10) || 3000;
const server = express();

if (process.env.NODE_ENV === 'development') {
  debug.enable('dev,server');
}

server.use('/assets', express.static(path.resolve(__dirname, '..', 'dist')));
server.set('views', path.resolve(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use(async function(req, res) {
  try {
    const location = new Location(req.path, req.query);
    const store = createStore(client, {});
    const body = await universalRender({location, store, client});

    // Load assets paths from `webpack-stats`
    // remove cache on dev env
    const assets = require('./webpack-stats.json');
    if (process.env.NODE_ENV === 'development') {
      delete require.cache[require.resolve('./webpack-stats.json')];
    }

    return res.render('index.ejs', {body, assets});
  } catch (error) {
    debug('server')('error with rendering');
    debug('server')(error);

    return res.status(500).end(error);
  }
});

server.listen(PORT);
if (process.send) process.send('online');
