import React, { PropTypes, Component } from 'react';
import { Modal, Button, ControlLabel, FormControl, Form, FormGroup, Col } from 'react-bootstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { RadioGroup, Radio } from 'react-radio-group';
import DateTime from 'react-datetime';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const moment = require('moment');
const img = require('../../assets/images/loading.gif');

export default class MultiEditModal extends Component {
  constructor(props) {
    super(props);
    const { options:{ types=[], assignees=[] } } = props;
    this.state = { 
      fields: [],
      values: { 
        type: types[0] && types[0].id || null,
        assignee: assignees[0] && assignees[0].id || null 
      },
      errors: {},
      step: 1
    };

    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.goStep = this.goStep.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    multiUpdate: PropTypes.func.isRequired,
    issueIds: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired
  }

  goStep() {
    this.setState({ step: this.state.step == 2 ? 1 : 2 });
  }

  async confirm() {
    const { fields, values } = this.state;
    const { close, issueIds, options, multiUpdate, index, query } = this.props;

    const submitData = {};
    _.forEach(fields, (v) => {
      submitData[v] = '';
    });

    _.forEach(fields, (v) => {
      if (!values[v]) {
        return;
      }

      const i = _.findIndex(options.fields, { key: v });
      if (i !== -1) {
        const type = options.fields[i].type;
        if (v == 'labels') {
          if (_.isArray(values[v])) {
            submitData[v] = _.uniq(_.map(values[v], (v) => _.trim(v.value)));
          } else {
            submitData[v] = values[v].split(',');
          }
        } else if ([ 'MultiSelect', 'MultiVersion', 'MultiUser', 'CheckboxGroup' ].indexOf(type) !== -1) {
          submitData[v] = values[v].split(',');
        } else if (type == 'DatePicker') {
          submitData[v] = parseInt(moment(values[v]).startOf('day').format('X'));
        } else if (type == 'DateTimePicker') {
          submitData[v] = parseInt(moment(values[v]).format('X'));
        } else if (type == 'Number') {
          submitData[v] = parseFloat(values[v]);
        } else {
          submitData[v] = values[v]; 
        }
      }
    });
    
    const ecode = await multiUpdate({ method: 'update', data: { ids: issueIds, values: submitData } });
    this.setState({ ecode: ecode });
    if (ecode === 0) {
      close();
      notify.show('问题已更新。', 'success', 2000);
      index(query);
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  fieldsChanged(newValues) {
    this.setState({
      fields: newValues
    });
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
    const { i18n: { errMsg }, options, issueIds, loading } = this.props;

    const implicitFields = [ 'title', 'state', 'reporter', 'resolver', 'closer', 'created_at', 'updated_at', 'resolved_at', 'closed_at', 'sprints' ];

    const allFields = [];
    _.forEach(options.fields || [], (f) => {
      if (f.type !== 'File' && implicitFields.indexOf(f.key) === -1) {
        allFields.push(f);
      }
    });

    const rows = [];
    for(let i = 0; i < allFields.length; i = i + 2) {
      rows.push(
        <li style={ { height: '30px' } }>
          <div style={ { width: '50%', display: 'inline-block' } }>
            <Checkbox value={ allFields[i].key }/>
            <span> { allFields[i].name || '' }</span>
          </div>
          <div style={ { width: '50%', display: 'inline-block' } }>
            { allFields[i + 1] && <Checkbox value={ allFields[i + 1].key }/> }
            <span> { allFields[i + 1] && allFields[i + 1].name || '' }</span>
          </div>
        </li>);
    }

    const editFields = [];
    _.forEach(options.fields, (v) => {
      if (this.state.fields.indexOf(v.key) !== -1) {
        editFields.push(v);
      }
    });

    return (
      <Modal show onHide={ this.cancel } backdrop='static' bsSize='large' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>批量编辑问题</Modal.Title>
        </Modal.Header>
        { this.state.step == 1 ?
        <Modal.Body style={ { height: '580px', overflow: 'auto' } }>
          <div>Please select the field to edit：</div>
          <div style={ { padding: '5px 0px 0px 5px' } }>
            <CheckboxGroup name='field' value={ this.state.fields } onChange={ this.fieldsChanged.bind(this) }>
              <ui className='list-unstyled clearfix'>
                { _.map(rows, (v) => v) }
              </ui>
            </CheckboxGroup>
          </div>
        </Modal.Body>
        :
        <Modal.Body style={ { height: '580px', overflow: 'auto' } }>
          <div style={ { margin: '5px 0px 15px 10px' } }>Note：1、若选择字段of值不输入或不选择，该字段of值将被置为空；2、该操作可能会造成数据of不完整，请谨慎操作。</div>
          <Form horizontal>
            { _.map(editFields, (v) => { 
              if (v.type === 'Text' || v.type === 'Url') {
                return (
                  <FormGroup key={ v.key } controlId={ 'id' + v.key }>
                    <Col sm={ 2 } componentClass={ ControlLabel }>
                      { v.name }
                    </Col>
                    <Col sm={ 9 }>
                      <FormControl
                        type='text'
                        disabled={ loading }
                        value={ this.state.values[v.key] || '' }
                        onChange={ (e) => { this.setState({ values: { ...this.state.values, [v.key]: e.target.value } }) } }
                        placeholder={ 'Enter' + v.name } />
                    </Col>
                  </FormGroup> ) 
              } else if (v.type === 'Number') {
                return (
                  <FormGroup key={ v.key } controlId={ 'id' + v.key } validationState={ this.state.errors[v.key] ? 'error' : null }>
                    <Col sm={ 2 } componentClass={ ControlLabel }>
                      { v.name }
                    </Col>
                    <Col sm={ 3 }>
                      <FormControl
                        type='number'
                        disabled={ loading }
                        value={ this.state.values[v.key] || 0 }
                        onChange={ (e) => { e.target.value && isNaN(e.target.value) ? this.state.errors[v.key] = '格式有误' : delete this.state.errors[v.key]; this.setState({ values: { ...this.state.values, [v.key]: e.target.value } }) } }
                        max={ v.key == 'progress' ? '100' : '' }
                        placeholder={ 'Enter' + v.name } />
                    </Col>
                  </FormGroup> )
              } else if (v.type === 'TextArea') {
                return (
                  <FormGroup key={ v.key } controlId={ 'id' + v.key }>
                    <Col sm={ 2 } componentClass={ ControlLabel }>
                      { v.name }
                    </Col>
                    <Col sm={ 9 }>
                      <FormControl
                        componentClass='textarea'
                        disabled={ loading }
                        value={ this.state.values[v.key] || '' }
                        onChange={ (e) => { this.setState({ values: { ...this.state.values, [v.key]: e.target.value } }) } }
                        style={ { height: '150px' } }
                        placeholder={ 'Enter' + v.name } />
                    </Col>
                  </FormGroup> )
              } else if (v.key === 'labels' && options.permissions && options.permissions.indexOf('manage_project') !== -1) {
                return (
                  <FormGroup key={ v.key } controlId={ 'id' + v.key }>
                    <Col sm={ 2 } componentClass={ ControlLabel }>
                      { v.name }
                    </Col>
                    <Col sm={ 7 }>
                      <CreatableSelect
                        multi
                        value={ this.state.values[v.key] || [] }
                        clearable={ true }
                        onChange={ newValue => { this.setState({ values: { ...this.state.values, [v.key]: newValue } }) } }
                        options={ _.map(options.labels || [], (val) => { return { label: val.name, value: val.name } } ) }
                        placeholder='选择或输入标签'/>
                    </Col>
                  </FormGroup> )
              } else if ([ 'Select', 'MultiSelect', 'SingleVersion', 'MultiVersion', 'SingleUser', 'MultiUser', 'CheckboxGroup', 'RadioGroup' ].indexOf(v.type) !== -1) {
                return (
                  <FormGroup key={ v.key } controlId={ 'id' + v.key }>
                    <Col sm={ 2 } componentClass={ ControlLabel }>
                      { v.name }
                    </Col>
                    <Col sm={ 7 }>
                      <Select
                        options={ _.map(v.optionValues || [], (v) => { return { value: v.id, label: v.name } }) }
                        simpleValue
                        clearable={ v.key !== 'type' && v.key !== 'assignee' }
                        value={ this.state.values[v.key] || null }
                        disabled={ loading }
                        multi={ [ 'MultiSelect', 'MultiVersion', 'MultiUser', 'CheckboxGroup' ].indexOf(v.type) !== -1 }
                        onChange={ newValue => { this.setState({ values: { ...this.state.values, [v.key]: newValue } }) } }
                        placeholder={ 'Select' + v.name } />
                    </Col>
                  </FormGroup> )
              } else if (v.type === 'DatePicker' || v.type === 'DateTimePicker') {
                return (
                  <FormGroup key={ v.key } controlId={ 'id' + v.key } validationState={ this.state.errors[v.key] ? 'error' : null }>
                    <Col sm={ 2 } componentClass={ ControlLabel }>
                      { v.name }
                    </Col>
                    <Col sm={ 4 }>
                      <DateTime
                        mode='date'
                        locale='zh-cn'
                        dateFormat={ 'YYYY/MM/DD' }
                        timeFormat={ v.type === 'DateTimePicker' ?  'HH:mm' : false }
                        closeOnSelect={ v.type === 'DatePicker' }
                        value={ this.state.values[v.key] }
                        onChange={ newValue => { newValue && !moment(newValue).isValid() ? this.state.errors[v.key] = '格式有误' : delete this.state.errors[v.key]; this.setState({ values: { ...this.state.values, [v.key]: newValue } }) } } />
                    </Col>
                    <Col sm={ 3 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                      { this.state.errors[v.key] || '' }
                    </Col>
                  </FormGroup> )
              } else if (v.type === 'TimeTracking') {
                return (
                  <FormGroup key={ v.key } controlId={ 'id' + v.key } validationState={ this.state.errors[v.key] ? 'error' : null }>
                    <Col sm={ 2 } componentClass={ ControlLabel }>
                      { v.name }
                    </Col>
                    <Col sm={ 4 }>
                      <FormControl
                        type='text'
                        disabled={ loading }
                        value={ this.state.values[v.key] || '' }
                        onChange={ (e) => { e.target.value && !this.ttTest(e.target.value) ? this.state.errors[v.key] = '格式有误' : delete this.state.errors[v.key]; this.setState({ values: { ...this.state.values, [v.key]: e.target.value } }) } }
                        placeholder='例如：3w 4d 12h 30m' />
                    </Col>
                    <Col sm={ 6 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
                      { this.state.errors[v.key] || '' }
                    </Col>
                  </FormGroup> )
              } } )
            }
          </Form>
        </Modal.Body> }
        <Modal.Footer>
          <div style={ { float: 'left' } }>Total选择问题 <b>{ issueIds.length }</b> 个。</div>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button onClick={ this.goStep } disabled={ this.state.fields.length <= 0 || loading }>{ this.state.step == 2 ? '< 上一步' : '下一步 >' }</Button>
          { this.state.step == 2 && <Button onClick={ this.confirm } style={ { marginLeft: '10px' } } disabled={ loading || !_.isEmpty(this.state.errors) }>确 定</Button> }
          <Button bsStyle='link' onClick={ this.cancel }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
