import React, { PropTypes, Component } from 'react';
import { Modal, Button, ControlLabel, FormControl, Form, FormGroup, Col, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { RadioGroup, Radio } from 'react-radio-group';
import DateTime from 'react-datetime';
import DropzoneComponent from 'react-dropzone-component';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { findDOMNode } from 'react-dom';

const $ = require('$');
const moment = require('moment');
const img = require('../../assets/images/loading.gif');

class CreateModal extends Component {
  constructor(props) {
    super(props);
    const { options, data={}, isSubtask=false, isFromWorkflow=false, action_id='' } = this.props;

    const typeTmpOptions = [];
    if (!isFromWorkflow) {
      if (isSubtask) {
        _.map(options.types || [], function(val) {
          if (val.type == 'subtask') {
            typeTmpOptions.push(val);
          }
        });
      } else {
        _.map(options.types || [], function(val) {
          if (val.type != 'subtask') {
            typeTmpOptions.push(val);
          }
        });
      }
    }

    let defaultIndex = -1, schema = [], errors={}, values={}, oldValues={}, typeOkOptions=[];
    if (!_.isEmpty(data) && data.id) {
      if (isFromWorkflow) {
        const action = _.find(data.wfactions, { id: action_id });
        if (action && action.schema) {
          schema = action.schema;
        }
      } else {
        _.map(typeTmpOptions || [], function(val) {
          if (!val.disabled || data.type == val.id) {
            typeOkOptions.push(val);
          }
        });

        defaultIndex = _.findIndex(typeOkOptions, { id: data.type });
        schema = defaultIndex !== -1 ? typeOkOptions[defaultIndex].schema : [];
      }
      _.map(schema, (v) => {
        if (!_.isUndefined(data[v.key])) {
          if (v.key == 'assignee' && data[v.key].id) {
            values[v.key] = data[v.key].id; // assignee
            oldValues[v.key] = data[v.key].id; // assignee
          } else if (v.type == 'SingleUser' && data[v.key].id) {
            values[v.key] = data[v.key].id;
            oldValues[v.key] = data[v.key].id;
          } else if (v.type == 'MultiUser' && _.isArray(data[v.key])) {
            values[v.key] = _.map(data[v.key], (v) => v.id).join(',');
            oldValues[v.key] = _.map(data[v.key], (v) => v.id).join(',');
          } else if ((v.type == 'MultiSelect' || v.type == 'MultiVersion') && _.isArray(data[v.key])) {
            values[v.key] = data[v.key].join(',');
            oldValues[v.key] = data[v.key].join(',');
          } else if (v.type == 'CheckboxGroup' && _.isString(data[v.key])) {
            values[v.key] = data[v.key].split(',');
            oldValues[v.key] = data[v.key].split(',');
          } else if (v.key == 'labels') {
            if (options.permissions && options.permissions.indexOf('manage_project') !== -1) {
              values[v.key] = _.map(data[v.key] || [], (v) => { return { value: v, label: v } });
              oldValues[v.key] = _.map(data[v.key] || [], (v) => { return { value: v, label: v } });
            } else {
              values[v.key] = (data[v.key] || []).join(',');
              oldValues[v.key] = (data[v.key] || []).join(','); 
            }
          } else if (v.type == 'File' && _.isArray(data[v.key])) {
            values[v.key] = _.map(data[v.key], (v) => { return v.id || v; }); // files
            oldValues[v.key] = _.map(data[v.key], (v) => { return v.id || v; }); // files
          } else if (v.type === 'DatePicker' || v.type === 'DateTimePicker') {
            values[v.key] = data[v.key] && moment.unix(data[v.key]);
            oldValues[v.key] = data[v.key] && moment.unix(data[v.key]);
          } else if (v.type === 'Number') {
            values[v.key] = data[v.key] + '';
            oldValues[v.key] = data[v.key] + '';
          } else {
            values[v.key] = data[v.key];
            oldValues[v.key] = data[v.key];
          }
        }
        if (v.required && (!data[v.key] || (_.isArray(data[v.key]) && data[v.key].length <= 0))) {
          errors[v.key] = '必填';
        }
      });
      _.extend(values, { type: data.type });
      _.extend(oldValues, { type: data.type });
    } else {
      _.map(typeTmpOptions || [], function(val) {
        if (!val.disabled) {
          typeOkOptions.push(val);
        }
      });

      defaultIndex = _.findIndex(typeOkOptions, { default: true }); 
      if (defaultIndex === -1) {
        defaultIndex = 0;
      }

      if (!typeOkOptions[defaultIndex]) {
        values['type'] = ''; 
        schema = [];
      } else {
        values['type'] = typeOkOptions[defaultIndex].id;
        schema = typeOkOptions[defaultIndex].schema;
      }
      _.map(schema || [], (v) => {
        if (v.defaultValue) {
          if (v.type === 'MultiSelect' && _.isArray(v.defaultValue)) {
            values[v.key] = v.defaultValue.join(',');
          } else if (v.type === 'CheckboxGroup' && _.isString(v.defaultValue)) {
            values[v.key] = v.defaultValue.split(',');
          } else {
            values[v.key] = v.defaultValue;
          }
        }
        if (v.required && !v.defaultValue) {
          errors[v.key] = '必填';
        }
      });
    }

    if (isFromWorkflow) {
      this.state = { ecode: 0, errors, touched: {}, schema, values, oldValues };
    } else {
      this.state = { ecode: 0, errors, touched: {}, typeOptions: typeOkOptions, schema, values, oldValues };
    }

    this.getChangedKeys = this.getChangedKeys.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount(){
    const dom = findDOMNode(this.refs['createModal']);
    const rect = dom.getBoundingClientRect();
    if (rect.height < 580) {
      dom.style.overflow = 'visible';
    }

    const { project, options } = this.props;
    if (options.permissions && options.permissions.indexOf('upload_file') !== -1) {
      const self = this;
      $(function() {
        $('#create-issue-dialog textarea').inlineattachment({
          allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
          uploadUrl: '/api/project/' + project.key + '/file',
          onFileUploaded: (editor, filename) => { 
            const fieldkey = editor.getAttr('id').substr(15); 
            self.state.values[fieldkey] = editor.getValue(); 
            delete self.state.errors[fieldkey]; 
            self.setState({ values: self.state.values }); 
          },
          onFileReceived: (editor, file) => { 
            const fieldkey = editor.getAttr('id').substr(15); 
            self.state.values[fieldkey] = editor.getValue(); 
            delete self.state.errors[fieldkey]; 
            self.setState({ values: self.state.values }); 
          }
        });
      });
    }
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    addLabels: PropTypes.func.isRequired,
    data: PropTypes.object,
    project: PropTypes.object,
    options: PropTypes.object,
    loading: PropTypes.bool,
    isSubtask: PropTypes.bool,
    parent: PropTypes.object,
    create: PropTypes.func,
    edit: PropTypes.func,
    doAction: PropTypes.func,
    action_id: PropTypes.string,
    isFromWorkflow: PropTypes.bool
  }

  getChangedKeys() {
    const diffKeys = [];
    _.mapKeys(this.state.values, (val, key) => {
      if (_.isEmpty(this.state.oldValues[key]) && _.isEmpty(val)) {
        return;
      }
      if (val instanceof moment && this.state.oldValues[key] instanceof moment) {
        if (!val.isSame(this.state.oldValues[key])) {
          diffKeys.push(key);
        }
      } else if (!_.isEqual(val, this.state.oldValues[key])) {
        diffKeys.push(key);
      }
    });
    return diffKeys; 
  }

  async handleSubmit() {
    const { create, edit, addLabels, close, options, data={}, parent={}, doAction=undefined, action_id='' } = this.props;
    //const schema = _.find(options.types, { id: this.state.values['type'] }).schema;
    const { schema } = this.state;

    let submitData = {};
    if (!_.isEmpty(data) && data.id) {
      const diffKeys = this.getChangedKeys();
      submitData = diffKeys.length > 0 ? _.pick(this.state.values, diffKeys) : {};
    } else {
      _.extend(submitData, this.state.values);
    }

    let newLabels = [];
    _.mapValues(submitData, (val, key) => {
      const index = _.findIndex(schema, { key });
      const field = index === -1 ? {} : schema[index];
      if (val) {
        if (field.key === 'labels') {
          if (_.isArray(val)) {
            newLabels = _.uniq(_.map(_.filter(val, (v) => !!v.className), (v) => _.trim(v.value)));
            submitData[key] = _.uniq(_.map(val, (v) => _.trim(v.value)));
          } else {
            submitData[key] = val.split(',');
          }
        } else if ([ 'MultiSelect', 'MultiVersion', 'MultiUser' ].indexOf(field.type) !== -1) {
          submitData[key] = val.split(',');
        } else if (field.type === 'DatePicker') {
          submitData[key] = parseInt(moment(val).startOf('day').format('X')); 
        } else if (field.type === 'DateTimePicker') {
          submitData[key] = parseInt(moment(val).format('X')); 
        } else if (field.type === 'Number') {
          submitData[key] = parseFloat(val);
        //} else if (field.type === 'TextArea') {
        //  submitData[key] = val.replace(/!\[Uploading file\.\.\.\]\(\)((\r\n)|(\n))?/ig, '');
        } else {
          submitData[key] = val;
        }
      } else {
        submitData[key] = ''; 
      }
    });

    let ecode = 0;
    if (!_.isEmpty(data) && data.id) {

      if (doAction && action_id) {
        ecode = await doAction(data.id, data.entry_id, { action_id, comments: submitData.comments || '' }, true);
        if (ecode !== 0) {
          this.setState({ ecode: ecode });
          return;
        }
      }

      ecode = await edit(data.id, submitData);
      if (ecode === 0) {
        close();
        if (doAction && action_id) {
          notify.show('提交完成。', 'success', 2000);
        } else {
          notify.show('问题已更新。', 'success', 2000);
        }
      }
    } else {
      if (parent.id) {
        _.extend(submitData, { parent_id: parent.id });
      }
      ecode = await create(submitData);
      if (ecode === 0) {
        close();
        notify.show('问题已创建。', 'success', 2000);
      }
    }

    if (ecode === 0 && newLabels.length > 0) {
      addLabels(newLabels);
    }

    this.setState({ ecode: ecode });
  }

  handleCancel() {
    const { close } = this.props;
    this.setState({ ecode: 0 });
    close();
  }

  typeChange(typeValue) {
    const { options } = this.props;
    const schema = _.find(options.types, { id: typeValue } ).schema;
    if (!schema) {
      return;
    }

    const errors = {}, values = {};
    _.map(schema, (v) => {
      if (this.state.errors[v.key]) {
        values[v.key] = '';
      } else if (!this.state.values[v.key] && v.defaultValue) {
        if (v.type === 'MultiSelect' && _.isArray(v.defaultValue)) {
          values[v.key] = v.defaultValue.join(',');
        } else if (v.type === 'CheckboxGroup' && _.isString(v.defaultValue)) {
          values[v.key] = v.defaultValue.split(',');
        } else {
          values[v.key] = v.defaultValue;
        }
      } else if (this.state.values[v.key]) {
        values[v.key] = this.state.values[v.key];
      }

      if (v.required && !values[v.key]) {
        errors[v.key] = '必填';
      }
    });

    values['type'] = typeValue;
    this.setState({ errors, touched: {}, schema, values });
  }

  success(localfile, res) {
    if (res.ecode !== 0) {
      notify.show('文档上传失败。', 'error', 2000);
      return;
    }

    const { field = '', file = {} } = res.data;
    this.state.values[field] = this.state.values[field] || [];
    this.state.values[field].push(file.id); 
    localfile.field = field;
    localfile.fid = file.id; 
    if (field && this.state.errors[field]) {
      delete this.state.errors[field];
      this.setState({ errors: this.state.errors });
    } else {
      this.setState({ values: this.state.values });
    }
  }

  removedfile(localfile) { 
    const field = localfile.field || '';
    const fid = localfile.fid || '';
    if (field && fid) {
      this.state.values[field] = _.reject(this.state.values[field], (o) => { return o === fid });
      this.setState({ values: this.state.values });
    }
    const curField = _.find(this.state.schema, { key: field });
    if (curField && curField.required && field && this.state.values[field].length <= 0) {
      this.state.errors[field] = '必传';
      this.setState({ errors: this.state.errors });
    }
  }

  urlTest(url) {
    // url regex
    const urlRegex = '^' + '(?:(?:https?|ftp)://)' + '(?:\\S+(?::\\S*)?@)?' + '(?:' + '(?!(?:10|127)(?:\\.\\d{1,3}){3})' + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' + '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' + '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' + '|' + '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' + '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' + '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' + ')' + '(?::\\d{2,5})?' + '(?:/\\S*)?' + '$';
    const re = new RegExp(urlRegex);
    return re.test(url);
  }

  ttTest(tt) {
    let newtt = _.trim(tt);
    const tts = newtt.split(' ');

    let flag = true;
    _.map(tts, (v) => {
      if (v) {
        if (!_.endsWith(v.toLowerCase(), 'w') && !_.endsWith(v.toLowerCase(), 'd') && !_.endsWith(v.toLowerCase(), 'h') && !_.endsWith(v.toLowerCase(), 'm')) {
          flag = false;
        }
        let time = v.substr(0, v.length - 1);
        if (time && isNaN(time)) {
          flag = false;
        }
      }
    });
    return flag;
  }

  render() {
    const { i18n: { errMsg }, options, close, loading, project, data={}, parent={}, isSubtask=false, isFromWorkflow=false } = this.props;
    const { schema } = this.state;

    const typeOptions = _.map(this.state.typeOptions, function(val) {
      return { 
        label: (
          <span>
            <span className='type-abb'>{ val.abb }</span>
            { val.name }
          </span>), 
        value: val.id 
      };
    });

    let bodyStyles = { height: '580px', overflow: 'auto' };
    if (isFromWorkflow) {
      bodyStyles = { maxHeight: '580px', overflow: 'auto' };
    }

    return (
      <Modal 
        show
        id='create-issue-dialog'
        backdrop='static'
        aria-labelledby='contained-modal-title-sm'
        onHide={ close } 
        bsSize='large'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ data.id ? (isFromWorkflow ? '流程页面' : ('编辑问题' + ' - ' + data.no)) : (isSubtask ? '创建子任务问题' : '创建问题') }</Modal.Title>
        </Modal.Header>
        <Form horizontal>
          <Modal.Body style={ bodyStyles } ref='createModal'>
            { !isFromWorkflow && !isSubtask &&
            <FormGroup controlId='formControlsLabel'>
              <Col sm={ 2 } componentClass={ ControlLabel }>
                项目名称
              </Col>
              <Col sm={ 9 }>
                <div style={ { marginTop: '7px', marginBottom: '6px' } }><span>{ project.name || '-' }</span></div>
              </Col>
            </FormGroup> }
            { !isFromWorkflow && isSubtask &&
            <FormGroup controlId='formControlsLabel'>
              <Col sm={ 2 } componentClass={ ControlLabel }>
                父任务 
              </Col>
              <Col sm={ 9 }>
                <div style={ { marginTop: '7px', marginBottom: '6px' } }><span>{ parent.title ? (parent.no + '-' + parent.title) : (data.parent && data.parent.title ? (data.parent.no + '-' + data.parent.title) : '-') }</span></div>
              </Col>
            </FormGroup> }
            { !isFromWorkflow &&
            <FormGroup controlId='formControlsSelect' style={ { height: '68px', borderBottom: '1px solid #ddd' } }>
              <Col sm={ 2 } componentClass={ ControlLabel }>
                <span className='txt-impt'>*</span>类型
              </Col>
              <Col sm={ 7 }>
                <Select 
                  options={ typeOptions } 
                  disabled={ loading } 
                  simpleValue 
                  searchable={ false } 
                  clearable={ false } 
                  value={ this.state.values['type'] } 
                  onChange={ this.typeChange.bind(this) } 
                  placeholder='请选择问题类型'/>
                <div><span style={ { fontSize: '12px' } }>改变问题类型可能造成已填写部分信息的丢失，建议填写信息前先确定问题类型。</span></div>
              </Col>
            </FormGroup> }
            { _.map(schema, (v, key) => {

              const title = (
                  <Col sm={ 2 } componentClass={ ControlLabel }>
                    { v.required && <span className='txt-impt'>*</span> }
                    { v.name }
                  </Col>
              );

              if (v.type === 'Text') {
                return (
                <FormGroup key={ key } controlId={ 'id' + key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] ? 'error' : null }>
                  { title }
                  <Col sm={ 9 }>
                    <FormControl 
                      type='text' 
                      disabled={ loading }
                      value={ this.state.values[v.key] } 
                      onChange={ (e) => { v.required && !e.target.value ? this.state.errors[v.key] = '必填' : delete this.state.errors[v.key]; this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values, errors: this.state.errors }); } } 
                      onBlur={ (e) => { this.state.touched[v.key] = true; this.setState({ touched: this.state.touched }); } }
                      placeholder={ '输入' + v.name } />
                  </Col>
                  <Col sm={ 1 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> ); 
              } else if (v.type === 'Number') { 
                return (
                <FormGroup key={ key } controlId={ 'id' + key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] ? 'error' : null }>
                  { title }
                  <Col sm={ 4 }>
                    <FormControl
                      type='number'
                      disabled={ loading }
                      value={ this.state.values[v.key] }
                      onChange={ (e) => { v.required && !e.target.value ? this.state.errors[v.key] = '必填' : (e.target.value && isNaN(e.target.value) ? this.state.errors[v.key] = '格式有误' : delete this.state.errors[v.key]); this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values, errors: this.state.errors }); } }
                      onBlur={ (e) => { this.state.touched[v.key] = true; this.setState({ touched: this.state.touched }); } }
                      placeholder={ '输入' + v.name } />
                  </Col>
                  <Col sm={ 6 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> );
              } else if (v.type === 'TextArea') {
                return (
                <FormGroup key={ key } controlId={ 'id' + key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] ? 'error' : null }>
                  { title }
                  <Col sm={ 9 }>
                    <FormControl
                      id={ 'field-textarea-' + v.key }
                      ref={ 'field-textarea-' + v.key }
                      componentClass='textarea'
                      disabled={ loading }
                      value={ this.state.values[v.key] }
                      onChange={ (e) => { v.required && !e.target.value ? this.state.errors[v.key] = '必填' : delete this.state.errors[v.key]; this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values, errors: this.state.errors }); } }
                      onBlur={ (e) => { this.state.touched[v.key] = true; this.setState({ touched: this.state.touched }); } }
                      style={ { height: '200px' } }
                      placeholder={ '输入' + v.name } />
                  </Col>
                  <Col sm={ 1 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> );
              } else if (v.key === 'labels' && options.permissions && options.permissions.indexOf('manage_project') !== -1) {
                return (
                <FormGroup key={ key } controlId={ 'id' + key }>
                  { title }
                  <Col sm={ 7 }>
                    <CreatableSelect
                      multi
                      value={ this.state.values[v.key] || [] }
                      clearable={ false }
                      onChange={ newValue => { this.state.values[v.key] = newValue; this.setState({ values: this.state.values }); } }
                      options={ _.map(options.labels || [], (val) => { return { label: val, value: val } } ) }
                      placeholder='选择或输入标签'/>
                  </Col>
                </FormGroup> );
              } else if ([ 'Select', 'MultiSelect', 'SingleVersion', 'MultiVersion', 'SingleUser', 'MultiUser' ].indexOf(v.type) !== -1) {
                return (
                <FormGroup key={ key } controlId={ 'id' + key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] ? 'error' : null }>
                  { title }
                  <Col sm={ 7 }>
                    <Select 
                      simpleValue
                      disabled={ loading }
                      multi={ v.type === 'MultiSelect' || v.type === 'MultiVersion' || v.type === 'MultiUser' }
                      clearable={ !v.required && v.key !== 'assignee' && v.key !== 'resolution' } 
                      value={ this.state.values[v.key] || null } 
                      options={ _.map(v.optionValues, (val) => { return { label: val.name, value: val.id } } ) } 
                      onChange={ newValue => { v.required && !newValue ? this.state.errors[v.key] = '必选' : delete this.state.errors[v.key]; this.state.touched[v.key] = true; this.state.values[v.key] = newValue; this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched }) } } 
                      className={ this.state.touched[v.key] && this.state.errors[v.key] && 'select-error' }
                      placeholder={ '选择' + v.name } />
                    { v.key === 'labels' &&
                      <div>
                        <span style={ { fontSize: '12px' } }>拥有项目管理权限的用户才可创建新的标签。</span>
                      </div> }
                  </Col>
                  <Col sm={ 1 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> ); 
              } else if (v.type === 'CheckboxGroup') {
                return (
                <FormGroup key={ key } controlId={ 'id' + key } validationState={ this.state.errors[v.key] ? 'error' : null }>
                  { title }
                  <Col sm={ 9 }>
                    <CheckboxGroup
                      style={ { marginTop: '7px' } }
                      name={ v.name }
                      value={ this.state.values[v.key] }
                      onChange={ newValue => { v.required && newValue.length <= 0 ? this.state.errors[v.key] = '必选' : delete this.state.errors[v.key]; this.state.touched[v.key] = true; this.state.values[v.key] = newValue; this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched }) } }>
                      { _.map(v.optionValues || [], (val, i) => 
                        <span style={ { marginLeft: '6px' } } key={ i }><Checkbox disabled={ loading } value={ val.id }/>{ ' ' + val.name + ' ' }</span>
                        )
                      }
                      { this.state.touched[v.key] && this.state.errors[v.key] && <div><ControlLabel>{ this.state.errors[v.key] || '' }</ControlLabel></div> }
                    </CheckboxGroup>
                  </Col>
                </FormGroup> );
              } else if (v.type === 'RadioGroup') {
                return (
                <FormGroup key={ key } controlId={ 'id' + key }>
                  { title }
                  <Col sm={ 9 }>
                    <RadioGroup
                      style={ { marginTop: '7px' } }
                      name={ v.name }
                      selectedValue={ this.state.values[v.key] }
                      onChange={ newValue => { this.state.values[v.key] = newValue; this.setState({ values: this.state.values }) } }>
                      { _.map(v.optionValues || [], (val, i) =>
                        <span style={ { marginLeft: '6px' } } key={ i }><Radio disabled={ loading } value={ val.id }/>{ ' ' + val.name + ' ' }</span>
                        )
                      }
                    </RadioGroup>
                  </Col>
                </FormGroup> ); 
              } else if (v.type === 'DatePicker' || v.type === 'DateTimePicker') {
                return (
                <FormGroup key={ key } controlId={ 'id' + key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] ? 'error' : null }>
                  { title }
                  <Col sm={ 4 }>
                    <DateTime 
                      mode='date' 
                      locale='zh-cn'
                      dateFormat={ 'YYYY/MM/DD' }
                      timeFormat={ v.type === 'DateTimePicker' ?  'HH:mm' : false } 
                      closeOnSelect={ v.type === 'DatePicker' }
                      value={ this.state.values[v.key] } 
                      onChange={ newValue => { v.required && !newValue ? this.state.errors[v.key] = '必填' : (newValue && !moment(newValue).isValid() ? this.state.errors[v.key] = '格式有误' : delete this.state.errors[v.key]); this.state.touched[v.key] = true; this.state.values[v.key] = newValue; this.setState({ values: this.state.values, errors: this.state.errors, touched: this.state.touched }); } }/>
                  </Col>
                  <Col sm={ 2 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> );
              } else if (v.type === 'File' && options.permissions && options.permissions.indexOf('upload_file') !== -1) {
                const componentConfig = {
                  showFiletypeIcon: true,
                  postUrl: '/api/project/' + project.key + '/file'
                };
                const djsConfig = {
                  addRemoveLinks: true,
                  paramName: v.key
                };
                const eventHandlers = {
                  init: dz => this.dropzone = dz,
                  success: this.success.bind(this),
                  error: (localfile) => { this.dropzone.removeFile(localfile); },
                  removedfile: this.removedfile.bind(this)
                }
                return (
                <FormGroup key={ key } controlId={ 'id' + key }>
                  { title }
                  <Col sm={ 7 }>
                    <div style={ { marginTop: '7px' } }>
                      <DropzoneComponent config={ componentConfig } eventHandlers={ eventHandlers } djsConfig={ djsConfig }/>
                    </div>
                  </Col>
                </FormGroup> );
              } else if (v.type === 'Url') {
                return (
                <FormGroup key={ key } controlId={ 'id' + key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] ? 'error' : null }>
                  { title }
                  <Col sm={ 7 }>
                    <FormControl
                      type='text'
                      disabled={ loading }
                      value={ this.state.values[v.key] }
                      onChange={ (e) => { v.required && !e.target.value ? this.state.errors[v.key] = '必填' : (e.target.value && !this.urlTest(e.target.value) ? this.state.errors[v.key] = '格式有误' : delete this.state.errors[v.key]); this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values, errors: this.state.errors }); } }
                      onBlur={ (e) => { this.state.touched[v.key] = true; this.setState({ touched: this.state.touched }); } }
                      placeholder={ '输入' + v.name } />
                  </Col>
                  <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> );
              } else if (v.type === 'TimeTracking') {
                return (
                <FormGroup key={ key } controlId={ 'id' + key } validationState={ this.state.touched[v.key] && this.state.errors[v.key] ? 'error' : null }>
                  { title }
                  <Col sm={ 4 }>
                    <FormControl
                      type='text'
                      disabled={ loading }
                      value={ this.state.values[v.key] }
                      onChange={ (e) => { v.required && !e.target.value ? this.state.errors[v.key] = '必填' : (e.target.value && !this.ttTest(e.target.value) ? this.state.errors[v.key] = '格式有误' : delete this.state.errors[v.key]); this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values, errors: this.state.errors }); } }
                      onBlur={ (e) => { this.state.touched[v.key] = true; this.setState({ touched: this.state.touched }); } }
                      placeholder={ '例如：3w 4d 12h 30m' } />
                  </Col>
                  <Col sm={ 6 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                    { this.state.touched[v.key] && (this.state.errors[v.key] || '') }
                  </Col>
                </FormGroup> );
              }
            }) }
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button 
            type='submit' 
            disabled={ (data.id && this.getChangedKeys().length <= 0 && isFromWorkflow === false) || _.isEmpty(schema) || !_.isEmpty(this.state.errors) || loading } 
            onClick={ this.handleSubmit }>
            确定
          </Button>
          <Button bsStyle='link' onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CreateModal;
