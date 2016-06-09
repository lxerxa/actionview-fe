import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { findDOMNode } from 'react-dom';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import CheckboxGroup from 'react-checkbox-group';
import RadioGroup from 'react-radio-group';
import DateTime from 'react-datetime';
import _ from 'lodash'

const img = require('../../assets/images/loading.gif');

@reduxForm({
  form: 'field',
  fields: [ 'defaultValue' ]
})
export default class DefaultValueConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    //this.state.type = props.data.type;
    //this.state.optionValues = props.data.optionValues || [];
    //this.state.defaultValue = props.data.defaultValue || [];
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
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
    initializeForm(data);
  }

  async handleSubmit() {
    const { values, config, close } = this.props;
    const ecode = await config(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
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

  render() {
    const { fields: { id, defaultValue }, dirty, handleSubmit, invalid, submitting, data } = this.props;

    let optionValues = [];
    let defaultComponent = {};
    if (data.type === 'Select' || data.type === 'MultiSelect') {
      if (data.optionValues) {
        optionValues = _.map(data.optionValues || [], function(val) {
          return { label: val, value: val };
        });
      }
      defaultComponent = ( <Select options={ optionValues } simpleValue multi={ data.type === 'MultiSelect' && true } value={ defaultValue.value } onChange={ newValue => { defaultValue.onChange(newValue) } } placeholder='请设置默认值'/> ); 
    } else if (data.type === 'RadioGroup') {
      defaultComponent = (
        <RadioGroup selectedValue={ defaultValue.value } onChange={ newValue => { defaultValue.onChange(newValue) } }>
        {
          Radio => (
            <ul>
            {
              _.map(data.optionValues, function (val, i) {
                return ( <li key={ i }><Radio value = { val }/> { val }</li> );
              })
            }
            </ul>
          )
        }
        </RadioGroup>
      );
    } else if (data.type === 'CheckboxGroup') {
      defaultComponent = ( 
        <CheckboxGroup value={ defaultValue.value } onChange={ newValue => { defaultValue.onChange(newValue) } }> 
        {
          Checkbox => (
            <ul>
            { 
              _.map(data.optionValues, function (val, i) { 
                return ( <li key={ i }><Checkbox value = { val }/> { val }</li> );
              })
            }
            </ul>
          )
        }
        </CheckboxGroup>
      ); 
    } else if (data.type === 'TextArea') {
      defaultComponent = ( <FormControl componentClass='textarea' { ...defaultValue } placeholder='请输入默认值'/> );
    } else if (data.type === 'DatePicker' || data.type === 'DateTimePicker' ) {
      defaultComponent = ( <DateTime locale='zh-cn' mode='date' dateFormat='YYYY/MM/DD' timeFormat= { data.type === 'DateTimePicker' ? 'HH:mm:ss' : '' } value={ defaultValue.value } onChange={ newValue => { defaultValue.onChange(newValue) } }/> );
    } else {
      defaultComponent = ( <FormControl type='text' { ...defaultValue } placeholder='请输入默认值'/> );
    }

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>{ '字段默认值配置 - ' + data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId='formControlsText'>
            <FormControl type='hidden' { ...id }/>
            <ControlLabel>默认值</ControlLabel>
            { defaultComponent }
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && 'aaaa' }</span>
          <image src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button className='ralign' disabled={ submitting || !dirty } type='submit'>确定</Button>
          <Button disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
