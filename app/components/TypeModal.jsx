import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

const img = require('../assets/images/loading.gif');

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
  fields: ['id', 'name', 'screen', 'workflow'],
  validate
})
class TypeModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    dirty: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, create, edit, hide } = this.props;
    let ecode = 0;
    if (values.id) {
      ecode = await edit(values);
    } else {
      ecode = await create(values);
    }

    if (ecode === 0) {
      hide();
      this.setState({ ecode: 0 });
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { hide, submitting } = this.props;
    if (submitting) {
      return;
    }
    hide();
    this.setState({ ecode: 0 });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data === nextProps.data) {
      return;
    }

    const { data } = nextProps;
    const { initializeForm } = this.props;
    initializeForm(data);
  }

  render() {
    const { fields: { id, name, screen, workflow }, options = {}, handleSubmit, invalid, dirty, submitting, data } = this.props;
    const { screens = [], workflows = [] } = options;
    const styles = { width: '60%' };

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>{ data.id ? ('编辑问题类型 - ' + data.name) : '创建问题类型' }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body className={ submitting ? 'disable' : 'enable' }>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>名称</ControlLabel>
            <FormControl type='hidden' { ...id }/>
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
          <Button className='ralign' disabled={ (data.id && !dirty) || submitting || invalid } type='submit'>确定</Button>
          <Button disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

export default TypeModal;
