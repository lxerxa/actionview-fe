import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.ip) {
    errors.ip = '必填';
  }
  // if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(values.ip)) {
  else if (!/^[\w-]+([.][\w-]+)+$/.test(values.ip)) {
    errors.ip = '格式有误';
  }
  if (values.port && !/^[1-9][0-9]*$/.test(values.port)) {
    errors.port = '必须输入正整数';
  }
  if (!values.send_addr) {
    errors.send_addr = '必填';
  } else if (!/^[\w-]+@[\w-]+([.][\w-]+)+$/.test(values.send_addr)) {
    errors.send_addr = '格式有误';
  }
  return errors;
};

@reduxForm({
  form: 'syssetting',
  fields: [ 'ip', 'port', 'send_addr', 'send_auth' ],
  validate
})
export default class SmtpServerModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
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
    initializeForm(data);
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update({ smtp: values });
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
    const { fields: { ip, port, send_addr, send_auth }, handleSubmit, invalid, dirty, submitting, data } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>SMPT服务器设置</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ ip.touched && ip.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>服务器</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...ip } placeholder='主机名称或IP地址'/>
            { ip.touched && ip.error && <HelpBlock style={ { float: 'right' } }>{ ip.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ port.touched && port.error ? 'error' : '' }>
            <ControlLabel>端口</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...port } placeholder='端口'/>
            { port.touched && port.error && <HelpBlock style={ { float: 'right' } }>{ port.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ send_addr.touched && send_addr.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>发送邮箱地址</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...send_addr } placeholder='邮箱账号'/>
            { send_addr.touched && send_addr.error && <HelpBlock style={ { float: 'right' } }>{ send_addr.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>发送验证</ControlLabel>
            <Select
              disabled={ submitting }
              clearable={ false }
              searchable={ false }
              options={ [ { value: 1, label: '开启' }, { value: 0, label: '关闭' } ] }
              value={ send_auth.value || 0 }
              onChange={ newValue => { send_auth.onChange(newValue) } }
              placeholder='请选择'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && 'aaaa' }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ !dirty || submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
