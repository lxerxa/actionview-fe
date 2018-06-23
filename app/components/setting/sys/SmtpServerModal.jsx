import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.host) {
    errors.host = '必填';
  }
  // if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(values.ip)) {
  else if (!/^[\w-]+([.][\w-]+)+$/.test(values.host)) {
    errors.host = '格式有误';
  }

  if (!values.port) {
    errors.port = '必填';
  } else if (values.port && !/^[1-9][0-9]*$/.test(values.port)) {
    errors.port = '必须输入正整数';
  }

  if (!values.username) {
    errors.username = '必填';
  }

  if (!values.has_old_password && !values.password) {
    errors.password = '必填';
  }
  return errors;
};

@reduxForm({
  form: 'syssetting',
  fields: [ 'host', 'port', 'encryption', 'username', 'has_old_password', 'password' ],
  validate
})
export default class SmtpServerModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, passwordShow: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    dirty: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;

    if (data.password) {
      this.state.passwordShow = false;
    }

    const newData = _.clone(data);
    newData.has_old_password = data.password ? true : false;
    newData.password = '';
    initializeForm(newData);
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update({ smtp: _.omit(values.password ? values : _.omit(values, [ 'password' ]), [ 'has_old_password' ]) });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('设置完成。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  render() {
    const { 
      i18n: { errMsg }, 
      fields: { host, port, encryption, username, has_old_password, password }, 
      handleSubmit, 
      invalid, 
      dirty, 
      submitting, 
      data } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>SMPT服务器设置</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup validationState={ host.touched && host.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>服务器</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...host } placeholder='主机名称或IP地址'/>
            { host.touched && host.error && <HelpBlock style={ { float: 'right' } }>{ host.error }</HelpBlock> }
          </FormGroup>
          <FormGroup validationState={ port.touched && port.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>端口</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...port } placeholder='端口'/>
            { port.touched && port.error && <HelpBlock style={ { float: 'right' } }>{ port.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText'>
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
          <FormGroup validationState={ username.touched && username.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>帐号</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...username } placeholder='输入帐号'/>
            { username.touched && username.error && <HelpBlock style={ { float: 'right' } }>{ username.error }</HelpBlock> }
          </FormGroup>
          <FormGroup validationState={ !has_old_password.value && password.touched && password.error ? 'error' : '' }>
            <ControlLabel>
              { !has_old_password.value ? <span className='txt-impt'>*</span> : <span/> }
              密码 
              { has_old_password.value && 
              <a style={ { fontWeight: 'normal', fontSize: '12px', cursor: 'pointer', marginLeft: '5px' } } 
                onClick={ (e) => { e.preventDefault(); if (this.state.passwordShow) { password.onChange('') } this.setState({ passwordShow: !this.state.passwordShow }) } }>
                { this.state.passwordShow ? '取消' : '设置' }
              </a> }
            </ControlLabel>
            { this.state.passwordShow && <FormControl disabled={ submitting } type='text' { ...password } placeholder='输入密码'/> }
            { !has_old_password.value && password.touched && password.error && <HelpBlock style={ { float: 'right' } }>{ password.error }</HelpBlock> }
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ !dirty || submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
