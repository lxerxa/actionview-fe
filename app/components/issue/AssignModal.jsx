import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.assignee) {
    errors.assignee = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'assign',
  fields: [ 'assignee' ],
  validate
})
export default class AssignModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    setAssignee: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, setAssignee, close, issue } = this.props;
    const ecode = await setAssignee(issue.id, values, true);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('已分配。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { assignee }, handleSubmit, invalid, submitting, issue, options } = this.props;

    const assigneeOptions = _.map(options.assignees || [], (val) => { return { label: val.name + '(' + val.email + ')', value: val.id } });

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '分配经办人 - ' + issue.no }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ assignee.touched && assignee.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>分配给</ControlLabel>
            <Select 
              simpleValue 
              clearable={ false } 
              disabled={ submitting } 
              options={ assigneeOptions } 
              value={ assignee.value } 
              onChange={ (newValue) => { assignee.onChange(newValue) } } 
              placeholder='选择经办人'/>
            { assignee.touched && assignee.error && <HelpBlock style={ { float: 'right' } }>{ assignee.error }</HelpBlock> }
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
