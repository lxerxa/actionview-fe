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
  } else if (_.findIndex(props.collection || [], { name: values.name }) !== -1) {
    errors.name = '该步骤已存在';
  }

  if (!values.state) {
    errors.state = '必选';
  }
  return errors;
};

@reduxForm({
  form: 'wfconfig',
  fields: [ 'name', 'state' ],
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
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    collection: PropTypes.array,
    options: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, create, close } = this.props;
    create(values);
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
      fields: { name, state }, 
      options, 
      collection, 
      handleSubmit, 
      invalid, 
      submitting } = this.props;

    const stateOptions = _.map(_.filter(options.states || [], function(o){ return _.findIndex(collection, { state: o.id }) === -1 }), (val) => { return { label: val.name, value: val.id } });

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>新建步骤</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
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
              onChange={ newValue => { state.onChange(newValue); if (!name.value) { name.onChange(_.find(stateOptions, { value: newValue }).label) } } } 
              placeholder='请选择状态' 
              clearable={ false } 
              searchable={ false }/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
