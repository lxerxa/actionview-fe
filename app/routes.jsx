import React from 'react';
import { Route } from 'react-router';

import { generateRoute } from 'utils/localized-routes';

export default (
  <Route component={ require('components/Layout') }>
    { generateRoute({
      paths: [ '/', '/users', '/utilisateurs' ],
      component: require('components/Users')
    }) }
    { generateRoute({
      paths: [ '/users/:seed', '/utilisateurs/:seed' ],
      component: require('components/Profile')
    }) }
    { generateRoute({
      paths: [ '/readme', '/lisez-moi' ],
      component: require('components/Readme')
    }) }
  </Route>
);
