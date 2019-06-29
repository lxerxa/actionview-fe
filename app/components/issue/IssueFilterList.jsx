import React, { PropTypes, Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

import Duration from '../share/Duration';

const $ = require('$');

export class IssueFilterList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      baseFilterShow: true,
      memberFilterShow: false,
      timeFilterShow: false,
      agileFilterShow: false, 
      otherFilterShow: false 
    }

    this.state.query = {};

    this.search = this.search.bind(this);
    this.groupFields = this.groupFields.bind(this);
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
    if (_.isEmpty(newQuery)) {
      this.state.query = {};
    } else {
      _.forEach(newQuery, (v, key) => {
        this.state.query[key] = newQuery[key] ? newQuery[key] : '';
      });
    }
  }

  search() {
    const { query={}, refresh } = this.props;

    const newQuery = _.assign({}, query);
    _.forEach(this.state.query, (v, key) => {
      if (v) {
        newQuery[key] = v;
      } else {
        delete newQuery[key];
      }
    });

    refresh(newQuery);
  }

  groupFields(fields, columns=3) {
    const filters = [];

    _.forEach(fields, (v) => {
      if (v.type === 'Text') {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <FormControl
                type='text'
                value={ this.state.query[v.key] || '' }
                onKeyPress={ (e) => { if (e.charCode == '13') { this.search(); } } }
                onChange={ (e) => { this.setState({ query: _.assign({}, this.state.query, { [v.key]: e.target.value }) }) } }
                placeholder={ '输入' + (v.desc || v.name) } />
            </Col>
          </div> );
      } else if (v.type === 'Select' || v.type === 'MultiSelect') {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <Select
                simpleValue
                multi={ v.type === 'MultiSelect' ? true : false }
                value={ this.state.query[v.key] || null }
                onChange={ (newValue) => { this.state.query[v.key] = newValue; this.search(); } }
                options={ v.optionValues }
                placeholder={ '选择' +  v.name }/>
            </Col>
          </div> );
      } else if (v.type === 'Duration') {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <Duration
                mode={ v.mode || '' }
                value={ this.state.query[v.key] }
                onChange={ (newValue) => { this.state.query[v.key] = newValue; this.search(); } }/>
            </Col>
          </div> );
      }
    });

    const res = [];
    const len = filters.length;
    for (let i = 0; i < len; ) {
      const section = filters.slice(i, i + columns);
      res.push(section);
      i += columns;
    }
    return res;
  }

  render() {
    const { 
      searchShow=false, 
      notShowFields=[],
      notShowBlocks=[],
      options: { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], epics=[], sprints=[], labels=[], users=[], fields=[] } } = this.props;

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

    const baseFields = [
      { key: 'title', name: '主题/NO', type: 'Text', desc: '主题关键字或编号' },
      { key: 'type', name: '类型', type: 'MultiSelect', optionValues: typeOptions },
      { key: 'priority', name: '优先级', type: 'MultiSelect', optionValues: priorityOptions },
      { key: 'state', name: '状态', type: 'MultiSelect', optionValues: stateOptions },
      { key: 'resolution', name: '解决结果', type: 'MultiSelect', optionValues: resolutionOptions },
      { key: 'module', name: '模块', type: 'MultiSelect', optionValues: moduleOptions },
      { key: 'resolve_version', name: '解决版本', type: 'MultiSelect', optionValues: versionOptions },
      { key: 'effect_versions', name: '影响版本', type: 'MultiSelect', optionValues: versionOptions },
      { key: 'labels', name: '标签', type: 'MultiSelect', optionValues: labelOptions },
      { key: 'description', name: '描述', type: 'Text', desc: '描述关键字' }
    ];
    const baseFilterSections = this.groupFields(_.reject(baseFields, (v) => notShowFields.indexOf(v.key) !== -1));

    const memberFields = [
      { key: 'reporter', name: '报告者', type: 'MultiSelect', optionValues: userOptions },
      { key: 'assignee', name: '经办人', type: 'MultiSelect', optionValues: userOptions },
      { key: 'resolver', name: '解决者', type: 'MultiSelect', optionValues: userOptions },
      { key: 'closer', name: '关闭者', type: 'MultiSelect', optionValues: userOptions },
      { key: 'watcher', name: '关注者', type: 'MultiSelect', optionValues: [ { value: 'me', label: '当前用户' } ] }
    ];
    const memberFilterSections = this.groupFields(_.reject(memberFields, (v) => notShowFields.indexOf(v.key) !== -1));

    const timeFields = [
      { key: 'created_at', name: '创建时间', type: 'Duration' },
      { key: 'updated_at', name: '更新时间', type: 'Duration' },
      { key: 'resolved_at', name: '解决时间', type: 'Duration' },
      { key: 'closed_at', name: '关闭时间', type: 'Duration' },
      { key: 'expect_complete_time', name: '期望完成', type: 'Duration', mode: 'fix_duration' }
    ];
    const timeFilterSections = this.groupFields(_.reject(timeFields, (v) => notShowFields.indexOf(v.key) !== -1), 2);

    const agileFields = [
      { key: 'epic', name: 'Epic', type: 'MultiSelect', optionValues: epicOptions },
      { key: 'sprint', name: 'Sprint', type: 'Select', optionValues: sprintOptions  }
    ];
    const agileFilterSections = this.groupFields(_.reject(agileFields, (v) => notShowFields.indexOf(v.key) !== -1), 3);

    const usedFieldKeys = _.reduce([ baseFields, memberFields, timeFields, agileFields ], (res, val) => { _.forEach(val, (v) => { res.push(v.key) }); return res; }, []);
    const othersFields = _.reject(fields, (v) => usedFieldKeys.indexOf(v.key) !== -1);
    _.forEach(othersFields, (v) => { 
      if (v.optionValues) { 
        v.optionValues = _.map(v.optionValues, (val) => { return { label: val.label || val.name, value: val.value || val.id } }) 
      }
    });
    const othersFilterSections = this.groupFields(_.reject(othersFields, (v) => notShowFields.indexOf(v.key) !== -1), 2);

    return (
      <Form 
        id='search-form'
        horizontal 
        style={ { marginTop: '10px', marginBottom: '15px', padding: '15px 10px 10px 10px', backgroundColor: '#f5f5f5', borderRadius: '4px' } } 
        className={ !searchShow && 'hide' }>
        { notShowBlocks.indexOf('base') === -1 &&
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px' } }>
          <div style={ { color: '#aaa' } }>
            <span 
              className='direct-button' 
              onClick={ () => this.setState({ baseFilterShow: !this.state.baseFilterShow }) } 
              title={ this.state.baseFilterShow ? '收缩' : '展开' }>
              <span style={ { marginRight: '2px' } }>基本字段</span>
              { this.state.baseFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
            </span>
          </div>
          { _.map(baseFilterSections, (v, i) => {
            return (
              <FormGroup key={ i } style={ { display: !this.state.baseFilterShow ? 'none' : '' } }>
                { v }
              </FormGroup> )
          }) }
        </div> }
        { notShowBlocks.indexOf('member') === -1 &&
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px' } }>
          <div style={ { color: '#aaa' } }>
            <span 
              className='direct-button' 
              onClick={ () => this.setState({ memberFilterShow: !this.state.memberFilterShow }) } 
              title={ this.state.memberFilterShow ? '收缩' : '展开' }>
              <span style={ { marginRight: '2px' } }>人员</span>
              { this.state.memberFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
            </span>
          </div>
          { _.map(memberFilterSections, (v, i) => {
            return (
              <FormGroup key={ i } style={ { display: !this.state.memberFilterShow ? 'none' : '' } }>
                { v }
              </FormGroup> )
          }) }
        </div> }
        { notShowBlocks.indexOf('time') === -1 &&
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px' } }>
          <div style={ { color: '#aaa' } }>
            <span 
              className='direct-button' 
              onClick={ () => this.setState({ timeFilterShow: !this.state.timeFilterShow }) } 
              title={ this.state.timeFilterShow ? '收缩' : '展开' }>
              <span style={ { marginRight: '2px' } }>时间</span>
              { this.state.timeFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
            </span>
          </div>
          { _.map(timeFilterSections, (v, i) => {
            return (
              <FormGroup key={ i } style={ { display: !this.state.timeFilterShow ? 'none' : '' } }>
                { v }
              </FormGroup> )
          }) }
        </div> }
        { notShowBlocks.indexOf('agile') === -1 &&
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px' } }>
          <div style={ { color: '#aaa' } }>
            <span 
              className='direct-button' 
              onClick={ () => this.setState({ agileFilterShow: !this.state.agileFilterShow }) } 
              title={ this.state.agileFilterShow ? '收缩' : '展开' }>
              <span style={ { marginRight: '2px' } }>敏捷迭代</span> 
              { this.state.agileFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
            </span>
          </div>
          { _.map(agileFilterSections, (v, i) => {
            return (
              <FormGroup key={ i } style={ { display: !this.state.agileFilterShow ? 'none' : '' } }>
                { v }
              </FormGroup> )
          }) }
        </div> }
        { notShowBlocks.indexOf('others') === -1 &&
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px' } }>
          <div style={ { color: '#aaa' } }>
            <span
              className='direct-button'
              onClick={ () => this.setState({ othersFilterShow: !this.state.othersFilterShow }) }
              title={ this.state.othersFilterShow ? '收缩' : '展开' }>
              <span style={ { marginRight: '2px' } }>其它字段</span>
              { this.state.othersFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
            </span>
          </div>
          { _.map(othersFilterSections, (v, i) => {
            return (
              <FormGroup key={ i } style={ { display: !this.state.othersFilterShow ? 'none' : '' } }>
                { v }
              </FormGroup> )
          }) }
        </div> }
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
