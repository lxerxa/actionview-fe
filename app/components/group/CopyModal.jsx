import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import ApiClient from '../../../shared/api-client';
import { notify } from 'react-notify-toast';

const $ = require('$');
const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  } 
  return errors;
};

@reduxForm({
  form: 'copy_group',
  fields: [ 'source_id', 'name', 'principal', 'public_scope', 'description' ],
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
    mode: PropTypes.string,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired
  }

  async handleSubmit() {

    const { mode, values, copy, close } = this.props;

    let principal = '';
    if (mode == 'admin') {
      principal = values.principal && values.principal.id || '';
    } else {
      principal = 'self';
    }

    const ecode = await copy({ ...values, principal, public_scope: values.public_scope || '1' });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('复制完成。', 'success', 2000);
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

  handleEntry() {
    $('input[name=name]').select();
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    const copyData = _.clone(data);
    _.extend(copyData, { name: '复制 - ' + data.name, source_id: data.id });
    initializeForm(copyData);
  }

  render() {
    const { 
      i18n: { errMsg }, 
      mode,
      fields: { source_id, name, principal, public_scope, description }, 
      handleSubmit, 
      invalid, 
      submitting 
    } = this.props;

    const scopeOptions = [
      { label: '公开（所有人可对其授权）', value: '1' }, 
      { label: '私有（仅负责人可对其授权）', value: '2' }, 
      { label: '成员可见（仅组成员和负责人可对其授权）', value: '3' }
    ];

    return (
      <Modal show onHide={ this.handleCancel } onEntered={ this.handleEntry } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>复制用户组</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormControl type='hidden' { ...source_id }/>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>组名</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='组名'/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          { mode == 'admin' &&
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
              placeholder='输入负责人(默认是系统管理员)'/>
          </FormGroup> }
          <FormGroup>
            <ControlLabel>公开范围</ControlLabel>
            <Select
              disabled={ submitting }
              options={ scopeOptions }
              simpleValue
              clearable={ false }
              value={ public_scope.value || '1' }
              onChange={ newValue => { public_scope.onChange(newValue) } }
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
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
