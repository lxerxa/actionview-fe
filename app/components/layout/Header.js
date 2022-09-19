import React, { PropTypes, Component } from 'react';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap';
import _ from 'lodash';
import { urlWrapper } from '../share/Funcs';
import { removeToken } from '../../../shared/jwt-token';

const About = require('./AboutModal');
const Encourage = require('./EncourageModal');
const logo = require('../../assets/images/brand.png');
const no_avatar = require('../../assets/images/no_avatar.png');
const $ = require('$');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { aboutShow: false, encourageShow: false };
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
      $('#main-loading').css({ 'width': '0px', 'height': '0px', 'background': 'none', 'display': 'none' });
      $('#main-loading img').css({ 'display': 'none' });
    }
    
    if (this.props.session.user.id) {
      recents();
    }
  }

  showBar(e) {
    $('#hide-bar').hide();
    $('#tack-bar').show();
    $('.toc-container').click();
    $('.toc-container').css({ position: 'fixed' });
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
    } else if (eventKey === 'mygroup') {
      entry('/mygroup');
    } else if (eventKey === 'about') {
      this.setState({ aboutShow: true });
    } else if (eventKey === 'encourage') {
      this.setState({ encourageShow: true });
    } else if (eventKey === 'logout') {
      logout();
      removeToken();
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
      { key: 'myproject', name: '项目中心' }, 
      { key: 'summary', name: '概览' }, 
      { key: 'issue', name: '问题' }, 
      { key: 'activity', name: '活动' },
      { key: 'kanban', name: '看板' },
      { key: 'gantt', name: '甘特图' },
      { key: 'module', name: '模块' },
      { key: 'version', name: '版本' },
      { key: 'report', name: '统计' },
      { key: 'document', name: '文件' },
      { key: 'wiki', name: 'Wiki' },
      { key: 'team', name: '项目成员' },
      { key: 'config', name: '配置概要' },
      { key: 'type', name: '问题类型' },
      { key: 'workflow', name: '工作流' },
      { key: 'field', name: '字段' },
      { key: 'screen', name: '界面' },
      { key: 'resolution', name: '解决结果' },
      { key: 'priority', name: '优先级' },
      { key: 'state', name: '状态' },
      { key: 'role', name: '角色权限' },
      { key: 'events', name: '通知事件' },
      { key: 'options', name: '选项' },
      { key: 'labels', name: '标签管理' },
      { key: 'reminds', name: '提醒' },
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
    const patten14 = new RegExp('^/mygroup$');

    let modulename = '';
    if (patten0.exec(pathname)) {
      modulename = '项目中心';
    } else if (patten1.exec(pathname)) {
      modulename = (curProject.key ? curProject.key + ' - ' : '') + '概览';
    } else if (patten3.exec(pathname)) {
      modulename = (curProject.key ? curProject.key + ' - ' : '') + '工作流配置';
    } else if (patten2.exec(pathname)) {
      const moduleKey = RegExp.$2;
      const module = _.find(Modules, { key: moduleKey }); 
      if (module) {
        modulename = (curProject.key ? curProject.key + ' - ' : '') + module.name;
      } else {
        modulename = (curProject.key ? curProject.key + ' - ' : '') + '其他';
      }
    } else if (patten6.exec(pathname)) {
      const moduleKey = RegExp.$1;
      const module = _.find(Modules, { key: moduleKey });
      if (module) {
        modulename = '全局方案配置 - ' + module.name;
      } else {
        modulename = '其他';
      }
    } else if (patten7.exec(pathname)) {
      modulename = '方案配置 - 工作流配置';
    } else if (patten4.exec(pathname)) {
      modulename = '项目列表';
    } else if (patten5.exec(pathname)) {
      modulename = '用户管理';
    } else if (patten10.exec(pathname)) {
      modulename = '用户组管理';
    } else if (patten11.exec(pathname)) {
      modulename = '用户目录';
    } else if (patten8.exec(pathname)) {
      modulename = '系统设置';
    } else if (patten9.exec(pathname)) {
      modulename = '个人设置';
    } else if (patten12.exec(pathname)) {
      modulename = '日志';
    } else if (patten13.exec(pathname)) {
      modulename = '日历管理';
    } else if (patten14.exec(pathname)) {
      modulename = '我的群组';
    } else {
      modulename = '其他';
    }

    const headerUser = { paddingTop: '4px', color: '#5f5f5f', textDecoration: 'blink', fontSize: '16px' }; 
    const avatar = (<img className='default-avatar' src={ session.user && session.user.avatar ? urlWrapper('/getavatar?fid=' + session.user.avatar) : no_avatar }/>);
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
            { session.user && session.user.email && session.user.email !== 'admin@action.view' && <MenuItem divider /> }
            { session.user && session.user.email && session.user.email !== 'admin@action.view' && <MenuItem eventKey='mygroup'>我的群组</MenuItem> }
            <MenuItem divider />
            <MenuItem eventKey='about'>关于</MenuItem>
            <MenuItem eventKey='encourage'>鼓励一下</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='setting'>个人设置</MenuItem>
            <MenuItem eventKey='logout'>退出</MenuItem>
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
            <MenuItem eventKey='scheme'>方案配置</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='user'>用户</MenuItem>
            <MenuItem eventKey='group'>用户组</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='project'>项目管理</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='logs'>日志</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey='setting'>系统设置</MenuItem>
          </DropdownButton>
        </span> }
        { session.user && session.user.email && session.user.email !== 'admin@action.view' &&
        <span style={ { float: 'right' } }>
          <DropdownButton 
            pullRight 
            bsStyle='link' 
            title='项目' 
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
              <span>项目中心</span>
            </MenuItem>
          </DropdownButton>
        </span> }
        { this.state.aboutShow &&
          <About
            show
            close={ () => { this.setState({ aboutShow: false }) } }/> }
        { this.state.encourageShow &&
          <Encourage
            show
            close={ () => { this.setState({ encourageShow: false }) } }/> }
      </div>
    );
  }
}
