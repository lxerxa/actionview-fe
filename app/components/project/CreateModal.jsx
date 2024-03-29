import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import ApiClient from '../../../shared/api-client';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  } 
  if (props.mode == 'admin' && !values.principal) {
    errors.principal = '必填';
  } 
  if (!values.key) {
    errors.key = '必填';
  } else {
    const Regex = '^\\w+$';
    const re = new RegExp(Regex);
    if (!re.test(values.key)) {
      errors.key = '需输入英文字符、数字或下划线';
    }
  } 
  return errors;
};


const asyncValidate = (values) => {
  return new Promise(async (resolve, reject) => {
    const api = new ApiClient;
    const results = await api.request({ url: '/project/checkkey/' + values.key });
    if (results.data && results.data.flag == '2') {
      reject({ key: '键值已被占用' });
    } else {
      resolve();
    }
  });
};

@reduxForm({
  form: 'project',
  fields: ['name', 'key', 'principal', 'description'],
  asyncValidate,
  asyncBlurFields: [ 'key' ],
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
    mode: PropTypes.object,
    asyncValidating: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { mode, values, create, close } = this.props;

    let principal = '';
    if (mode == 'admin') {
      principal = values.principal && values.principal.id || '';
    } else {
      principal = 'self';
    }

    const ecode = await create({ ...values, principal }, mode);
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

  async searchUsers(input) {
    input = input.toLowerCase();
    if (!input)
    {
      return { options: [] };
    }
    const api = new ApiClient;
    const results = await api.request( { url: '/user/search?s=' + input } );
    return { options: _.map(results.data, (val) => { val.name = val.name + '(' + val.email + ')'; return val; }) };
  }

  render() {
    const { 
      i18n: { errMsg }, 
      mode,
      asyncValidating, 
      fields: { name, key, principal, description }, 
      handleSubmit, 
      invalid, 
      submitting 
    } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>创建项目</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>名称</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='项目名'/>
            <FormControl.Feedback/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ key.touched && key.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>键值</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...key } placeholder='键值'/>
            <FormControl.Feedback>
            { asyncValidating ? <i className='fa fa-spinner fa-spin'></i> : (key.active === false && key.invalid === false ? <span style={ { color : '#3c763d' } }><i className='fa fa-check'></i></span> : '') }
            </FormControl.Feedback>
            { key.touched && key.error && <HelpBlock style={ { float: 'right' } }>{ key.error }</HelpBlock> }
          </FormGroup>
          { mode == 'admin' &&
          <FormGroup controlId='formControlsText' validationState={ principal.touched && principal.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>责任人</ControlLabel>
            <Select.Async 
              clearable={ false } 
              disabled={ submitting } 
              options={ [] } 
              value={ principal.value } 
              onChange={ (newValue) => { principal.onChange(newValue) } } 
              valueKey='id' 
              labelKey='name' 
              loadOptions={ this.searchUsers.bind(this) } 
              placeholder='输入责任人'/>
            { principal.touched && principal.error && <HelpBlock style={ { float: 'right' } }>{ principal.error }</HelpBlock> }
          </FormGroup> }
          <FormGroup controlId='formControlsText'>
            <ControlLabel>描述</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...description } placeholder='项目描述'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ key.active === true || asyncValidating || submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
