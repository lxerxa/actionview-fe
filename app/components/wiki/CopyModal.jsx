import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import ApiClient from '../../../shared/api-client';
import { notify } from 'react-notify-toast';

const $ = require('$');
const img = require('../../assets/images/loading.gif');

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'copy_wiki',
  fields: [ 'name', 'dest_path' ],
  validate
})
export default class CopyModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, initilizedFlag: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    project_key: PropTypes.string.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    initializeForm: PropTypes.func.isRequired,
    curPath: PropTypes.string.isRequired,
    copy: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    const copyData = _.assign({}, data, { name: 'Copy - ' + data.name });
    initializeForm(copyData);
  }

  async handleSubmit() {
    const { values, copy, data, close, curPath } = this.props;
    const ecode = await copy({ id: data.id, name: values.name, src_path: data.parent, dest_path: values.dest_path && values.dest_path.id || curPath }, !(values.dest_path && values.dest_path.id));
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('复制完成。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleEntry() {
    $('input[name=name]').select();
  }

  handleCancel() {
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  async searchPath(input) {
    input = input.toLowerCase();
    if (!input)
    {
      return { options: [] };
    }

    const { project_key } = this.props;

    const api = new ApiClient;
    const limit = 20;
    const results = await api.request( { url: '/project/' + project_key + '/wiki/search/path?s=' + input } );

    const options = [];
    if (results.data.length > 0) {
      _.map(results.data, (v) => {
        options.push({ id: v.id, name: v.name });
      });
    }
    return { options };
  }

  render() {
    const { i18n: { errMsg }, fields: { name, dest_path }, handleSubmit, invalid, submitting, data } = this.props;

    return (
      <Modal show bsSize='large' onHide={ this.handleCancel } onEntered={ this.handleEntry } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>Copy{ data.d === 1 ? '目录' : 'Document' } - { data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : null }>
            <ControlLabel><span className='txt-impt'>*</span>Name</ControlLabel>
            <FormControl disabled={ submitting } type='text' { ...name } placeholder='Name'/>
            { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText'>
            <ControlLabel>复制到</ControlLabel>
            <Select.Async
              clearable={ false }
              disabled={ submitting }
              options={ [] }
              value={ dest_path.value }
              onChange={ (newValue) => { dest_path.onChange(newValue) } }
              valueKey='id'  
              labelKey='name'
              loadOptions={ this.searchPath.bind(this) }
              placeholder='输入路径名称(默认当前路径)'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button disabled={ submitting || invalid } type='submit'>Submit</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>Cancel</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
