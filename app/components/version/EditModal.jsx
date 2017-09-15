import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import DateTime from 'react-datetime';
import { notify } from 'react-notify-toast';

var moment = require('moment');
const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  } else if (props.data.name !== values.name && _.findIndex(props.collection || [], { name: values.name }) !== -1) {
    errors.name = '该名称已存在';
  }

  if (values.start_time) {
    if (!moment(values.start_time).isValid()) {
      errors.start_time = '格式错误';
    }
  }

  if (values.end_time) {
    if (!moment(values.end_time).isValid()) {
      errors.end_time = '格式错误';
    }
  }

  if (values.start_time && values.end_time) {
    if (values.start_time > values.end_time)
    {
      errors.start_time = '开始时间要早于结束时间';
    }
  }

  return errors;
};

@reduxForm({
  form: 'version',
  fields: ['id', 'name', 'start_time', 'end_time', 'description'],
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
    edit: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    initializeForm({ ...data, start_time: data.start_time ? moment.unix(data.start_time) : data.start_time, end_time: data.end_time ? moment.unix(data.end_time) : data.end_time });
  }

  async handleSubmit() {
    const { values, edit, close } = this.props;

    if (values.start_time) {
      values.start_time = parseInt(moment(values.start_time).startOf('day').format('X'));
    }
    if (values.end_time) {
      values.end_time = parseInt(moment(values.end_time).endOf('day').format('X'));
    }

    const ecode = await edit(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('更新完成。', 'success', 2000);
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
    const { 
      i18n: { errMsg }, 
      fields: { id, name, start_time, end_time, description }, 
      handleSubmit, 
      invalid, 
      dirty, 
      submitting, 
      data } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '编辑版本 - ' + data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>名称</ControlLabel>
            <FormControl type='hidden' { ...id }/>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='版本名'/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ start_time.value && start_time.error ? 'error' : '' }>
            <ControlLabel>开始时间</ControlLabel>
            <DateTime 
              locale='zh-cn' 
              mode='date' 
              closeOnSelect 
              dateFormat='YYYY/MM/DD' 
              timeFormat={ false } 
              value={ start_time.value } 
              onChange={ newValue => { start_time.onChange(newValue) } }/>
            { start_time.value && start_time.error && <HelpBlock style={ { float: 'right' } }>{ start_time.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ end_time.value && end_time.error ? 'error' : '' }>
            <ControlLabel>结束时间</ControlLabel>
            <DateTime 
              locale='zh-cn' 
              mode='date' 
              closeOnSelect 
              dateFormat='YYYY/MM/DD' 
              timeFormat={ false } 
              value={ end_time.value } 
              onChange={ newValue => { end_time.onChange(newValue) } }/>
            { end_time.value && end_time.error && <HelpBlock style={ { float: 'right' } }>{ end_time.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>描述</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...description } placeholder='描述'/>
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
