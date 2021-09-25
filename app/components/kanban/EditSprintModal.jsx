import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import DateTime from 'react-datetime';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};

  if (!values.name) {
    errors.name = '必填';
  }

  return errors;
};

@reduxForm({
  form: 'editsprint',
  fields: ['no', 'name', 'description'],
  validate
})
export default class EditSprintModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, isSendMsg: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    dirty: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    
    const ecode = await update(values);
    this.setState({ ecode: ecode });

    if (ecode === 0) {
      notify.show('更新完成。', 'success', 2000);
      close();
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

  render() {
    const { 
      i18n: { errMsg }, 
      data,
      fields: { no, name, description }, 
      handleSubmit, 
      dirty,
      invalid, 
      submitting 
    } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>编辑 - { data.name || '' }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyUp={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body style={ { maxHeight: '580px' } }>
          <FormGroup>
            <ControlLabel><span className='txt-impt'>*</span>名称</ControlLabel>
            <FormControl type='hidden' { ...no }/>
            <FormControl
              disabled={ submitting }
              type='text'
              { ...name }
              placeholder='名称'/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>描述</ControlLabel>
            <FormControl 
              disabled={ submitting } 
              componentClass='textarea'
              style={ { height: '200px' } }
              { ...description }
              placeholder='描述'/>
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
