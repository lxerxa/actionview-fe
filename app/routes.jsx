import React from 'react';
import { Route } from 'react-router';

import { generateRoute } from 'utils/localized-routes';

export default (
  <Route component={ require('components/Layout') }>
    { generateRoute({
      paths: [ '/', '/login' ],
      component: require('components/Login')
    }) }
  </Route>
);
