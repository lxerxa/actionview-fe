import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { FieldTypes } from '../share/Constants';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  }

  const usedKeys = [ 
    'id', 
    'type', 
    'state', 
    'assignee', 
    'reporter', 
    'modifier',
    'resolver',
    'closer',
    'created_at', 
    'updated_at', 
    'resolved_at', 
    'closed_at', 
    'regression_times', 
    'his_resolvers', 
    'resolved_logs', 
    'no', 
    'schema', 
    'parent_id', 
    'parents', 
    'subtasks', 
    'links', 
    'entry_id', 
    'definition_id', 
    'comments_num',
    'worklogs_num',
    'gitcommits_num',
    'sprint',
    'sprints',
    'filter',
    'from',
    'from_kanban_id',
    'limit',
    'page',
    'orderBy',
    'stat_x',
    'stat_y'
  ];

  if (!values.key) {
    errors.key = '必填';
  } else {
    _.forEach(props.collection, (v) => {
      usedKeys.push(v.key);
      if (v.type === 'TimeTracking') {
        usedKeys.push(v.key + '_m');
      } else if (v.type === 'MultiUser') {
        usedKeys.push(v.key + '_ids');
      }
    });
    if (usedKeys.indexOf(values.key) !== -1) {
      errors.key = '该键值已存在或已被系统使用';
    }
    if (values.type && ((values.type === 'TimeTracking' && usedKeys.indexOf(values.key + '_m') !== -1) || (values.type === 'MultiUser' && usedKeys.indexOf(values.key + '_m') !== -1))) {
      errors.key = '该键值已存在或已被系统使用';
    }
  }

  if (!values.type) {
    errors.type = '必填';
  }

  return errors;
};

@reduxForm({
  form: 'field',
  fields: [ 'name', 'key', 'type', 'applyToTypes', 'description' ],
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
    isSysConfig: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    options: PropTypes.object,
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
    const { 
      i18n: { errMsg }, 
      isSysConfig,
      fields: { name, key, type, applyToTypes, description }, 
      handleSubmit, 
      invalid, 
      options, 
      submitting } = this.props;

    const typeOptions = _.map(options.types || [], (val) => { return { label: val.name, value: val.id } });

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>创建字段</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>字段名</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='字段名'/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ key.touched && key.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>键值</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...key } placeholder='键值唯一'/>
            { key.touched && key.error && <HelpBlock style={ { float: 'right' } }>{ key.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsSelect' validationState={ type.touched && type.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>类型</ControlLabel>
            <Select 
              disabled={ submitting } 
              options={ FieldTypes } 
              simpleValue 
              value={ type.value } 
              onChange={ newValue => { type.onChange(newValue) } } 
              placeholder='请选择字段类型' 
              clearable={ false }/>
            { type.touched && type.error && <HelpBlock style={ { float: 'right' } }>{ type.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsSelect' style={ { display: isSysConfig ? 'none' : '' } }>
            <ControlLabel>适用类型</ControlLabel>
            <Select 
              disabled={ submitting } 
              multi 
              options={ typeOptions } 
              simpleValue 
              value={ applyToTypes.value || null } 
              onChange={ newValue => { applyToTypes.onChange(newValue) } } 
              placeholder='默认全部'/>
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>描述</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...description } placeholder='描述内容'/>
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
