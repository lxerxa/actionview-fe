import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import ApiClient from '../../../shared/api-client';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  }
  if (!values.principal) {
    errors.principal = '必填';
  }
  return errors;
};

@reduxForm({
  form: 'project',
  fields: ['id', 'name', 'principal', 'description'],
  validate
})
export default class EditModal extends Component {
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
    dirty: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    initializeForm(data);
  }
  
  async searchUsers(input) {
    input = input.toLowerCase();
    if (!input)
    {
      return { options: [] };
    }
    const api = new ApiClient;
    const results = await api.request( { url: '/user/search?s=' + input } );
    return { options: _.map(results.data, (val) => { val.name = val.name + '(' + val.email + ')'; return val; }) };
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update(values.id, _.extend(_.omit(values, ['id']), { principal: values.principal && values.principal.id || '' }));
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('项目已更新。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { id, name, principal, description }, handleSubmit, invalid, dirty, submitting, data } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '编辑项目 - ' + data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>名称</ControlLabel>
            <FormControl type='hidden' { ...id }/>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='问题状态名'/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ principal.touched && principal.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>责任人</ControlLabel>
            <Select.Async 
              clearable={ false } 
              disabled={ submitting } 
              options={ [] } 
              value={ principal.value } 
              onChange={ (newValue) => { principal.onChange(newValue) } } 
              valueKey='id' 
              labelKey='name' 
              loadOptions={ this.searchUsers.bind(this) } 
              placeholder='输入责任人'/>
            { principal.touched && principal.error && <HelpBlock style={ { float: 'right' } }>{ principal.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>描述</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...description } placeholder='状态描述'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ !dirty || submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
