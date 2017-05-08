import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.to) {
    errors.to = '必填';
  }  else if (!/^[\w-]+@[\w-]+([.][\w-]+)+$/.test(values.to)) {
    errors.to = '格式有误';
  }

  if (!values.subject) {
    errors.subject = '必填';
  }
  return errors;
};

@reduxForm({
  form: 'sysetting',
  fields: ['to', 'subject'],
  validate
})
export default class ResetPwdModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, contents: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    sendMail: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, sendMail, close } = this.props;
    const ecode = await sendMail(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('邮件已发送。', 'success', 2000);
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
    const { fields: { to, subject, contents }, handleSubmit, invalid, submitting } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>发送测试邮件</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ to.touched && to.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>收件人</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...to } placeholder='收件人'/>
            { to.touched && to.error && <HelpBlock style={ { float: 'right' } }>{ to.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ subject.touched && subject.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>主题</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...subject } placeholder='主题'/>
            { subject.touched && subject.error && <HelpBlock style={ { float: 'right' } }>{ subject.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsTextarea'>
            <ControlLabel>内容</ControlLabel>
            <FormControl style={ { height: '100px' } } disabled={ submitting } componentClass='textarea' { ...contents } placeholder='内容'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && 'aaaa' }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
