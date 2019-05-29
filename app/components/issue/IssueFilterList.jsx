import React, { PropTypes, Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

import Duration from '../share/Duration';

const $ = require('$');
const filters = [
  'type',
  'assignee',
  'reporter',
  'watcher',
  'resolver',
  'closer',
  'state',
  'resolution',
  'priority',
  'module',
  'resolve_version',
  'effect_versions',
  'epic',
  'sprint',
  'labels',
  'created_at',
  'updated_at',
  'resolved_at',
  'closed_at',
  'expect_complete_time',
  'title',
  'orderBy'
];

export class IssueFilterList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      baseFilterShow: true,
      memberFilterShow: true,
      timeFilterShow: true,
      agileFilterShow: true
    }

    _.forEach(filters, (v) => {
      this.state[v] = '';
    });

    this.search = this.search.bind(this);
  }

  static propTypes = {
    refresh: PropTypes.func.isRequired,
    query: PropTypes.object,
    searchShow: PropTypes.bool,
    notShowFields: PropTypes.array,
    notShowBlocks: PropTypes.array,
    options: PropTypes.object
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    _.forEach(filters, (v) => {
      this.state[v] = newQuery[v] ? newQuery[v] : '';
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

    const newQuery = _.assign({}, query);
    _.forEach(filters, (v) => {
      if (this.state[v]) {
        newQuery[v] = this.state[v];
      } else {
        delete newQuery[v];
      }
    });

    refresh(newQuery);
  }

  render() {
    const { 
      searchShow=false, 
      notShowFields=[],
      notShowBlocks=[],
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
        </FormGroup> }
        { this.state.memberFilterShow &&
        <FormGroup>
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
          { notShowFields.indexOf('watcher') === -1 &&
          <Col sm={ 1 } componentClass={ ControlLabel }>
            关注者
          </Col> }
          { notShowFields.indexOf('watcher') === -1 &&
          <Col sm={ 3 }>
            <Select
              simpleValue
              multi
              placeholder='选择关注者'
              value={ this.state.watcher }
              onChange={ (newValue) => { this.state.watcher = newValue; this.search(); } }
              options={ [ { value: 'me', label: '当前用户' } ] }/>
          </Col> }
        </FormGroup> }
        { notShowBlocks.indexOf('time') === -1 &&
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px', color: '#aaa' } }>
          时间 
          <span className='direct-button' onClick={ () => this.setState({ timeFilterShow: !this.state.timeFilterShow }) } title={ this.state.timeFilterShow ? '收缩' : '展开' }>
            { this.state.timeFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
          </span>
        </div> }
        { this.state.timeFilterShow && notShowBlocks.indexOf('time') === -1 &&
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
        { this.state.timeFilterShow && notShowBlocks.indexOf('time') === -1 &&
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
        { this.state.timeFilterShow && notShowBlocks.indexOf('time') === -1 &&
        <FormGroup>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            期望完成 
          </Col>
          <Col sm={ 5 }>
            <Duration
              mode='fix_duration'
              value={ this.state.expect_complete_time }
              onChange={ (newValue) => { this.setState({ expect_complete_time: newValue }); this.search(); } }/>
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
              value={ this.state.sprint || null }
              onChange={ (newValue) => { this.state.sprint = newValue; this.search(); } }
              options={ sprintOptions }/>
          </Col>
        </FormGroup> }
      </Form>
    );
  }
}

export function getCondsTxt(query, options) {
  const { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], epics=[], sprints=[], users=[] } = options;

  const errorMsg = ' 检索值解析失败，条件无法正常显示。如果当前检索已被保存为过滤器，建议删除，重新保存。';
  const queryConds = [];
  let index = -1;

  if (query.no) { queryConds.push('NO～' + query.no); }
  if (query.title) { queryConds.push('主题/NO～' + query.title); }

  const baseConds = [
    { key: 'type', name: '类型', values: types },
    { key: 'priority', name: '优先级', values: priorities },
    { key: 'state', name: '状态', values: states },
    { key: 'resolution', name: '解决结果', values: resolutions },
    { key: 'module', name: '模块', values: modules },
    { key: 'resolve_version', name: '解决版本', values: versions  },
    { key: 'effect_versions', name: '影响版本', values: versions }
  ];
  for (let i = 0; i < baseConds.length; i++) {
    const v = baseConds[i];
    if (query[v.key]) {
      const baseQuery = query[v.key].split(',');
      const baseQueryNames = [];
      for (let j = 0; j < baseQuery.length; j++) {
        if ((index = _.findIndex(v.values, { id: baseQuery[j] })) !== -1) {
          baseQueryNames.push(v.values[index].name);
        } else {
          return v.name + errorMsg;
        }
      }
      queryConds.push(v.name + '～' + baseQueryNames.join('，'));
    }
  };

  if (query.labels) {
    queryConds.push('标签～' + query.labels);
  }

  const memberConds = [
    { key: 'reporter', name : '报告人' },
    { key: 'assignee', name: '经办人' },
    { key: 'watcher', name : '关注者' },
    { key: 'resolver', name : '解决者' },
    { key: 'closer', name : '关闭者' }
  ];
  for (let i = 0; i < memberConds.length; i++) {
    const v = memberConds[i];
    if (query[v.key]) {
      const memberQuery = query[v.key].split(',');
      const memberQueryNames = [];
      for (let j = 0; j < memberQuery.length; j++) {
        if (memberQuery[j] == 'me') {
          memberQueryNames.push('当前用户');
        } else if ((index = _.findIndex(users, { id: memberQuery[j] })) !== -1) {
          memberQueryNames.push(users[index].name);
        } else {
          return v.name + errorMsg;
        }
      }
      queryConds.push(v.name + '～' + memberQueryNames.join('，'));
    }
  }

  const timeConds = [
    { key: 'created_at', name: '创建时间' },
    { key: 'updated_at', name : '更新时间' },
    { key: 'resolved_at', name : '解决时间' },
    { key: 'closed_at', name : '关闭时间' },
    { key: 'expect_complete_time', name : '期望完成时间' }
  ];
  const units = { w: '周', m: '月', y: '年' };
  for (let i = 0; i < timeConds.length; i++) {
    const v = timeConds[i];
    if (query[v.key]) {
      let cond = '';
      if (_.endsWith(query[v.key], 'w') || _.endsWith(query[v.key], 'm') || _.endsWith(query[v.key], 'y')) {
        const pattern = new RegExp('^(-?)(\\d+)(w|m|y)$');
        if (pattern.exec(query[v.key])) {
          cond = RegExp.$2 + units[RegExp.$3] + (RegExp.$1 === '-' ? '外' : '内');
        } else {
          return v.name + errorMsg;
        }
      } else {
        cond = query[v.key];
      }
      queryConds.push(v.name + '～' + cond);
    }
  }

  if (query.epic) {
    const epicQuery = query.epic.split(',');
    const epicQueryNames = [];
    for (let i = 0; i < epicQuery.length; i++) {
      if ((index = _.findIndex(epics, { id: epicQuery[i] })) !== -1) {
        epicQueryNames.push(epics[index].name);
      } else {
        return 'Epic' + errorMsg;
      }
    }
    queryConds.push('Epic～' + epicQueryNames.join('，'));
  }
  if (query.sprint) {
    const sprintQuery = query.sprint.split(',');
    const sprintQueryNames = [];
    for (let i = 0; i < sprintQuery.length; i++) {
      if ((index = sprints.indexOf(sprintQuery[i])) !== -1) {
        sprintQueryNames.push(sprints[index]);
      } else {
        return 'Sprint' + errorMsg;
      }
    }
    queryConds.push('Sprint～Sprint ' + sprintQueryNames.join('，'));
  }

  if (queryConds.length <= 0) { return ''; }

  return queryConds.join(' | ');
}
