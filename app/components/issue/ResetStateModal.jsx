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
    errors.assignee = '必填';
  }
  return errors;
};

@reduxForm({
  form: 'resetstate',
  fields: [ 'assignee', 'resolution' ],
  validate
})
export default class ResetStateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    issue: PropTypes.object.isRequired
  }

  async handleSubmit() {
    const { close, values, resetState, issue } = this.props;
    const ecode = await resetState(issue.id, values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('问题已重置。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  componentWillMount() {
    const { initializeForm, issue } = this.props;
    const values = { resolution: issue.resolution, assignee: issue.assignee.id };
    initializeForm(values);
  }

  render() {
    const { i18n: { errMsg }, fields: { assignee, resolution }, options, issue, handleSubmit, invalid, submitting } = this.props;

    const assigneeOptions = _.map(options.assignees || [], (val) => { return { label: val.name + '(' + val.email + ')', value: val.id } });
    const resolutionOptions = _.map(options.resolutions, (val) => { return { label: val.name, value: val.id } });

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '重置状态 - ' + issue.no }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <div className='info-col' style={ { marginTop: '5px' } }>
            <div className='info-icon'><i className='fa fa-info-circle'></i></div>
            <div className='info-content'>如重置此问题，原来的流程信息将会丢失，状态被初始化为开始值。</div>
          </div>
          <FormGroup controlId='formControlsText' validationState={ assignee.touched && assignee.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>分配给</ControlLabel>
            <Select
              simpleValue
              clearable={ false }
              disabled={ submitting }
              options={ assigneeOptions }
              value={ assignee.value || null }
              onChange={ (newValue) => { assignee.onChange(newValue) } }
              placeholder='选择经办人'/>
            { assignee.touched && assignee.error && <HelpBlock style={ { float: 'right' } }>{ assignee.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ resolution.touched && resolution.error ? 'error' : null }>
            <ControlLabel>解决结果</ControlLabel>
            <Select
              simpleValue
              clearable={ false }
              disabled={ submitting }
              options={ resolutionOptions }
              value={ resolution.value || null }
              onChange={ (newValue) => { resolution.onChange(newValue) } }
              placeholder='选择解决结果'/>
            { assignee.touched && assignee.error && <HelpBlock style={ { float: 'right' } }>{ assignee.error }</HelpBlock> }
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
