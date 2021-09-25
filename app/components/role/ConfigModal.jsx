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
      notify.show('设置完成。', 'success', 2000);
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
            <label style={ { fontWeight: 400 } }>
              <Checkbox value={ fields[i].id }/>
              <span> { fields[i].name || '' }</span>
            </label>
          </div>
          <div style={ { width: '50%', display: 'inline-block' } }>
            <label style={ { fontWeight: 400 } }>
              { fields[i + 1] && <Checkbox value={ fields[i + 1].id }/> }
              <span> { fields[i + 1] && fields[i + 1].name || '' }</span>
            </label>
          </div>
        </li>);
    }
    return rows;
  }

  render() {
    const { i18n: { errMsg }, fields: { permissions }, handleSubmit, submitting, data } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>权限配置 - { data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body style={ { maxHeight: '580px', overflow: 'auto' } }>
          <FormGroup controlId='formControlsText'>
            <CheckboxGroup 
              name='permissions' 
              value={ permissions.value || [] } 
              onChange={ (newValue) => { permissions.onChange(newValue) } } 
              style={ { marginLeft: '10px' } }>
              <ControlLabel>项目</ControlLabel>
              <ui className='list-unstyled clearfix'>
                { this.rows(Permissions.project) }
              </ui>
              <ControlLabel style={ { marginTop: '10px', marginBottom: '0px' } }>问题</ControlLabel>
              <ui className='list-unstyled clearfix'>
                { this.rows(Permissions.issue) }
              </ui>
              <ControlLabel style={ { marginTop: '10px', marginBottom: '0px' } }>附件</ControlLabel>
              <ui className='list-unstyled clearfix'>
                { this.rows(Permissions.files) }
              </ui>
              <ControlLabel style={ { marginTop: '10px', marginBottom: '0px' } }>评论</ControlLabel>
              <ui className='list-unstyled clearfix'>
                { this.rows(Permissions.comments) }
              </ui>
              <ControlLabel style={ { marginTop: '10px', marginBottom: '0px' } }>工作日志</ControlLabel>
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
            全部选择
          </BootstrapCheckbox>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
