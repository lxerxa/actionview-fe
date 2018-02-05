import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');

export default class FilterConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '', 
      type: '', 
      assignee: '', 
      reporter: '', 
      state: '', 
      priority: '', 
      resolution: '', 
      module: '', 
      created_at: null, 
      updated_at: null,
      touched: {},
      errors: {} };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillMount() {
    const { data: { query={}, filters=[] }, model, no=-1 } = this.props;
    if (model == 'global') {
      this.state.type = query.type && query.type.join(',') || ''; 
      this.state.assignee = query.assignee && query.assignee.join(',') || ''; 
      this.state.reporter = query.reporter && query.reporter.join(',') || ''; 
      this.state.state = query.state && query.state.join(',') || ''; 
      this.state.resolution = query.resolution && query.resolution.join(',') || ''; 
      this.state.priority = query.priority && query.priority.join(',') || ''; 
      this.state.module = query.module && query.module.join(',') || ''; 
      this.state.created_at = query.created_at || null; 
      this.state.updated_at = query.updated_at || null; 
    } else if (model == 'filter' && no >= 0) {
      const filter = _.find(filters, { no: no });
      if (!filter) {
        return;
      }
      const filterQuery = filter.query; 
      this.state.name = filter.name;
      this.state.type = filterQuery.type && filterQuery.type.join(',') || '';
      this.state.assignee = filterQuery.assignee && filterQuery.assignee.join(',') || '';
      this.state.reporter = filterQuery.reporter && filterQuery.reporter.join(',') || '';
      this.state.state = filterQuery.state && filterQuery.state.join(',') || '';
      this.state.resolution = filterQuery.resolution && filterQuery.resolution.join(',') || '';
      this.state.priority = filterQuery.priority && filterQuery.priority.join(',') || '';
      this.state.module = filterQuery.module && filterQuery.module.join(',') || '';
      this.state.created_at = filterQuery.created_at || null;
      this.state.updated_at = filterQuery.updated_at || null;
    }
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    model: PropTypes.string.isRequired,
    no: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    update: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    options: PropTypes.object,
    data: PropTypes.object
  }

  async handleSubmit() {
    const { update, close, data:{ id, filters=[] }, model, no } = this.props;

    const submitData = {};
    if (this.state.type) { submitData.type = this.state.type.split(','); } 
    if (this.state.state) { submitData.state = this.state.state.split(','); } 
    if (this.state.priority) { submitData.priority = this.state.priority.split(','); } 
    if (this.state.resolution) { submitData.resolution = this.state.resolution.split(','); } 
    if (this.state.module) { submitData.module = this.state.module.split(','); } 
    if (this.state.assignee) { submitData.assignee = this.state.assignee.split(','); } 
    if (this.state.reporter) { submitData.reporter = this.state.reporter.split(','); } 
    if (this.state.created_at) { submitData.created_at = this.state.created_at; }
    if (this.state.updated_at) { submitData.updated_at = this.state.updated_at; }

    let ecode = 0;
    if (model == 'global') {
      ecode = await update(_.extend({ query: submitData }, { id }));
    } else if (model == 'filter') {
      if (no >= 0) {
        const index = _.findIndex(filters, { no: no });
        filters[index].query = submitData;
        filters[index].name = this.state.name;
      } else {
        let no = 0;
        if (filters.length > 0) {
          no = _.max(_.map(filters, (v) => v.no)) + 1;
        }
        filters.push({ query: submitData, name: this.state.name, no });
      }
      ecode = await update(_.extend({ filters }, { id }));
    }
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('设置完成。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { close, loading } = this.props;
    if (loading) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  render() {
    const { i18n: { errMsg }, model, no, loading, options: { types=[], states=[], priorities=[], resolutions=[], modules=[], users=[] } } = this.props;

    const typeOptions = _.map(_.filter(types, (v) => { return v.type === 'standard' }), (val) => { return { label: val.name, value: val.id } });
    const userOptions = _.map(users, (val) => { return { label: val.name + '(' + val.email + ')', value: val.id } });
    userOptions.unshift({ value: 'me', label: '当前用户' });
    const stateOptions = _.map(states, (val) => { return { label: val.name, value: val.id } });
    const priorityOptions = _.map(priorities, (val) => { return { label: val.name, value: val.id } });
    const resolutionOptions = _.map(resolutions, (val) => { return { label: val.name, value: val.id } });
    const dateOptions = [{ label: '一周内', value: '1w' }, { label: '两周内', value: '2w' }, { label: '一月内', value: '1m' }];
    const moduleOptions = _.map(modules, (val) => { return { label: val.name, value: val.id } });

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' bsSize='large' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ model == 'global' ? '全局过滤器' : ( no === -1 ? '添加快速过滤器' : '编辑快速过滤器' ) }</Modal.Title>
        </Modal.Header>
        <Form horizontal onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body>
          { model === 'filter' &&
          <FormGroup controlId='formControlsLabel' style={ { height: '50px', borderBottom: '1px solid #ddd' } } validationState={ this.state.touched.name && this.state.errors.name && 'error' || '' }>
            <Col sm={ 2 } componentClass={ ControlLabel }>
             <span className='txt-impt'>*</span>过滤器名称 
            </Col>
            <Col sm={ 8 }>
              <FormControl
                type='text'
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }); if (!e.target.value) { this.state.errors.name = '必填'; this.setState({ errors: this.state.errors }); } else { this.setState({ errors: {} }); } } }
                onBlur={ (e) => { this.state.touched.name = true; this.setState({ touched: this.state.touched }); } }
                placeholder={ '输入名称' } />
            </Col>
            <Col sm={ 2 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
              { this.state.touched.name && (this.state.errors.name || '') }
            </Col>
          </FormGroup> }
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              类型 
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                multi
                placeholder='选择类型'
                value={ this.state.type }
                onChange={ (newValue) => { this.setState({ type: newValue }); } }
                options={ typeOptions }/>
            </Col>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              优先级 
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                multi
                placeholder='选择优先级'
                value={ this.state.priority }
                onChange={ (newValue) => { this.setState({ priority: newValue }); } }
                options={ priorityOptions }/>
            </Col>
          </FormGroup>
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              状态
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                multi
                placeholder='选择状态'
                value={ this.state.state }
                onChange={ (newValue) => { this.setState({ state: newValue }); } }
                options={ stateOptions }/>
            </Col>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              解决结果 
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                multi
                placeholder='选择解决结果'
                value={ this.state.resolution }
                onChange={ (newValue) => { this.setState({ resolution: newValue }); } }
                options={ resolutionOptions }/>
            </Col>
          </FormGroup>
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              报告人 
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                multi
                placeholder='选择用户'
                value={ this.state.reporter }
                onChange={ (newValue) => { this.setState({ reporter: newValue }); } }
                options={ userOptions }/>
            </Col>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              经办人
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                multi
                placeholder='选择用户'
                value={ this.state.assignee }
                onChange={ (newValue) => { this.setState({ assignee: newValue }); } }
                options={ userOptions }/>
            </Col>
          </FormGroup>
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              创建时间
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                placeholder='选择时间段'
                value={ this.state.created_at }
                onChange={ (newValue) => { this.setState({ created_at: newValue }); } }
                options={ dateOptions }/>
            </Col>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              更新时间
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                placeholder='选择时间段'
                value={ this.state.updated_at }
                onChange={ (newValue) => { this.setState({ updated_at: newValue }); } }
                options={ dateOptions }/>
            </Col>
          </FormGroup>
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              模块 
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                multi
                placeholder='选择模块'
                value={ this.state.module }
                onChange={ (newValue) => { this.setState({ module: newValue }); } }
                options={ moduleOptions }/>
            </Col>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ (model === 'filter' && !this.state.name) || loading } onClick={ this.handleSubmit }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
