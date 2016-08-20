import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  if (!values.state) {
    errors.name = 'Required';
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
    optionValues: PropTypes.array,
    submitting: PropTypes.bool,
    dirty: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    data: PropTypes.object,
    options: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    initializeForm(data);
  }

  async handleSubmit() {
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
    const { fields: { id, name, state }, dirty, handleSubmit, invalid, submitting, data, options } = this.props;

    const stateOptions = _.map(options.states || [], (val) => { return { label: val.name, value: val.id } });

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>新建步骤</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body className={ submitting ? 'disable' : 'enable' }>
          <FormGroup controlId='formControlsText'>
            <FormControl type='hidden' { ...id }/>
            <ControlLabel>步骤名</ControlLabel>
            <FormControl type='text' { ...name } placeholder='步骤名'/>
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>链接状态</ControlLabel>
            <Select options={ stateOptions } simpleValue value={ state.value } onChange={ newValue => { state.onChange(newValue) } } placeholder='请选择状态' clearable={ false } searchable={ false }/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button className='ralign' disabled={ !dirty || submitting || invalid } type='submit'>确定</Button>
          <Button disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
