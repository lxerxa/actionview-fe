import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './components/Layout';
import Login from './components/Login';
import Home from './components/Home';
import Project from './components/Project';
import Profile from './components/Profile';
import ProjectList from './components/ProjectList';
import TypeList from './components/TypeList';
import IssueList from './components/IssueList';

export default (
  <Route path='/' component={ Layout }>
    <Route path='/login' component={ Login }/>
    <Route path='/home' component={ Home }>
      <IndexRoute component={ ProjectList }/>
      <Route path='/project/:key' component={ Project }>
        <IndexRoute component={ Profile }/>
        <Route path='/project/:key/profile' component={ Profile }/>
        <Route path='/project/:key/type' component={ TypeList }/>
        <Route path='/project/:key/issue' component={ IssueList }/>
      </Route>
    </Route>
  </Route>
);
