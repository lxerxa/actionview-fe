import React, { PropTypes, Component } from 'react';
import { reduxForm, getValues } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  } else if (props.data.name !== values.name && _.findIndex(props.collection || [], { name: values.name }) !== -1) {
    errors.name = '该名称已存在';
  }

  if (values.bgColor) {
    const pattern = new RegExp(/^#[0-9a-fA-F]{6}$/);
    if (!pattern.test(values.bgColor)) {
      errors.bgColor = '格式错误';
    }
  } else {
    errors.bgColor = '必选';
  }
  return errors;
};

@reduxForm({
  form: 'epic',
  fields: ['id', 'name', 'bgColor'],
  validate
})
export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    dirty: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('更新完成。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    initializeForm(data);
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
    const { i18n: { errMsg }, fields: { id, name, bgColor, description }, dirty, handleSubmit, invalid, submitting } = this.props;

    const bgColors = [ '#815b3a', '#f79232', '#d39c3f', '#654982', '#4a6785', '#8eb021', '#3b7fc4', '#f15c75', '#ac707a' ];
    const bgColorOptions = _.map(bgColors, (v) => {
      return { value: v, label: (<span className='select-color' style={ { marginTop: '7px', backgroundColor: v } }></span>) }
    });
    
    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>编辑Epic</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>Name</ControlLabel>
            <FormControl type='hidden' { ...id }/>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='优先级名'/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ bgColor.touched && bgColor.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>背景色</ControlLabel>
            <Select
              simpleValue
              disabled={ submitting }
              options={ bgColorOptions }
              clearable={ false }
              searchable={ false }
              value={ bgColor.value }
              onChange={ newValue => { bgColor.onChange(newValue) } }
              placeholder='请选择背景色'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ !dirty || submitting || invalid } type='submit'>Submit</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>Cancel</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
