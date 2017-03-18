import React, { PropTypes, Component } from 'react';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap';
import _ from 'lodash';

const $ = require('$');

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    pathname: PropTypes.string
  }

  showBar(e) {
    $('#hide-bar').hide();
    $('#tack-bar').show();
    $('.toc-container').css({ position: 'fixed', boxShadow: '0 0 .5rem #9da5ab' });
    $('.toc-container').animate({ left: '0px' });
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { pathname, project } = this.props;

    const sections = pathname.split('/');
    let modulename = sections.pop();
    const Modules = [
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

    let activeModule = _.find(Modules, { key: modulename });
    if (!activeModule) {
      if (sections.length > 1) {
        modulename = sections.pop(); 
        if (modulename === 'workflow') {
          activeModule = { key: 'wfconfig', name: '工作流配置' };
        }
      }
    }

    return (
      <div className='head'>
        <span style={ { display: 'none', cursor: 'pointer', marginRight: '15px' } } onClick={ (e) => { this.showBar(e); } } id='show-bar'><i className='fa fa-bars'></i></span>
        <span>{ activeModule.name }</span>
        <span style={ { float: 'right', marginRight: '10px' } } title='创建项目'>
          <Button bsStyle='link' style={ { color: '#000' } }><i className='fa fa-plus'></i></Button>
        </span>
        <span style={ { float: 'right' } }>
          <DropdownButton pullRight bsStyle='link' title='项目' id='basic-nav-dropdown' style={ { color: '#000' } }>
            <MenuItem eventKey={ 3.1 }>Action</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={ 3.4 }>社交化项目管理系统</MenuItem>
            <MenuItem eventKey={ 3.4 }>Separated link</MenuItem>
            <MenuItem eventKey={ 3.4 }>Separated link</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={ 3.4 }>更多</MenuItem>
          </DropdownButton>
        </span>
      </div>
    );
  }
}
