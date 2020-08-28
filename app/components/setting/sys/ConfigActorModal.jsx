import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import ApiClient from '../../../../shared/api-client';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

@reduxForm({
  form: 'syssetting',
  fields: [ 'sys_admin' ]
})
export default class ConfigActorModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update({ sysroles: values });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('配置完成。', 'success', 2000);
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
    _.map(data.sys_admin || [], (v, i) => {
      data.sys_admin[i].nameAndEmail = v.name + '(' + v.email + ')';
    });
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
    return { options: _.map(results.data, (val) => { val.nameAndEmail = val.name + '(' + val.email + ')'; return val; }) };
  }

  render() {
    const { i18n: { errMsg }, fields: { sys_admin }, handleSubmit, submitting } = this.props;
    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>Role配置</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>系统管理员</ControlLabel>
            <Select.Async 
              multi
              clearable={ false } 
              disabled={ submitting } 
              options={ [] } 
              value={ sys_admin.value } 
              onChange={ (newValue) => { sys_admin.onChange(newValue) } } 
              valueKey='id' 
              labelKey='nameAndEmail' 
              loadOptions={ this.searchUsers.bind(this) } 
              placeholder='输入用户'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
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
