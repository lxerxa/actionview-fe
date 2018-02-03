import React, { PropTypes, Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

const $ = require('$');

export default class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      type: '', 
      assignee: '', 
      reporter: '', 
      watcher: '', 
      state: '', 
      priority: '', 
      resolution: '', 
      module: '', 
      resolve_vesion: '', 
      created_at: '', 
      updated_at: '', 
      title: '' };
    this.search = this.search.bind(this);
  }

  static propTypes = {
    refresh: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    query: PropTypes.object,
    searchShow: PropTypes.bool,
    options: PropTypes.object,
    indexLoading: PropTypes.bool.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    this.setState({ 
      title: newQuery.title ? newQuery.title : '',
      type: newQuery.type ? newQuery.type : '',
      assignee: newQuery.assignee ? newQuery.assignee : '',
      reporter: newQuery.reporter ? newQuery.reporter : '',
      watcher: newQuery.watcher ? newQuery.watcher : '',
      state: newQuery.state ? newQuery.state : '',
      resolution: newQuery.resolution ? newQuery.resolution : '',
      priority: newQuery.priority ? newQuery.priority : '',
      module: newQuery.module ? newQuery.module : '',
      resolve_version: newQuery.resolve_version ? newQuery.resolve_version : '',
      created_at: newQuery.created_at ? newQuery.created_at : null,
      updated_at: newQuery.updated_at ? newQuery.updated_at : null
    });
  }

  componentDidMount() {
    const self = this;
    $('#title').bind('keypress',function(event){
      if(event.keyCode == '13') {
        self.search();
      }
    });
  }

  search() {
    const { query={}, refresh } = this.props;

    const newQuery = {};
    if (this.state.type) {  newQuery.type = this.state.type; }
    if (this.state.assignee) { newQuery.assignee = this.state.assignee; }
    if (this.state.reporter) { newQuery.reporter = this.state.reporter; }
    if (this.state.watcher) { newQuery.watcher = this.state.watcher; }
    if (this.state.state) { newQuery.state = this.state.state; }
    if (this.state.resolution) { newQuery.resolution = this.state.resolution; }
    if (this.state.priority) { newQuery.priority = this.state.priority; }
    if (this.state.module) { newQuery.module = this.state.module; }
    if (this.state.resolve_version) { newQuery.resolve_version = this.state.resolve_version; }
    if (this.state.created_at) { newQuery.created_at = this.state.created_at; }
    if (this.state.updated_at) { newQuery.updated_at = this.state.updated_at; }
    if (this.state.title) { newQuery.title = this.state.title; }

    if (query.orderBy) { newQuery.orderBy = query.orderBy; }

    refresh(newQuery);
  }

  render() {
    const { indexLoading, searchShow=false, hide, options: { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], users=[] } } = this.props;

    const typeOptions = _.map(types, (val) => { return { label: val.name, value: val.id } });
    const userOptions = _.map(users, (val) => { return { label: val.name + '(' + val.email + ')', value: val.id } });
    userOptions.unshift({ value: 'me', label: '当前用户' });
    const stateOptions = _.map(states, (val) => { return { label: val.name, value: val.id } });
    const priorityOptions = _.map(priorities, (val) => { return { label: val.name, value: val.id } });
    const resolutionOptions = _.map(resolutions, (val) => { return { label: val.name, value: val.id } });
    const dateOptions = [{ label: '一周内', value: '1w' }, { label: '两周内', value: '2w' }, { label: '一月内', value: '1m' }, { label: '一月外', value: '-1m' }];
    const moduleOptions = _.map(modules, (val) => { return { label: val.name, value: val.id } });
    const versionOptions = _.map(versions, (val) => { return { label: val.name, value: val.id } });

    return (
      <Form horizontal style={ { marginTop: '10px', marginBottom: '15px', padding: '15px 10px 1px 10px', backgroundColor: '#f5f5f5' } } className={ !searchShow && 'hide' }>
        <FormGroup controlId='formControlsLabel'>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            主题/NO
          </Col>
          <Col sm={ 3 }>
            <FormControl
              id='title'
              type='text'
              value={ this.state.title }
              onChange={ (e) => { this.setState({ title: e.target.value }) } }
              placeholder={ '输入关键字或编号' } />
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            类型 
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择类型'
              value={ this.state.type }
              onChange={ (newValue) => { this.state.type = newValue; this.search(); } }
              options={ typeOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            状态
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择状态'
              value={ this.state.state }
              onChange={ (newValue) => { this.state.state = newValue; this.search(); } }
              options={ stateOptions }/>
          </Col>
        </FormGroup>
        <FormGroup controlId='formControlsLabel'>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            经办人
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择经办人'
              value={ this.state.assignee }
              onChange={ (newValue) => { this.state.assignee = newValue; this.search(); } }
              options={ userOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            优先级
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择优先级'
              value={ this.state.priority }
              onChange={ (newValue) => { this.state.priority = newValue; this.search(); } }
              options={ priorityOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            解决结果
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择解决结果'
              value={ this.state.resolution }
              onChange={ (newValue) => { this.state.resolution = newValue; this.search(); } }
              options={ resolutionOptions }/>
          </Col>
        </FormGroup>
        <FormGroup controlId='formControlsLabel'>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            报告人
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择报告人'
              value={ this.state.reporter }
              onChange={ (newValue) => { this.state.reporter = newValue; this.search(); } }
              options={ userOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            模块
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择模块'
              value={ this.state.module }
              onChange={ (newValue) => { this.state.module = newValue; this.search(); } }
              options={ moduleOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            解决版本 
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择解决版本'
              value={ this.state.resolve_version }
              onChange={ (newValue) => { this.state.resolve_version = newValue; this.search(); } }
              options={ versionOptions }/>
          </Col>
        </FormGroup>
        <FormGroup controlId='formControlsLabel'>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            关注者
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择关注者'
              value={ this.state.watcher }
              onChange={ (newValue) => { this.state.watcher = newValue; this.search(); } }
              options={ [ { value: 'me', label: '当前用户' } ] }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            创建时间
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              placeholder='选择时间段'
              value={ this.state.created_at }
              onChange={ (newValue) => { this.state.created_at = newValue; this.search(); } }
              options={ dateOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            更新时间
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              placeholder='选择时间段'
              value={ this.state.updated_at }
              onChange={ (newValue) => { this.state.updated_at = newValue; this.search(); } }
              options={ dateOptions }/>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
