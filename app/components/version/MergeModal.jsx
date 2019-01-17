import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock, Checkbox } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.source) {
    errors.source = '必填';
  }
  if (!values.dest) {
    errors.dest = '必填';
  }
  return errors;
};

@reduxForm({
  form: 'mergeversion',
  fields: [ 'source', 'dest' ],
  validate
})
export default class MergeModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, isSendMsg: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    versions: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    merge: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { merge, values, close } = this.props;
    const ecode = await merge({ source: values.source, dest: values.dest });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('已合并。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { source, dest }, handleSubmit, invalid, submitting, versions } = this.props;

    const versionOptions = _.map(versions || [], (val) => { return { label: val.name, value: val.id } });

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>合并版本</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <div className='info-col' style={ { marginBottom: '15px', marginTop: '5px' } }>
            <div className='info-icon'><i className='fa fa-info-circle'></i></div>
            <div className='info-content'>版本合并后，将无法还原，请谨慎合并。</div>
          </div>
          <FormGroup controlId='formControlsText' validationState={ source.touched && source.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>要合并版本</ControlLabel>
            <Select 
              simpleValue 
              clearable={ false } 
              disabled={ submitting } 
              options={ versionOptions } 
              value={ source.value } 
              onChange={ (newValue) => { source.onChange(newValue) } } 
              placeholder='选择版本'/>
            { source.touched && source.error && <HelpBlock style={ { float: 'right' } }>{ source.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ dest.touched && dest.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>合并至</ControlLabel>
            <Select
              simpleValue
              clearable={ false }
              disabled={ submitting }
              options={ versionOptions }
              value={ dest.value }
              onChange={ (newValue) => { dest.onChange(newValue) } }
              placeholder='选择版本'/>
            { dest.touched && dest.error && <HelpBlock style={ { float: 'right' } }>{ dest.error }</HelpBlock> }
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || invalid || source.value == dest.value } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
