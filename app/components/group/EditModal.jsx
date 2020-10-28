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
  return errors;
};

@reduxForm({
  form: 'group',
  fields: [ 'id', 'name', 'principal', 'scope', 'description' ],
  validate
})
export default class EditModal extends Component {
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
    dirty: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update(values.id, _.omit({ ...values, principal: values.principal && values.principal.id || '' }, ['id']));
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('组信息已更新。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
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

  handleCancel() {
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    initializeForm(data);
  }

  render() {
    const { 
      i18n: { errMsg }, 
      fields: { id, name, principal, scope, description }, 
      dirty, 
      handleSubmit, 
      invalid, 
      submitting 
    } = this.props;

    const scopeOptions = [{ label: '公开（所有人可对其授权）', value: 1 }, { label: '私有（仅负责人可对其授权）', value: 2 }, { label: '成员可见（仅组成员和负责人可对其授权）', value: 3 }];

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>编辑用户组</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>组名</ControlLabel>
            <FormControl type='hidden' { ...id }/>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='组名'/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup validationState={ principal.touched && principal.error ? 'error' : null }>
            <ControlLabel>负责人</ControlLabel>
            <Select.Async
              clearable={ false }
              disabled={ submitting }
              options={ [] }
              value={ principal.value }
              onChange={ (newValue) => { principal.onChange(newValue) } }
              valueKey='id'
              labelKey='name'
              loadOptions={ this.searchUsers.bind(this) }
              placeholder='输入负责任(默认是系统管理员)'/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>公开范围</ControlLabel>
            <Select
              disabled={ submitting }
              options={ scopeOptions }
              simpleValue
              clearable={ false }
              value={ scope.value || 1 }
              onChange={ newValue => { scope.onChange(newValue) } }
              placeholder='请选择公开范围'/>
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>描述</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...description } placeholder='描述'/>
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
