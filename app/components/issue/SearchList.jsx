import React, { PropTypes, Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

import Duration from '../share/Duration';

const $ = require('$');

export default class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      baseFilterShow: true,
      memberFilterShow: true,
      timeFilterShow: true,
      agileFilterShow: true,
      type: '', 
      assignee: '', 
      reporter: '', 
      watcher: '', 
      resolver: '', 
      closer: '', 
      state: '', 
      priority: '', 
      resolution: '', 
      module: '', 
      resolve_vesion: '', 
      effect_versions: '',
      epic: '', 
      sprint: '', 
      labels: '', 
      created_at: '', 
      updated_at: '', 
      resolved_at: '', 
      closed_at: '', 
      title: '' };
    this.search = this.search.bind(this);
  }

  static propTypes = {
    refresh: PropTypes.func.isRequired,
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
      resolver: newQuery.resolver ? newQuery.resolver : '',
      closer: newQuery.closer ? newQuery.closer : '',
      state: newQuery.state ? newQuery.state : '',
      resolution: newQuery.resolution ? newQuery.resolution : '',
      priority: newQuery.priority ? newQuery.priority : '',
      module: newQuery.module ? newQuery.module : '',
      resolve_version: newQuery.resolve_version ? newQuery.resolve_version : '',
      effect_versions: newQuery.effect_versions ? newQuery.effect_versions : '',
      epic: newQuery.epic ? newQuery.epic : '',
      sprint: newQuery.sprint ? newQuery.sprint : null,
      labels: newQuery.labels ? newQuery.labels : '',
      created_at: newQuery.created_at ? newQuery.created_at : null,
      updated_at: newQuery.updated_at ? newQuery.updated_at : null,
      resolved_at: newQuery.resolved_at ? newQuery.resolved_at : null,
      closed_at: newQuery.closed_at ? newQuery.closed_at : null
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
    if (this.state.resolver) { newQuery.resolver = this.state.resolver; }
    if (this.state.closer) { newQuery.closer = this.state.closer; }
    if (this.state.state) { newQuery.state = this.state.state; }
    if (this.state.resolution) { newQuery.resolution = this.state.resolution; }
    if (this.state.priority) { newQuery.priority = this.state.priority; }
    if (this.state.module) { newQuery.module = this.state.module; }
    if (this.state.resolve_version) { newQuery.resolve_version = this.state.resolve_version; }
    if (this.state.effect_versions) { newQuery.effect_versions = this.state.effect_versions; }
    if (this.state.epic) { newQuery.epic = this.state.epic; }
    if (this.state.sprint) { newQuery.sprint = this.state.sprint; }
    if (this.state.labels) { newQuery.labels = this.state.labels; }
    if (this.state.created_at) { newQuery.created_at = this.state.created_at; }
    if (this.state.updated_at) { newQuery.updated_at = this.state.updated_at; }
    if (this.state.resolved_at) { newQuery.resolved_at = this.state.resolved_at; }
    if (this.state.closed_at) { newQuery.closed_at = this.state.closed_at; }
    if (this.state.title) { newQuery.title = this.state.title; }

    if (query.orderBy) { newQuery.orderBy = query.orderBy; }

    refresh(newQuery);
  }

  render() {
    const { 
      indexLoading, 
      searchShow=false, 
      options: { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], epics=[], sprints=[], labels=[], users=[] } } = this.props;

    const typeOptions = _.map(types, (val) => { return { label: val.name, value: val.id } });
    const userOptions = _.map(users, (val) => { return { label: val.name + '(' + val.email + ')', value: val.id } });
    userOptions.unshift({ value: 'me', label: '当前用户' });
    const stateOptions = _.map(states, (val) => { return { label: (<span className={ 'state-' + val.category + '-label' }>{ val.name }</span>), value: val.id } });
    const priorityOptions = _.map(priorities, (val) => { return { label: val.name, value: val.id } });
    const resolutionOptions = _.map(resolutions, (val) => { return { label: val.name, value: val.id } });
    const moduleOptions = _.map(modules, (val) => { return { label: val.name, value: val.id } });
    const versionOptions = _.map(versions, (val) => { return { label: val.name, value: val.id } });
    const epicOptions = _.map(epics, (val) => { return { label: val.name, value: val.id } });
    const sprintOptions = _.map(sprints, (val) => { return { label: 'Sprint ' + val, value: val } });
    const labelOptions = _.map(labels, (val) => { return { label: val, value: val } });

    return (
      <Form horizontal style={ { marginTop: '10px', marginBottom: '15px', padding: '15px 10px 1px 10px', backgroundColor: '#f5f5f5', borderRadius: '4px' } } className={ !searchShow && 'hide' }>
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px', color: '#aaa' } }>
          基本字段
          <span className='direct-button' onClick={ () => this.setState({ baseFilterShow: !this.state.baseFilterShow }) } title={ this.state.baseFilterShow ? '收缩' : '展开' }>
            { this.state.baseFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
          </span>
        </div>
        { this.state.baseFilterShow &&
        <FormGroup>
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
        </FormGroup> }
        { this.state.baseFilterShow &&
        <FormGroup>
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
        </FormGroup> }
        { this.state.baseFilterShow &&
        <FormGroup>
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
          <Col sm={ 1 } componentClass={ ControlLabel }>
            影响版本
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择影响版本'
              value={ this.state.effect_versions }
              onChange={ (newValue) => { this.state.effect_versions = newValue; this.search(); } }
              options={ versionOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            标签
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择标签'
              value={ this.state.labels }
              onChange={ (newValue) => { this.state.labels = newValue; this.search(); } }
              options={ labelOptions }/>
          </Col>
        </FormGroup> }
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px', color: '#aaa' } }>
          人员
          <span className='direct-button' onClick={ () => this.setState({ memberFilterShow: !this.state.memberFilterShow }) } title={ this.state.memberFilterShow ? '收缩' : '展开' }>
            { this.state.memberFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
          </span>
        </div>
        { this.state.memberFilterShow &&
        <FormGroup>
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
        </FormGroup> }
        { this.state.memberFilterShow &&
        <FormGroup>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            解决者 
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择解决者'
              value={ this.state.resolver }
              onChange={ (newValue) => { this.state.resolver = newValue; this.search(); } }
              options={ userOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            关闭者
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择关闭者'
              value={ this.state.closer }
              onChange={ (newValue) => { this.state.closer = newValue; this.search(); } }
              options={ userOptions }/>
          </Col>
        </FormGroup> }
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px', color: '#aaa' } }>
          时间 
          <span className='direct-button' onClick={ () => this.setState({ timeFilterShow: !this.state.timeFilterShow }) } title={ this.state.timeFilterShow ? '收缩' : '展开' }>
            { this.state.timeFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
          </span>
        </div>
        { this.state.timeFilterShow &&
        <FormGroup>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            创建时间
          </Col>
          <Col sm={ 5 }>
            <Duration
              value={ this.state.created_at }
              onChange={ (newValue) => { this.setState({ created_at: newValue }); this.search(); } }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            更新时间
          </Col>
          <Col sm={ 5 }>
            <Duration
              value={ this.state.updated_at }
              onChange={ (newValue) => { this.setState({ updated_at: newValue }); this.search(); } }/>
          </Col>
        </FormGroup> }
        { this.state.timeFilterShow &&
        <FormGroup>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            解决时间
          </Col>
          <Col sm={ 5 }>
            <Duration
              value={ this.state.resolved_at }
              onChange={ (newValue) => { this.setState({ resolved_at: newValue }); this.search(); } }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            关闭时间
          </Col>
          <Col sm={ 5 }>
            <Duration
              value={ this.state.closed_at }
              onChange={ (newValue) => { this.setState({ closed_at: newValue }); this.search(); } }/>
          </Col>
        </FormGroup> }
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px', color: '#aaa' } }>
          敏捷迭代 
          <span className='direct-button' onClick={ () => this.setState({ agileFilterShow: !this.state.agileFilterShow }) } title={ this.state.agileFilterShow ? '收缩' : '展开' }>
            { this.state.agileFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
          </span>
        </div>
        { this.state.agileFilterShow &&
        <FormGroup>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            Epic 
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择Epic'
              value={ this.state.epic }
              onChange={ (newValue) => { this.state.epic = newValue; this.search(); } }
              options={ epicOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            Sprint
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              placeholder='选择Sprint'
              value={ this.state.sprint }
              onChange={ (newValue) => { this.state.sprint = newValue; this.search(); } }
              options={ sprintOptions }/>
          </Col>
        </FormGroup> }
      </Form>
    );
  }
}
