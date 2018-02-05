import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  }

  if (values.max && !(/(^[1-9]\d*$)/.test(values.max))) {
    errors.max = '必须输入正整数';
  }

  if (values.min && !(/(^[1-9]\d*$)/.test(values.min))) {
    errors.min = '必须输入正整数';
  }

  return errors;
};

@reduxForm({
  form: 'column',
  fields: [ 'name', 'states', 'max', 'min' ],
  validate
})
export default class ColumnConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    no: PropTypes.number.isRequired,
    config: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { update, no, config, values, close } = this.props;

    const columns = _.clone(config.columns || []);
    if (no >= 0) {
      const ind = _.findIndex(columns, { no });
      columns[ind] = { no, name: values.name, states: values.states ? values.states.split(',') : [], max: values.max || '', min: values.min || '' };
    } else {
      let no = 0;
      if (columns.length > 0) {
        no = _.max(_.map(columns, (v) => v.no)) + 1;
      }
      columns.push({ name: values.name, no, states: values.states ? values.states.split(',') : [], max: values.max || '', min: values.min || '' });
    }

    const ecode = await update({ id: config.id, columns });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('设置完成。', 'success', 2000);
    } else { 
      this.setState({ ecode: ecode });
    }
  }

  componentWillMount() {
    const { initializeForm, config, no } = this.props;
    if (no >= 0) {
      const column = _.find(config.columns, { no });
      initializeForm({ name: column.name, states: (column.states || []).join(','), max: column.max || '', min: column.min || '' });
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
    const { i18n: { errMsg }, fields: { name, states, max, min }, handleSubmit, invalid, submitting, config, no, options } = this.props;

    let otherStates = [];
    _.forEach(config.columns, (v) => {
      if (v.no !== no) {
        otherStates = _.union(otherStates, v.states);
      }
    });

    const stateOptions = [];
    _.forEach(options.states || [], (v) => {
      if (_.indexOf(otherStates, v.id) === -1) {
        stateOptions.push({ label: v.name, value: v.id });
      }
    });
    
    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ no >= 0 ? '编辑列' : '添加列' }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>名称</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='列名'/ >
            { name.touched && name.error &&
              <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>状态</ControlLabel>
            <Select 
              multi
              simpleValue 
              disabled={ submitting } 
              clearable={ false }
              options={ stateOptions } 
              value={ states.value } 
              onChange={ (newValue) => { states.onChange(newValue) } } 
              placeholder='选择状态'/>
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ max.touched && max.error ? 'error' : '' }>
            <ControlLabel>最大问题数（Max）</ControlLabel>
            <FormControl 
              disabled={ submitting } 
              type='text' 
              { ...max } 
              placeholder='输入正整数'/ >
            { max.touched && max.error &&
              <HelpBlock style={ { float: 'right' } }>{ max.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ min.touched && min.error ? 'error' : '' }>
            <ControlLabel>最小问题数（Min）</ControlLabel>
            <FormControl 
              disabled={ submitting } 
              type='text' 
              { ...min } 
              placeholder='输入正整数'/ >
            { min.touched && min.error &&
              <HelpBlock style={ { float: 'right' } }>{ min.error }</HelpBlock> }
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
