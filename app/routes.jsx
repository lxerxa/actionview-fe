import React from 'react';
import {Route} from 'react-router';

export default (
  <Route component={require('./components/Layout')}>
    <Route
      path='/'
      component={require('./components/TodoContainer')} />
  </Route>
);
