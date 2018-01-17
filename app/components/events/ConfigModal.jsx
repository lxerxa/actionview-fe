import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

export default class ConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, notifications: [], userParam: '', roleParam: '' };

    const { data: { notifications=[] } } = props;
    _.map(notifications, (v) => {
      if (v.key == 'role' && v.value) {
        this.state.notifications.push('role');
        this.state.roleParam = v.value;
      } else if (v.key == 'user' && v.value && v.value.id) {
        this.state.notifications.push('user');
        this.state.userParam = v.value.id;
      } else {
        this.state.notifications.push(v);
      }
    });

    this.state.oldNotifications = _.clone(this.state.notifications);
    this.state.oldUserParam = this.state.userParam;
    this.state.oldRoleParam = this.state.roleParam;

    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    setNotify: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, setNotify, data, options } = this.props;
    const notifications = [];
    _.map(this.state.notifications, (v) => {
      if (v == 'user') {
        if (this.state.userParam) {
          const user = _.find(options.users, { id: this.state.userParam });
          notifications.push({ key: v, value: user });
        }
      } else if (v == 'role') {
        if (this.state.roleParam) {
          notifications.push({ key: v, value: this.state.roleParam });
        }
      } else {
        notifications.push(v);
      }
    });

    const ecode = await setNotify({ id: data.id, notifications });
    if (ecode === 0) {
      close();
      notify.show('配置完成。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  notificationsChanged(newValues) {
    this.setState({
      notifications: newValues 
    });
  }

  render() {
    const { i18n: { errMsg }, data, options, loading } = this.props;

    const roleOptions = options.roles || [];
    const userOptions = (options.users || []).sort(function(a, b) { return a.name.localeCompare(b.name); });

    const selectEnableStyles = { width: '125px', marginLeft: '10px', backgroundColor: '#ffffff', borderRadius: '4px' };
    const selectDisabledStyles = { width: '125px', marginLeft: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' };

    let isChanged = false;
    if (this.state.userParam !== this.state.oldUserParam || this.state.roleParam !== this.state.oldRoleParam) {
      isChanged = true;
    } else {
      const tmp = _.intersection(this.state.notifications, this.state.oldNotifications);
      if (tmp.length !== this.state.notifications.length || tmp.length !== this.state.oldNotifications.length) {
        isChanged = true;
      }
    }

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>通知设置 - { data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={ { paddingTop: '10px', paddingBottom: '0px', paddingLeft: '5px' } }>
            <CheckboxGroup name='notifications' value={ this.state.notifications } onChange={ this.notificationsChanged.bind(this) }>
              <ui className='list-unstyled clearfix cond-list'>
                <li>
                  <Checkbox disabled={ loading } value='current_user'/>
                  <span>当前用户</span>
                </li>
                <li>
                  <Checkbox disabled={ loading } value='assignee'/>
                  <span>当前经办人</span>
                </li>
                <li>
                  <Checkbox disabled={ loading } value='reporter'/>
                  <span>报告者</span>
                </li>
                <li>
                  <Checkbox disabled={ loading } value='project_principal'/>
                  <span>项目负责人</span>
                </li>
                <li>
                  <Checkbox disabled={ loading } value='module_principal'/>
                  <span>模块负责人</span>
                </li>
                <li>
                  <Checkbox disabled={ loading } value='watchers'/>
                  <span>所有关注者</span>
                </li>
                <li>
                  <Checkbox disabled={ loading } value='user'/>
                  <span>单一用户</span>
                  <select
                    value={ this.state.userParam }
                    onChange={ (e) => this.setState({ userParam: e.target.value }) }
                    disabled={ (_.indexOf(this.state.notifications, 'user') !== -1 && !loading) ? false : true }
                    style={ _.indexOf(this.state.notifications, 'user') !== -1 ? selectEnableStyles : selectDisabledStyles }>
                    <option value='' key=''>请选择用户</option>
                    { userOptions.map( userOption => <option value={ userOption.id } key={ userOption.id }>{ userOption.name + '(' + userOption.email + ')' }</option> ) }
                  </select>
                </li>
                <li>
                  <Checkbox disabled={ loading } value='role'/>
                  <span>项目角色</span>
                  <select
                    value={ this.state.roleParam }
                    onChange={ (e) => this.setState({ roleParam: e.target.value }) }
                    disabled={ (_.indexOf(this.state.notifications, 'role') !== -1 && !loading) ? false : true }
                    style={ _.indexOf(this.state.notifications, 'role') !== -1 ? selectEnableStyles : selectDisabledStyles }>
                    <option value='' key=''>请选择角色</option>
                    { roleOptions.map( roleOption => <option value={ roleOption.id } key={ roleOption.id }>{ roleOption.name }</option> ) }
                  </select>
                </li>
              </ui>
            </CheckboxGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button onClick={ this.confirm } disabled={ !isChanged || loading }>确定</Button>
          <Button bsStyle='link' onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
