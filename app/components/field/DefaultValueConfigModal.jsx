import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { findDOMNode } from 'react-dom';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import DateTime from 'react-datetime';
import _ from 'lodash'
import { notify } from 'react-notify-toast';

var moment = require('moment');
const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const { data } = props;

  const errors = {};
  if (data.type === 'Number') {
    if (values.defaultValue && isNaN(values.defaultValue)) {
      errors.defaultValue = '格式错误';
    }
  } else if (data.type === 'DatePicker') {
    if (values.defaultValue && !moment(values.defaultValue).isValid()) {
      errors.defaultValue = '格式错误';
    }
  }

  return errors;
};
@reduxForm({
  form: 'field',
  fields: [ 'id', 'defaultValue' ],
  validate
})
export default class DefaultValueConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    optionValues: PropTypes.array,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    dirty: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    config: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    if ((data.type === 'MultiSelect' || data.type === 'CheckboxGroup') && _.isArray(data.defaultValue)) {
      data.defaultValue = data.defaultValue.join(',');
    } else if (data.type === 'DatePicker') {
      data.defaultValue = moment.unix(data.defaultValue);
    }
    initializeForm(data);
  }

  async handleSubmit() {
    const { values, config, close, data } = this.props;
    if (data.type === 'DatePicker' && values.defaultValue) {
      values.defaultValue = parseInt(moment(values.defaultValue).startOf('day').format('X')); 
    }
    //alert(JSON.stringify(values));
    const ecode = await config(values);
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

  render() {
    const { i18n: { errMsg }, fields: { id, defaultValue }, dirty, handleSubmit, invalid, submitting, data } = this.props;

    let optionValues = [];
    let defaultComponent = {};
    if (data.type === 'Select' || data.type === 'MultiSelect' || data.type === 'CheckboxGroup' || data.type === 'RadioGroup') {
      if (data.optionValues) {
        optionValues = _.map(data.optionValues || [], function(val) {
          return { label: val.name, value: val.id };
        });
      }
      defaultComponent = ( 
        <Select 
          options={ optionValues } 
          simpleValue 
          multi={ data.type === 'CheckboxGroup' || data.type === 'MultiSelect' } 
          value={ defaultValue.value } 
          onChange={ newValue => { defaultValue.onChange(newValue) } } 
          placeholder='设置默认值'/> ); 
    } else if (data.type === 'TextArea') {
      defaultComponent = ( 
        <FormControl 
          componentClass='textarea' 
          { ...defaultValue } 
          placeholder='输入默认值'/> );
    } else if (data.type === 'DatePicker') {
      defaultComponent = ( 
       <DateTime 
         mode='date' 
         closeOnSelect 
         dateFormat='YYYY/MM/DD' 
         timeFormat= { false } 
         value={ defaultValue.value } 
         onChange={ newValue => { defaultValue.onChange(newValue) } }/> );
    } else {
      defaultComponent = ( 
        <FormControl 
          type='text' 
          { ...defaultValue } 
          placeholder='输入默认值'/> );
    }

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '字段默认值配置 - ' + data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ defaultValue.value && defaultValue.error ? 'error' : '' }>
            <FormControl type='hidden' { ...id }/>
            <ControlLabel>默认值</ControlLabel>
            { defaultComponent }
            { defaultValue.value && defaultValue.error && <HelpBlock>{ defaultValue.error }</HelpBlock> }
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || !dirty || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
