import React, { PropTypes, Component } from 'react';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap';
import _ from 'lodash';

const no_avatar = require('../assets/images/no_avatar.png');
const $ = require('$');

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    getSess: PropTypes.func.isRequired,
    recents: PropTypes.func.isRequired,
    entry: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    pathname: PropTypes.string
  }

  componentWillMount() {
    const { recents, session, getSess } = this.props;
    if (!session.user.id) {
      getSess();
    }
    recents();
  }

  showBar(e) {
    $('#hide-bar').hide();
    $('#tack-bar').show();
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
      entry('/user/setting');
    } else if (eventKey === 'logout') {
      logout();
    }
  }

  sysOperateSelect(eventKey) {
    const { entry } = this.props;

    if (eventKey === 'project') {
      entry('/project');
    } else if (eventKey === 'user') {
      entry('/user');
    } else if (eventKey === 'setting') {
      entry('/sys/setting');
    }
  }

  render() {
    const { pathname, project, session } = this.props;

    let curProject = project.item || {};
    let recentProjects = project.recents;
    if (!_.isEmpty(curProject)) {
      recentProjects = _.reject(recentProjects, { key: curProject.key });
    }

    const Modules = [
      { key: 'myproject', name: '项目中心' }, 
      { key: 'issue', name: '问题' }, 
      { key: 'activity', name: '活动' },
      { key: 'module', name: '模块' },
      { key: 'version', name: '版本' },
      { key: 'type', name: '问题类型' },
      { key: 'workflow', name: '工作流' },
      { key: 'field', name: '字段' },
      { key: 'screen', name: '界面' },
      { key: 'resolution', name: '解决结果' },
      { key: 'priority', name: '优先级' },
      { key: 'state', name: '状态' },
      { key: 'role', name: '角色权限' },
      { key: 'events', name: '通知事件' }
    ];

    const patten0 = new RegExp('^/myproject$');
    const patten1 = new RegExp('^/project/(\\w+)$');
    const patten2 = new RegExp('^/project/(\\w+)/(\\w+)$');
    const patten3 = new RegExp('^/project/(\\w+)/workflow/(\\w+)$');
    const patten4 = new RegExp('^/project$');
    const patten5 = new RegExp('^/user$');

    let modulename = '';
    if (patten0.exec(pathname)) {
      modulename = '项目中心';
    } else if (patten1.exec(pathname)) {
      modulename = '项目首页';
    } else if (patten2.exec(pathname)) {
      const moduleKey = RegExp.$2;
      const module = _.find(Modules, { key: moduleKey }); 
      if (module) {
        modulename = module.name;
      } else {
        modulename = '其他';
      }
    } else if (patten3.exec(pathname)) {
      modulename = '工作流配置';
    } else if (patten4.exec(pathname)) {
      modulename = '项目列表';
    } else if (patten5.exec(pathname)) {
      modulename = '用户管理';
    } else {
      modulename = '其他';
    }

    const headerUser = { paddingTop: '4px', color: '#5f5f5f', textDecoration: 'blink', fontSize: '16px' }; 
    const avatar = (<img className='no-avatar' src={ no_avatar }/>);
    const sysTitle = (<span><i className='fa fa-cog'></i></span>);

    return (
      <div className='head'>
        <span className='show-bar-icon' style={ { display: 'none' } } onClick={ (e) => { this.showBar(e); } } id='show-bar'><i className='fa fa-bars'></i></span>
        <span style={ { color: '#5f5f5f' } }>{ modulename }</span>
        <span style={ { float: 'right', marginRight: '10px' } }>
          <DropdownButton pullRight bsStyle='link' title={ avatar } style={ headerUser } onSelect={ this.userOperateSelect.bind(this) }>
            <MenuItem disabled>{ session.user.first_name || '' }</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='setting'>个人设置</MenuItem>
            <MenuItem eventKey='logout'>退出</MenuItem>
          </DropdownButton>
        </span>
        <span style={ { float: 'right' } }>
          <DropdownButton pullRight bsStyle='link' title={ sysTitle } id='basic-nav-dropdown' style={ headerUser } onSelect={ this.sysOperateSelect.bind(this) }>
            <MenuItem eventKey='scheme'>项目类型方案</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='user'>用户管理</MenuItem>
            <MenuItem eventKey='project'>项目管理</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='setting'>系统设置</MenuItem>
          </DropdownButton>
        </span>
        <span style={ { float: 'right' } }>
          <DropdownButton pullRight bsStyle='link' title='项目' id='basic-nav-dropdown' style={ headerUser } onSelect={ this.operateSelect.bind(this) }>
            { !_.isEmpty(curProject) && <MenuItem disabled>{ curProject.name }</MenuItem> }
            { !_.isEmpty(curProject) && <MenuItem divider /> }
            { _.map(recentProjects, (v, i) => <MenuItem key={ i } eventKey={ v.key }>{ v.name }</MenuItem> ) }
            { recentProjects.length > 0 && <MenuItem divider /> }
            <MenuItem eventKey='myproject'>项目中心</MenuItem>
          </DropdownButton>
        </span>
      </div>
    );
  }
}
