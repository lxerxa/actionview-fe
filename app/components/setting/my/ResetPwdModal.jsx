import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.password) {
    errors.password = 'Required';
  }
  if (!values.new_password) {
    errors.new_password = 'Required';
  }
  if (!values.new_password2) {
    errors.new_password2 = 'Required';
  }
  if ((values.new_password || values.new_password2) && values.new_password != values.new_password2) {
    errors.new_password2 = '密码不一致';
  }

  return errors;
};

@reduxForm({
  form: 'mysetting',
  fields: ['password', 'new_password', 'new_password2'],
  validate
})
export default class ResetPwdModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    resetPwd: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, resetPwd, close } = this.props;
    const ecode = await resetPwd(_.pick(values, [ 'password', 'new_password' ]));
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('密码已修改。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { password, new_password, new_password2 }, handleSubmit, invalid, submitting } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>重置密码</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsSrc' validationState={ password.touched && password.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>原密码</ControlLabel>
            <FormControl disabled={ submitting } type='password' { ...password } placeholder='原密码'/>
            { password.touched && password.error && <HelpBlock style={ { float: 'right' } }>{ password.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsNew' validationState={ new_password.touched && new_password.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>新密码</ControlLabel>
            <FormControl disabled={ submitting } type='password' { ...new_password } placeholder='新密码'/>
            { new_password.touched && new_password.error && <HelpBlock style={ { float: 'right' } }>{ new_password.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsNew2' validationState={ new_password2.touched && new_password2.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>确认密码</ControlLabel>
            <FormControl disabled={ submitting } type='password' { ...new_password2 } placeholder='确认密码'/>
            { new_password2.touched && new_password2.error && <HelpBlock style={ { float: 'right' } }>{ new_password2.error }</HelpBlock> }
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || invalid } type='submit'>Submit</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>Cancel</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
