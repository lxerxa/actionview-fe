import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import ApiClient from '../../../shared/api-client';
import { notify } from 'react-notify-toast';
import { Permissions } from '../share/Constants';

const img = require('../../assets/images/loading.gif');

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'state',
  fields: ['name', 'description', 'permissions'],
  validate
})
export default class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    //this.searchUsers = this.searchUsers.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, create, close } = this.props;
    if (values.permissions)
    {
      values.permissions = _.map(values.permissions, _.iteratee('value'));
    }
    //if (values.users)
    //{
    //  values.users = _.map(values.users, _.iteratee('value'));
    //}
    const ecode = await create(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('新建完成。', 'success', 2000);
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

  //async searchUsers(input) {
  //  input = input.toLowerCase();
  //  if (!input)
  //  {
  //    return { options: [] };
  //  }
  //  const api = new ApiClient;
  //  const results = await api.request( { url: '/user?s=' + input } ); 
  //  return { options: results.data };
  //}

  render() {
    const { i18n: { errMsg }, fields: { name, description, permissions }, values, handleSubmit, invalid, submitting } = this.props;

    let permissionOptions = _.map(Permissions, function(v) { return { value: v.id, label: v.name }; });
    if (_.findIndex(permissions.value, { value: 'all' }) !== -1) {
      values.permissions = permissions.value = permissionOptions = _.reject(permissionOptions, { value: 'all' });
    }

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>创建新角色</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText'>
            <ControlLabel><span className='txt-impt'>*</span>角色名</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='角色名'/>
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>权限集</ControlLabel>
            <Select 
              multi
              disabled={ submitting } 
              clearable={ false } 
              searchable={ false } 
              options={ permissionOptions } 
              value={ permissions.value } 
              onChange={ newValue => { permissions.onChange(newValue) } } 
              placeholder='请选择权限'/>
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>描述</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...description } placeholder='描述'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
