import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

const img = require('../assets/images/loading.gif');

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }

  if (!values.key) {
    errors.key = 'Required';
  }

  if (!values.category) {
    errors.category = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'project',
  fields: ['name', 'key', 'category'],
  validate
})
class ProjectModal extends Component {
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
    resetForm: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, create, hide, resetForm } = this.props;
    const ecode = await create(values);
    if (ecode === 0) {
      hide();
      resetForm();
      this.setState({ ecode: 0 });
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { hide, resetForm, submitting } = this.props;
    if (submitting) {
      return;
    }
    hide();
    resetForm();
    this.setState({ ecode: 0 });
  }

  render() {
    const { fields: { name, key, category }, handleSubmit, invalid, submitting } = this.props;
    const styles = { width: '60%' };
    const styles2 = { marginRight: '20px' };
    const styles3 = { width: '25px', height: '25px', marginRight: '15px' };
    const styles4 = { display: 'none' };

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>创建项目</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>名称</ControlLabel>
            <FormControl type='text' { ...name } placeholder='输入项目名' />
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>键值</ControlLabel>
            <FormControl type='text' { ...key } style={ styles } placeholder='输入键值（最多10个字符）' />
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>类型</ControlLabel>
            <FormControl componentClass='select' type='text' { ...category } style={ styles } placeholder='请选择'>
              <option value=''>请选择</option>
              <option value='1'>产品</option>
              <option value='2'>技术</option>
            </FormControl>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span style={ styles2 }>{ this.state.ecode !== 0 && !submitting && 'aaaa' }</span>
          <image src={ img } style={ submitting ? styles3 : styles4 }/>
          <Button style={ styles2 } disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

export default ProjectModal;
