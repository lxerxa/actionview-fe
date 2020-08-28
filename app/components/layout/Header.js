import React, { PropTypes, Component } from 'react';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap';
import _ from 'lodash';

const About = require('./AboutModal');
const logo = require('../../assets/images/brand.png');
const no_avatar = require('../../assets/images/no_avatar.png');
const $ = require('$');

const { API_BASENAME } = process.env;

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { aboutShow: false };
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    getSess: PropTypes.func.isRequired,
    recents: PropTypes.func.isRequired,
    entry: PropTypes.func.isRequired,
    cleanSelectedProject: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    pathname: PropTypes.string
  }

  async componentWillMount() {
    const { recents, session, getSess } = this.props;
    if (!session.user.id) {
      await getSess();
    }
    
    if (this.props.session.user.id) {
      recents();
    }
  }

  showBar(e) {
    $('#hide-bar').hide();
    $('#tack-bar').show();
    $('.toc-container').click();
    $('.toc-container').css({ position: 'fixed', boxShadow: '0 0 .5rem #9da5ab' });
    $('.toc-container').animate({ left: '0px' });
    e.nativeEvent.stopImmediatePropagation();
  }

  operateSelect(eventKey) {
    const { entry } = this.props;
    if (eventKey === 'myproject') {
      entry('/myproject');
    } else {
      entry('/project/' + eventKey);
    }
  }

  userOperateSelect(eventKey) {
    const { entry, logout } = this.props;

    if (eventKey === 'setting') {
      entry('/mysetting');
    } else if (eventKey === 'about') {
      this.setState({ aboutShow: true });
    } else if (eventKey === 'logout') {
      logout();
    }
  }

  sysOperateSelect(eventKey) {
    const { entry, cleanSelectedProject } = this.props;
    //cleanSelectedProject();

    if (eventKey === 'project') {
      entry('/admin/project');
    } else if (eventKey === 'user') {
      entry('/admin/user');
    } else if (eventKey === 'group') {
      entry('/admin/group');
    } else if (eventKey === 'scheme') {
      entry('/admin/scheme/type');
    } else if (eventKey === 'setting') {
      entry('/admin/syssetting');
    } else if (eventKey === 'logs') {
      entry('/admin/logs');
    }
  }

  githubSelect(eventKey) {
    if (eventKey === 'frontend') {
      window.open('https://github.com/lxerxa/actionview-fe', '_blank');
    } else if (eventKey === 'backend') {
      window.open('https://github.com/lxerxa/actionview', '_blank');
    }
  }

  render() {
    const { pathname, project, session } = this.props;

    let curProject = {};
    let recentProjects = project.recents;
    if (/^\/project/.test(pathname)) {
      curProject = project.item;
    }

    const Modules = [
      { key: 'myproject', name: 'Project center' },
      { key: 'summary', name: 'Summary' },
      { key: 'issue', name: 'Issue' }, 
      { key: 'activity', name: 'Activity' },
      { key: 'kanban', name: 'Kanban' },
      { key: 'gantt', name: 'Gantt' },
      { key: 'module', name: 'Module' },
      { key: 'version', name: 'Version' },
      { key: 'report', name: 'Report' },
      { key: 'document', name: 'Document' },
      { key: 'wiki', name: 'Wiki' },
      { key: 'team', name: '项目成员' },
      { key: 'config', name: '配置概要' },
      { key: 'type', name: 'Type' },
      { key: 'workflow', name: 'Workflow' },
      { key: 'field', name: 'Field' },
      { key: 'screen', name: 'Screen' },
      { key: 'resolution', name: 'Resolution' },
      { key: 'priority', name: 'Priority' },
      { key: 'state', name: 'Status' },
      { key: 'role', name: 'Role' },
      { key: 'events', name: 'Events' },
      { key: 'options', name: '选项' },
      { key: 'labels', name: '标签管理' },
      { key: 'integrations', name: '外部用户' },
      { key: 'webhooks', name: 'Webhooks' }
    ];

    const patten0 = new RegExp('^/myproject$');
    const patten1 = new RegExp('^/project/(\\w+)$');
    const patten2 = new RegExp('^/project/(\\w+)/(\\w+)(/\\w+)*$');
    const patten3 = new RegExp('^/project/(\\w+)/workflow/(\\w+)$');
    const patten4 = new RegExp('^/admin/project$');
    const patten5 = new RegExp('^/admin/user$');
    const patten6 = new RegExp('^/admin/scheme/(\\w+)$');
    const patten7 = new RegExp('^/admin/scheme/workflow/(\\w+)$');
    const patten8 = new RegExp('^/admin/syssetting$');
    const patten9 = new RegExp('^/mysetting$');
    const patten10 = new RegExp('^/admin/group$');
    const patten11 = new RegExp('^/admin/directory$');
    const patten12 = new RegExp('^/admin/logs$');
    const patten13 = new RegExp('^/admin/calendar$');

    let modulename = '';
    if (patten0.exec(pathname)) {
      modulename = 'Project center';
    } else if (patten1.exec(pathname)) {
      modulename = (curProject.key ? curProject.key + ' - ' : '') + 'Summary';
    } else if (patten3.exec(pathname)) {
      modulename = (curProject.key ? curProject.key + ' - ' : '') + '工作流配置';
    } else if (patten2.exec(pathname)) {
      const moduleKey = RegExp.$2;
      const module = _.find(Modules, { key: moduleKey }); 
      if (module) {
        modulename = (curProject.key ? curProject.key + ' - ' : '') + module.name;
      } else {
        modulename = (curProject.key ? curProject.key + ' - ' : '') + 'Other';
      }
    } else if (patten6.exec(pathname)) {
      const moduleKey = RegExp.$1;
      const module = _.find(Modules, { key: moduleKey });
      if (module) {
        modulename = 'Global scheme configuration - ' + module.name;
      } else {
        modulename = 'Other';
      }
    } else if (patten7.exec(pathname)) {
      modulename = 'Project configuration - 工作流配置';
    } else if (patten4.exec(pathname)) {
      modulename = 'Project list';
    } else if (patten5.exec(pathname)) {
      modulename = 'User management';
    } else if (patten10.exec(pathname)) {
      modulename = '用户组管理';
    } else if (patten11.exec(pathname)) {
      modulename = 'Directory';
    } else if (patten8.exec(pathname)) {
      modulename = '系统设置';
    } else if (patten9.exec(pathname)) {
      modulename = '个人设置';
    } else if (patten12.exec(pathname)) {
      modulename = 'Log';
    } else if (patten13.exec(pathname)) {
      modulename = 'Calendar';
    } else {
      modulename = 'Other';
    }

    const headerUser = { paddingTop: '4px', color: '#5f5f5f', textDecoration: 'blink', fontSize: '16px' }; 
    const avatar = (<img className='no-avatar' src={ session.user && session.user.avatar ? API_BASENAME + '/getavatar?fid=' + session.user.avatar : no_avatar }/>);
    const sysTitle = (<span><i className='fa fa-cog'></i></span>);

    return (
      <div className='head'>
        <span className='show-bar-icon' style={ { display: 'none' } } onClick={ (e) => { this.showBar(e); } } id='show-bar'><i className='fa fa-bars'></i></span>
        <span style={ { color: '#5f5f5f' } }>{ modulename }</span>
        <span className='toc-logo'><img src={ logo } width={ 120 }/></span>
        <span style={ { float: 'right', marginRight: '10px' } }>
          <DropdownButton 
            pullRight 
            bsStyle='link' 
            title={ avatar } 
            id='basic-nav-dropdown' 
            style={ headerUser } 
            onSelect={ this.userOperateSelect.bind(this) }>
            <MenuItem disabled>{ session.user.first_name || '' }</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='about'>on</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='setting'>Personal settings</MenuItem>
            <MenuItem eventKey='logout'>Quit</MenuItem>
          </DropdownButton>
        </span>
        { session.user && session.user.permissions && session.user.permissions.sys_admin &&
        <span style={ { float: 'right' } }>
          <DropdownButton 
            pullRight 
            bsStyle='link' 
            title={ sysTitle } 
            id='basic-nav-dropdown'  
            style={ headerUser }  
            onSelect={ this.sysOperateSelect.bind(this) }>
            <MenuItem eventKey='scheme'>Solution configuration</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='user'>User</MenuItem>
            <MenuItem eventKey='group'>User group</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='project'>Project management</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='logs'>Log</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='setting'>Settings</MenuItem>
          </DropdownButton>
        </span> }
        { session.user && session.user.email && session.user.email !== 'admin@action.view' &&
        <span style={ { float: 'right' } }>
          <DropdownButton 
            pullRight 
            bsStyle='link' 
            title='Project'
            id='basic-nav-dropdown-project' 
            style={ headerUser } 
            onSelect={ this.operateSelect.bind(this) }>
            { _.map(recentProjects, (v, i) => 
              <MenuItem key={ i } eventKey={ v.key }>
                { !_.isEmpty(curProject) &&
                <div style={ { display: 'inline-block', width: '20px', textAlign: 'left' } }>
                  { curProject.key === v.key && <span><i className='fa fa-check'></i></span> }
                </div> }
                <span>{ v.name }</span>
              </MenuItem> ) }
            { recentProjects.length > 0 && <MenuItem divider /> }
            <MenuItem eventKey='myproject'>
              { !_.isEmpty(curProject) && 
              <div style={ { display: 'inline-block', width: '20px' } }/> }
              <span>Project center</span>
            </MenuItem>
          </DropdownButton>
        </span> }
        {/* <span style={ { paddingTop: '5px', float: 'right' } }>
          <iframe 
            src='https://ghbtns.com/github-btn.html?user=lxerxa&repo=actionview&type=star&count=true' 
            frameBorder='0' 
            scrolling='0' 
            width='100px' 
            height='20px'>
          </iframe>
        </span> */}
        { this.state.aboutShow &&
        <About
          show
          close={ () => { this.setState({ aboutShow: false }) } }/>
        }
      </div>
    );
  }
}
