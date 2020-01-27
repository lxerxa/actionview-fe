import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './components/layout/Home';
import Error from './components/layout/Error';
import Login from './components/login/Login';
import Forgot from './components/login/Forgot';
import ResetPwd from './components/login/ResetPwd';
import Register from './components/login/Register';
import Project from './components/project/Project';
import Scheme from './components/scheme/Scheme';

const suffix = ' - ActionView';

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
const GanttContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/gantt/Container'))
  }, 'gantt')
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
const ReportContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/report/Container'))
  }, 'report')
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
const DirectoryContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/directory/Container'))
  }, 'directory')
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

const DocumentContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/document/Container'))
  }, 'document')
};

const WikiContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/wiki/Container'))
  }, 'wiki')
};

const IntegrationsContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/integrations/Container'))
  }, 'wiki')
};

const WebhooksContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/webhooks/Container'))
  }, 'webhooks')
};

const LogsContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/logs/Container'))
  }, 'logs')
};

const CalendarContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/calendar/Container'))
  }, 'calendar')
};

export default (
  <Route path='/' component={ Layout }>
    <IndexRoute component={ Login }/>
    <Route 
      onEnter={ ()=> { document.title = '登录' + suffix; } } 
      path='/login' component={ Login }/>
    <Route 
      path='/forgot' 
      onEnter={ ()=> { document.title = '找回密码' + suffix; } } 
      component={ Forgot }/>
    <Route 
      path='/resetpwd' 
      onEnter={ ()=> { document.title = '重置密码' + suffix; } } 
      component={ ResetPwd }/>
    <Route 
      path='/register' 
      component={ Register }/>
    <Route path='/home' component={ Home }>
      <Route 
        path='/myproject' 
        onEnter={ ()=> { document.title = '项目中心' + suffix; } } 
        getComponent={ ProjectContainer }/>
      <Route 
        path='/mysetting' 
        onEnter={ ()=> { document.title = '个人设置' + suffix; } } 
        getComponent={ MysettingContainer }/>
      <Route 
        path='/project/:key' 
        component={ Project }>
        <IndexRoute getComponent={ SummaryContainer }/>
        <Route path='summary' getComponent={ SummaryContainer }/>
        <Route path='issue' getComponent={ IssueContainer }/>
        <Route path='activity' getComponent={ ActivityContainer }/>
        <Route path='module' getComponent={ ModuleContainer }/>
        <Route path='version' getComponent={ VersionContainer }/>
        <Route path='report(/:mode)' getComponent={ ReportContainer }/>
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
        <Route path='gantt' getComponent={ GanttContainer }/>
        <Route path='document(/:id)' getComponent={ DocumentContainer }/>
        <Route path='wiki(/:dir)(/:wid)(/:mode)' getComponent={ WikiContainer }/>
        <Route path='integrations' getComponent={ IntegrationsContainer }/>
        <Route path='webhooks' getComponent={ WebhooksContainer }/>
      </Route>
      <Route 
        path='/admin/project' 
        onEnter={ ()=> { document.title = '项目列表' + suffix; } } 
        getComponent={ ProjectContainer }/>
      <Route 
        path='/admin/user' 
        onEnter={ ()=> { document.title = '用户' + suffix; } } 
        getComponent={ UserContainer }/>
      <Route 
        path='/admin/group' 
        onEnter={ ()=> { document.title = '用户组' + suffix; } } 
        getComponent={ GroupContainer }/>
      <Route 
        path='/admin/directory' 
        onEnter={ ()=> { document.title = '用户目录' + suffix; } } 
        getComponent={ DirectoryContainer }/>
      <Route 
        path='/admin/syssetting' 
        onEnter={ ()=> { document.title = '系统设置' + suffix; } } 
        getComponent={ SyssettingContainer }/>
      <Route 
        path='/admin/logs' 
        onEnter={ ()=> { document.title = '日志' + suffix; } } 
        getComponent={ LogsContainer }/>
      <Route
        path='/admin/calendar'
        onEnter={ ()=> { document.title = '日历管理' + suffix; } }
        getComponent={ CalendarContainer }/>
      <Route 
        path='/admin/scheme' 
        component={ Scheme }>
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
