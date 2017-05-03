import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  return errors;
};

@reduxForm({
  form: 'syssetting',
  fields: [ 'week2day', 'day2hour' ],
  validate
})
export default class TimeTrackModal extends Component {
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
    close: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    initializeForm(data);
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('设置完成。', 'success', 2000);
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
    const { fields: { week2day, day2hour }, handleSubmit, invalid, dirty, submitting, data } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>时间追踪</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ week2day.touched && week2day.error ? 'error' : '' }>
            <ControlLabel>每周有效工作日</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...week2day } placeholder='单位:天'/>
            { week2day.touched && week2day.error && <HelpBlock style={ { float: 'right' } }>{ week2day.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ day2hour.touched && day2hour.error ? 'error' : '' }>
            <ControlLabel>每天有效工作时间</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...day2hour } placeholder='单位:小时'/>
            { day2hour.touched && day2hour.error && <HelpBlock style={ { float: 'right' } }>{ day2hour.error }</HelpBlock> }
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && 'aaaa' }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ !dirty || submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
