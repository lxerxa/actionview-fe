import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Label } from 'react-bootstrap';
import _ from 'lodash';

const $ = require('$');

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      projectPanelShow: false,
      projectSummaryShow: false, 
      projectConfigShow: false, 
      projectSettingsShow: false, 
      adminPanelShow: false,
      adminSchemeShow: false, 
      adminUserManageShow: false, 
      adminProjectManageShow: false, 
      adminSysSettingsShow: false, 
      adminAccessLogsShow: false, 
      tackFlag: true };
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    resize: PropTypes.func.isRequired,
    isHide: PropTypes.bool.isRequired,
    pathname: PropTypes.string
  }

  componentDidMount() {
    const self = this;
    $('.toc-container').unbind('click').bind('click', function(e) {
      if ([ 'I', 'H4', 'SPAN', 'A' ].indexOf(e.target.nodeName) === -1) {
        e.stopPropagation();
      }
    });

    const storage = window.localStorage;
    if (storage && storage.getItem('sideBarHide') === '1') {
      this.hideBar();
    } else {
      this.tackBar();
    }

    $(document).unbind('click').bind('click', function(e) {
      if (e.target.parentElement == document.getElementById('hide-bar') || e.target.parentElement == document.getElementById('tack-bar')) {
        return;
      }
      if (self.props.isHide) {
        $('.toc-container').animate({ left: '-20%' });
      }
    });
  }

  hideBar() {
    let detailLeftFloat = false;
    if ($('.animate-dialog').length > 0 && $('.animate-dialog').offset().left - $('.doc-container').offset().left < 1) {
      detailLeftFloat = true;
    }

    //box-shadow: 0 0 .5rem #9da5ab;
    $('.toc-container').animate({ left: '-20%' });
    $('.toc-container').css({ position: 'fixed' });
    $('.head').css({ paddingLeft: '15px' });
    $('.toc-logo').css({ left: '45%' });
    $('#show-bar').show();
    detailLeftFloat && $('.animate-dialog').css('left', $('.doc-container').offset().left);

    this.props.resize({ containerWidth: $('.doc-main').get(0).clientWidth, sidebarHide: true });

    const storage = window.localStorage;
    if (storage) {
      storage.setItem('sideBarHide', '1');
    }
  }

  tackBar() {
    let detailLeftFloat = false;
    if ($('.animate-dialog').length > 0 && $('.animate-dialog').offset().left - $('.doc-container').offset().left < 1) {
      detailLeftFloat = true;
    }
    $('.head').css({ paddingLeft: '19%' });
    $('.toc-logo').css({ left: '54%' });
    $('.toc-container').css({ position: 'relative' });
    $('#show-bar').hide();
    $('#tack-bar').hide();
    $('#hide-bar').show();
    detailLeftFloat && $('.animate-dialog').css('left', $('.doc-container').offset().left);

    this.props.resize({ containerWidth: $('.doc-main').get(0).clientWidth * 0.8, sidebarHide: false });

    const storage = window.localStorage;
    if (storage) {
      storage.setItem('sideBarHide', '0');
    }
  }

  toggleShow(item) {
    return (e) => {
      this.setState({ [`${item}Show`]: !this.state[`${item}Show`] });
      e.nativeEvent.stopImmediatePropagation();
    };
  }

  componentDidUpdate() {
    const { pathname } = this.props;
    if (/^\/project\/(\w+)(\/summary)?$/.test(pathname)) {
      $('#summary').addClass('menu-active');
    } else {
      $('#summary').removeClass('menu-active');
    }
    if (/^\/project\/(\w+)\/kanban(\/\w+)?$/.test(pathname)) {
      $('#kanban').addClass('menu-active');
    } else {
      $('#kanban').removeClass('menu-active');
    }
    if (/^\/project\/(\w+)\/gantt(\/\w+)?$/.test(pathname)) {
      $('#gantt').addClass('menu-active');
    } else {
      $('#gantt').removeClass('menu-active');
    }
    if (/^\/project\/(\w+)\/workflow(\/\w+)?$/.test(pathname)) {
      $('#workflow').addClass('menu-active');
    } else {
      $('#workflow').removeClass('menu-active');
    }
    if (/^\/admin\/scheme\/workflow(\/\w+)?$/.test(pathname)) {
      $('#admin-workflow').addClass('menu-active');
    } else {
      $('#admin-workflow').removeClass('menu-active');
    }
    if (/^\/project\/(\w+)\/report(\/\w+)?$/.test(pathname)) {
      $('#report').addClass('menu-active');
    } else {
      $('#report').removeClass('menu-active');
    }
    if (/^\/project\/(\w+)\/document(\/\w+)?$/.test(pathname)) {
      $('#document').addClass('menu-active');
    } else {
      $('#document').removeClass('menu-active');
    }
    if (/^\/project\/(\w+)\/wiki(\/\w+)*$/.test(pathname)) {
      $('#wiki').addClass('menu-active');
    } else {
      $('#wiki').removeClass('menu-active');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (/^\/project\/(\w+)(\/(summary|issue|kanban|activity|version|module|team|document|wiki|report|gantt)(\/\w+)*)?$/.test(nextProps.pathname)) {
      this.state.adminPanelShow = false;
      this.state.projectPanelShow = true;
      this.state.projectSummaryShow = true;
    } else if (/^\/project\/(\w+)\/(config|type|workflow|field|screen|priority|state|resolution|role|events)(\/\w+)?$/.test(nextProps.pathname)){
      this.state.adminPanelShow = false;
      this.state.projectPanelShow = true;
      this.state.projectConfigShow = true;
    } else if (/^\/project\/(\w+)\/(webhooks|integrations|labels|reminds)(\/\w+)?$/.test(nextProps.pathname)){
      this.state.adminPanelShow = false;
      this.state.projectPanelShow = true;
      this.state.projectSettingsShow = true;
    } else if (/^\/admin\/scheme/.test(nextProps.pathname)) {
      this.state.adminPanelShow = true;
      this.state.projectPanelShow = false;
      this.state.adminSchemeShow = true;
    } else if (/^\/admin\/(user|group|directory)$/.test(nextProps.pathname)) {
      this.state.adminPanelShow = true;
      this.state.projectPanelShow = false;
      this.state.adminUserManageShow = true;
    } else if (/^\/admin\/project$/.test(nextProps.pathname)) {
      this.state.adminPanelShow = true;
      this.state.projectPanelShow = false;
      this.state.adminProjectManageShow = true;
    } else if (/^\/admin\/(syssetting|calendar)$/.test(nextProps.pathname)) {
      this.state.adminPanelShow = true;
      this.state.projectPanelShow = false;
      this.state.adminSysSettingsShow = true;
    } else if (/^\/admin\/logs$/.test(nextProps.pathname)) {
      this.state.adminPanelShow = true;
      this.state.projectPanelShow = false;
      this.state.adminAccessLogsShow = true;
    }
  }

  render() {
    const { project, session } = this.props;
    const toggleShow = this.toggleShow.bind(this);

    if (this.state.adminPanelShow) {
      return (
      <div className='toc-container'>
        <div className='react-menu-container'>
          <div className='toc-container-header'>
            <span className='span-bar-icon' onClick={ this.hideBar.bind(this) }><i className='fa fa-bars'></i></span>
            <span className='span-angle-double' id='hide-bar' onClick={ this.hideBar.bind(this)  }><i className='fa fa-thumb-tack fa-rotate-90'></i></span>
            <span className='span-tack-bar' style={ { display: 'none' } } id='tack-bar' onClick={ this.tackBar.bind(this) }><i className='fa fa-thumb-tack'></i></span>
          </div>
          { session.user.permissions && session.user.permissions.sys_admin &&
          <div className='toc-container-body'>
            <h4 style={ { overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'default' } }>管理员管理面板</h4>
            <h4 onClick={ toggleShow('adminScheme') }><i className={ this.state.adminSchemeShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } />全局方案配置</h4>
            <ul className={ !this.state.adminSchemeShow && 'hide' }>
              <li><Link to='/admin/scheme/type' activeClassName='menu-active'>问题类型</Link></li>
              <li><Link to='/admin/scheme/state' activeClassName='menu-active'>状态</Link></li>
              <li><Link to='/admin/scheme/workflow' activeClassName='menu-active' id='admin-workflow'>工作流</Link></li>
              <li><Link to='/admin/scheme/field' activeClassName='menu-active'>字段</Link></li>
              <li><Link to='/admin/scheme/screen' activeClassName='menu-active'>界面</Link></li>
              <li><Link to='/admin/scheme/priority' activeClassName='menu-active'>优先级</Link></li>
              <li><Link to='/admin/scheme/resolution' activeClassName='menu-active'>解决结果</Link></li>
              <li><Link to='/admin/scheme/role' activeClassName='menu-active'>角色权限</Link></li>
              <li><Link to='/admin/scheme/events' activeClassName='menu-active'>通知事件</Link></li>
            </ul>
            <h4 onClick={ toggleShow('adminUserManage') }><i className={ this.state.adminUserManageShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } />用户管理</h4>
            <ul className={ !this.state.adminUserManageShow && 'hide' }>
              <li><Link to='/admin/user' activeClassName='menu-active'>用户</Link></li>
              <li><Link to='/admin/group' activeClassName='menu-active'>用户组</Link></li>
              <li><Link to='/admin/directory' activeClassName='menu-active'>用户目录</Link></li>
            </ul>
            <h4 onClick={ toggleShow('adminProjectManage') }><i className={ this.state.adminProjectManageShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } />项目管理</h4>
            <ul className={ !this.state.adminProjectManageShow && 'hide' }>
              <li><Link to='/admin/project' activeClassName='menu-active'>项目</Link></li>
            </ul>
            <h4 onClick={ toggleShow('adminAccessLogs') }><i className={ this.state.adminAccessLogsShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } />日志查看</h4>
            <ul className={ !this.state.adminAccessLogsShow && 'hide' }>
              <li><Link to='/admin/logs' activeClassName='menu-active'>日志</Link></li>
            </ul>
            <h4 onClick={ toggleShow('adminSysSettings') }><i className={ this.state.adminSysSettingsShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } />系统配置</h4>
            <ul className={ !this.state.adminSysSettingsShow && 'hide' }>
              <li><Link to='/admin/syssetting' activeClassName='menu-active'>系统配置</Link></li>
              <li><Link to='/admin/calendar' activeClassName='menu-active'>日历管理</Link></li>
            </ul>
          </div> }
        </div>
      </div>);
    } else {
      return (
      <div className='toc-container'>
        <div className='react-menu-container'>
          <div className='toc-container-header'>
            <span className='span-bar-icon' onClick={ this.hideBar.bind(this) }><i className='fa fa-bars'></i></span>
            <span className='span-angle-double' id='hide-bar' onClick={ this.hideBar.bind(this)  }><i className='fa fa-thumb-tack fa-rotate-90'></i></span>
            <span className='span-tack-bar' style={ { display: 'none' } } id='tack-bar' onClick={ this.tackBar.bind(this) }><i className='fa fa-thumb-tack'/></span>
          </div>
          { project.item.key ? 
          <div className='toc-container-body'>
            <h4 style={ { overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'default' } } title={ project.item.name }>{ project.item.name || '' }</h4>
            <h4 onClick={ toggleShow('projectSummary') } ><i className={ this.state.projectSummaryShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } />项目概述</h4>
            { project.options.permissions && project.options.permissions.length > 0 &&
            <ul className={ !this.state.projectSummaryShow && 'hide' }>
              <li><Link to={ '/project/' + project.item.key + '/summary' } activeClassName='menu-active' id='summary'>概览</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/issue' } activeClassName='menu-active'>问题</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/kanban' } activeClassName='menu-active' id='kanban'>看板</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/gantt/filter' } activeClassName='menu-active' id='gantt'>甘特图</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/activity' } activeClassName='menu-active'>活动</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/module' } activeClassName='menu-active'>模块</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/version' } activeClassName='menu-active'>版本</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/report' } activeClassName='menu-active' id='report'>统计</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/document' } activeClassName='menu-active' id='document'>文件</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/wiki' } activeClassName='menu-active' id='wiki'>Wiki</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/team' } activeClassName='menu-active'>成员</Link></li>
            </ul> }
            <h4 onClick={ toggleShow('projectConfig') }><i className={ this.state.projectConfigShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } />方案配置</h4>
            { project.options.permissions && project.options.permissions.indexOf('manage_project') !== -1 &&
            <ul className={ !this.state.projectConfigShow && 'hide' }>
              <li><Link to={ '/project/' + project.item.key + '/config' } activeClassName='menu-active'>概要</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/type' } activeClassName='menu-active'>问题类型</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/state' } activeClassName='menu-active'>状态</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/workflow' } activeClassName='menu-active' id='workflow'>工作流</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/field' } activeClassName='menu-active'>字段</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/screen' } activeClassName='menu-active'>界面</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/priority' } activeClassName='menu-active'>优先级</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/resolution' } activeClassName='menu-active'>解决结果</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/role' } activeClassName='menu-active'>角色权限</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/events' } activeClassName='menu-active'>通知事件</Link></li>
            </ul> }
            { project.options.permissions && project.options.permissions.indexOf('manage_project') === -1 &&
            <ul className={ !this.state.projectConfigShow && 'hide' }>
              <li><Link to={ '/project/' + project.item.key + '/config' } activeClassName='menu-active'>概要</Link></li> 
            </ul> }
            { project.options.permissions && project.options.permissions.indexOf('manage_project') !== -1 &&
            <h4 onClick={ toggleShow('projectSettings') }><i className={ this.state.projectSettingsShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } />项目设置</h4> }
            { project.options.permissions && project.options.permissions.indexOf('manage_project') !== -1 &&
            <ul className={ !this.state.projectSettingsShow && 'hide' }>
              <li><Link to={ '/project/' + project.item.key + '/labels' } activeClassName='menu-active'>标签管理</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/integrations' } activeClassName='menu-active'>外部用户</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/webhooks' } activeClassName='menu-active'>Webhooks</Link></li>
            </ul> }
            <h4>&nbsp;</h4><h4>&nbsp;</h4>
          </div>
          :
          <h4 className='toc-container-body'>请选择要查看的项目</h4> } 
        </div>
      </div>);
    }
  }
}
