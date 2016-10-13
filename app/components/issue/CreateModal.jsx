import React, { PropTypes, Component } from 'react';
import { Modal, Button, ControlLabel, FormControl, Form, FormGroup, Col, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { RadioGroup, Radio } from 'react-radio-group';
import DateTime from 'react-datetime';
import _ from 'lodash';

var moment = require('moment');
const img = require('../../assets/images/loading.gif');

class CreateModal extends Component {
  constructor(props) {
    super(props);
    const { config } = this.props;

    const defaultIndex = _.findIndex(config.types || [], { default: true }); 
    const schema = defaultIndex !== -1 ? config.types[defaultIndex].schema : [];
    const errors = {}, values = {};
    _.map(schema, (v) => {
      if (v.defaultValue) {
        values[v.key] = v.defaultValue;
      }
      if (v.required && !v.defaultValue) {
        errors[v.key] = 'requried';
      }
    });

    this.state = { ecode: 0, errors, touched: {}, type: defaultIndex !== -1 ? config.types[defaultIndex].id : '', schema, values };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    config: PropTypes.object,
    issue: PropTypes.object,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { create, close, config } = this.props;

    const schema = _.find(config.types, { id: this.state.type }).schema;
    const submitData = {};
    _.mapValues(this.state.values, (val, key) => {
      const index = _.findIndex(schema, { key });
      const field = index === -1 ? {} : schema[index];
      if (field.type === 'DatePicker') {
        submitData[key] = parseInt(moment(val).startOf('day').format('X')); 
      } else if (field.type === 'DateTimePicker') {
        submitData[key] = parseInt(moment(val).format('X')); 
      } else if (field.type === 'Number') {
        submitData[key] = parseInt(val);
      } else {
        submitData[key] = val; 
      }
    });
    submitData['type'] = this.state.type;
    const ecode = await create(submitData);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { close } = this.props;
    this.setState({ ecode: 0 });
    close();
  }

  typeChange(typeValue) {
    const { config } = this.props;
    const schema = _.find(config.types, { id: typeValue } ).schema;
    if (!schema) {
      return;
    }

    const errors = {}, values = {};
    _.map(schema, (v) => {
      if (this.state.errors[v.key]) {
        values[v.key] = '';
      } else if (!this.state.values[v.key] && v.defaultValue) {
        values[v.key] = v.defaultValue;
      } else if (this.state.values[v.key]) {
        values[v.key] = this.state.values[v.key];
      }

      if (v.required && !values[v.key]) {
        errors[v.key] = 'requried';
      }
    });

    this.setState({ type: typeValue, errors, touched: {}, schema, values });
  }

  render() {
    const { config, close, issue } = this.props;
    const { schema } = this.state;

    const typeOptions = _.map(config.types || [], function(val) {
      return { 
        label: (
          <span>
            <span className='type-abb'>{ val.abb }</span>
            { val.name }
          </span>), 
        value: val.id 
      };
    });

    return (
      <Modal { ...this.props } onHide={ close } bsSize='large' backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>创建问题</Modal.Title>
        </Modal.Header>
        <Modal.Body className={ issue.loading ? 'disable' : 'enable' } style={ { height: '580px', overflow: 'auto' } }>
          <Form horizontal>
            <FormGroup controlId='formControlsLabel'>
              <Col sm={ 2 } componentClass={ ControlLabel }>
                项目名称
              </Col>
              <Col sm={ 9 }>
                <div style={ { marginTop: '6px', marginBottom: '6px' } }><span>社交化项目管理系统</span></div>
              </Col>
            </FormGroup>
            <FormGroup controlId='formControlsSelect' style={ { height: '68px', borderBottom: '1px solid #ddd' } }>
              <Col sm={ 2 } componentClass={ ControlLabel }>
                <span className='txt-impt'>*</span>类型
              </Col>
              <Col sm={ 7 }>
                <Select options={ typeOptions } simpleValue searchable={ false } clearable={ false } value={ this.state.type } onChange={ this.typeChange.bind(this) } placeholder='请选择问题类型'/>
                <div><span style={ { fontSize: '12px' } }>改变问题类型可能造成已填写部分信息的丢失，建议填写信息前先确定问题类型。</span></div>
              </Col>
            </FormGroup>
            <div>
            { _.map(schema, (v, key) => {

              const title = (
                  <Col sm={ 2 } componentClass={ ControlLabel }>
                    { v.required && <span className='txt-impt'>*</span> }
                    { v.name }
                  </Col>
              );

              if (v.type === 'Text') {
                return (
                <FormGroup controlId={ key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] && 'error' }>
                  { title }
                  <Col sm={ 9 }>
                    <FormControl 
                      type='text' 
                      value={ this.state.values[v.key] } 
                      onChange={ (e) => { this.state.touched[v.key] = true; v.required && !e.target.value ? this.state.errors[v.key] = '必填' : delete this.state.errors[v.key]; this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched }); } } 
                      placeholder={ '输入' + v.name } />
                  </Col>
                  <Col sm={ 1 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> ); 
              } else if (v.type === 'Number') { 
                return (
                <FormGroup controlId={ key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] && 'error' }>
                  { title }
                  <Col sm={ 4 }>
                    <FormControl
                      type='text'
                      value={ this.state.values[v.key] }
                      onChange={ (e) => { this.state.touched[v.key] = true; v.required && !e.target.value ? this.state.errors[v.key] = '必填' : (e.target.value && isNaN(e.target.value) ? this.state.errors[v.key] = '格式有误' : delete this.state.errors[v.key]); this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched }); } }
                      placeholder={ '输入' + v.name } />
                  </Col>
                  <Col sm={ 6 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> );
              } else if (v.type === 'TextArea') {
                return (
                <FormGroup controlId={ key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] && 'error' }>
                  { title }
                  <Col sm={ 9 }>
                    <FormControl
                      componentClass='textarea'
                      value={ this.state.values[v.key] }
                      onChange={ (e) => { this.state.touched[v.key] = true; v.required && !e.target.value ? this.state.errors[v.key] = '必填' : delete this.state.errors[v.key]; this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched }); } }
                      style={ { height: '200px' } }
                      placeholder={ '输入' + v.name } />
                  </Col>
                  <Col sm={ 1 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> );
              } else if (v.type === 'Select' || v.type === 'MultiSelect') {
                return (
                <FormGroup controlId={ key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] && 'error' }>
                  { title }
                  <Col sm={ 7 }>
                    <Select 
                      simpleValue
                      multi={ v.type === 'MultiSelect' }
                      clearable={ !v.required } 
                      value={ this.state.values[v.key] } 
                      options={ _.map(v.optionValues, (val) => { return { label: val.name, value: val.id } } ) } 
                      onChange={ newValue => { v.required && !newValue ? this.state.errors[v.key] = '必选' : delete this.state.errors[v.key]; this.state.touched[v.key] = true; this.state.values[v.key] = newValue; this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched }) } } 
                      className={ this.state.touched[v.key] && this.state.errors[v.key] && 'select-error' }
                      placeholder={ '选择' + v.name } />
                  </Col>
                  <Col sm={ 1 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> ); 
              } else if (v.type === 'CheckboxGroup') {
                return (
                <FormGroup controlId={ key } validationState={ this.state.errors[v.key] && 'error' }>
                  { title }
                  <Col sm={ 9 }>
                    <CheckboxGroup
                      style={ { marginTop: '6px' } }
                      name={ v.name }
                      value={ this.state.values[v.key] && _.isString(this.state.values[v.key]) ? this.state.values[v.key].split(',') : this.state.values[v.key] }
                      onChange={ newValue => { v.required && newValue.length <= 0 ? this.state.errors[v.key] = '必选' : delete this.state.errors[v.key]; this.state.touched[v.key] = true; this.state.values[v.key] = newValue; this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched }) } }>
                      { _.map(v.optionValues || [], (val) => 
                        <span><Checkbox value={ val.id }/>{ ' ' + val.name + ' ' }</span>
                        )
                      }
                      { this.state.touched[v.key] && this.state.errors[v.key] && <div><ControlLabel>{ this.state.errors[v.key] || '' }</ControlLabel></div> }
                    </CheckboxGroup>
                  </Col>
                </FormGroup> );
              } else if (v.type === 'RadioGroup') {
                return (
                <FormGroup controlId={ key }>
                  { title }
                  <Col sm={ 9 }>
                    <RadioGroup
                      style={ { marginTop: '6px' } }
                      name={ v.name }
                      value={ this.state.values[v.key] }
                      onChange={ newValue => { this.state.values[v.key] = newValue; this.setState({ values: this.state.values }) } }>
                      { _.map(v.optionValues || [], (val) =>
                        <span style={ { marginLeft: '6px' } }><Radio value={ val.id }/>{ ' ' + val.name + ' ' }</span>
                        )
                      }
                    </RadioGroup>
                  </Col>
                </FormGroup> ); 
              } else if (v.type === 'DatePicker' || v.type === 'DateTimePicker') {
                return (
                <FormGroup controlId={ key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] && 'error' }>
                  { title }
                  <Col sm={ 4 }>
                    <DateTime 
                      mode='date' 
                      dateFormat={ v.type === 'DateTimePicker' ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD' }
                      timeFormat={ v.type === 'DateTimePicker' } 
                      closeOnSelect={ v.type === 'DatePicker' }
                      value={ this.state.values[v.key] } 
                      onChange={ newValue => { v.required && !newValue ? this.state.errors[v.key] = '必填' : (newValue && !moment(newValue).isValid() ? this.state.errors[v.key] = '格式有误' : delete this.state.errors[v.key]); this.state.touched[v.key] = true; this.state.values[v.key] = newValue; this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched }); } }/>
                  </Col>
                  <Col sm={ 2 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> );
              }
            }) }
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !issue.loading && 'aaaa' }</span>
          <image src={ img } className={ issue.loading ? 'loading' : 'hide' }/>
          <Button className='ralign' type='submit' disabled={ !_.isEmpty(this.state.errors) || issue.loading } onClick={ this.handleSubmit }>确定</Button>
          <Button onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CreateModal;
