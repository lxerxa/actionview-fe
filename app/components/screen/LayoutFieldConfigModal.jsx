import React, { PropTypes, Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import { reduxForm } from 'redux-form';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

@reduxForm({
  form: 'screen',
  fields: [ 'id', 'required_fields' ]
})
export default class LayoutFieldConfigModal extends Component {
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
    initializeForm: PropTypes.func.isRequired,
    config: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;

    const required_fields = [];
    const fields = data.fields || [];
    const fieldNum = fields.length;
    for (let i = 0; i < fieldNum; i++) {
      if (fields[i].required) {
        required_fields.push(fields[i].id);
      }
    }
    data.required_fields = required_fields.join(',');
    initializeForm(data);
  }

  async handleSubmit() {
    const { values, close, config } = this.props;
    if (values.required_fields) {
      values.required_fields = values.required_fields.split(',');
    }
    values.required_fields = values.required_fields || [];
    let ecode = 0;
    ecode = await config(values);

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

    const { fields: { id, required_fields }, dirty, handleSubmit, submitting, data } = this.props;

    const screenFields = _.map(data.fields || [], function(val) {
      return { label: val.name, value: val.id };
    });

    return (
      <Modal { ...this.props } onHide={ this.handleCancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '界面字段配置 - ' + this.props.data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body>
          <FormControl type='hidden' { ...id }/>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>必填字段</ControlLabel>
            <Select simpleValue options={ screenFields } clearable={ false } value={ required_fields.value } onChange={ newValue => { required_fields.onChange(newValue) } } placeholder='选择必填字段(可多选)' multi/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && 'aaaa' }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || !dirty } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel.bind(this) }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
