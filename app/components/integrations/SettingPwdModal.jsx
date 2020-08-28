import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.pwd) {
    errors.name = 'Required';
  }

  return errors;
};

@reduxForm({
  form: 'settingpwd',
  fields: [ 'pwd' ],
  validate
})
export default class SettingPwdModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    mode: PropTypes.string,
    user: PropTypes.object,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    handle: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, mode, user, handle, close } = this.props;
    const ecode = await handle({ user: user.key, mode, ...values });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      if (mode === 'resetPwd') {
        notify.show('已重置。', 'success', 2000);
      } else {
        notify.show('已开通。', 'success', 2000);
      }
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
    const { i18n: { errMsg }, fields: { pwd }, handleSubmit, invalid, submitting, user, mode } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ user.name || '' } - { mode === 'resetPwd' ? '重置密码' : '设置密码' }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ pwd.touched && pwd.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>密码</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...pwd } placeholder='设置密码'/>
            { pwd.touched && pwd.error && <HelpBlock style={ { float: 'right' } }>{ pwd.error }</HelpBlock> }
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
