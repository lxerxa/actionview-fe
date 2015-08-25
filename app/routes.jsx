import React from 'react';
import { Route } from 'react-router';

export default (
  <Route component={ require('components/Layout') }>
    <Route path='/' component={ require('components/Users') } />
    <Route path='/users/:seed' component={ require('components/Profile') } />
    <Route path='readme' component={ require('components/Readme') } />
  </Route>
);
