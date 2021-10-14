import React, { PropTypes, Component } from 'react';
import { Button, Label, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import _ from 'lodash';
import { IssueFilterList, parseQuery } from './IssueFilterList';

const CreateModal = require('./CreateModal');
const SaveFilterModal = require('./SaveFilterModal');
const ResetFiltersNotify = require('./ResetFiltersNotify');
const FilterConfigModal = require('../share/FilterConfigModal');
const FilterDelModal = require('./DelFiltersModal');
const ResetColumnsNotify = require('./ResetColumnsNotify');
const ColumnsConfigModal = require('./ColumnsConfigModal');
const ExportConfigModal = require('./ExportConfigModal');
const ImportModal = require('./ImportModal');
const MultiDelNotify = require('./MultiDelNotify');
const MultiEditModal = require('./MultiEditModal');

const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      filterConfigShow: false, 
      filterDelShow: false, 
      searchShow: false, 
      saveFilterShow: false,
      resetFiltersShow: false,
      setColumnsShow: false,
      resetColumnsShow: false,
      exportConfigShow: false,
      importModalShow: false, 
      multiEditModalShow: false, 
      multiDelNotifyShow: false 
    };

    this.createModalClose = this.createModalClose.bind(this);
    this.saveFilterModalClose = this.saveFilterModalClose.bind(this);
    this.resetFiltersNotifyClose = this.resetFiltersNotifyClose.bind(this);
    this.filterConfigModalClose = this.filterConfigModalClose.bind(this);
    this.filterDelModalClose = this.filterDelModalClose.bind(this);
    this.setColumnsNotifyClose = this.setColumnsNotifyClose.bind(this);
    this.resetColumnsNotifyClose = this.resetColumnsNotifyClose.bind(this);
    this.exportConfigModalClose = this.exportConfigModalClose.bind(this);
    this.importModalClose = this.importModalClose.bind(this);
    this.multiEditModalClose = this.multiEditModalClose.bind(this);
    this.multiDelNotifyClose = this.multiDelNotifyClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    addLabels: PropTypes.func.isRequired,
    saveFilter: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired,
    setColumns: PropTypes.func.isRequired,
    resetColumns: PropTypes.func.isRequired,
    configFilters: PropTypes.func.isRequired,
    delFilters: PropTypes.func.isRequired,
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
    indexLoading: PropTypes.bool.isRequired,
    multiUpdate: PropTypes.func.isRequired,
    multiDel: PropTypes.func.isRequired,
    selectedIds: PropTypes.array.isRequired,
    isBatchHandle: PropTypes.bool.isRequired,
    switchBatch: PropTypes.func.isRequired
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

  filterDelModalClose() {
    this.setState({ filterDelShow: false });
  }

  exportConfigModalClose() {
    this.setState({ exportConfigShow: false });
  }

  importModalClose() {
    this.setState({ importModalShow: false });
  }

  multiDelNotifyClose() {
    this.setState({ multiDelNotifyShow: false });
  }

  multiEditModalClose() {
    this.setState({ multiEditModalShow: false });
  }

  operateSelect(eventKey) {
    const { refresh, index, query, switchBatch } = this.props;
    if (eventKey === 'refresh') {
      if (query.page > 1) {
        refresh(_.extend(query, { page: undefined }));
      } else {
        index(query);
      }
    } else if (eventKey === 'gotogantt') {
      refresh(_.extend(query, { page: undefined }), 'gantt');
    } else if (eventKey === 'set_columns') {
      this.setState({ setColumnsShow: true });
    } else if (eventKey === 'reset_columns') {
      this.setState({ resetColumnsShow: true });
    } else if (eventKey === 'import') {
      this.setState({ importModalShow: true });
    } else if (eventKey === 'export') {
      this.setState({ exportConfigShow: true });
    } else if (eventKey == 'batch') {
      switchBatch();
    }
  }

  selectFilter(eventKey) {
    const { refresh, options={} } = this.props;

    if (eventKey == 'filterConfig') {
      this.setState({ filterConfigShow: true });
    } else if(eventKey == 'saveFilter') {
      this.setState({ saveFilterShow : true });
    } else if(eventKey == 'filterDel') {
      this.setState({ filterDelShow : true });
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

  multiOperateSelect(eventKey) {
    if (eventKey === 'multi_del') {
      this.setState({ 'multiDelNotifyShow' : true });
    } else if (eventKey === 'multi_edit') {
      this.setState({ 'multiEditModalShow' : true });
    }
  }

  render() {
    const { 
      i18n, 
      user,
      index,
      create, 
      addLabels, 
      saveFilter, 
      resetFilters, 
      configFilters, 
      delFilters, 
      setColumns, 
      resetColumns, 
      imports,
      indexLoading, 
      optionsLoading, 
      filterLoading, 
      columnsLoading, 
      options={}, 
      refresh, 
      query, 
      loading, 
      project,
      multiDel,
      multiUpdate,
      selectedIds,
      isBatchHandle
    } = this.props;

    const standardTypes = _.reject(_.reject(options.types || [], { type: 'subtask' }) || [], { disabled: true }) || [];
    const sqlTxt = optionsLoading ? '' : parseQuery(query, options);

    return (
      <div>
        <div style={ { paddingTop: '5px' } }>
          { selectedIds.length > 0 &&
            <DropdownButton className='create-btn' title='批量操作' onSelect={ this.multiOperateSelect.bind(this) }>
              { options.permissions && options.permissions.indexOf('edit_issue') !== -1 && <MenuItem eventKey='multi_edit'>编辑</MenuItem> }
              { options.permissions && options.permissions.indexOf('delete_issue') !== -1 && <MenuItem eventKey='multi_del'>删除</MenuItem> }
            </DropdownButton> }
          <DropdownButton className='create-btn' id='filters' title='过滤器' onSelect={ this.selectFilter.bind(this) }>
            { options.filters && options.filters.length > 0 ? 
              _.map(options.filters || [], (val) => <MenuItem eventKey={ val.id } key={ val.id }>{ val.name }</MenuItem> ) :
              <MenuItem disabled>无</MenuItem> }
            <MenuItem divider/>
            <MenuItem eventKey='saveFilter'>保存当前检索</MenuItem>
            <MenuItem eventKey='filterConfig'>过滤器排序</MenuItem>
            <MenuItem eventKey='filterDel'>过滤器删除</MenuItem>
          </DropdownButton>
          <Button className='create-btn' disabled={ optionsLoading } onClick={ () => { this.setState({ searchShow: !this.state.searchShow }); } }>检索&nbsp;<i className={ this.state.searchShow ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down' }></i></Button>
          { options.permissions && options.permissions.indexOf('create_issue') !== -1 &&
          <Button className='create-btn' bsStyle='primary' disabled={ standardTypes.length <= 0 || optionsLoading } onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i> 创建</Button> }
          <div style={ { marginTop: '10px', float: 'right' } }>
            <DropdownButton id='more' pullRight style={ { float: 'right' } } title='更多' onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='refresh'>刷新</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='gotogantt'>跳至甘特图</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='set_columns'>显示列配置</MenuItem>
              <MenuItem eventKey='reset_columns'>显示列重置</MenuItem>
              { options.permissions && (options.permissions.indexOf('edit_issue') !== -1 || options.permissions.indexOf('delete_issue') !== -1) &&
                <MenuItem divider/> }
              { options.permissions && (options.permissions.indexOf('edit_issue') !== -1 || options.permissions.indexOf('delete_issue') !== -1) &&
                <MenuItem eventKey='batch'>{ isBatchHandle ? '取消批量操作' : '批量操作' }</MenuItem> }
              { options.permissions && options.permissions.indexOf('create_issue') !== -1 &&
                <MenuItem divider/> }
              { options.permissions && options.permissions.indexOf('create_issue') !== -1 &&
                <MenuItem eventKey='import'>导入</MenuItem> }
              <MenuItem divider/>
              <MenuItem eventKey='export'>导出</MenuItem>
            </DropdownButton>
          </div>
          { sqlTxt &&
          <div className='cond-bar'>
            <div className='cond-contents' title={ sqlTxt }>
              <b>检索条件</b>：{ sqlTxt }
            </div>
            <div className='remove-icon' onClick={ () => { this.setState({ saveFilterShow: true }); } } title='保存当前检索'>
              <i className='fa fa-save'></i>
            </div>
          </div> }
        </div>
        { this.state.filterConfigShow && 
          <FilterConfigModal 
            show 
            isRemovable={ false }
            close={ this.filterConfigModalClose } 
            loading={ filterLoading } 
            config={ configFilters } 
            filters={ options.filters || [] } 
            i18n={ i18n }/> }
        { this.state.filterDelShow &&
          <FilterDelModal
            show
            close={ this.filterDelModalClose }
            loading={ filterLoading }
            del={ delFilters }
            data={ _.filter(options.filters || [], (v) => v.creator == user.id) }
            i18n={ i18n }/> }
        { !optionsLoading && 
          <IssueFilterList 
            savable
            values={ query } 
            visable={ this.state.searchShow } 
            indexLoading={ indexLoading } 
            options={ options } 
            onSave={ () => { this.setState({ saveFilterShow: true }) } }
            onChange={ (newValue) => { refresh(_.assign({}, newValue, { page: undefined })) } } /> }
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
            options={ options } 
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
        { this.state.multiDelNotifyShow &&
          <MultiDelNotify show
            close={ this.multiDelNotifyClose }
            index={ index }
            query={ query }
            issueIds={ selectedIds }
            loading = { loading }
            multiDel={ multiDel }
            i18n={ i18n }/> }
        { this.state.multiEditModalShow &&
          <MultiEditModal
            show
            close={ this.multiEditModalClose }
            project={ project } 
            index={ index }
            query={ query }
            issueIds={ selectedIds }
            loading = { loading }
            multiUpdate={ multiUpdate }
            options={ options }
            i18n={ i18n }/> }
      </div>
    );
  }
}
