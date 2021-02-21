import React, { PropTypes, Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

const validate = (values, props) => {
  const errors = {};
  if (!values.ids) {
    errors.ids = '必选';
  }

  return errors;
};

@reduxForm({
  form: 'del_filters',
  fields: [ 'ids' ],
  validate
})
export default class DelFiltersModal extends Component {
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
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, close, del } = this.props;
    values.ids = values.ids.split(',');
    const ecode = await del(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('删除完成。', 'success', 2000);
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
    const { i18n: { errMsg }, fields: { ids }, handleSubmit, invalid, submitting, data } = this.props;

    const filterOptions = _.map(data, (v) => {
      return { value: v.id, label: v.name }
    });

    return (
      <Modal show onHide={ this.handleCancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>过滤器删除</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel>选择要删除的过滤器</ControlLabel>
            <Select 
              simpleValue 
              multi
              disabled={ submitting }
              options={ filterOptions } 
              clearable={ false } 
              value={ ids.value || null } 
              onChange={ newValue => { ids.onChange(newValue) } } 
              placeholder='选择过滤器(可多选)'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel.bind(this) }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
