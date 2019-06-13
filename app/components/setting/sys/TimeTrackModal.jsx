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
    i18n: PropTypes.object.isRequired,
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
    if (!data.week2day) {
      data.week2day = 5;
    }
    if (!data.day2hour) {
      data.day2hour = 8;
    }
    initializeForm(data);
  }

  async handleSubmit() {
    const { values, update, close } = this.props;
    const ecode = await update({ timetrack: _.pick(values, [ 'week2day', 'day2hour' ]) });
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
    const { i18n: { errMsg }, fields: { week2day, day2hour }, handleSubmit, invalid, dirty, submitting, data } = this.props;
    const dayOptions = [ 
      { value: 6, label: '6' }, 
      { value: 5.5, label: '5.5' }, 
      { value: 5, label: '5' }, 
      { value: 4.5, label: '4.5' }, 
      { value: 4, label: '4' } 
    ];

    const hourOptions = [ 
      { value: 10, label: '10' }, 
      { value: 9.5, label: '9.5' }, 
      { value: 9, label: '9' }, 
      { value: 8.5, label: '8.5' }, 
      { value: 8, label: '8' }, 
      { value: 7.5, label: '7.5' }, 
      { value: 7, label: '7' }, 
      { value: 6.5, label: '6.5' },
      { value: 6, label: '6' }
    ];

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>时间追踪</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>每周有效工作日(天)</ControlLabel>
            <Select
              disabled={ submitting }
              clearable={ false }
              searchable={ false }
              options={ dayOptions }
              value={ week2day.value }
              onChange={ newValue => { week2day.onChange(newValue) } }
              placeholder='请选择'/>
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>每天有效工作时间(小时)</ControlLabel>
            <Select
              disabled={ submitting }
              clearable={ false }
              searchable={ false }
              options={ hourOptions }
              value={ day2hour.value }
              onChange={ newValue => { day2hour.onChange(newValue) } }
              placeholder='请选择'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ !dirty || submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
