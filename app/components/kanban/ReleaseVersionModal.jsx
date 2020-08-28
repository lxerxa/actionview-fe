import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock, Checkbox } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import DateTime from 'react-datetime';
import { notify } from 'react-notify-toast';

const moment = require('moment');
const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  if (_.findIndex(props.options.versions || [], { name: values.name }) !== -1) {
    errors.name = '该版本已存在';
  }
  return errors;
};

@reduxForm({
  form: 'releasekanban',
  fields: [ 'name', 'description' ],
  validate
})
export default class ReleaseVersionModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, isSendMsg: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    release: PropTypes.func.isRequired,
    releasedIssues: PropTypes.array.isRequired,
    initializeForm: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { release, releasedIssues, values, close } = this.props;

    const ecode = await release({ 
      ids: _.map(releasedIssues, (v) => v.id), 
      isSendMsg: this.state.isSendMsg, 
      name: values.name, 
      description: values.description 
    });

    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('已发布。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { name, description }, handleSubmit, invalid, submitting, options } = this.props;

    const versionOptions = _.map(options.versions || [], (val) => { return { label: val.name, value: val.id } });

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>版本发布</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>版本名称</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='版本名称'/ >
            { name.touched && name.error &&
              <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          {/*<FormGroup controlId='formControlsText' validationState={ end_time.value && end_time.error ? 'error' : null }>
            <ControlLabel>Release date</ControlLabel>
            <DateTime
              locale='zh-cn'
              mode='date'
              closeOnSelect
              dateFormat='YYYY/MM/DD'
              timeFormat={ false }
              defaultValue={ moment() }
              value={ end_time.value }
              onChange={ newValue => { end_time.onChange(newValue) } }/>
            { end_time.value && end_time.error && <HelpBlock style={ { float: 'right' } }>{ end_time.error }</HelpBlock> }
          </FormGroup>*/}
          <FormGroup controlId='formControlsText'>
            <ControlLabel>Description</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...description } placeholder='Description'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Checkbox
            disabled={ submitting }
            checked={ this.state.isSendMsg }
            onClick={ () => { this.setState({ isSendMsg: !this.state.isSendMsg }) } }
            style={ { display: 'inline-block', marginRight: '20px', marginLeft: '10px' } }>
            通知项目成员
          </Checkbox>
          <Button disabled={ submitting || invalid } type='submit'>Submit</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>Cancel</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
