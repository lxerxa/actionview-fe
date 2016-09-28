import React, { PropTypes, Component } from 'react';
import { Modal, Button, ControlLabel, FormControl, Form, FormGroup, Col, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { RadioGroup, Radio } from 'react-radio-group';
import DateTime from 'react-datetime';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

class CreateModal extends Component {
  constructor(props) {
    super(props);
    const { config } = this.props;

    const defaultType = _.find(config.types || [], { default: true }); 
    this.state = { ecode: 0, errors: {}, type: defaultType.id, schema: config.schemas[defaultType.id] };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    config: PropTypes.object,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, create, close } = this.props;
    const ecode = await create(values);
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

  render() {
    const { config, close } = this.props;
    const { schema } = this.state;

    const typeOptions = _.map(config.types || [], function(val) {
      return { label: val.name, value: val.id };
    });

    let submitflag = true;
    let t;
    for (t in this.state.errors) {
      if (this.state.errors[t] !== undefined) {
        submitflag = false;
        break;
      }
    }

    return (
      <Modal { ...this.props } onHide={ close } bsSize='large' backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>创建问题</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId='formControlsSelect' style={ { height: '50px', borderBottom: '1px solid #ddd' } }>
              <Col sm={ 2 } componentClass={ ControlLabel }>
                <span className='txt-impt'>*</span>类型
              </Col>
              <Col sm={ 6 }>
                <Select options={ typeOptions } simpleValue clearable={ false } value={ this.state.type } onChange={ newValue => { this.setState({ type: newValue }) } } placeholder='请选择问题类型'/>
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
                <FormGroup controlId={ key } validationState={ this.state.errors[v.key] && 'error' }>
                  { title }
                  <Col sm={ 9 }>
                    <FormControl 
                      type='text' 
                      value={ _.isUndefined(this.state[v.key]) ? v.defaultValue || '' : this.state[v.key] } 
                      onChange={ (e) => { v.required && !e.target.value ? this.state.errors[v.key] = '必填' : this.state.errors[v.key] = undefined; this.setState({ [ v.key ]: e.target.value, errors: this.state.errors }); } } 
                      placeholder={ '输入' + v.name } />
                  </Col>
                  <Col sm={ 1 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.errors[v.key] || '' }
                  </Col>
                </FormGroup> ); 
              } else if (v.type === 'Select' || v.type === 'MultiSelect') {
                return (
                <FormGroup controlId={ key } validationState={ this.state.errors[v.key] && 'error' }>
                  { title }
                  <Col sm={ 6 }>
                    <Select 
                      simpleValue
                      multi={ v.type === 'MultiSelect' }
                      clearable={ !v.required } 
                      value={ _.isUndefined(this.state[v.key]) ? v.defaultValue || '' : this.state[v.key] } 
                      options={ _.map(v.optionValues, (val) => { return { label: val.name, value: val.id } } ) } 
                      onChange={ newValue => { v.required && !newValue ? this.state.errors[v.key] = '必选' : this.state.errors[v.key] = undefined; this.setState({ [ v.key ]: newValue, errors: this.state.errors }) } } 
                      className={ this.state.errors[v.key] && 'select-error' }
                      placeholder={ '选择' + v.name } />
                  </Col>
                  <Col sm={ 1 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.errors[v.key] || '' }
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
                      value={ _.isUndefined(this.state[v.key]) ? (v.defaultValue || '').split(',') : this.state[v.key] }
                      onChange={ newValue => { v.required && newValue.length <= 0 ? this.state.errors[v.key] = '必选' : this.state.errors[v.key] = undefined; this.setState({ [ v.key ]: newValue, errors: this.state.errors }) } }>
                      { _.map(v.optionValues || [], (val) => 
                        <span><Checkbox value={ val.id }/>{ ' ' + val.name + ' ' }</span>
                        )
                      }
                      { this.state.errors[v.key] && <div><ControlLabel>{ this.state.errors[v.key] || '' }</ControlLabel></div> }
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
                      value={ _.isUndefined(this.state[v.key]) ? v.defaultValue || '' : this.state[v.key] }
                      onChange={ newValue => { this.setState({ [ v.key ]: newValue }) } }>
                      { _.map(v.optionValues || [], (val) =>
                        <span style={ { marginLeft: '6px' } }><Radio value={ val.id }/>{ ' ' + val.name + ' ' }</span>
                        )
                      }
                    </RadioGroup>
                  </Col>
                </FormGroup> ); 
              } else if (v.type === 'DatePicker' || v.type === 'DateTimePicker') {
                return (
                <FormGroup controlId={ key } validationState={ this.state.errors[v.key] && 'error' }>
                  { title }
                  <Col sm={ 4 }>
                    <DateTime 
                      locale='zh-cn' 
                      mode='date' 
                      dateFormat={ v.type === 'DateTimePicker' ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD' }
                      timeFormat={ v.type === 'DateTimePicker' } 
                      value={ _.isUndefined(this.state[v.key]) ? v.defaultValue || '' : this.state[v.key] } 
                      onChange={ newValue => { this.setState({ [ v.key ]: newValue }) } }/>
                  </Col>
                  <Col sm={ 1 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.errors[v.key] || '' }
                  </Col>
                </FormGroup> );
              }
            }) }
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className='ralign' type='submit' disabled={ !submitflag }>确定</Button>
          <Button onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CreateModal;
