import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }

  if (!values.key) {
    errors.key = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'project',
  fields: ['name', 'key'],
  validate
})
class ProjectModal extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    dirty: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.func
  }

  render() {
    const { fields: { name, key }, invalid, submitting } = this.props;
    const styles = { width: '60%' };
    const styles2 = { marginRight: '25px' };

    return (
      <Modal {...this.props} bsSize='la' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>创建项目</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>名称</ControlLabel>
            <FormControl type='text' { ...name } placeholder='输入项目名' />
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>键值</ControlLabel>
            <FormControl type='text' { ...key } style={ styles } placeholder='输入键值（最多10个字符）' />
          </FormGroup>
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button style={ styles2 } disabled={ submitting || invalid } onClick={ this.props.onHide }>确定</Button>
          <Button onClick={ this.props.onHide }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}

export default ProjectModal;
