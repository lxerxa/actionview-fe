import React, { PropTypes, Component } from 'react';
import { Button, Label, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
const $ = require('$');

const CreateModal = require('./CreateModal');
const AddSearcherModal = require('./AddSearcherModal');
const SearchList = require('./SearchList');
const SearcherConfigModal = require('./SearcherConfigModal');
const ExportConfigModal = require('./ExportConfigModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      searcherConfigShow: false, 
      searchShow: false, 
      addSearcherShow: false,
      exportConfigShow: false };

    this.createModalClose = this.createModalClose.bind(this);
    this.addSearcherModalClose = this.addSearcherModalClose.bind(this);
    this.searcherConfigModalClose = this.searcherConfigModalClose.bind(this);
    this.exportConfigModalClose = this.exportConfigModalClose.bind(this);
    this.condsTxt = this.condsTxt.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    addLabels: PropTypes.func.isRequired,
    addSearcher: PropTypes.func.isRequired,
    configSearcher: PropTypes.func.isRequired,
    closeDetailBar: PropTypes.func,
    index: PropTypes.func,
    refresh: PropTypes.func,
    exportExcel: PropTypes.func,
    getOptions: PropTypes.func,
    query: PropTypes.object,
    project: PropTypes.object,
    options: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    optionsLoading: PropTypes.bool.isRequired,
    searcherLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired
  }

  componentWillMount() {
    const { getOptions } = this.props;
    getOptions();
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  addSearcherModalClose() {
    this.setState({ addSearcherShow: false });
  }

  condsTxt() {
    const { optionsLoading, options: { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], epics=[], sprints=[], users=[] }, query } = this.props;

    if (optionsLoading) {
      return '';
    }

    const errorMsg = ' 检索值解析失败，条件无法正常显示。如果当前检索已被保存为过滤器，建议删除，重新保存。';
    const queryConds = [];
    let index = -1;

    if (query.no) { queryConds.push('编号～' + query.no); }
    if (query.title) { queryConds.push('主题～' + query.title); }

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
      { key: 'assignee', name: '经办人' }, 
      { key: 'reporter', name : '报告人' }, 
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
      { key: 'closed_at', name : '关闭时间' }
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

  searcherConfigModalClose() {
    this.setState({ searcherConfigShow: false });
  }

  exportConfigModalClose() {
    this.setState({ exportConfigShow: false });
  }

  operateSelect(eventKey) {
    const { refresh, index, query } = this.props;
    if (eventKey === '1') {
      if (query.page > 1) {
        refresh(_.extend(query, { page: 1 }));
      } else {
        index(query);
      }
    } else if (eventKey === '2') {
      this.setState({ exportConfigShow: true });
    }
  }

  selectSearcher(eventKey) {
    const { refresh, options={} } = this.props;

    if (eventKey == 'searcherConfig') {
      this.setState({ searcherConfigShow: true });
    } else if(eventKey == 'saveSearcher') {
      this.setState({ addSearcherShow : true });
    } else if(eventKey == 'all') {
      refresh({});
    } else if(eventKey == 'todos') {
      refresh({ assignee: 'me', resolution: 'Unresolved' });
    } else if(eventKey == 'myreports') {
      refresh({ reporter: 'me' });
    } else if(eventKey == 'mywatches') {
      refresh({ watcher: 'me' });
    } else {
      const searchers = options.searchers || [];
      const searcher = _.find(searchers, { id: eventKey }) || {};
      refresh(searcher.query || {});
    }
  }

  exportExcel(fields) {
    const { exportExcel, query } = this.props;
    exportExcel(query, fields);
  }

  render() {
    const { 
      i18n, 
      create, 
      addLabels, 
      addSearcher, 
      configSearcher, 
      indexLoading, 
      optionsLoading, 
      searcherLoading, 
      options={}, 
      closeDetailBar,
      refresh, 
      query, 
      loading, 
      project } = this.props;

    const standardTypes = _.reject(_.reject(options.types || [], { type: 'subtask' }) || [], { disabled: true }) || [];
    const sqlTxt = this.condsTxt();

    return (
      <div>
        <div style={ { marginTop: '5px' } }>
          <DropdownButton className='create-btn' title='过滤器' onSelect={ this.selectSearcher.bind(this) }>
            <MenuItem eventKey='all'>全部问题</MenuItem>
            <MenuItem eventKey='todos'>分配给我的</MenuItem>
            <MenuItem eventKey='mywatches'>我关注的</MenuItem>
            <MenuItem eventKey='myreports'>我报告的</MenuItem>
            { options.searchers && options.searchers.length > 0 && <MenuItem divider/> }
            { _.map(options.searchers || [], (val) => 
              <MenuItem eventKey={ val.id } key={ val.id }>{ val.name }</MenuItem>
            ) }
            <MenuItem divider/>
            { sqlTxt && <MenuItem eventKey='saveSearcher'>保存当前检索</MenuItem> }
            <MenuItem eventKey='searcherConfig'>过滤器管理</MenuItem>
          </DropdownButton>
          <Button className='create-btn' disabled={ optionsLoading } onClick={ () => { if (!this.state.searchShow) { closeDetailBar(); }  this.setState({ searchShow: !this.state.searchShow }); } }>检索&nbsp;<i className={ this.state.searchShow ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down' }></i></Button>
          { options.permissions && options.permissions.indexOf('create_issue') !== -1 &&
          <Button className='create-btn' bsStyle='primary' disabled={ standardTypes.length <= 0 || optionsLoading } onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i> 创建</Button> }
          <div style={ { marginTop: '8px', float: 'right' } }>
            <DropdownButton pullRight style={ { float: 'right' } } title='更多' onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='1'>刷新</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='2'>导出</MenuItem>
            </DropdownButton>
          </div>
          { sqlTxt &&
          <div className='cond-bar'>
            <div className='cond-contents' title={ sqlTxt }><b>检索条件</b>：{ sqlTxt }</div>
            <div className='remove-icon' onClick={ () => { refresh({}); } } title='清空当前检索'><i className='fa fa-remove'></i></div>
            <div className='remove-icon' onClick={ () => { this.setState({ addSearcherShow: true }); } } title='保存当前检索'><i className='fa fa-save'></i></div>
          </div> }
        </div>
        { this.state.searcherConfigShow && 
        <SearcherConfigModal 
          show 
          close={ this.searcherConfigModalClose } 
          loading={ searcherLoading } 
          config={ configSearcher } 
          searchers={ options.searchers || [] } 
          i18n={ i18n }/> }
        <SearchList 
          className={ !this.state.searchShow && 'hide' } 
          query={ query } 
          searchShow={ this.state.searchShow } 
          indexLoading={ indexLoading } 
          options={ options } 
          refresh={ refresh } />
        { this.state.createModalShow && 
        <CreateModal 
          show 
          close={ this.createModalClose } 
          options={ options } 
          create={ create } 
          addLabels={ addLabels } 
          loading={ loading } 
          project={ project } 
          i18n={ i18n }/> }
        { this.state.addSearcherShow && 
        <AddSearcherModal 
          show 
          close={ this.addSearcherModalClose } 
          searchers={ options.searchers || [] } 
          create={ addSearcher } 
          query={ query } 
          loading={ searcherLoading } 
          sqlTxt={ sqlTxt } 
          i18n={ i18n }/> }
        { this.state.exportConfigShow &&
        <ExportConfigModal
          show
          close={ this.exportConfigModalClose }
          options={ options } 
          exportExcel={ this.exportExcel.bind(this) }
          i18n={ i18n }/> }
      </div>
    );
  }
}
