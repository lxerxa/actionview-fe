import debug from 'debug';
import express from 'express';

import Location from 'react-router/lib/Location';

import client from '../app/redux/api-client';
import createStore from '../app/redux/create';
import universalRender from '../shared/universal-render';

if (process.env.NODE_ENV === 'development') {
  debug.enable('dev,server');
}

const server = express();

server.use(async function(req, res) {
  try {
    const location = new Location(req.path, req.query);
    const store = createStore(client, {});
    const body = await universalRender({location, store, client});

    return res.status(200).end(body);
  } catch (error) {
    debug('server')('error with rendering');
    debug('server')(error);

    return res.status(500).end(error);
  }
});

server.listen(3000);
