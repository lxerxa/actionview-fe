import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.first_name) {
    errors.first_name = '必填';
  } 

  if (!values.email) {
    errors.email = '必填';
  } else if (!/^(\w-*\.*)+@(\w+[\w|-]*)+(\.\w+[\w|-]*)*(\.\w{2,})+$/.test(values.email)) {
    errors.email = '格式有误';
  } 

  if (values.mobile) {
    if (!/^1(3|4|5|6|7|8)\d{9}$/.test(values.mobile)) {
      errors.mobile = '格式有误';
    }
  }
  return errors;
};

@reduxForm({
  form: 'user',
  fields: [ 'first_name', 'email', 'mobile' ],
  validate
})
export default class CreateModal extends Component {
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
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, create, close } = this.props;
    const ecode = await create(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('创建完成。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { first_name, email, mobile }, handleSubmit, invalid, submitting } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>添加用户</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ first_name.touched && first_name.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>姓名</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...first_name } placeholder='姓名'/>
            { first_name.touched && first_name.error && <HelpBlock style={ { float: 'right' } }>{ first_name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ email.touched && email.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>邮箱</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...email } placeholder='Email'/>
            { email.touched && email.error && <HelpBlock style={ { float: 'right' } }>{ email.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ mobile.touched && mobile.error ? 'error' : null }>
            <ControlLabel>手机</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...mobile } placeholder='手机号'/>
            { mobile.touched && mobile.error && <HelpBlock style={ { float: 'right' } }>{ mobile.error }</HelpBlock> }
          </FormGroup>
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
