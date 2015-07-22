import express from 'express';

import React from 'react';
import Router from 'react-router';
import Location from 'react-router/lib/Location';
import { Provider } from 'react-redux';

import routes from '../app/routes';
import apiClient from '../app/redux/api-client';
import createStore from '../app/redux/create';

const server = express();

server.use(function(req, res) {
  const location = new Location(req.path, req.query);
  Router.run(routes, location, function(error, initialState) {
    if (error) return res.status(500).send(error);

    const store = createStore(apiClient, {});
    const element = (
      <Provider store={store}>
        {() => (
          <Router
            location={location}
            {...initialState} />
        )}
      </Provider>
    );
    const body = React.renderToString(element);

    res.status(200).end(body);
  });
});

server.listen(3000);
