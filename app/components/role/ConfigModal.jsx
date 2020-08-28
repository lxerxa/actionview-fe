import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, Checkbox as BootstrapCheckbox } from 'react-bootstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { Permissions } from '../share/Constants';

const img = require('../../assets/images/loading.gif');

@reduxForm({
  form: 'permissions',
  fields: [ 'permissions' ]
})
export default class ConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.allPermissions = [];
    _.forEach(Permissions, (v) => { this.allPermissions = this.allPermissions.concat(v); });
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    setPermission: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, setPermission, data, close } = this.props;
    const ecode = await setPermission(_.assign({}, values, { id: data.id }));
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('Setup complete', 'success', 2000);
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

  componentWillMount() {
    const { initializeForm, data } = this.props;
    initializeForm(data);
  }

  rows(fields) {
    const rows = [];
    for(let i = 0; i < fields.length; i = i + 2) {
      rows.push(
        <li>
          <div style={ { width: '50%', display: 'inline-block' } }>
            <Checkbox value={ fields[i].id }/>
            <span> { fields[i].name || '' }</span>
          </div>
          <div style={ { width: '50%', display: 'inline-block' } }>
            { fields[i + 1] && <Checkbox value={ fields[i + 1].id }/> }
            <span> { fields[i + 1] && fields[i + 1].name || '' }</span>
          </div>
        </li>);
    }
    return rows;
  }

  render() {
    const { i18n: { errMsg }, fields: { permissions }, handleSubmit, submitting, data } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>Rights profile - { data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body style={ { maxHeight: '580px', overflow: 'auto' } }>
          <FormGroup controlId='formControlsText'>
            <CheckboxGroup 
              name='permissions' 
              value={ permissions.value || [] } 
              onChange={ (newValue) => { permissions.onChange(newValue) } } 
              style={ { marginLeft: '10px' } }>
              <ControlLabel>Project</ControlLabel>
              <ui className='list-unstyled clearfix'>
                { this.rows(Permissions.project) }
              </ui>
              <ControlLabel style={ { marginTop: '10px', marginBottom: '0px' } }>Issue</ControlLabel>
              <ui className='list-unstyled clearfix'>
                { this.rows(Permissions.issue) }
              </ui>
              <ControlLabel style={ { marginTop: '10px', marginBottom: '0px' } }>Files</ControlLabel>
              <ui className='list-unstyled clearfix'>
                { this.rows(Permissions.files) }
              </ui>
              <ControlLabel style={ { marginTop: '10px', marginBottom: '0px' } }>Comments</ControlLabel>
              <ui className='list-unstyled clearfix'>
                { this.rows(Permissions.comments) }
              </ui>
              <ControlLabel style={ { marginTop: '10px', marginBottom: '0px' } }>Work log</ControlLabel>
              <ui className='list-unstyled clearfix'>
                { this.rows(Permissions.worklogs) }
              </ui>
            </CheckboxGroup>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <BootstrapCheckbox
            checked={ permissions.value && this.allPermissions.length == permissions.value.length }
            onClick={ () => {
              if (this.allPermissions.length === permissions.value.length) {
                permissions.onChange([]);
              } else {
                permissions.onChange(_.map(this.allPermissions, (v) => v.id));
              }
            } }
            style={ { float: 'left', margin: '5px 5px' } }>
            Select all
          </BootstrapCheckbox>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting } type='submit'>Submit</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>Cancel</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
