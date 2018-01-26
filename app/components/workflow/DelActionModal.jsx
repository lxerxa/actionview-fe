import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import _ from 'lodash';

const validate = (values) => {
  const errors = {};
  if (!values.actions) {
    errors.actions = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'delAction',
  fields: [ 'actions' ],
  validate
})
export default class DelActionModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    data: PropTypes.object,
    stepData: PropTypes.object,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  handleSubmit() {
    const { values, stepData, del, close } = this.props;
    del(stepData.id, _.map(values.actions, _.iteratee('value')));
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
    const { fields: { actions }, submitting, invalid, stepData, handleSubmit } = this.props;
    const actionOptions = _.map(stepData.actions || [], (val) => { return { label: val.name, value: val.id } });

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ stepData.name } - 删除动作</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>工作流动作</ControlLabel>
            <Select 
              options={ actionOptions } 
              value={ actions.value } 
              onChange={ newValue => { actions.onChange(newValue) } } 
              placeholder='请选择要删除动作' 
              clearable={ false } 
              searchable={ false } 
              multi/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
