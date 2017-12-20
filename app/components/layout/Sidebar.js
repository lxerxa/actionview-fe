import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Label } from 'react-bootstrap';
const $ = require('$');

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      projectPanelShow: false,
      projectSummaryShow: false, 
      projectConfigShow: false, 
      adminPanelShow: false,
      adminSchemeShow: false, 
      adminSysManageShow: false, 
      adminSysSettingShow: false, 
      tackFlag: true };
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    pathname: PropTypes.string
  }

  componentDidMount() {
    $('.toc-container').click(function(e) {
      if (e.target.nodeName !== 'I' && e.target.nodeName !== 'A' && e.target.nodeName !== 'SPAN') {
        e.stopPropagation();
      }
    });

    $(document).click(function() {
      if ($('.toc-container').eq(0).css('position') === 'fixed') {
        $('.toc-container').animate({ left: '-20%' });
      }
    });
  }

  hideBar() {
    let detailLeftFloat = false;
    if ($('.animate-dialog').length > 0 && $('.animate-dialog').offset().left == $('.doc-container').offset().left) {
      detailLeftFloat = true;
    }

    //box-shadow: 0 0 .5rem #9da5ab;
    $('.toc-container').animate({ left: '-20%' });
    $('.toc-container').css({ position: 'fixed' });
    $('.head').css({ paddingLeft: '15px' });
    $('.toc-logo').css({ left: '45%' });
    $('#show-bar').show();
    detailLeftFloat && $('.animate-dialog').css('left', $('.doc-container').offset().left);
  }

  tackBar() {
    let detailLeftFloat = false;
    if ($('.animate-dialog').length > 0 && $('.animate-dialog').offset().left == $('.doc-container').offset().left) {
      detailLeftFloat = true;
    }
    $('.head').css({ paddingLeft: '19%' });
    $('.toc-logo').css({ left: '52%' });
    $('.toc-container').css({ position: 'relative', boxShadow: 'none', borderRight: 'solid 1px #e5e5e5' });
    $('#show-bar').hide();
    $('#tack-bar').hide();
    $('#hide-bar').show();
    detailLeftFloat && $('.animate-dialog').css('left', $('.doc-container').offset().left);
  }

  componentWillReceiveProps(nextProps) {
    if (/^\/project\/(\w+)(\/(summary|issue|kanban|activity|version|module|team)(\/\w+)?)?$/.test(nextProps.pathname)) {
      this.state.adminPanelShow = false;
      this.state.projectPanelShow = true;
      this.state.projectSummaryShow = true;
    } else if (/^\/project\/(\w+)\/(config|type|workflow|field|screen|priority|state|resolution|role|events)(\/\w+)?$/.test(nextProps.pathname)){
      this.state.adminPanelShow = false;
      this.state.projectPanelShow = true;
      this.state.projectConfigShow = true;
    } else if (/^\/admin\/scheme/.test(nextProps.pathname)) {
      this.state.adminPanelShow = true;
      this.state.projectPanelShow = false;
      this.state.adminSchemeShow = true;
    } else if (/^\/admin\/(project|user|group)$/.test(nextProps.pathname)) {
      this.state.adminPanelShow = true;
      this.state.projectPanelShow = false;
      this.state.adminSysManageShow = true;
    } else if (/^\/admin\/syssetting$/.test(nextProps.pathname)) {
      this.state.adminPanelShow = true;
      this.state.projectPanelShow = false;
      this.state.adminSysSettingShow = true;
    }
  }

  render() {
    const { project, session } = this.props;

    if (this.state.adminPanelShow) {
      return (
      <div className='toc-container'>
        <div className='react-menu-container'>
          <div style={ { height: '50px', lineHeight: '35px', paddingTop: '8px' } }>
            <span className='span-bar-icon' onClick={ this.hideBar.bind(this) }><i className='fa fa-bars'></i></span>
            <span className='span-angle-double' id='hide-bar' onClick={ this.hideBar.bind(this)  }><i className='fa fa-angle-double-left'></i></span>
            <span className='span-tack-bar' style={ { display: 'none' } } id='tack-bar' onClick={ this.tackBar.bind(this) }><i className='fa fa-thumb-tack'></i></span>
          </div>
          { session.user.permissions && session.user.permissions.sys_admin &&
          <div>
            <h4 style={ { overflow: 'hidden', textOverflow: 'ellipsis' } }>管理员管理面板</h4>
            <h4><i className={ this.state.adminSchemeShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ (e) => { this.setState({ adminSchemeShow: !this.state.adminSchemeShow }); e.nativeEvent.stopImmediatePropagation(); } }></i>方案配置</h4>
            <ul className={ !this.state.adminSchemeShow && 'hide' }>
              <li><Link to='/admin/scheme/type'>问题类型</Link></li>
              <li><Link to='/admin/scheme/workflow'>工作流</Link></li>
              <li><Link to='/admin/scheme/field'>字段</Link></li>
              <li><Link to='/admin/scheme/screen'>界面</Link></li>
              <li><Link to='/admin/scheme/state'>状态</Link></li>
              <li><Link to='/admin/scheme/resolution'>解决结果</Link></li>
              <li><Link to='/admin/scheme/priority'>优先级</Link></li>
              <li><Link to='/admin/scheme/role'>角色权限</Link></li>
              <li><Link to='/admin/scheme/events'>通知事件</Link></li>
            </ul>
            <h4><i className={ this.state.adminSysManageShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ (e) => { this.setState({ adminSysManageShow: !this.state.adminSysManageShow }); e.nativeEvent.stopImmediatePropagation(); } }></i>系统管理</h4>
            <ul className={ !this.state.adminSysManageShow && 'hide' }>
              <li><Link to='/admin/user'>用户</Link></li>
              <li><Link to='/admin/group'>用户组</Link></li>
              <li><Link to='/admin/project'>项目管理</Link></li>
            </ul>
            <h4><i className={ this.state.adminSysSettingShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ (e) => { this.setState({ adminSysSettingShow: !this.state.adminSysSettingShow }); e.nativeEvent.stopImmediatePropagation(); } }></i>系统配置</h4>
            <ul className={ !this.state.adminSysSettingShow && 'hide' }>
              <li><Link to='/admin/syssetting'>配置</Link></li>
            </ul>
          </div> }
        </div>
      </div>);
    } else {
      return (
      <div className='toc-container'>
        <div className='react-menu-container'>
          <div style={ { height: '50px', lineHeight: '35px', paddingTop: '8px' } }>
            <span className='span-bar-icon' onClick={ this.hideBar.bind(this) }><i className='fa fa-bars'></i></span>
            <span className='span-angle-double' id='hide-bar' onClick={ this.hideBar.bind(this)  }><i className='fa fa-angle-double-left'></i></span>
            <span className='span-tack-bar' style={ { display: 'none' } } id='tack-bar' onClick={ this.tackBar.bind(this) }><i className='fa fa-thumb-tack'></i></span>
          </div>
          { project.item.key ? 
          <div>
            <h4 style={ { overflow: 'hidden', textOverflow: 'ellipsis' } }>{ project.item.name || '' }</h4>
            <h4><i className={ this.state.projectSummaryShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ (e) => { this.setState({ projectSummaryShow: !this.state.projectSummaryShow }); e.nativeEvent.stopImmediatePropagation(); } }></i>项目概述</h4>
            { project.options.permissions && project.options.permissions.length > 0 &&
            <ul className={ !this.state.projectSummaryShow && 'hide' }>
              <li><Link to={ '/project/' + project.item.key + '/summary' }>概要</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/issue' }>问题</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/kanban' }>看板</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/activity' }>活动</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/module' }>模块</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/version' }>版本</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/team' }>成员</Link></li>
            </ul> }
            <h4><i className={ this.state.projectConfigShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ (e) => { this.setState({ projectConfigShow: !this.state.projectConfigShow }); e.nativeEvent.stopImmediatePropagation(); } }></i>配置管理</h4>
            { project.options.permissions && project.options.permissions.indexOf('manage_project') !== -1 &&
            <ul className={ !this.state.projectConfigShow && 'hide' }>
              <li><Link to={ '/project/' + project.item.key + '/config' }>概要</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/type' }>问题类型</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/workflow' }>工作流</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/field' }>字段</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/screen' }>界面</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/state' }>状态</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/resolution' }>解决结果</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/priority' }>优先级</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/role' }>角色权限</Link></li>
              <li><Link to={ '/project/' + project.item.key + '/events' }>通知事件</Link></li>
            </ul> }
            { project.options.permissions && project.options.permissions.length > 0 && project.options.permissions.indexOf('manage_project') === -1 &&
            <ul className={ !this.state.projectConfigShow && 'hide' }>
              <li><Link to={ '/project/' + project.item.key + '/config' }>概要</Link></li> 
            </ul> }
            <h4>&nbsp;</h4><h4>&nbsp;</h4>
          </div>
          :
          <h4 style={ { overflow: 'hidden', textOverflow: 'ellipsis' } }>请选择要查看的项目</h4> } 
        </div>
      </div>);
    }
  }
}
