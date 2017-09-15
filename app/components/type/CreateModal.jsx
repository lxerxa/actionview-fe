import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  } else if (_.findIndex(props.collection || [], { name: values.name }) !== -1) {
    errors.name = '该名称已存在';
  }

  if (!values.abb) {
    errors.abb = '必填';
  } else {
    const pattern = new RegExp(/^[a-zA-Z0-9]/);
    if (!pattern.test(values.abb)) {
      errors.abb = '格式有误';
    } else if (_.findIndex(props.collection || [], { abb: values.abb }) !== -1) {
      errors.abb = '该缩码已存在';
    }
  }

  if (!values.screen_id) {
    errors.screen_id = 'Required';
  }

  if (!values.workflow_id) {
    errors.workflow_id = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'type',
  fields: ['name', 'abb', 'screen_id', 'workflow_id', 'type', 'description'],
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
    options: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, create, close } = this.props;
    const ecode = await create(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('新建完成。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { name, abb, screen_id, workflow_id, type, description }, options = {}, handleSubmit, invalid, submitting } = this.props;
    const { screens = [], workflows = [] } = options;

    if (abb.value) {
      abb.value = abb.value.toUpperCase();
      abb.value = abb.value.substring(0, 1);
    }

    const screenOptions = _.map(screens, function(val) {
      return { label: val.name, value: val.id };
    });
    const workflowOptions = _.map(workflows, function(val) {
      return { label: val.name, value: val.id };
    });
    const typeOptions = [{ label: '标准', value: 'standard' }, { label: '子任务', value: 'subtask' }]; 

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>创建问题类型</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>名称</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='问题类型名'/ >
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ abb.touched && abb.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>缩码</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...abb } placeholder='缩码(一个字母或数字)'/ >
            { abb.touched && abb.error && <HelpBlock style={ { float: 'right' } }>{ abb.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel><span className='txt-impt'>*</span>界面</ControlLabel>
            <Select 
              disabled={ submitting } 
              options={ screenOptions } 
              simpleValue 
              clearable={ false } 
              value={ screen_id.value } 
              onChange={ newValue => { screen_id.onChange(newValue) } } 
              placeholder='请选择一个界面'/>
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel><span className='txt-impt'>*</span>工作流</ControlLabel>
            <Select 
              disabled={ submitting } 
              options={ workflowOptions } 
              simpleValue clearable={ false } 
              value={ workflow_id.value } 
              onChange={ newValue => { workflow_id.onChange(newValue) } } 
              placeholder='请选择一个工作流'/>
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>类型</ControlLabel>
            <Select 
              disabled={ submitting } 
              options={ typeOptions } 
              simpleValue clearable={ false } 
              value={ type.value || 'standard' } 
              onChange={ newValue => { type.onChange(newValue) } } 
              placeholder='请选择问题类型'/>
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
