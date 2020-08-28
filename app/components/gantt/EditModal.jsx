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

  if (values.expect_start_time) {
    if (!moment(values.expect_start_time).isValid()) {
      errors.expect_start_time = '格式错误';
    }
  }
  if (values.expect_complete_time) {
    if (!moment(values.expect_complete_time).isValid()) {
      errors.expect_complete_time = '格式错误';
    }
  }
  if (values.expect_start_time && values.expect_complete_time) {
    if (values.expect_start_time > values.expect_complete_time) {
      errors.expect_start_time = '开始时间要早于结束时间';
    }
  }

  if (values.progress) {
    if (isNaN(values.progress)) {
      errors.progress = '格式错误';
    } else if (values.progress < 0 || values.progress > 100) {
      errors.progress = '数值必须在0～100之间';
    }
  }
  return errors;
};

@reduxForm({
  form: 'ganttedit',
  fields: [ 'expect_start_time', 'expect_complete_time', 'progress' ],
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
    values: PropTypes.object,
    fields: PropTypes.object,
    data: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, edit, close, data } = this.props;
    
    const submitValues = {};

    if (values.expect_start_time) {
      submitValues.expect_start_time = parseInt(moment(values.expect_start_time).startOf('day').format('X'));
    } else {
      submitValues.expect_start_time = '';
    }
    if (values.expect_complete_time) {
      submitValues.expect_complete_time = parseInt(moment(values.expect_complete_time).startOf('day').format('X'));
    } else {
      submitValues.expect_complete_time = '';
    }
    if (values.progress) {
      submitValues.progress = values.progress - 0;
    } else {
      submitValues.progress = '';
    }

    const ecode = await edit(data.id, submitValues);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      notify.show('编辑完成。', 'success', 2000);
      close();
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
    initializeForm({ 
      expect_start_time: moment.unix(data.expect_start_time || data.expect_complete_time || data.created_at).startOf('day'), 
      expect_complete_time: moment.unix(data.expect_complete_time || data.expect_start_time || data.created_at),
      progress: data.progress || 0 
    });
  }

  render() {
    const { 
      i18n: { errMsg }, 
      fields: { expect_start_time, expect_complete_time, progress }, 
      handleSubmit, 
      invalid, 
      submitting,
      data } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '问题编辑 - ' + data.no }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup>
            <ControlLabel>Title</ControlLabel>
            <span style={ { marginLeft: '10px' } }>{ data.title }</span>
          </FormGroup>
          <div>
            <FormGroup style={ { width: '45%', display: 'inline-block' } } validationState={ expect_start_time.value && expect_start_time.error ? 'error' : null }>
              <ControlLabel>Expected start date</ControlLabel>
              <DateTime 
                locale='zh-cn' 
                mode='date' 
                closeOnSelect 
                dateFormat='YYYY/MM/DD' 
                timeFormat={ false } 
                value={ expect_start_time.value } 
                onChange={ newValue => { expect_start_time.onChange(newValue) } }/>
              { expect_start_time.value && expect_start_time.error && 
                <HelpBlock style={ { float: 'right' } }>{ expect_start_time.error }</HelpBlock> }
            </FormGroup>
            <FormGroup style={ { width: '45%', display: 'inline-block', float: 'right' } } validationState={ expect_complete_time.value && expect_complete_time.error ? 'error' : null }>
              <ControlLabel>Expected completion date</ControlLabel>
              <DateTime 
                locale='zh-cn' 
                mode='date' 
                closeOnSelect 
                dateFormat='YYYY/MM/DD' 
                timeFormat={ false } 
                value={ expect_complete_time.value } 
                onChange={ newValue => { expect_complete_time.onChange(newValue) } }/>
              { expect_complete_time.value && expect_complete_time.error && <HelpBlock style={ { float: 'right' } }>{ expect_complete_time.error }</HelpBlock> }
            </FormGroup>
          </div>
          <FormGroup validationState={ progress.touched && progress.error ? 'error' : null }>
            <ControlLabel>Progress</ControlLabel>
            <FormControl 
              disabled={ submitting } 
              type='number' 
              min='0'
              max='100'
              style={ { width: '80px', display: 'inline-block', marginLeft: '10px' } }
              { ...progress } 
              placeholder='Progress'/> %
            { progress.value && progress.touched && progress.error ? <HelpBlock>{ progress.error }</HelpBlock> : '' }
          </FormGroup>
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
