import React, { PropTypes, Component } from 'react';
import { Button, Label, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
import { IssueFilterList, parseQuery } from './IssueFilterList';

const $ = require('$');
const CreateModal = require('./CreateModal');
const SaveFilterModal = require('./SaveFilterModal');
const ResetFiltersNotify = require('./ResetFiltersNotify');
const FilterConfigModal = require('../share/FilterConfigModal');
const ResetColumnsNotify = require('./ResetColumnsNotify');
const ColumnsConfigModal = require('./ColumnsConfigModal');
const ExportConfigModal = require('./ExportConfigModal');
const ImportModal = require('./ImportModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      filterConfigShow: false, 
      searchShow: false, 
      saveFilterShow: false,
      resetFiltersShow: false,
      setColumnsShow: false,
      resetColumnsShow: false,
      exportConfigShow: false,
      importModalShow: false };

    this.createModalClose = this.createModalClose.bind(this);
    this.saveFilterModalClose = this.saveFilterModalClose.bind(this);
    this.resetFiltersNotifyClose = this.resetFiltersNotifyClose.bind(this);
    this.filterConfigModalClose = this.filterConfigModalClose.bind(this);
    this.setColumnsNotifyClose = this.setColumnsNotifyClose.bind(this);
    this.resetColumnsNotifyClose = this.resetColumnsNotifyClose.bind(this);
    this.exportConfigModalClose = this.exportConfigModalClose.bind(this);
    this.importModalClose = this.importModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    addLabels: PropTypes.func.isRequired,
    saveFilter: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired,
    setColumns: PropTypes.func.isRequired,
    resetColumns: PropTypes.func.isRequired,
    configFilters: PropTypes.func.isRequired,
    closeDetailBar: PropTypes.func,
    index: PropTypes.func,
    refresh: PropTypes.func,
    exportExcel: PropTypes.func,
    imports: PropTypes.func,
    getOptions: PropTypes.func,
    query: PropTypes.object,
    project: PropTypes.object,
    options: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    optionsLoading: PropTypes.bool.isRequired,
    filterLoading: PropTypes.bool.isRequired,
    columnsLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired
  }

  componentWillMount() {
    const { getOptions } = this.props;
    getOptions();
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  saveFilterModalClose() {
    this.setState({ saveFilterShow: false });
  }

  resetFiltersNotifyClose() {
    this.setState({ resetFiltersShow: false });
  }

  setColumnsNotifyClose() {
    this.setState({ setColumnsShow: false });
  }

  resetColumnsNotifyClose() {
    this.setState({ resetColumnsShow: false });
  }

  filterConfigModalClose() {
    this.setState({ filterConfigShow: false });
  }

  exportConfigModalClose() {
    this.setState({ exportConfigShow: false });
  }

  importModalClose() {
    this.setState({ importModalShow: false });
  }

  operateSelect(eventKey) {
    const { refresh, index, query } = this.props;
    if (eventKey === 'refresh') {
      if (query.page > 1) {
        refresh(_.extend(query, { page: undefined }));
      } else {
        index(query);
      }
    } else if (eventKey === 'set_columns') {
      this.setState({ setColumnsShow: true });
    } else if (eventKey === 'reset_columns') {
      this.setState({ resetColumnsShow: true });
    } else if (eventKey === 'import') {
      this.setState({ importModalShow: true });
    } else if (eventKey === 'export') {
      this.setState({ exportConfigShow: true });
    }
  }

  selectFilter(eventKey) {
    const { refresh, options={} } = this.props;

    if (eventKey == 'filterConfig') {
      this.setState({ filterConfigShow: true });
    } else if(eventKey == 'saveFilter') {
      this.setState({ saveFilterShow : true });
    } else if(eventKey == 'resetFilters') {
      this.setState({ 'resetFiltersShow' : true });
    } else if(eventKey == 'all') {
      refresh({});
    } else if(eventKey == 'todos') {
      refresh({ assignee: 'me', resolution: 'Unresolved' });
    } else if(eventKey == 'myreports') {
      refresh({ reporter: 'me' });
    } else if(eventKey == 'mywatches') {
      refresh({ watcher: 'me' });
    } else {
      const filters = options.filters || [];
      const filter = _.find(filters, { id: eventKey }) || {};
      refresh(filter.query || {});
    }
  }

  exportExcel(fields) {
    const { exportExcel, query } = this.props;
    exportExcel(query, fields);
  }

  render() {
    const { 
      i18n, 
      index,
      create, 
      addLabels, 
      saveFilter, 
      resetFilters, 
      configFilters, 
      setColumns, 
      resetColumns, 
      imports,
      indexLoading, 
      optionsLoading, 
      filterLoading, 
      columnsLoading, 
      options={}, 
      closeDetailBar,
      refresh, 
      query, 
      loading, 
      project } = this.props;

    const standardTypes = _.reject(_.reject(options.types || [], { type: 'subtask' }) || [], { disabled: true }) || [];
    const sqlTxt = optionsLoading ? '' : parseQuery(query, options);

    return (
      <div>
        <div style={ { marginTop: '5px' } }>
          <DropdownButton className='create-btn' id='filters' title='过滤器' onSelect={ this.selectFilter.bind(this) }>
            { options.filters && options.filters.length > 0 ? 
              _.map(options.filters || [], (val) => <MenuItem eventKey={ val.id } key={ val.id }>{ val.name }</MenuItem> ) :
              <MenuItem disabled>无</MenuItem> }
            <MenuItem divider/>
            <MenuItem eventKey='saveFilter'>保存当前检索</MenuItem>
            <MenuItem eventKey='filterConfig'>过滤器管理</MenuItem>
            <MenuItem eventKey='resetFilters'>过滤器重置</MenuItem>
          </DropdownButton>
          <Button className='create-btn' disabled={ optionsLoading } onClick={ () => { if (!this.state.searchShow) { closeDetailBar(); }  this.setState({ searchShow: !this.state.searchShow }); } }>检索&nbsp;<i className={ this.state.searchShow ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down' }></i></Button>
          { options.permissions && options.permissions.indexOf('create_issue') !== -1 &&
          <Button className='create-btn' bsStyle='primary' disabled={ standardTypes.length <= 0 || optionsLoading } onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i> 创建</Button> }
          <div style={ { marginTop: '8px', float: 'right' } }>
            <DropdownButton id='more' pullRight style={ { float: 'right' } } title='更多' onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='refresh'>刷新</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='set_columns'>显示列配置</MenuItem>
              <MenuItem eventKey='reset_columns'>显示列重置</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='import'>导入</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='export'>导出</MenuItem>
            </DropdownButton>
          </div>
          { sqlTxt &&
          <div className='cond-bar'>
            <div className='cond-contents' title={ sqlTxt }><b>检索条件</b>：{ sqlTxt }</div>
            <div className='remove-icon' onClick={ () => { refresh({}); } } title='清空当前检索'><i className='fa fa-remove'></i></div>
            <div className='remove-icon' onClick={ () => { this.setState({ saveFilterShow: true }); } } title='保存当前检索'><i className='fa fa-save'></i></div>
          </div> }
        </div>
        { this.state.filterConfigShow && 
        <FilterConfigModal 
          show 
          close={ this.filterConfigModalClose } 
          loading={ filterLoading } 
          config={ configFilters } 
          filters={ options.filters || [] } 
          i18n={ i18n }/> }
        <IssueFilterList 
          values={ query } 
          searchShow={ this.state.searchShow } 
          indexLoading={ indexLoading } 
          options={ options } 
          onChange={ (newValue) => { refresh(_.assign({}, newValue, { page: undefined })) } } />
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
        { this.state.saveFilterShow && 
        <SaveFilterModal 
          show 
          close={ this.saveFilterModalClose } 
          filters={ options.filters || [] } 
          create={ saveFilter } 
          query={ query } 
          loading={ filterLoading } 
          sqlTxt={ sqlTxt } 
          i18n={ i18n }/> }
        { this.state.resetFiltersShow &&
          <ResetFiltersNotify
            show
            close={ this.resetFiltersNotifyClose }
            reset={ resetFilters }
            loading={ filterLoading }
            i18n={ i18n }/> }
        { this.state.setColumnsShow &&
          <ColumnsConfigModal
            show
            close={ this.setColumnsNotifyClose }
            options={ options }
            data={ options.display_columns || [] }
            set={ setColumns }
            loading={ columnsLoading }
            i18n={ i18n }/> }
        { this.state.resetColumnsShow &&
          <ResetColumnsNotify
            show
            close={ this.resetColumnsNotifyClose }
            options={ options }
            reset={ resetColumns }
            loading={ columnsLoading }
            i18n={ i18n }/> }
        { this.state.exportConfigShow &&
          <ExportConfigModal
            show
            close={ this.exportConfigModalClose }
            options={ options } 
            exportExcel={ this.exportExcel.bind(this) }
            i18n={ i18n }/> }
        { this.state.importModalShow &&
          <ImportModal
            show
            close={ this.importModalClose }
            imports={ imports }
            loading={ loading }
            index={ index }
            i18n={ i18n }/> }
      </div>
    );
  }
}
