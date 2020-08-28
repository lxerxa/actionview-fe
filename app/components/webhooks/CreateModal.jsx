import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.request_url) {
    errors.request_url = 'Required';
  } 
  return errors;
};

@reduxForm({
  form: 'webhooks',
  fields: [ 'request_url', 'token', 'events' ],
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
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, create, close } = this.props;
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
    const { i18n: { errMsg }, fields: { request_url, token, events }, handleSubmit, invalid, submitting } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>New Webhooks</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ request_url.touched && request_url.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>请求Url</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...request_url } placeholder='http://example.com/postreceive'/>
            { request_url.touched && request_url.error && <HelpBlock style={ { float: 'right' } }>{ request_url.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>安全令牌</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...token }/>
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>事件</ControlLabel>
            <CheckboxGroup 
              name='events' 
              value={ events.value || [] } 
              onChange={ (newValue) => { events.onChange(newValue) } } 
              style={ { marginLeft: '10px' } }>
              <ui className='list-unstyled clearfix'>
                <li>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='create_issue'/>
                    <span> Create issue</span>
                  </div>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='edit_issue'/>
                    <span> Edit issue</span>
                  </div>
                </li>
                <li>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='del_issue'/>
                    <span> Delete issue</span>
                  </div>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='resolve_issue'/>
                    <span> Resolve issue</span>
                  </div>
                </li>
                <li>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='close_issue'/>
                    <span> Close issue</span>
                  </div>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='reopen_issue'/>
                    <span> Reopen</span>
                  </div>
                </li>
                <li>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='add_worklog'/>
                    <span> Add worklog</span>
                  </div>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='edit_worklog'/>
                    <span> Edit worklog</span>
                  </div>
                </li>
                <li>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='create_version'/>
                    <span> New version</span>
                  </div>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='edit_version'/>
                    <span> Edit version</span>
                  </div>
                </li>
                <li>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='release_version'/>
                    <span> Release version</span>
                  </div>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='merge_version'/>
                    <span> Merge version</span>
                  </div>
                </li>
                <li>
                  <div style={ { width: '50%', display: 'inline-block' } }>
                    <Checkbox value='del_version'/>
                    <span> Delete version</span>
                  </div>
                </li>
              </ui>
            </CheckboxGroup>
          </FormGroup>
          {/*<FormGroup controlId='formControlsText'>
            <ControlLabel>SSL安全验证</ControlLabel>
            <CheckboxGroup 
              name='ssl' 
              value={ ssl.value || [] } 
              onChange={ (newValue) => { ssl.onChange(newValue) } } 
              style={ { marginLeft: '10px' } }>
              <Checkbox value='1' disabled={ submitting }/>
              <span> enable</span>
            </CheckboxGroup>
          </FormGroup>*/}
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
