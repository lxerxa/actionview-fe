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

//const SummaryContainer = require('./components/summary/Container');
const SummaryContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/summary/Container'))
  }, 'summary')
};
//const IssueContainer = require('./components/issue/Container');
const IssueContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/issue/Container'))
  }, 'issue')
};
//const KanbanContainer = require('./components/kanban/Container');
const KanbanContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/kanban/Container'))
  }, 'kanban')
};
//const ModuleContainer = require('./components/module/Container');
const ModuleContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/module/Container'))
  }, 'module')
};
//const VersionContainer = require('./components/version/Container');
const VersionContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/version/Container'))
  }, 'version')
};
//const TeamContainer = require('./components/team/Container');
const TeamContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/team/Container'))
  }, 'team')
};
//const ConfigContainer = require('./components/config/Container');
const ConfigContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/config/Container'))
  }, 'config')
};
//const TypeContainer = require('./components/type/Container');
const TypeContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/type/Container'))
  }, 'type')
};
//const FieldContainer = require('./components/field/Container');
const FieldContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/field/Container'))
  }, 'field')
};
//const ScreenContainer = require('./components/screen/Container');
const ScreenContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/screen/Container'))
  }, 'screen')
};
//const WorkflowContainer = require('./components/workflow/Container');
const WorkflowContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/workflow/Container'))
  }, 'workflow')
};
//const WorkflowConfigContainer = require('./components/workflow/ConfigContainer');
const WorkflowConfigContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/workflow/ConfigContainer'))
  }, 'wfconfig')
};
//const StateContainer = require('./components/state/Container');
const StateContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/state/Container'))
  }, 'state')
};
//const ResolutionContainer = require('./components/resolution/Container');
const ResolutionContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/resolution/Container'))
  }, 'resolution')
};
//const PriorityContainer = require('./components/priority/Container');
const PriorityContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/priority/Container'))
  }, 'priority')
};
//const RoleContainer = require('./components/role/Container');
const RoleContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/role/Container'))
  }, 'role')
};
//const EventsContainer = require('./components/events/Container');
const EventsContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/events/Container'))
  }, 'events')
};
//const ActivityContainer = require('./components/activity/Container');
const ActivityContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/activity/Container'))
  }, 'activity')
};
//const ProjectContainer = require('./components/project/Container');
const ProjectContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/project/Container'))
  }, 'project')
};
//const UserContainer = require('./components/user/Container');
const UserContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/user/Container'))
  }, 'user')
};
//const GroupContainer = require('./components/group/Container');
const GroupContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/group/Container'))
  }, 'group')
};
//const MysettingContainer = require('./components/setting/my/Container');
const MysettingContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/setting/my/Container'))
  }, 'mysetting')
};
//const SyssettingContainer = require('./components/setting/sys/Container');
const SyssettingContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/setting/sys/Container'))
  }, 'syssetting')
};

export default (
  <Route path='/' component={ Layout }>
    <IndexRoute component={ Login }/>
    <Route path='/login' component={ Login }/>
    <Route path='/forgot' component={ Forgot }/>
    <Route path='/register' component={ Register }/>
    <Route path='/home' component={ Home }>
      <Route path='/myproject' getComponent={ ProjectContainer }/>
      <Route path='/mysetting' getComponent={ MysettingContainer }/>
      <Route path='/project/:key' component={ Project }>
        <IndexRoute getComponent={ SummaryContainer }/>
        <Route path='summary' getComponent={ SummaryContainer }/>
        <Route path='issue' getComponent={ IssueContainer }/>
        <Route path='activity' getComponent={ ActivityContainer }/>
        <Route path='module' getComponent={ ModuleContainer }/>
        <Route path='version' getComponent={ VersionContainer }/>
        <Route path='team' getComponent={ TeamContainer }/>
        <Route path='config' getComponent={ ConfigContainer }/>
        <Route path='type' getComponent={ TypeContainer }/>
        <Route path='field' getComponent={ FieldContainer }/>
        <Route path='screen' getComponent={ ScreenContainer }/>
        <Route path='workflow' getComponent={ WorkflowContainer }/>
        <Route path='workflow/:id' getComponent={ WorkflowConfigContainer }/>
        <Route path='state' getComponent={ StateContainer }/>
        <Route path='resolution' getComponent={ ResolutionContainer }/>
        <Route path='priority' getComponent={ PriorityContainer }/>
        <Route path='role' getComponent={ RoleContainer }/>
        <Route path='events' getComponent={ EventsContainer }/>
        <Route path='activity' getComponent={ ActivityContainer }/>
        <Route path='kanban(/:id)' getComponent={ KanbanContainer }/>
      </Route>
      <Route path='/admin/project' getComponent={ ProjectContainer }/>
      <Route path='/admin/user' getComponent={ UserContainer }/>
      <Route path='/admin/group' getComponent={ GroupContainer }/>
      <Route path='/admin/syssetting' getComponent={ SyssettingContainer }/>
      <Route path='/admin/scheme' component={ Scheme }>
        <IndexRoute getComponent={ TypeContainer }/>
        <Route path='type' getComponent={ TypeContainer }/>
        <Route path='field' getComponent={ FieldContainer }/>
        <Route path='screen' getComponent={ ScreenContainer }/>
        <Route path='workflow' getComponent={ WorkflowContainer }/>
        <Route path='workflow/:id' getComponent={ WorkflowConfigContainer }/>
        <Route path='state' getComponent={ StateContainer }/>
        <Route path='resolution' getComponent={ ResolutionContainer }/>
        <Route path='priority' getComponent={ PriorityContainer }/>
        <Route path='role' getComponent={ RoleContainer }/>
        <Route path='events' getComponent={ EventsContainer }/>
      </Route>
    </Route>
    <Route path='*' component={ Error }/>
  </Route>
);
