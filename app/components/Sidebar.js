import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Label } from 'react-bootstrap';
const $ = require('$');

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { projectBrowseShow: false, projectConfigShow: false, tackFlag: true };
    const browseModules = [ 'issue', 'activity', 'module', 'version' ];
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

  componentDidMount() {
    $('.toc-container').click(function(e) {
      if (e.target.nodeName !== 'I' && e.target.nodeName !== 'A' && e.target.nodeName !== 'SPAN') {
        e.stopPropagation();
      }
    });

    $(document).click(function() {
      if ($('.toc-container').eq(0).css('position') === 'fixed') {
        $('.toc-container').animate({ left: '-250px' });
      }
    });
  }

  hideBar() {
    //box-shadow: 0 0 .5rem #9da5ab;
    $('.toc-container').animate({ left: '-250px' });
    $('.toc-container').css({ position: 'fixed' });
    $('.head').css({ paddingLeft: '15px' });
    $('#show-bar').show();
  }

  tackBar() {
    $('.head').css({ paddingLeft: '265px' });
    $('.toc-container').css({ position: 'relative', boxShadow: 'none', borderRight: 'solid 1px #e5e5e5' });
    $('#show-bar').hide();
    $('#tack-bar').hide();
    $('#hide-bar').show();
  }

  render() {
    const { project } = this.props;

    return (
      <div className='toc-container'>
        <div className='react-menu-container'>
          <div style={ { height: '50px', lineHeight: '35px', paddingTop: '7px' } }>
            <span style={ { fontSize: '19px', cursor: 'pointer', float: 'left' } } onClick={ this.hideBar.bind(this) }><i className='fa fa-bars'></i></span>
            <span style={ { fontSize: '19px', cursor: 'pointer', float: 'right', paddingLeft: '5px', paddingRight: '5px', marginRight: '-8px' } } id='hide-bar' onClick={ this.hideBar.bind(this)  }><i className='fa fa-angle-double-left'></i></span>
            <span style={ { fontSize: '19px', cursor: 'pointer', float: 'right', display: 'none', marginRight: '-8px' } } id='tack-bar' onClick={ this.tackBar.bind(this) }><i className='fa fa-thumb-tack'></i></span>
          </div>
          <h4>社交化项目管理系统</h4>
          <h4><i className={ this.state.projectBrowseShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ (e) => { this.setState({ projectBrowseShow: !this.state.projectBrowseShow }); e.nativeEvent.stopImmediatePropagation(); } }></i>项目概述</h4>
          <ul className={ !this.state.projectBrowseShow && 'hide' }>
            <li><Link to={ '/project/' + project.item.key + '/issue' }>问题</Link></li>
            <li><Link to={ '/project/' + project.item.key + '/activity' }>活动</Link></li>
            <li><Link to={ '/project/' + project.item.key + '/module' }>模块</Link></li>
            <li><Link to={ '/project/' + project.item.key + '/version' }>版本</Link></li>
          </ul>
          <h4><i className={ this.state.projectConfigShow ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o' } onClick={ (e) => { this.setState({ projectConfigShow: !this.state.projectConfigShow }); e.nativeEvent.stopImmediatePropagation(); } }></i>项目管理</h4>
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
          <h4>&nbsp;</h4><h4>&nbsp;</h4>
          <div id='carbonads'>
            <Label bsStyle='success'>刘旭(研究院)</Label> <div style={ { marginTop: '5px' } }>登录于 16/12/20 20:45<span style={ { marginLeft: '10px' } }><i className='fa fa-sign-out' title='退出'></i></span></div>
          </div>
        </div>
      </div>);
  }
}
