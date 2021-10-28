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
      unfolded: true, 
      baseFilterShow: true,
      memberFilterShow: false,
      timeFilterShow: false,
      agileFilterShow: false, 
      othersFilterShow: false 
    }
    this.state.values = {};

    this.onChange = this.onChange.bind(this);
    this.groupFields = this.groupFields.bind(this);
    this.removeCond = this.removeCond.bind(this);
    this.removeAllConds = this.removeAllConds.bind(this);
  }

  static propTypes = {
    removable: PropTypes.bool,
    foldable: PropTypes.bool,
    textInputChange: PropTypes.bool,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    onHide: PropTypes.func,
    columns: PropTypes.number,
    styles: PropTypes.object,
    values: PropTypes.object,
    visable: PropTypes.bool,
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

  removeCond(field) {
    const { values={}, onChange } = this.props;

    const newQuery = _.assign({}, values);
    _.forEach(this.state.values, (v, key) => {
      if (key == field) {
        delete newQuery[key];
      } else {
        newQuery[key] = v;
      }
    });

    onChange && onChange(newQuery);
  }

  removeAllConds(keys) {
    const removableKeys = keys.concat([ 'orderBy' ]);

    console.log(removableKeys);

    const { values={}, onChange } = this.props;
    const tmpValues = {};
    _.forEach(values, (v, k) => {
      if (_.indexOf(removableKeys, k) === -1) {
        tmpValues[k] = v;
      }
    }); 
    onChange && onChange(tmpValues);
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
    const { textInputChange=false, values } = this.props;

    const filters = [];
    _.forEach(fields, (v) => {
      if (v.type === 'Text' || v.type === 'TextArea' || v.type === 'RichTextEditor' || v.type === 'Url') {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <FormControl
                type='text'
                value={ this.state.values[v.key] || '' }
                onBlur={ () => { this.state.values[v.key] != values[v.key] && this.onChange() } }
                onKeyDown={ (e) => { if (e.keyCode == '13') { this.onChange(); } } }
                onChange={ (e) => { this.state.values[v.key] = e.target.value; this.setState({ values: this.state.values }); if (textInputChange) { this.onChange(); } } }
                placeholder={ '输入' + (v.desc || v.name) } />
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
                placeholder={ '选择' +  v.name }/>
            </Col>
          </div> );
      } else if ([ 'DatePicker', 'DateTimePicker' ].indexOf(v.type) !== -1) {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <Duration
                value={ this.state.values[v.key] }
                onChange={ (newValue) => { this.state.values[v.key] = newValue; this.onChange(); } }/>
            </Col>
          </div> );
      } else if ([ 'Number', 'Integer', 'TimeTracking' ].indexOf(v.type) !== -1) {
        filters.push(
          <div>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              { v.name }
            </Col>
            <Col sm={ 12 / columns - 1 }>
              <Interval
                value={ this.state.values[v.key] }
                onBlur={ () => { this.state.values[v.key] != values[v.key] && this.onChange() } }
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
      foldable=false,
      removable=true,
      columns,
      styles={},
      values,
      visable=false, 
      notShowFields=[],
      notShowBlocks=[],
      notShowTypes=[],
      onHide,
      onSave,
      options,
      options: { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], epics=[], sprints=[], labels=[], users=[], fields=[] } 
    } = this.props;

    const { unfolded } = this.state;

    const userOptions = _.map(users, (val) => { return { name: val.name + '(' + val.email + ')', id: val.id } });
    userOptions.unshift({ id: 'me', name: '当前用户' });
    const labelOptions = _.map(labels, (val) => { return { id: val.name, name: val.name } });
    const sprintOptions = _.map(sprints, (val) => { return { name: val.name, id: val.no + '' } });

    const baseFields = [
      { key: 'title', name: '主题/NO', type: 'Text', desc: '主题关键字或编号' },
      { key: 'type', name: '类型', type: 'MultiSelect', optionValues: types },
      { key: 'priority', name: '优先级', type: 'MultiSelect', optionValues: priorities },
      { key: 'state', name: '状态', type: 'MultiSelect', optionValues: states },
      { key: 'resolution', name: '解决结果', type: 'MultiSelect', optionValues: resolutions },
      { key: 'module', name: '模块', type: 'MultiSelect', optionValues: modules },
      { key: 'resolve_version', name: '解决版本', type: 'MultiSelect', optionValues: versions },
      { key: 'effect_versions', name: '影响版本', type: 'MultiSelect', optionValues: versions },
      { key: 'labels', name: '标签', type: 'MultiSelect', optionValues: labelOptions }
    ];
    const baseFilterSections = this.groupFields(_.reject(baseFields, (v) => notShowFields.indexOf(v.key) !== -1 || notShowTypes.indexOf(v.type) !== -1), columns || 3);

    const memberFields = [
      { key: 'reporter', name: '报告者', type: 'MultiSelect', optionValues: userOptions },
      { key: 'assignee', name: '负责人', type: 'MultiSelect', optionValues: userOptions },
      { key: 'resolver', name: '解决者', type: 'MultiSelect', optionValues: userOptions },
      { key: 'closer', name: '关闭者', type: 'MultiSelect', optionValues: userOptions },
      { key: 'watcher', name: '关注者', type: 'MultiSelect', optionValues: [ { id: 'me', name: '当前用户' } ] }
    ];
    const memberFilterSections = this.groupFields(_.reject(memberFields, (v) => notShowFields.indexOf(v.key) !== -1), columns || 3);

    const timeFields = [
      { key: 'created_at', name: '创建时间', type: 'DateTimePicker' },
      { key: 'updated_at', name: '更新时间', type: 'DateTimePicker' },
      { key: 'resolved_at', name: '解决时间', type: 'DateTimePicker' },
      { key: 'closed_at', name: '关闭时间', type: 'DateTimePicker' },
      { key: 'expect_start_time', name: '期望开始', type: 'DatePicker' },
      { key: 'expect_complete_time', name: '期望完成', type: 'DatePicker' }
    ];
    const timeFilterSections = this.groupFields(_.reject(timeFields, (v) => notShowFields.indexOf(v.key) !== -1), 2);

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
    const othersFilterSections = this.groupFields(_.reject(othersFields, (v) => notShowFields.indexOf(v.key) !== -1 || notShowTypes.indexOf(v.type) !== -1), 2);

    const searchedFieldKeys = _.union(_.map(baseFields, v => v.key), _.map(memberFields, v => v.key), _.map(timeFields, v => v.key), _.map(agileFields, v => v.key), _.map(othersFields, v => v.key));
    const conds = _parseQuery(values, options);

    let buttonNum = 0;
    if (onHide) {
      buttonNum++;
    }
    if (removable && conds.length > 0) {
      buttonNum++;
    }
    if (onSave && conds.length > 0) {
      buttonNum++;
    }
    const condListStyle = 'cond-list-view-' + _.max([ buttonNum, 1 ]);

    return (
      <div 
        id='search-form' 
        style={ styles }
        className={ !visable && 'hide' }>
        <div className='cond-list-container'>
          <div className='cond-list-title'>
            检索条件：
          </div>
          <div className={ condListStyle }>
            { conds.length > 0 ?
              _.map(conds, (v) => 
                <div className='cond-list-label'>
                  { v.kname }: { v.value }  
                  <span style={ { color: '#aaa' } }> | </span>
                  <span onClick={ () => { this.removeCond(v.key) } } className='comments-button'><i className='fa fa-close'></i></span>
                </div>)
              : 
              '全部' }
          </div>
          <div className='cond-list-opt'>
            { foldable && 
            <Button bsStyle='link' onClick={ () => { this.setState({ unfolded: !unfolded }) } } style={ { paddingTop: '0px' } }>
              { unfolded ? '收起' : '展开' } <i className={ unfolded ? 'fa fa-angle-up' : 'fa fa-angle-down' }></i>
            </Button> }
            { removable && conds.length > 0 &&
            <Button bsStyle='link' onClick={ () => { this.removeAllConds(searchedFieldKeys) } } style={ { paddingTop: '0px' } }>
              清空
            </Button> }
            { onSave && conds.length > 0 &&
            <Button bsStyle='link' onClick={ onSave } style={ { paddingTop: '0px' } }>
              保存
            </Button> }
            { onHide &&
            <Button bsStyle='link' onClick={ onHide } style={ { paddingTop: '0px' } }>
              隐藏 
            </Button> }
          </div>
        </div>
        <Form 
          style={ { borderTop: '1px dashed #dedede', paddingTop: '10px', marginTop: '5px' } }
          horizontal 
          className={ !this.state.unfolded && 'hide' }>
          { notShowBlocks.indexOf('base') === -1 &&
          <div style={ { width: '100%', textAlign: 'left' } }>
            <div style={ { color: '#aaa' } }>
              <span 
                className='direct-button' 
                onClick={ () => this.setState({ baseFilterShow: !this.state.baseFilterShow }) } 
                title={ this.state.baseFilterShow ? '收缩' : '展开' }>
                <span style={ { marginRight: '2px' } }>基本字段</span>
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
          <div style={ { width: '100%', textAlign: 'left' } }>
            <div style={ { color: '#aaa' } }>
              <span 
                className='direct-button' 
                onClick={ () => this.setState({ memberFilterShow: !this.state.memberFilterShow }) } 
                title={ this.state.memberFilterShow ? '收缩' : '展开' }>
                <span style={ { marginRight: '2px' } }>人员</span>
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
          <div style={ { width: '100%', textAlign: 'left' } }>
            <div style={ { color: '#aaa' } }>
              <span 
                className='direct-button' 
                onClick={ () => this.setState({ timeFilterShow: !this.state.timeFilterShow }) } 
                title={ this.state.timeFilterShow ? '收缩' : '展开' }>
                <span style={ { marginRight: '2px' } }>时间</span>
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
          <div style={ { width: '100%', textAlign: 'left' } }>
            <div style={ { color: '#aaa' } }>
              <span 
                className='direct-button' 
                onClick={ () => this.setState({ agileFilterShow: !this.state.agileFilterShow }) } 
                title={ this.state.agileFilterShow ? '收缩' : '展开' }>
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
          <div style={ { width: '100%', textAlign: 'left' } }>
            <div style={ { color: '#aaa' } }>
              <span
                className='direct-button'
                onClick={ () => this.setState({ othersFilterShow: !this.state.othersFilterShow }) }
                title={ this.state.othersFilterShow ? '收缩' : '展开' }>
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
    </div>);
  }
}

export function parseQuery(query, options) {
  const queryConds = _parseQuery(query, options);
  const tmpConds = [];
  _.forEach(queryConds, (v) => {
    tmpConds.push(v.kname + ': ' + v.value);
  });
  return tmpConds.length > 0 ? tmpConds.join(' | ') : '';
}

function _parseQuery(query, options) {

  const { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], epics=[], sprints=[], users=[], fields=[] } = options;

  const userOptions = _.map(users, (val) => { return { name: val.name, id: val.id } });
  userOptions.unshift({ id: 'me', name: '当前用户' });

  const sprintOptions = _.map(sprints, (val) => { return { name: val.name, id: val.no + '' } });

  const sections = [
    { key: 'no', name: 'NO', type: 'Text' },
    { key: 'title', name: '主题/NO', type: 'Text' },
    { key: 'type', type: 'MultiSelect', name: '类型', optionValues: types },
    { key: 'priority', type: 'MultiSelect', name: '优先级', optionValues: priorities },
    { key: 'state', type: 'MultiSelect', name: '状态', optionValues: states },
    { key: 'resolution', type: 'MultiSelect', name: '解决结果', optionValues: resolutions },
    { key: 'module', type: 'MultiSelect', name: '模块', optionValues: modules },
    { key: 'resolve_version', type: 'MultiSelect', name: '解决版本', optionValues: versions  },
    { key: 'effect_versions', type: 'MultiSelect', name: '影响版本', optionValues: versions },
    { key: 'labels', name: '标签', type: 'MultiSelect' },
    { key: 'descriptions', name: '描述', type: 'RichTextEditor' },
    { key: 'reporter', name : '报告人', type: 'MultiSelect', optionValues: userOptions },
    { key: 'assignee', name: '负责人', type: 'MultiSelect', optionValues: userOptions },
    { key: 'watcher', name : '关注者', type: 'MultiSelect', optionValues: userOptions },
    { key: 'resolver', name : '解决者', type: 'MultiSelect', optionValues: userOptions },
    { key: 'closer', name : '关闭者', type: 'MultiSelect', optionValues: userOptions },
    { key: 'created_at', name: '创建时间', type: 'DateTimePicker' },
    { key: 'updated_at', name : '更新时间', type: 'DateTimePicker' },
    { key: 'resolved_at', name : '解决时间', type: 'DateTimePicker' },
    { key: 'closed_at', name : '关闭时间', type: 'DateTimePicker' },
    { key: 'expect_start_time', name : '期望开始时间', type: 'DatePicker' },
    { key: 'expect_complete_time', name : '期望完成时间', type: 'DatePicker' },
    { key: 'epic', type: 'MultiSelect', name: 'Epic', optionValues: epics },
    { key: 'sprints', type: 'Select', name: 'Sprint', optionValues: sprintOptions }
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

  const currentDurations = {
    '0d': '当天',
    '0w': '本周',
    '0m': '当月',
    '0y': '当前年'
  };

  const queryConds = [];
  const errorMsg = ' 检索值解析失败，条件无法正常显示。如果当前检索已被保存为过滤器，建议删除，重新保存。';
  let index = -1;

  for(let i = 0; i < sections.length; i++) {
    let ecode = 0;
    const v = sections[i];
    if (query[v.key]) {
      if ('labels' == v.key || [ 'Text', 'TextArea', 'RichTextEditor', 'Url', 'Number', 'TimeTracking' ].indexOf(v.type) !== -1) {
        queryConds.push({ key: v.key, kname: v.name, value: query[v.key] });
      } else if ([ 'Select', 'MultiSelect', 'SingleUser', 'MultiUser', 'CheckboxGroup', 'RadioGroup', 'SingleVersion', 'MultiVersion' ].indexOf(v.type) !== -1) {
        const queryNames = [];
        const queryValues = query[v.key].split(',');
        for(let j = 0; j < queryValues.length; j++) {
          if ((index = _.findIndex(v.optionValues, { id: queryValues[j] })) !== -1) {
            queryNames.push(v.optionValues[index].name);
          } else {
            ecode = -1;
            _.remove(queryNames);
            queryNames.push('解析失败！');
            break;
          }
        }
        queryConds.push({ key: v.key, kname: v.name, value: queryNames.join(', '), ecode });
      } else if ([ 'DatePicker', 'DateTimePicker' ].indexOf(v.type) !== -1) {
        let cond = '', startCond = '', endCond = '';
        const timeUnits = { d: '天', w: '周', m: '个月', y: '年' };
        const sections = query[v.key].split('~');
        if ([ '0d', '0w', '0m', '0y' ].indexOf(sections[0]) !== -1) {
          startCond = currentDurations[sections[0]];
        } else if ([ 'd', 'w', 'm', 'y' ].indexOf(sections[0].charAt(sections[0].length - 1)) !== -1) {
          const pattern = new RegExp('^(-?)(\\d+)(d|w|m|y)$');
          if (pattern.exec(sections[0])) {
            if (RegExp.$2 == '0') {
              startCond = '当天';
            } else {
              startCond = RegExp.$2 + timeUnits[RegExp.$3] + (RegExp.$1 === '-' ? '前' : '后');
            }
          } else {
            ecode = -1;
            startCond = '解析失败！';
          }
        } else {
          startCond = sections[0];
        }

        if (sections[1]) {
          if ([ '0d', '0w', '0m', '0y' ].indexOf(sections[1]) !== -1) {
            endCond = currentDurations[sections[1]];
          } else if ([ 'd', 'w', 'm', 'y' ].indexOf(sections[1].charAt(sections[1].length - 1)) !== -1) {
            const pattern = new RegExp('^(-?)(\\d+)(d|w|m|y)$');
            if (pattern.exec(sections[1])) {
              if (RegExp.$2 == '0') {
                endCond = '当天';
              } else {
                endCond = RegExp.$2 + timeUnits[RegExp.$3] + (RegExp.$1 === '-' ? '前' : '后');
              }
            } else {
              ecode = -1;
              endCond = '解析失败！';
            }
          } else {
            endCond = sections[1];
          }
        }

        if (sections.length > 1) {
          cond = startCond + '~' + endCond;
        } else {
          cond = startCond;
        }

        queryConds.push({ key: v.key, kname: v.name, value: cond, ecode });
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
      queryConds.push({ key: 'orderBy', kname: '排序', value: orderItems.join(', '), ecode: 0 });
    }
  }

  return queryConds;
}
