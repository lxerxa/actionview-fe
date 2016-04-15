import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import { generateRoute } from 'utils/localized-routes';

export default (
  <Route path='/' component={ Layout }>
    { generateRoute({
      paths: [ '/home' ],
      component: require('components/Home')
    }) }
    { generateRoute({
      paths: [ '/login' ],
      component: require('components/Login')
    }) }
    { generateRoute({
      paths: [ '/apps' ],
      component: require('components/MobileApps')
    }) }
    { generateRoute({
      paths: [ '/myproject' ],
      component: require('components/MyProject')
    }) }
  </Route>
);
