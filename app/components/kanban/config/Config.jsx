import React, { PropTypes, Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
import { parseQuery } from '../../issue/IssueFilterList';

const img = require('../../../assets/images/loading.gif');
const EditModal = require('./EditModal');
const DelKanbanNotify = require('./DelKanbanNotify');
const FilterList = require('./FilterList');
const FilterConfigModal = require('./FilterConfigModal');
const ColumnList = require('./ColumnList');
const ColumnConfigModal = require('./ColumnConfigModal');
const DisplayFieldsConfigModal = require('./DisplayFieldsConfigModal');
const DelNotify = require('./DelNotify');

export default class Config extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      delNotifyShow: false,
      globalFilterModalShow: false,
      quickFilterModalShow: false,
      delFilterNotifyShow: false,
      displayFieldsModalShow: false,
      columnModalShow: false,
      delColumnNotifyShow: false,
      filterNo: -1,
      columnNo: -1 };

    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.globalFilterModalClose = this.globalFilterModalClose.bind(this);
    this.quickFilterModalClose = this.quickFilterModalClose.bind(this);
    this.delFilterNotifyClose = this.delFilterNotifyClose.bind(this);
    this.displayFieldsModalClose = this.displayFieldsModalClose.bind(this);
    this.columnModalClose = this.columnModalClose.bind(this);
    this.delColumnNotifyClose = this.delColumnNotifyClose.bind(this);
    this.condsTxt = this.condsTxt.bind(this);
    this.getDisplayFields = this.getDisplayFields.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    config: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  condsTxt(query) {
    const { options } = this.props;
    const newQuery = _.mapValues(query || {}, (v) => { if (_.isArray(v)) { return v.join(','); } else { return v; } });
    return parseQuery(newQuery, options);
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  globalFilterModalClose() {
    this.setState({ globalFilterModalShow: false });
  }

  quickFilterModalClose() {
    this.setState({ quickFilterModalShow: false });
  }

  displayFieldsModalClose() {
    this.setState({ displayFieldsModalShow: false });
  }

  columnModalClose() {
    this.setState({ columnModalShow: false });
  }

  delFilterNotifyClose() {
    this.setState({ delFilterNotifyShow: false });
  }

  delColumnNotifyClose() {
    this.setState({ delColumnNotifyShow: false });
  }

  editFilter(no) {
    this.setState({ quickFilterModalShow: true, filterNo: no });
  }

  delFilter(no) {
    this.setState({ delFilterNotifyShow: true, filterNo: no });
  }

  editColumn(no) {
    this.setState({ columnModalShow: true, columnNo: no });
  }

  delColumn(no) {
    this.setState({ delColumnNotifyShow: true, columnNo: no });
  }

  getDisplayFields(fields) {
    const { options } = this.props;

    const fieldNames = [];
    _.forEach(fields || [], (v) => {
      const ind = _.findIndex(options.fields, { key: v });
      if (ind !== -1) {
        fieldNames.push(options.fields[ind].name);
      }
    });
    return fieldNames.join(',') || '-';
  }

  render() {

    const styles = { marginLeft: '20px', marginTop: '10px', marginBottom: '10px' };
 
    const { 
      i18n, 
      options,
      loading,
      edit,
      del,
      config } = this.props;

    const isAllowedEdit = options.permissions && options.permissions.indexOf('manage_project') !== -1;

    let usedStates = [];
    _.forEach(config.columns || [], (v) => {
      usedStates = _.union(usedStates, v.states);
    });
    const unUsedStates = _.filter(options.states || [], (v) => { return _.indexOf(usedStates, v.id) === -1 });

    const items = [];
    items.push({
      id: 'basic',
      title: (
        <div>
          <span className='kanban-table-td-title'>基本信息</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0, marginBottom: '10px' } }>
            <li>名称：{ config.name || '-' }</li>
            <li>类型：{ config.type || '-' }</li>
            <li>描述：{ config.description || '-' }</li>
          </ul>
          { isAllowedEdit &&
          <Button onClick={ () => { this.setState({ editModalShow: true }) } }>编辑</Button> }
          { isAllowedEdit &&
          <Button style={ { marginLeft: '15px' } } bsStyle='link' onClick={ () => { this.setState({ delNotifyShow: true }) } }>删除</Button> }
        </div>
      )
    });
    items.push({
      id: 'query',
      title: (
        <div>
          <span className='kanban-table-td-title'>全局过滤</span>
          <span className='table-td-desc'>用来过滤整个看板的问题，默认显示全部。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          { _.isEmpty(_.omit(config.query, [ 'subtask' ])) ?
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0, marginBottom: '10px' } }>
            <li>全部</li>
          </ul>
          :
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0, marginBottom: '10px' } }>
            <li>{ this.condsTxt(config.query) }</li>
          </ul> }
          { isAllowedEdit &&
          <Button onClick={ () => { this.setState({ globalFilterModalShow: true }) } }>设置</Button> }
        </div>
      )
    });
    items.push({
      id: 'filters',
      title: (
        <div>
          <span className='kanban-table-td-title'>快速过滤器</span>
          <span className='table-td-desc'>可上下拖拽调整过滤器位置</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          { (!config.filters || config.filters.length <= 0) ?
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>未定义</li>
          </ul>
          :
          <FilterList
            isAllowedEdit={ isAllowedEdit } 
            kid={ config.id }
            editFilter={ this.editFilter.bind(this) }
            delFilter={ this.delFilter.bind(this) }
            filters={ config.filters || [] }
            update={ edit }
            condsTxt={ this.condsTxt } /> }
          { isAllowedEdit &&
          <Button onClick={ () => { this.setState({ quickFilterModalShow: true, filterNo: -1 }) } }>添加</Button> }
        </div>
      )
    });
    items.push({
      id: 'fields',
      title: (
        <div>
          <span className='kanban-table-td-title'>显示字段</span>
        </div>
      ),  
      contents: (
        <div style={ styles }>
          { _.isEmpty(config.display_fields) ?
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0, marginBottom: '10px' } }>
            <li>未定义</li>
          </ul>
          :
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0, marginBottom: '10px' } }>
            <li>{ this.getDisplayFields(config.display_fields || []) }</li>
          </ul> }
          { isAllowedEdit &&
          <Button onClick={ () => { this.setState({ displayFieldsModalShow: true }) } }>设置</Button> }
        </div>
      )
    });
    items.push({
      id: 'columns',
      title: (
        <div style={ { minHeight: '300px' } }>
          <span className='kanban-table-td-title'>显示列</span>
          <span className='table-td-desc'>可左右拖拽调整列位置</span>
          { unUsedStates.length > 0 && <div className='table-td-desc' style={ { marginTop: '10px' } }>以下未分配状态：</div> }
          { _.map(unUsedStates, (v, i) => { 
            return <div className='config-column-card' key = { i }> <span className={ 'state-' + v.category + '-label' } >{ v.name }</span></div> }) }
        </div>
      ),  
      contents: (
        <div style={ { ...styles, marginLeft: '10px' } } className='config-columns'>
          { (!config.columns || config.columns.length <= 0) ?
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>未定义</li>
          </ul>
          :
          <ColumnList
            isAllowedEdit={ isAllowedEdit }
            kid={ config.id }
            editColumn={ this.editColumn.bind(this) }
            delColumn={ this.delColumn.bind(this) }
            options={ options }
            update={ edit }
            columns={ config.columns || [] } /> }
          { isAllowedEdit &&
          <Button style={ { marginLeft: '10px' } } onClick={ () => { this.setState({ columnModalShow: true, columnNo: -1 }) } }>添加</Button> }
        </div>
      )     
    }); 

    return (
      <div style={ { overflowY: 'auto', height: '100%', paddingBottom: '80px' } }>
        <BootstrapTable data={ items } headerStyle={ { display: 'none' } } bordered={ false } hover trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn width='200' dataField='title'/>
          <TableHeaderColumn dataField='contents'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal  
            show 
            close={ this.editModalClose } 
            update={ edit } 
            data={ config } 
            i18n={ i18n }/> }
        { this.state.delNotifyShow &&
          <DelKanbanNotify
            show
            close={ this.delNotifyClose }
            del={ del }
            loading={ loading }
            data={ config } 
            i18n={ i18n }/> }
        { this.state.globalFilterModalShow &&
          <FilterConfigModal
            show
            model='global'
            close={ this.globalFilterModalClose }
            update={ edit }
            loading={ loading }
            data={ config }
            options={ options }
            i18n={ i18n }/> }
        { this.state.quickFilterModalShow &&
          <FilterConfigModal
            show
            model='filter'
            no={ this.state.filterNo }
            close={ this.quickFilterModalClose }
            update={ edit }
            loading={ loading }
            data={ config }
            options={ options }
            i18n={ i18n }/> }
        { this.state.displayFieldsModalShow &&
          <DisplayFieldsConfigModal
            show
            close={ this.displayFieldsModalClose }
            options={ options }
            data={ config }
            update={ edit }
            loading={ loading }
            i18n={ i18n }/> }
        { this.state.delFilterNotifyShow &&
          <DelNotify
            show
            model='filter' 
            no={ this.state.filterNo }
            close={ this.delFilterNotifyClose }
            update={ edit }
            loading={ loading }
            config={ config }
            i18n={ i18n }/> }
        { this.state.columnModalShow &&
          <ColumnConfigModal
            show
            no={ this.state.columnNo }
            close={ this.columnModalClose }
            update={ edit }
            config={ config }
            options={ options }
            i18n={ i18n }/> }
        { this.state.delColumnNotifyShow &&
          <DelNotify
            show
            model='column'
            no={ this.state.columnNo }
            close={ this.delColumnNotifyClose }
            update={ edit }
            loading={ loading }
            config={ config }
            i18n={ i18n }/> }
      </div>
    );
  }
}
