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
    errors.name = 'Required';
  } else if (_.findIndex(props.collection || [], { name: values.name }) !== -1) {
    errors.name = '该名称已存在';
  }

  return errors;
};

@reduxForm({
  form: 'module',
  fields: ['name', 'defaultAssignee', 'principal', 'description'],
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
    if (!values.defaultAssignee)
    {
      values.defaultAssignee = 'projectPrincipal';
    }

    const ecode = await create(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('New 完成。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { name, defaultAssignee, principal, description }, options={}, handleSubmit, invalid, submitting } = this.props;

    const assigneeOptions = [ { value: 'projectPrincipal', label: '项目负责人' }, { value: 'modulePrincipal', label: '模块负责人' }, { value: 'none', label: '未分配' } ];

    const userOptions = _.map(options.users || [], (value) => { return { value: value.id, label: value.name + '(' + value.email + ')' } });

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>创建模块</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>Name</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='模块名'/ >
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>Principal responsible</ControlLabel>
            <Select 
              disabled={ submitting } 
              clearable={ true } 
              value={ principal.value } 
              onChange={ newValue => { principal.onChange(newValue) } } 
              options={ userOptions } 
              placeholder='选择责任人'/>
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>Default assignee</ControlLabel>
            <Select 
              disabled={ submitting } 
              options={ assigneeOptions } 
              clearable={ true } 
              value={ defaultAssignee.value } 
              onChange={ newValue => { defaultAssignee.onChange(newValue) } } 
              placeholder='Default assignee(项目负责人)'/>
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>Description</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...description } placeholder='Description'/>
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
