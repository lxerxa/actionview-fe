import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

const img = require('../../assets/images/loading.gif');

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }

  if (!values.screen) {
    errors.screen = 'Required';
  }

  if (!values.workflow) {
    errors.workflow = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'type',
  fields: ['name', 'screen', 'workflow'],
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
    options: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
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
    const { fields: { name, screen, workflow }, options = {}, handleSubmit, invalid, submitting } = this.props;
    const { screens = [], workflows = [] } = options;
    const styles = { width: '60%' };

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>创建问题类型</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body className={ submitting ? 'disable' : 'enable' }>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>名称</ControlLabel>
            <FormControl type='text' { ...name } placeholder='问题类型名'/>
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>界面</ControlLabel>
            <FormControl componentClass='select' type='text' { ...screen } style={ styles }>
              <option value=''>请选择一个界面</option>
              { screens.map( screenOption => <option value={ screenOption.id } key={ screenOption.id }>{ screenOption.name }</option>) }
            </FormControl>
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>工作流</ControlLabel>
            <FormControl componentClass='select' type='text' { ...workflow } style={ styles }>
              <option value=''>请选择一个工作流</option>
              { workflows.map( workflowOption => <option value={ workflowOption.id } key={ workflowOption.id }>{ workflowOption.name }</option>) }
            </FormControl>
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
