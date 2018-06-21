import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, Form, FormControl, FormGroup, Col, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import Tabs, { TabPane } from 'rc-tabs';

const img = require('../../assets/images/loading.gif');

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  }
  if (!values.host) {
    errors.host = '必填';
  }
  if (!values.port) {
    errors.port = '必填';
  } else if (values.port && !/^[1-9][0-9]*$/.test(values.port)) {
    errors.port = '必须输入正整数';
  }
  if (!values.admin_username) {
    errors.admin_username = '必填';
  }
  if (!values.admin_password) {
    errors.admin_password = '必填';
  }
  if (!values.base_dn) {
    errors.base_dn = '必填';
  }
  if (!values.user_object_class) {
    errors.user_object_class = '必填';
  }
  if (!values.user_object_filter) {
    errors.user_object_filter = '必填';
  }
  if (!values.user_name_attr) {
    errors.user_name_attr = '必填';
  }
  if (!values.user_email_attr) {
    errors.user_email_attr = '必填';
  }
  if (!values.group_object_class) {
    errors.group_object_class = '必填';
  }
  if (!values.group_object_filter) {
    errors.group_object_filter = '必填';
  }
  if (!values.group_name_attr) {
    errors.group_name_attr = '必填';
  }
  if (!values.group_membership_attr) {
    errors.group_membership_attr = '必填';
  }
  return errors;
};

