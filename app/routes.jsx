import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './components/layout/Home';
import Error from './components/layout/Error';
import Login from './components/login/Login';
import Forgot from './components/login/Forgot';
import Register from './components/login/Register';
import Project from './components/project/Project';
import Scheme from './components/scheme/Scheme';
import Profile from './components/Profile';

const IssueContainer = require('./components/issue/Container');
const ModuleContainer = require('./components/module/Container');
const VersionContainer = require('./components/version/Container');
const TeamContainer = require('./components/team/Container');
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
//const MyprojectContainer = require('./components/myproject/Container');
const ProjectContainer = require('./components/project/Container');
const UserContainer = require('./components/user/Container');
const SchemeContainer = require('./components/scheme/Container');
const MysettingContainer = require('./components/setting/my/Container');
const SyssettingContainer = require('./components/setting/sys/Container');

export default (
  <Route path='/' component={ Layout }>
    <Route path='/login' component={ Login }/>
    <Route path='/forgot' component={ Forgot }/>
    <Route path='/register' component={ Register }/>
    <Route path='/home' component={ Home }>
      <Route path='/myproject' component={ ProjectContainer }/>
      <Route path='/mysetting' component={ MysettingContainer }/>
      <Route path='/project/:key' component={ Project }>
        <IndexRoute component={ Profile }/>
        <Route path='summary' component={ Profile }/>
        <Route path='issue' component={ IssueContainer }/>
        <Route path='activity' component={ ActivityContainer }/>
        <Route path='module' component={ ModuleContainer }/>
        <Route path='version' component={ VersionContainer }/>
        <Route path='team' component={ TeamContainer }/>
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
      <Route path='/admin/project' component={ ProjectContainer }/>
      <Route path='/admin/user' component={ UserContainer }/>
      <Route path='/admin/syssetting' component={ SyssettingContainer }/>
      <Route path='/admin/scheme' component={ Scheme }>
        <IndexRoute component={ TypeContainer }/>
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
      </Route>
    </Route>
    <Route path='*' component={ Error }/>
  </Route>
);
