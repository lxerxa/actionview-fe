import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Label } from 'react-bootstrap';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { projectBrowseShow: false, projectConfigShow: false, personalCenterShow: false };
    const browseModules = [ 'issue', 'module', 'version' ];
    const configModules = [ 'type', 'workflow', 'field', 'screen', 'resolution', 'priority', 'state', 'role', 'events' ];
    if (props.pathname) {
      const sections = props.pathname.split('/');
      let modulename = sections.pop();
      if (browseModules.indexOf(modulename) !== -1) {
        this.state.projectBrowseShow = true;
      } else if (configModules.indexOf(modulename) !== -1) {
        this.state.projectConfigShow = true;
      } else {
        if (sections.length > 1) {
          modulename = sections.pop(); 
          if (modulename === 'workflow') {
            this.state.projectConfigShow = true;
          }
        }
      }
    }
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    pathname: PropTypes.string
  }

  render() {
    const { project } = this.props;

    return (
      <div className='react-menu-container'>
        <h3 style={ { marginBottom: '2.4rem' } }>
          <i className='fa fa-eye'></i>
          <span style={ { marginLeft: '1.0rem', borderBottom: '0.3rem solid #3492ff' } }>ActionView</span>
        </h3>
        <h4>
          <Link to={ '/project/home' }><i className='fa fa-th-large'></i>项目中心</Link>
        </h4>
        <div className='search'>
          社交化项目管理系统
        </div>
        <h4><i className={ this.state.projectBrowseShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ () => { this.setState({ projectBrowseShow: !this.state.projectBrowseShow }) } }></i>项目概述</h4>
        <ul className={ !this.state.projectBrowseShow && 'hide' }>
          <li><Link to={ '/project/' + project.item.key + '/issue' }>问题</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/activity' }>活动</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/module' }>模块</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/version' }>版本</Link></li>
        </ul>
        <h4><i className={ this.state.projectConfigShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ () => { this.setState({ projectConfigShow: !this.state.projectConfigShow }) } }></i>项目管理</h4>
        <ul className={ !this.state.projectConfigShow && 'hide' }>
          <li><Link to={ '/project/' + project.item.key + '/type' }>问题类型</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/workflow' }>工作流</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/field' }>字段</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/screen' }>界面</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/state' }>状态</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/resolution' }>解决结果</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/priority' }>优先级</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/role' }>角色权限</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/events' }>通知事件</Link></li>
        </ul>
        <div className='search'>
          个人中心
        </div>
        <h4><i className={ this.state.personalCenterShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ () => { this.setState({ personalCenterShow: !this.state.personalCenterShow }) } }></i>个人中心</h4>
        <ul className={ !this.state.personalCenterShow && 'hide' }>
          <li><Link to={ '/project/' + project.item.key + '/type' }>通知</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/workflow' }>设置</Link></li>
        </ul>
        <h4>&nbsp;</h4><h4>&nbsp;</h4>
        <div id='carbonads'>
          <Label bsStyle='success'>刘旭(研究院)</Label> <div style={ { marginTop: '5px' } }>登录于 16/12/20 20:45<span style={ { marginLeft: '10px' } }><i className='fa fa-sign-out' title='退出'></i></span></div>
          </div>
      </div>);
  }
}
