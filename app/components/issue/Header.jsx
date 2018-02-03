import React, { PropTypes, Component } from 'react';
import { Button, Label, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';
import _ from 'lodash';
const $ = require('$');

const CreateModal = require('./CreateModal');
const AddSearcherModal = require('./AddSearcherModal');
const SearchList = require('./SearchList');
const SearcherConfigModal = require('./SearcherConfigModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, searcherConfigShow: false, searchShow: false, condShow: false, addSearcherShow: false };
    this.createModalClose = this.createModalClose.bind(this);
    this.addSearcherModalClose = this.addSearcherModalClose.bind(this);
    this.searcherConfigModalClose = this.searcherConfigModalClose.bind(this);
    this.condsTxt = this.condsTxt.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    addSearcher: PropTypes.func.isRequired,
    configSearcher: PropTypes.func.isRequired,
    refresh: PropTypes.func,
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
    const { options: { types=[], states=[], priorities=[], resolutions=[], modules=[], versions=[], users=[] }, query } = this.props;
    const dateOptions = [{ label: '一周内', value: '1w' }, { label: '两周内', value: '2w' }, { label: '一月内', value: '1m' }, { label: '一月外', value: '-1m' }];

    const errorMsg = ' 检索值解析失败，条件无法正常显示。如果当前检索已被保存为过滤器，建议删除，重新保存。';
    const queryConds = [];
    let index = -1;

    if (query.no) { queryConds.push('编号：' + query.no); }
    if (query.title) { queryConds.push('主题~' + query.title); }
    if (query.type) { 
      const typeQuery = query.type.split(',');
      const typeQueryNames = [];
      for (let i = 0; i < typeQuery.length; i++) {
        if ((index = _.findIndex(types, { id: typeQuery[i] })) !== -1) {
          typeQueryNames.push(types[index].name);
        } else {
          return '类型' + errorMsg;
        }
      }
      queryConds.push('类型：' + typeQueryNames.join('，'));
    }
    if (query.assignee) {
      const assigneeQuery = query.assignee.split(',');
      const assigneeQueryNames = [];
      for (let i = 0; i < assigneeQuery.length; i++) {
        if (assigneeQuery[i] == 'me') {
          assigneeQueryNames.push('当前用户');
        } else if ((index = _.findIndex(users, { id: assigneeQuery[i] })) !== -1) {
          assigneeQueryNames.push(users[index].name);
        } else {
          return '经办人' + errorMsg;
        }
      }
      queryConds.push('经办人：' + assigneeQueryNames.join('，'));
    }
    if (query.reporter) {
      const reporterQuery = query.reporter.split(',');
      const reporterQueryNames = [];
      for (let i = 0; i < reporterQuery.length; i++) {
        if (reporterQuery[i] == 'me') {
          reporterQueryNames.push('当前用户');
        } else if ((index = _.findIndex(users, { id: reporterQuery[i] })) !== -1) {
          reporterQueryNames.push(users[index].name);
        } else {
          return '报告人' + errorMsg;
        }
      }
      queryConds.push('报告人：' + reporterQueryNames.join('，'));
    }
    if (query.watcher) {
      const watcherQuery = query.watcher.split(',');
      const watcherQueryNames = [];
      for (let i = 0; i < watcherQuery.length; i++) {
        if (watcherQuery[i] == 'me') {
          watcherQueryNames.push('当前用户');
        }
      }
      queryConds.push('关注者：' + watcherQueryNames.join('，'));
    }
    if (query.state) {
      const stateQuery = query.state.split(',');
      const stateQueryNames = [];
      for (let i = 0; i < stateQuery.length; i++) {
        if ((index = _.findIndex(states, { id: stateQuery[i] })) !== -1) {
          stateQueryNames.push(states[index].name);
        } else {
          return '状态' + errorMsg;
        }
      }
      queryConds.push('状态：' + stateQueryNames.join('，'));
    }
    if (query.resolution) {
      const resolutionQuery = query.resolution.split(',');
      const resolutionQueryNames = [];
      for (let i = 0; i < resolutionQuery.length; i++) {
        if ((index = _.findIndex(resolutions, { id: resolutionQuery[i] })) !== -1) {
          resolutionQueryNames.push(resolutions[index].name);
        } else {
          return '解决结果' + errorMsg;
        }
      }
      queryConds.push('解决结果：' + resolutionQueryNames.join('，'));
    }
    if (query.priority) {
      const priorityQuery = query.priority.split(',');
      const priorityQueryNames = [];
      for (let i = 0; i < priorityQuery.length; i++) {
        if ((index = _.findIndex(priorities, { id: priorityQuery[i] })) !== -1) {
          priorityQueryNames.push(priorities[index].name);
        } else {
          return '优先级' + errorMsg;
        }
      }
      queryConds.push('优先级：' + priorityQueryNames.join('，'));
    }
    if (query.module) {
      const moduleQuery = query.module.split(',');
      const moduleQueryNames = [];
      for (let i = 0; i < moduleQuery.length; i++) {
        if ((index = _.findIndex(modules, { id: moduleQuery[i] })) !== -1) {
          moduleQueryNames.push(modules[index].name);
        } else {
          return '模块' + errorMsg;
        }
      }
      queryConds.push('模块：' + moduleQueryNames.join('，'));
    }
    if (query.resolve_version) {
      const versionQuery = query.resolve_version.split(',');
      const versionQueryNames = [];
      for (let i = 0; i < versionQuery.length; i++) {
        if ((index = _.findIndex(versions, { id: versionQuery[i] })) !== -1) {
          versionQueryNames.push(versions[index].name);
        } else {
          return '解决版本：' + errorMsg;
        }
      }
      queryConds.push('解决版本：' + versionQueryNames.join('，'));
    }
    if (query.created_at) { queryConds.push('创建时间：' + ((index = _.findIndex(dateOptions, { value: query.created_at })) !== -1 ? dateOptions[index].label : query.created_at)); }
    if (query.updated_at) { queryConds.push('更新时间：' + ((index = _.findIndex(dateOptions, { value: query.updated_at })) !== -1 ? dateOptions[index].label : query.updated_at)); }

    if (queryConds.length <= 0) { return '全部问题'; }

    return queryConds.join(' | ');
  }

  searcherConfigModalClose() {
    this.setState({ searcherConfigShow: false });
  }

  operateSelect(eventKey) {
    const { refresh, query } = this.props;
    if (eventKey === '1') {
      refresh(query);
    } else if (eventKey == '2') {
      this.setState({ condShow : !this.state.condShow });
    } else if (eventKey == '3') {
      this.setState({ addSearcherShow : true });
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

  render() {
    const { 
      i18n, 
      create, 
      addSearcher, 
      configSearcher, 
      indexLoading, 
      optionsLoading, 
      searcherLoading, 
      options={}, 
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
            <MenuItem eventKey='saveSearcher'>保存当前检索</MenuItem>
            <MenuItem eventKey='searcherConfig'>过滤器管理</MenuItem>
          </DropdownButton>
          <Button className='create-btn' disabled={ optionsLoading } onClick={ () => { this.setState({ searchShow: !this.state.searchShow, searcherConfigShow: false }); } }>检索&nbsp;<i className={ this.state.searchShow ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down' }></i></Button>
          { options.permissions && options.permissions.indexOf('create_issue') !== -1 &&
            <Button className='create-btn' bsStyle='primary' disabled={ standardTypes.length <= 0 || optionsLoading } onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i> 创建</Button> }
          <div style={ { marginTop: '8px', float: 'right' } }>
            <DropdownButton pullRight style={ { float: 'right' } } title='更多' onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='1'>刷新</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='2'>{ this.state.condShow ? '隐藏条件' : '显示条件' }</MenuItem>
              <MenuItem eventKey='3'>保存当前检索</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='5'>导出</MenuItem>
              <MenuItem eventKey='6'>导入</MenuItem>
            </DropdownButton>
          </div>
        </div>
        { this.state.condShow &&
        <div className='cond-bar'>
          <span>{ sqlTxt }</span>
          <span className='remove-icon' onClick={ () => { this.setState({ condShow: false }); } } title='关闭'><i className='fa fa-remove'></i></span>
          <span className='remove-icon' onClick={ () => { this.setState({ addSearcherShow: true }); } } title='保存'><i className='fa fa-save'></i></span>
        </div> }
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
            refresh={ refresh } 
            hide={ () => { this.setState({ searchShow: false }) } }/>
        { this.state.createModalShow && 
          <CreateModal 
            show 
            close={ this.createModalClose } 
            options={ options } 
            create={ create } 
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
      </div>
    );
  }
}
