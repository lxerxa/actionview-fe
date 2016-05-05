import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './components/Layout';
import Login from './components/Login';
import Home from './components/Home';
import ProjectList from './components/ProjectList';

export default (
  <Route path='/' component={ Layout }>
    <Route path='/login' component={ Login }/>
    <Route path='/home' component={ Home }>
      <IndexRoute component={ ProjectList }/>
    </Route>
  </Route>
);
