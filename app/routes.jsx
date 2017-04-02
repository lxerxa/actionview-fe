import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './components/Layout';
import Cover from './components/Cover';
import Login from './components/Login';
import Home from './components/Home';
import Project from './components/Project';
import Profile from './components/Profile';
import ProjectList from './components/ProjectList';

const IssueContainer = require('./components/issue/Container');
const ModuleContainer = require('./components/module/Container');
const VersionContainer = require('./components/version/Container');
const TypeContainer = require('./components/type/Container');
const FieldContainer = require('./components/field/Container');
const ScreenContainer = require('./components/screen/Container');
const WorkflowContainer = require('./components/workflow/Container');
const WorkflowConfigContainer = require('./components/workflow/ConfigContainer');
const StateContainer = require('./components/state/Container');
const ResolutionContainer = require('./components/resolution/Container');
const PriorityContainer = require('./components/priority/Container');
const RoleContainer = require('./components/role/Container');
const EventsContainer = require('./components/events/Container');
const ActivityContainer = require('./components/activity/Container');
const MyprojectContainer = require('./components/myproject/Container');

export default (
  <Route path='/' component={ Layout }>
    <IndexRoute component={ Cover }/>
    <Route path='/login' component={ Login }/>
    <Route path='/home' component={ Home }>
      <IndexRoute component={ ProjectList }/>
      <Route path='/myproject' component={ MyprojectContainer }/>
      <Route path='/project/:key' component={ Project }>
        <IndexRoute component={ Profile }/>
        <Route path='profile' component={ Profile }/>
        <Route path='issue' component={ IssueContainer }/>
        <Route path='activity' component={ ActivityContainer }/>
        <Route path='module' component={ ModuleContainer }/>
        <Route path='version' component={ VersionContainer }/>
        <Route path='type' component={ TypeContainer }/>
        <Route path='field' component={ FieldContainer }/>
        <Route path='screen' component={ ScreenContainer }/>
        <Route path='workflow' component={ WorkflowContainer }/>
        <Route path='workflow/:id' component={ WorkflowConfigContainer }/>
        <Route path='state' component={ StateContainer }/>
        <Route path='resolution' component={ ResolutionContainer }/>
        <Route path='priority' component={ PriorityContainer }/>
        <Route path='role' component={ RoleContainer }/>
        <Route path='events' component={ EventsContainer }/>
        <Route path='activity' component={ ActivityContainer }/>
      </Route>
    </Route>
  </Route>
);
