import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  } else if (values.name.indexOf(' ') !== -1) {
    errors.name = '步骤名称不能有空格';
  } else if (props.data.name !== values.name && _.findIndex(props.collection || [], { name: values.name }) !== -1) {
    errors.name = '该步骤已存在';
  }

  if (!values.state) {
    errors.state = '必选';
  }
  return errors;
};

@reduxForm({
  form: 'wfconfig',
  fields: [ 'id', 'name', 'state' ],
  validate
})
export default class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    submitting: PropTypes.bool,
    dirty: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    data: PropTypes.object,
    options: PropTypes.object,
    collection: PropTypes.array,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    initializeForm(data);
  }

  handleSubmit() {
    const { values, edit, close } = this.props;
    edit(values);
    close();
  }

  handleCancel() {
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    close();
  }

  render() {
    const { 
      fields: { id, name, state }, 
      dirty, 
      handleSubmit, 
      invalid, 
      submitting, 
      data, 
      options, 
      collection } = this.props;

    const stateOptions = _.map(_.filter(options.states || [], (o) => { return _.findIndex(collection, { state: o.id }) === -1 || o.id === data.state }), (val) => { return { label: val.name, value: val.id } });

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>编辑步骤 - { data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
            <FormControl type='hidden' { ...id }/>
            <ControlLabel>
              <span className='txt-impt'>*</span>步骤名
            </ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='步骤名'/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>
              <span className='txt-impt'>*</span>链接状态
            </ControlLabel>
            <Select 
              disabled={ submitting } 
              options={ stateOptions } 
              simpleValue 
              value={ state.value } 
              onChange={ newValue => { state.onChange(newValue) } } 
              placeholder='请选择状态' 
              clearable={ false } 
              searchable={ false }/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={ !dirty || submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
