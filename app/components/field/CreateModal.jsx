import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

const img = require('../../assets/images/loading.gif');

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }

  if (!values.key) {
    errors.key = 'Required';
  }

  if (!values.type) {
    errors.type = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'field',
  fields: [ 'name', 'key', 'type', 'description' ],
  validate
})
export default class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
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
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  render() {
    const { fields: { name, key, type, description }, handleSubmit, invalid, submitting } = this.props;
    const styles = { width: '60%' };
    const types = [
      { id: 'Label', name: '标签' },
      { id: 'RadioGroup', name: '单选按钮' },
      { id: 'CheckboxGroup', name: '复选按钮' },
      { id: 'DatePicker', name: '日期选择控件' },
      { id: 'DateTimePicker', name: '日期时间选择控件' },
      { id: 'Number', name: '数值字段' },
      { id: 'Text', name: '文本框单行' },
      { id: 'TextArea', name: '文本框多行' },
      { id: 'Select', name: '选择列表(单行)' },
      { id: 'MultiSelect', name: '选择列表(多行)' },
      { id: 'Url', name: 'URL字段' }];

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>创建字段</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body className={ submitting ? 'disable' : 'enable' }>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>字段名</ControlLabel>
            <FormControl type='text' { ...name } placeholder='字段名'/>
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>键值</ControlLabel>
            <FormControl type='text' { ...key } placeholder='键值唯一'/>
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>类型</ControlLabel>
            <FormControl componentClass='select' type='text' { ...type } style={ styles }>
              <option value=''>请选择字段类型</option>
              { types.map( typeOption => <option value={ typeOption.id } key={ typeOption.id }>{ typeOption.name }</option>) }
            </FormControl>
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>描述</ControlLabel>
            <FormControl type='text' { ...description } placeholder='描述内容'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && 'aaaa' }</span>
          <image src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button className='ralign' disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}