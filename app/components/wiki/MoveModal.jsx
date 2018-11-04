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
  if (!values.dest_path) {
    errors.dest_path = '必填';
  }
  return errors;
};

@reduxForm({
  form: 'move_wiki',
  fields: [ 'id', 'dest_path' ],
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
    move: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    const copyData = _.clone(data);
    _.extend(copyData, { name: '复制 - ' + data.name });
    initializeForm(copyData);
  }

  async handleSubmit() {
    const { values, move, data, close } = this.props;
    const ecode = await move({ id: data.id, dest_path: values.dest_path && values.dest_path.id || data.parent });
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
    if (!input) {
      return { options: [] };
    }

    const { project_key, data } = this.props;

    const api = new ApiClient;
    const limit = 20;
    const results = await api.request( { url: '/project/' + project_key + '/wiki/search/path?s=' + input + ( data.d === 1 ? ('&moved_path=' + data.id) : '' ) } );

    const options = [];
    if (results.data.length > 0) {
      _.map(results.data, (v) => {
        if (v.id === data.parent) {
          return;
        }
        options.push({ id: v.id, name: v.name });
      });
    }
    return { options };
  }

  render() {
    const { i18n: { errMsg }, fields: { id, dest_path }, handleSubmit, invalid, submitting, data } = this.props;

    return (
      <Modal { ...this.props } bsSize='large' onHide={ this.handleCancel } onEntered={ this.handleEntry } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>移动{ data.d === 1 ? '目录' : '文档' } - { data.name }</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          <FormGroup validationState={ dest_path.touched && dest_path.error ? 'error' : '' }>
            <ControlLabel><span className='txt-impt'>*</span>移动到</ControlLabel>
            <Select.Async
              clearable={ false }
              disabled={ submitting }
              options={ [] }
              value={ dest_path.value }
              onChange={ (newValue) => { dest_path.onChange(newValue) } }
              valueKey='id'  
              labelKey='name'
              loadOptions={ this.searchPath.bind(this) }
              placeholder='输入路径名称'/>
            { dest_path.touched && dest_path.error && <HelpBlock style={ { float: 'right' } }>{ dest_path.error }</HelpBlock> }
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