@reduxForm({
  form: 'ldap',
  fields: [ 
    'id',
    'name', 
    'host', 
    'port', 
    'encryption',
    'admin_username', 
    'admin_password', 
    'base_dn', 
    'additional_user_dn', 
    'additional_group_dn', 
    'user_object_class', 
    'user_object_filter', 
    'user_name_attr', 
    'user_email_attr', 
    'group_object_class',
    'group_object_filter',
    'group_name_attr', 
    'group_membership_attr'
  ],
  validate
})
export default class AddLDAPModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, activeKey: '1' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    options: PropTypes.object,
    data: PropTypes.object,
    initializeForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    edit: PropTypes.func,
    create: PropTypes.func
  }

  async handleSubmit() {
    const { values, create, edit, close } = this.props;
    let ecode = 0;
    if (values.id) {
      ecode = await edit(values.id, { name: values.name, configs: _.omit(values, [ 'id', 'name' ]) });
      if (ecode === 0){
        close();
        notify.show('已更新。', 'success', 2000);
      }
    } else {
      ecode = await create({ name: values.name, configs: _.omit(values, [ 'id', 'name' ]) });
      if (ecode === 0){
        close();
        notify.show('已添加。', 'success', 2000);
      }
    }
    this.setState({ ecode });
  }

  handleCancel() {
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  onTabChange(activeKey) {
    this.setState({ activeKey });
  }

  componentWillMount() {
    const { initializeForm, data={} } = this.props;
    let newData= _.clone(data);
    if (newData.configs) {
      newData = { id: newData.id, name: newData.name, ...newData.configs };
    } 
    if (!newData.id) {
      newData.port = 389;
      newData.user_object_class = 'inetOrgPerson';
      newData.user_object_filter = '(objectClass=inetOrgPerson)';
      newData.user_name_attr = 'cn';
      newData.user_email_attr = 'mail';
      newData.group_object_class = 'groupOfUniqueNames';
      newData.group_object_filter = '(objectClass=groupOfUniqueNames)';
      newData.group_name_attr = 'cn';
      newData.group_membership_attr = 'uniqueMember';
    }
    newData.admin_password = '';
    initializeForm(newData);
  }

  render() {
    const { 
      i18n: { errMsg }, 
      fields: { 
        id,
        name,
        host,
        port,
        encryption,
        admin_username,
        admin_password,
        base_dn,
        additional_user_dn,
        additional_group_dn,
        user_object_class,
        user_object_filter,
        user_name_attr,
        user_email_attr,
        group_object_class,
        group_object_filter,
        group_name_attr,
        group_membership_attr }, 
      handleSubmit, 
      invalid, 
      submitting, 
      options,
      data } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ !data.id ? '添加LDAP' : ('编辑LDAP - ' + data.name) }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <FormControl type='hidden' { ...id }/>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <Tabs
            activeKey={ this.state.activeKey }
            onChange={ this.onTabChange.bind(this) } >
            <TabPane tab='服务器' key='1'>
              <div style={ { paddingTop: '15px' } }>
                <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>目录名</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...name } placeholder='目录名'/>
                  { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ host.touched && host.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>主机名</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...host } placeholder='主机名'/>
                  { host.touched && host.error && <HelpBlock style={ { float: 'right' } }>{ host.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ port.touched && port.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>端口</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...port } placeholder='端口'/>
                  { port.touched && port.error && <HelpBlock style={ { float: 'right' } }>{ port.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsSelect'>
                  <ControlLabel>加密</ControlLabel>
                  <Select
                    disabled={ submitting }
                    clearable={ false }
                    searchable={ false }
                    options={ [ { value: '', label: '无' }, { value: 'tls', label: 'TLS' }, { value: 'ssl', label: 'SSL' } ] }
                    value={ encryption.value || '' }
                    onChange={ newValue => { encryption.onChange(newValue) } }
                    placeholder='请选择'/>
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ admin_username.touched && admin_username.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>用户名</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...admin_username } placeholder='用户名'/>
                  { admin_username.touched && admin_username.error && <HelpBlock style={ { float: 'right' } }>{ admin_username.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ admin_password.touched && admin_password.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>密码</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...admin_password } placeholder='密码'/>
                  { admin_password.touched && admin_password.error && <HelpBlock style={ { float: 'right' } }>{ admin_password.error }</HelpBlock> }
                  { !(admin_password.touched && admin_password.error) && data.id && <HelpBlock style={ { float: 'left' } }>配置信息的每次修改都需重新输入密码。</HelpBlock> }
                </FormGroup>
              </div>
            </TabPane>
            <TabPane tab='DN' key='2'>
              <div style={ { paddingTop: '15px' } }>
                <FormGroup controlId='formControlsText' validationState={ base_dn.touched && base_dn.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>Base DN</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...base_dn } placeholder='base DN'/>
                  { base_dn.touched && base_dn.error && <HelpBlock style={ { float: 'right' } }>{ base_dn.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel>Additional User DN</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...additional_user_dn } placeholder='additional user DN'/>
                </FormGroup>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel>Additional Group DN</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...additional_group_dn } placeholder='additional group DN'/>
                </FormGroup>
              </div>
            </TabPane>
            <TabPane tab='用户' key='3'>
              <div style={ { paddingTop: '15px' } }>
                <FormGroup controlId='formControlsText' validationState={ user_object_class.touched && user_object_class.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>对象类</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...user_object_class } placeholder='对象类'/>
                  { user_object_class.touched && user_object_class.error && <HelpBlock style={ { float: 'right' } }>{ user_object_class.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ user_object_filter.touched && user_object_filter.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>对象过滤</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...user_object_filter } placeholder='对象过滤'/>
                  { user_object_filter.touched && user_object_filter.error && <HelpBlock style={ { float: 'right' } }>{ user_object_filter.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ user_name_attr.touched && user_name_attr.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>用户名属性</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...user_name_attr } placeholder='用户名属性'/>
                  { user_name_attr.touched && user_name_attr.error && <HelpBlock style={ { float: 'right' } }>{ user_name_attr.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ user_email_attr.touched && user_email_attr.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>邮箱属性</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...user_email_attr } placeholder='邮箱属性'/>
                  { user_email_attr.touched && user_email_attr.error && <HelpBlock style={ { float: 'right' } }>{ user_email_attr.error }</HelpBlock> }
                </FormGroup>
              </div>
            </TabPane>
            <TabPane tab='用户组' key='4'>
              <div style={ { paddingTop: '15px' } }>
                <FormGroup controlId='formControlsText' validationState={ group_object_class.touched && group_object_class.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>对象类</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...group_object_class } placeholder='对象类'/>
                  { group_object_class.touched && group_object_class.error && <HelpBlock style={ { float: 'right' } }>{ group_object_class.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ group_object_filter.touched && group_object_filter.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>对象过滤</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...group_object_filter } placeholder='对象过滤'/>
                  { group_object_filter.touched && group_object_filter.error && <HelpBlock style={ { float: 'right' } }>{ group_object_filter.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ group_name_attr.touched && group_name_attr.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>组名属性</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...group_name_attr } placeholder='组名属性'/>
                  { group_name_attr.touched && group_name_attr.error && <HelpBlock style={ { float: 'right' } }>{ group_name_attr.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText' validationState={ group_membership_attr.touched && group_membership_attr.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>组成员属性</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...group_membership_attr } placeholder='组成员属性'/>
                  { group_membership_attr.touched && group_membership_attr.error && <HelpBlock style={ { float: 'right' } }>{ group_membership_attr.error }</HelpBlock> }
                </FormGroup>
              </div>
            </TabPane>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
