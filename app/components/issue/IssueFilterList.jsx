import React, { PropTypes, Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

import Duration from '../share/Duration';
import Interval from '../share/Interval';

export class IssueFilterList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      baseFilterShow: true,
      memberFilterShow: false,
      timeFilterShow: false,
      agileFilterShow: false, 
      othersFilterShow: false 
    }
    this.state.values = {};

    this.onChange = this.onChange.bind(this);
    this.groupFields = this.groupFields.bind(this);
  }

  static propTypes = {
    textInputChange: PropTypes.bool,
    onChange: PropTypes.func,
    columns: PropTypes.number,
    values: PropTypes.object,
    searchShow: PropTypes.bool,
    notShowFields: PropTypes.array,
    notShowBlocks: PropTypes.array,
    notShowTypes: PropTypes.array,
    options: PropTypes.object
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.values || {};
    if (_.isEmpty(newQuery)) {
      this.state.values = {};
    } else {
      this.state.values = {};
      _.forEach(newQuery, (v, key) => {
        this.state.values[key] = newQuery[key] ? newQuery[key] : '';
      });
    }
  }

  onChange() {
    const { values={}, onChange } = this.props;

    const newQuery = _.assign({}, values);
    _.forEach(this.state.values, (v, key) => {
      if (v) {
        newQuery[key] = v;
      } else {
        delete newQuery[key];
      }
    });

    onChange && onChange(newQuery);
  }

  groupFields(fields, columns=3) {
    const { textInputChange=false } = this.props;

    const filters = [];
    _.forEach(fields, (v) => {
      if (v.type === 'Text' || v.type === 'TextArea' || v.type === 'Url') {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <FormControl
                type='text'
                value={ this.state.values[v.key] || '' }
                onKeyDown={ (e) => { if (e.keyCode == '13') { this.onChange(); } } }
                onChange={ (e) => { this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values }); if (textInputChange) { this.onChange(); } } }
                placeholder={ 'Enter' + (v.desc || v.name) } />
            </Col>
          </div> );
      } else if ([ 'Select', 'MultiSelect', 'SingleUser', 'MultiUser', 'CheckboxGroup', 'RadioGroup', 'SingleVersion', 'MultiVersion' ].indexOf(v.type) !== -1) {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <Select
                simpleValue
                multi={ v.key !== 'sprints' && true }
                value={ this.state.values[v.key] || null }
                onChange={ (newValue) => { this.state.values[v.key] = newValue; this.onChange(); } }
                options={ _.map(v.optionValues, (val) => { return { label: val.name, value: val.id } }) }
                placeholder={ 'Select' +  v.name }/>
            </Col>
          </div> );
      } else if ([ 'Duration', 'DatePicker', 'DateTimePicker' ].indexOf(v.type) !== -1) {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <Duration
                mode={ (v.type === 'DatePicker' || v.type === 'DateTimePicker') ? 'fixed' : (v.mode || '') }
                value={ this.state.values[v.key] }
                onChange={ (newValue) => { this.state.values[v.key] = newValue; this.onChange(); } }/>
            </Col>
          </div> );
      } else if (v.type === 'Number' || v.type === 'TimeTracking') {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <Interval
                value={ this.state.values[v.key] }
                keyPress={ (e) => { if (e.keyCode == '13') { this.onChange(); } } }
                onChange={ (newValue) => { this.state.values[v.key] = newValue; this.setState({ values: this.state.values }); if (textInputChange) { this.onChange(); } } }/>
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
      columns,
      values,
      searchShow=false, 
      notShowFields=[],
      notShowBlocks=[],
      notShowTypes=[],
      options: { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], epics=[], sprints=[], labels=[], users=[], fields=[] } } = this.props;

    const userOptions = _.map(users, (val) => { return { name: val.name + '(' + val.email + ')', id: val.id } });
    userOptions.unshift({ id: 'me', name: '当前用户' });
    const labelOptions = _.map(labels, (val) => { return { id: val.name, name: val.name } });
    const sprintOptions = _.map(sprints, (val) => { return { name: 'Sprint ' + val, id: val } });

    const baseFields = [
      { key: 'title', name: 'Title/NO', type: 'Text', desc: 'Title keyword or number' },
      { key: 'type', name: 'Type', type: 'MultiSelect', optionValues: types },
      { key: 'priority', name: 'Priority', type: 'MultiSelect', optionValues: priorities },
      { key: 'state', name: 'Status', type: 'MultiSelect', optionValues: states },
      { key: 'resolution', name: 'Resolution', type: 'MultiSelect', optionValues: resolutions },
      { key: 'module', name: 'Module', type: 'MultiSelect', optionValues: modules },
      { key: 'resolve_version', name: 'Resolution version', type: 'MultiSelect', optionValues: versions },
      { key: 'effect_versions', name: 'Affect version', type: 'MultiSelect', optionValues: versions },
      { key: 'labels', name: 'Label', type: 'MultiSelect', optionValues: labelOptions }
    ];
    const baseFilterSections = this.groupFields(_.reject(baseFields, (v) => notShowFields.indexOf(v.key) !== -1 || notShowTypes.indexOf(v.type) !== -1), columns || 3);

    const memberFields = [
      { key: 'reporter', name: 'Reporter', type: 'MultiSelect', optionValues: userOptions },
      { key: 'assignee', name: 'Assignee', type: 'MultiSelect', optionValues: userOptions },
      { key: 'resolver', name: 'Resolver', type: 'MultiSelect', optionValues: userOptions },
      { key: 'closer', name: 'Closer', type: 'MultiSelect', optionValues: userOptions },
      { key: 'watcher', name: 'Watcher', type: 'MultiSelect', optionValues: [ { id: 'me', name: '当前用户' } ] }
    ];
    const memberFilterSections = this.groupFields(_.reject(memberFields, (v) => notShowFields.indexOf(v.key) !== -1), columns || 3);

    const timeFields = [
      { key: 'created_at', name: 'Creation date', type: 'Duration' },
      { key: 'updated_at', name: 'Update date', type: 'Duration' },
      { key: 'resolved_at', name: 'Resolution date', type: 'Duration' },
      { key: 'closed_at', name: 'Close date', type: 'Duration' },
      { key: 'expect_start_time', name: 'Expected start date', type: 'Duration', mode: 'fixed' },
      { key: 'expect_complete_time', name: 'Expected complete date', type: 'Duration', mode: 'fixed' }
    ];
    const timeFilterSections = this.groupFields(_.reject(timeFields, (v) => notShowFields.indexOf(v.key) !== -1), columns || 2);

    const agileFields = [
      { key: 'epic', name: 'Epic', type: 'MultiSelect', optionValues: epics },
      { key: 'sprints', name: 'Sprint', type: 'Select', optionValues: sprintOptions  }
    ];
    const agileFilterSections = this.groupFields(_.reject(agileFields, (v) => notShowFields.indexOf(v.key) !== -1), columns || 3);

    const usedFieldKeys = _.reduce([ baseFields, memberFields, timeFields, agileFields ], (res, val) => { _.forEach(val, (v) => { res.push(v.key) }); return res; }, []);
    const othersFields = _.reject(fields, (v) => v.type === 'File' || usedFieldKeys.indexOf(v.key) !== -1);
    _.forEach(othersFields, (v) => { 
      if (v.type === 'SingleUser' || v.type === 'MultiUser') {
        v.optionValues = userOptions;
      } else if (v.type === 'SingleVersion' || v.type === 'MultiVersion') {
        v.optionValues = versions; 
      }
    });
    const othersFilterSections = this.groupFields(_.reject(othersFields, (v) => notShowFields.indexOf(v.key) !== -1 || notShowTypes.indexOf(v.type) !== -1), columns || 2);

    return (
      <Form 
        id='search-form'
        horizontal 
        style={ { marginTop: '10px', marginBottom: '15px', padding: '15px 10px 10px 10px', backgroundColor: '#f7f7f7', borderRadius: '4px' } } 
        className={ !searchShow && 'hide' }>
        { notShowBlocks.indexOf('base') === -1 &&
        <div style={ { width: '100%', textAlign: 'left', paddingBottom: '5px' } }>
          <div style={ { color: '#aaa' } }>
            <span 
              className='direct-button' 
              onClick={ () => this.setState({ baseFilterShow: !this.state.baseFilterShow }) } 
              title={ this.state.baseFilterShow ? '收缩' : 'unfold' }>
              <span style={ { marginRight: '2px' } }>Basic field</span>
              { _.intersection(_.keys(values), _.map(baseFields, _.iteratee('key'))).length > 0 ? <span>...</span> : <span/> }
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
              title={ this.state.memberFilterShow ? '收缩' : 'unfold' }>
              <span style={ { marginRight: '2px' } }>Member</span>
              { _.intersection(_.keys(values), _.map(memberFields, _.iteratee('key'))).length > 0 ? <span>...</span> : <span/> }
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
              title={ this.state.timeFilterShow ? '收缩' : 'unfold' }>
              <span style={ { marginRight: '2px' } }>Date</span>
              { _.intersection(_.keys(values), _.map(timeFields, _.iteratee('key'))).length > 0 ? <span>...</span> : <span/> }
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
              title={ this.state.agileFilterShow ? '收缩' : 'unfold' }>
              <span style={ { marginRight: '2px' } }>敏捷迭代</span> 
              { _.intersection(_.keys(values), _.map(agileFields, _.iteratee('key'))).length > 0 ? <span>...</span> : <span/> }
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
              title={ this.state.othersFilterShow ? '收缩' : 'unfold' }>
              <span style={ { marginRight: '2px' } }>其它字段</span>
              { _.intersection(_.keys(values), _.map(othersFields, _.iteratee('key'))).length > 0 ? <span>...</span> : <span/> }
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

export function parseQuery(query, options) {

  const { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], epics=[], sprints=[], users=[], fields=[] } = options;

  const userOptions = _.map(users, (val) => { return { name: val.name, id: val.id } });
  userOptions.unshift({ id: 'me', name: '当前用户' });

  const sections = [
    { key: 'no', name: 'NO', type: 'Text' },
    { key: 'title', name: 'Title/NO', type: 'Text' },
    { key: 'type', type: 'MultiSelect', name: 'Type', optionValues: types },
    { key: 'priority', type: 'MultiSelect', name: 'Priority', optionValues: priorities },
    { key: 'state', type: 'MultiSelect', name: 'Status', optionValues: states },
    { key: 'resolution', type: 'MultiSelect', name: 'Resolution', optionValues: resolutions },
    { key: 'module', type: 'MultiSelect', name: 'Module', optionValues: modules },
    { key: 'resolve_version', type: 'MultiSelect', name: 'Resolution version', optionValues: versions  },
    { key: 'effect_versions', type: 'MultiSelect', name: 'Affect version', optionValues: versions },
    { key: 'labels', name: 'Label', type: 'MultiSelect' },
    { key: 'description', name: 'Description', type: 'TextArea' },
    { key: 'reporter', name : 'Reporter', type: 'MultiSelect', optionValues: userOptions },
    { key: 'assignee', name: 'Assignee', type: 'MultiSelect', optionValues: userOptions },
    { key: 'watcher', name : 'Watcher', type: 'MultiSelect', optionValues: userOptions },
    { key: 'resolver', name : 'Resolver', type: 'MultiSelect', optionValues: userOptions },
    { key: 'closer', name : 'Closer', type: 'MultiSelect', optionValues: userOptions },
    { key: 'created_at', name: 'Creation date', type: 'Duration' },
    { key: 'updated_at', name : 'Update date', type: 'Duration' },
    { key: 'resolved_at', name : 'Resolution date', type: 'Duration' },
    { key: 'closed_at', name : 'Close date', type: 'Duration' },
    { key: 'expect_start_time', name : 'Expected start date', type: 'Duration' },
    { key: 'expect_complete_time', name : 'Expected completion date', type: 'Duration' },
    { key: 'epic', type: 'MultiSelect', name: 'Epic', optionValues: epics },
    { key: 'sprints', type: 'Select', name: 'Sprint' }
  ];

  _.forEach(fields, (v) => {
    if (v.type !== 'File' && _.findIndex(sections, { key: v.key }) === -1) {
      if (v.type === 'SingleUser' || v.type === 'MultiUser') {
        v.optionValues = userOptions;
      } else if (v.type === 'SingleVersion' || v.type === 'MultiVersion') {
        v.optionValues = versions;
      }
      sections.push(v);
    }
  });

  const queryConds = [];
  const errorMsg = ' 检索值解析失败，条件无法正常显示。如果当前检索已被保存为过滤器，建议删除，重新保存。';
  let index = -1;

  for(let i = 0; i < sections.length; i++) {
    const v = sections[i];
    if (query[v.key]) {
      if ([ 'labels', 'sprints' ].indexOf(v.key) !== -1 || [ 'Text', 'TextArea', 'Url', 'Number', 'TimeTracking' ].indexOf(v.type) !== -1) {
        queryConds.push(v.name + '～' + query[v.key]);
      } else if ([ 'Select', 'MultiSelect', 'SingleUser', 'MultiUser', 'CheckboxGroup', 'RadioGroup', 'SingleVersion', 'MultiVersion' ].indexOf(v.type) !== -1) {
        const queryNames = [];
        const queryValues = query[v.key].split(',');
        for(let j = 0; j < queryValues.length; j++) {
          if ((index = _.findIndex(v.optionValues, { id: queryValues[j] })) !== -1) {
            queryNames.push(v.optionValues[index].name);
          } else {
            return v.name + '～' + errorMsg;
          }
        }
        queryConds.push(v.name + '～' + queryNames.join(','));
      } else if ([ 'Duration', 'DatePicker', 'DateTimePicker' ].indexOf(v.type) !== -1) {
        let cond = '';
        const timeUnits = { w: '周', m: '月', y: '年' };
        if (_.endsWith(query[v.key], 'w') || _.endsWith(query[v.key], 'm') || _.endsWith(query[v.key], 'y')) {
          const pattern = new RegExp('^(-?)(\\d+)(w|m|y)$');
          if (pattern.exec(query[v.key])) {
            cond = RegExp.$2 + timeUnits[RegExp.$3] + (RegExp.$1 === '-' ? '外' : '内');
          } else {
            return v.name + errorMsg;
          }
        } else {
          cond = query[v.key];
        }
        queryConds.push(v.name + '～' + cond);
      }
    }
  }

  const sections2 = []; 
  _.forEach(sections, (v) => { 
    if (v.type === 'TimeTracking') { 
      sections2.push(_.assign({}, v, { key: v.key + '_m' }));  
    } else { 
      sections2.push(v); 
    } 
  });
  const orderby = query['orderBy'];
  if (orderby) {
    const orderItems = [];
    const orderSections = orderby.split(',');
    _.forEach((orderSections), (v) => {
      let orderName = '';
      let orderField = '';
      const tmp = _.trim(v).replace(/\s+/g, ' ').split(' ');
      if (tmp.length === 2) {
        if (_.findIndex(sections2, { key: tmp[0] }) !== -1) {
          orderField = _.find(sections2, { key: tmp[0] }).name;
        } else {
          return;
        }
        if (tmp[1].toLowerCase() === 'asc') {
          orderName = '↑';
        } else if (tmp[1].toLowerCase() === 'desc') {
          orderName = '↓';
        } else {
          return;
        }
        orderItems.push(orderField + orderName);
      } 
    });
    if (orderItems.length > 0) {
      queryConds.push(orderItems.join(','));
    }
  }

  return queryConds.length > 0 ? queryConds.join(' | ') : '';
}
