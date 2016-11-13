import React, { PropTypes, Component } from 'react';
import ProjectModal from './ProjectModal';
import CreateIssueModal from './issue/CreateModal';
import { Link } from 'react-router';
import { Label, Nav, Navbar, NavItem, Col, Form, FormGroup, ControlLabel } from 'react-bootstrap';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { projctModalShow: false, issueModalShow: false };
    this.projectModalClose = this.projectModalClose.bind(this);
    this.issueModalClose = this.issueModalClose.bind(this);
  }

  static propTypes = {
    indexImg: PropTypes.any.isRequired,
    project: PropTypes.object.isRequired,
    issue: PropTypes.object,
    createIssue: PropTypes.func,
    createProject: PropTypes.func
  }

  projectModalClose() {
    this.setState({ projectModalShow: false });
  }

  issueModalClose() {
    this.setState({ issueModalShow: false });
  }

  render() {
    const { indexImg, project, createProject, createIssue, issue } = this.props;
    return (
      <div className='react-menu-container'>
        <h3 style={ { marginBottom: '2.4rem' } }>
          <i className='fa fa-eye'></i>
          <span style={ { marginLeft: '1.0rem', borderBottom: '0.3rem solid #3492ff' } }>ActionView</span>
        </h3>
        <h4>
          <Link to={ '/project/home' }><i className='fa fa-home'></i> 项目中心</Link>
        </h4>
        <div className='search'>
          社交化项目管理系统
        </div>
        <h4><i className='fa fa-minus-square-o'></i>项目概述</h4>
        <ul>
          <li><Link to={ '/project/' + project.item.key + '/issue' }>问题</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/module' }>模块</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/version' }>版本</Link></li>
        </ul>
        <h4><i className='fa fa-minus-square-o'></i>项目管理</h4>
        <ul>
          <li><Link to={ '/project/' + project.item.key + '/type' }>问题类型</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/workflow' }>工作流</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/field' }>字段</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/screen' }>界面</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/state' }>状态</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/resolution' }>解决结果</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/priority' }>优先级</Link></li>
          <li><Link to={ '/project/' + project.item.key + '/role' }>角色权限</Link></li>
          <li/><li/><li/>
        </ul>
        <div id='carbonads'>
          <Label bsStyle='success'>刘旭(研究院)</Label> 登录于 16/12/20 20:45<span style={ { marginLeft: '10px' } }><i className='fa fa-sign-out'></i></span>
          </div>
      </div>);
  }
}
