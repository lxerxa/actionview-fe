import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.email) {
    errors.email = '邮箱不能为空';
  } else if (!/^(\w-*\.*)+@(\w+[\w|-]*)+(\.\w+[\w|-]*)*(\.\w{2,})+$/.test(values.email)) {
    errors.email = '输入格式有误';
  }
  return errors;
};

@reduxForm({
  form: 'bindemail',
  fields: ['email'],
  validate
})
export default class BindEmailModal extends Component {
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
    update: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update({ bind_email: values.email });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('已设置。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { email }, handleSubmit, invalid, submitting } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>邮箱绑定</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ email.touched && email.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>关联邮箱</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...email } placeholder='关联邮箱'/>
            { email.touched && email.error && <HelpBlock style={ { float: 'right' } }>{ email.error }</HelpBlock> }
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
