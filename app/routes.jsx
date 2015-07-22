import React from 'react';
import { Route } from 'react-router';

export default (
  <Route component={require('components/Layout')}>
    <Route
      path='/'
      component={require('components/Todo/TodoContainer')} />
    <Route
      path='/users'
      component={require('components/Users')} />
  </Route>
);
