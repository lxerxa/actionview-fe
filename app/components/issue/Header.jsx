import React, { PropTypes, Component } from 'react';
import { Button, Label, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
import { IssueFilterList, getCondsTxt } from './IssueFilterList';

const $ = require('$');
const CreateModal = require('./CreateModal');
const AddSearcherModal = require('./AddSearcherModal');
const SearcherConfigModal = require('../share/SearcherConfigModal');
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
    const sqlTxt = optionsLoading ? '' : getCondsTxt(query, options);

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
        <IssueFilterList 
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
