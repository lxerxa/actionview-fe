import React, { PropTypes, Component } from 'react';
//import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FormGroup, FormControl, ButtonGroup, Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import ApiClient from '../../../shared/api-client';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const $ = require('$');
const PaginationList = require('../share/PaginationList');
const CreateModal = require('./CreateModal');
const EditModal = require('./EditModal');
const CloseNotify = require('./CloseNotify');
const DelNotify = require('./DelNotify');
const MultiOperateNotify = require('./MultiOperateNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      editModalShow: false, 
      closeNotifyShow: false, 
      delNotifyShow: false, 
      operateShow: false, 
      multiOperateNotifyShow: false,
      multiOperate: '',
      hoverRowId: '', 
      selectedIds: [],
      willSetPrincipalPids: [], 
      settingPrincipalPids: [],
      principal: {},
      principal_id: null,
      name: '', 
      status: 'active' };

    this.createModalClose = this.createModalClose.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.closeNotifyClose = this.closeNotifyClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.multiOperateNotifyClose = this.multiOperateNotifyClose.bind(this);
    this.entry = this.entry.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object,
    getOptions: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    entry: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    reopen: PropTypes.func.isRequired,
    createIndex: PropTypes.func.isRequired,
    multiReopen: PropTypes.func.isRequired,
    multiStop: PropTypes.func.isRequired,
    multiCreateIndex: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, getOptions, query={} } = this.props;
    const newQuery = {};
    newQuery.status = this.state.status = query.status || 'active';
    if (query.name) {
      newQuery.name = this.state.name = query.name;
    }
    if (query.principal_id) {
      newQuery.principal_id = this.state.principal_id = query.principal_id;
    }

    index(newQuery);
    getOptions();
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  closeNotifyClose() {
    this.setState({ closeNotifyShow: false });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  multiOperateNotifyClose() {
    this.setState({ multiOperateNotifyShow: false });
  }

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  entry(key) {
    const { entry } = this.props;
    entry('/project/' + key); 
  }

  componentDidMount() {
    const self = this;
    $('#pname').bind('keypress',function(event){  
      if(event.keyCode == '13') {  
        self.refresh();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { index, query } = this.props;
    if (!_.isEqual(newQuery, query)) {
      index(newQuery);
    }

    this.state.status = newQuery.status || 'active';
    this.state.name = newQuery.name || '';
    this.state.principal_id = newQuery.principal_id || null;
  }

  closeNotify(id) {
    this.setState({ closeNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  async reopen(id) {
    const { select, reopen } = this.props;
    select(id);
    const ecode = await reopen(id);
    if (ecode === 0) {
      notify.show('项目已打开。', 'success', 2000);    
    } else {
      notify.show('打开失败。', 'error', 2000);    
    }
  }

  async createIndex(id) {
    const { select, createIndex } = this.props;
    select(id);
    const ecode = await createIndex(id);
    if (ecode === 0) {
      notify.show('索引已创建。', 'success', 2000);
    } else {
      notify.show('创建失败。', 'error', 2000);
    }
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;

    if (eventKey === '1') {
      this.edit(hoverRowId);
    } else if (eventKey === '2') {
      this.closeNotify(hoverRowId);
    } else if (eventKey === '3') {
      this.reopen(hoverRowId);
    } else if (eventKey === '4') {
      this.createIndex(hoverRowId);
    } else if (eventKey === '5') {
      this.delNotify(hoverRowId);
    }
  }

  multiOperateSelect(eventKey) {
    this.setState({ multiOperateNotifyShow: true, multiOperate: eventKey });
  }

  willSetPrincipal(pid) {
    this.state.willSetPrincipalPids.push(pid);
    this.setState({ willSetPrincipalPids: this.state.willSetPrincipalPids });
  }

  uploaderChange(newValue) {
    this.state.uploader = newValue;
    this.refresh();
  }

  refresh() {
    const { refresh } = this.props;
    const query = {};
    if (_.trim(this.state.name)) {
      query.name = _.trim(this.state.name);
    }
    if (this.state.principal_id) {
      query.principal_id = this.state.principal_id;
    }
    query.status = this.state.status;

    refresh(query);
  }

  onRowMouseOver(rowData) {
    if (rowData.id !== this.state.hoverRowId) {
      this.setState({ operateShow: true, hoverRowId: rowData.id });
    }
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  onSelectAll(isSelected, rows) {
    if (isSelected) {
      const length = rows.length;
      for (let i = 0; i < length; i++) {
        this.state.selectedIds.push(rows[i].id);
      }
    } else {
      this.state.selectedIds = [];
    }
    this.setState({ selectedIds: this.state.selectedIds });
  }

  onSelect(row, isSelected) {
    if (isSelected) {
      this.state.selectedIds.push(row.id);
    } else {
      const newSelectedIds = [];
      const length = this.state.selectedIds.length;
      for (let i = 0; i < length; i++) {
        if (this.state.selectedIds[i] !== row.id) {
          newSelectedIds.push(this.state.selectedIds[i]);
        }
      }
      this.state.selectedIds = newSelectedIds;
    }
    this.setState({ selectedIds: this.state.selectedIds });
  }

  cancelSelected() {
    this.setState({ selectedIds: [] });
  }

  render() {
    const { 
      i18n, 
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      refresh, 
      create, 
      del, 
      stop, 
      multiStop, 
      multiReopen, 
      multiCreateIndex, 
      update, 
      options, 
      query } = this.props;
    const { willSetPrincipalPids, settingPrincipalPids } = this.state;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const projects = [];
    const projectNum = collection.length;
    for (let i = 0; i < projectNum; i++) {
      projects.push({
        id: collection[i].id,
        name: ( 
          <div> 
            <a href='#' style={ { cursor: 'pointer' } } onClick={ (e) => { e.preventDefault(); this.entry(collection[i].key); } }>{ collection[i].name }</a>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div> ),
        uploader: collection[i].uploader && collection[i].uploader.name,
        uploaded_at: 'ssss',
        operation: (
          <div>
          { operateShow && hoverRowId === collection[i].id && !itemLoading &&
            <DropdownButton 
              pullRight 
              bsStyle='link' 
              style={ { textDecoration: 'blink' ,color: '#000' } } 
              key={ i } 
              title={ node } 
              id={ `dropdown-basic-${i}` } 
              onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='1'>设置标签</MenuItem>
              <MenuItem eventKey='2'>编辑</MenuItem>
              <MenuItem eventKey='3'>上传新版本</MenuItem>
              <MenuItem eventKey='4'>删除</MenuItem>
            </DropdownButton> }
            <img src={ img } className={ (itemLoading && selectedItem.id === collection[i].id) ? 'loading' : 'hide' }/>
          </div>
        )
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);
    // opts.onMouseLeave = this.onMouseLeave.bind(this);

    let selectRowProp = {};
    if (projects.length > 0) {
      selectRowProp = {
        mode: 'checkbox',
        selected: this.state.selectedIds,
        onSelect: this.onSelect.bind(this),
        onSelectAll: this.onSelectAll.bind(this)
      };
    }

    return (
      <div>
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            <span style={ { float: 'right', width: '22%', marginRight: '10px' } }>
              <Select
                simpleValue
                placeholder='上传者'
                value={ this.state.principal_id }
                onChange={ this.principalChange.bind(this) }
                options={ _.map(options.principals, (v) => { return { value: v.id, label: v.name + '(' + v.email + ')' } } ) }/>
            </span>
            <span style={ { float: 'right', width: '22%', marginRight: '10px' } }>
              <FormControl
                type='text'
                id='pname'
                style={ { height: '36px' } }
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }) } }
                placeholder={ '文档名称查询...' } />
            </span>
            { this.state.selectedIds.length > 0 &&
            <span style={ { float: 'left', marginRight: '10px' } }>
              <DropdownButton title='操作' onSelect={ this.multiOperateSelect.bind(this) }>
                <MenuItem eventKey='setLabels'>设置标签</MenuItem>
                <MenuItem eventKey='delete'>删除</MenuItem>
              </DropdownButton>
            </span> }
            <span style={ { float: 'left', width: '20%' } }>
              <Button onClick={ () => { this.setState({ uploadModalShow: true }); } } disabled={ indexLoading }>
                <i className='fa fa-plus'></i>&nbsp;上传文档
              </Button>
            </span>
          </FormGroup>
        </div>
        <div>
          <BootstrapTable data={ projects } bordered={ false } hover options={ opts } trClassName='tr-middle' selectRow={ selectRowProp }>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
            <TableHeaderColumn dataField='uploader' width='320'>上传者</TableHeaderColumn>
            <TableHeaderColumn dataField='uploaded_at'>上传时间</TableHeaderColumn>
            <TableHeaderColumn dataField='size'>大小</TableHeaderColumn>
            <TableHeaderColumn width='60' dataField='operation'/>
          </BootstrapTable>
          { this.state.editModalShow && 
            <EditModal 
              show 
              close={ this.editModalClose } 
              update={ update } 
              data={ selectedItem } 
              i18n={ i18n }/> }
          { this.state.createModalShow && 
            <CreateModal 
              show 
              close={ this.createModalClose } 
              create={ create } 
              i18n={ i18n }/> }
          { this.state.closeNotifyShow && 
            <CloseNotify 
              show 
              close={ this.closeNotifyClose } 
              data={ selectedItem } 
              stop={ stop }/> }
          { this.state.delNotifyShow &&
            <DelNotify
              show
              close={ this.delNotifyClose }
              data={ selectedItem }
              del={ del }/> }
          { this.state.multiOperateNotifyShow && 
            <MultiOperateNotify 
              show 
              close={ this.multiOperateNotifyClose } 
              multiReopen={ multiReopen } 
              multiStop={ multiStop } 
              multiCreateIndex={ multiCreateIndex } 
              ids={ this.state.selectedIds } 
              cancelSelected={ this.cancelSelected.bind(this) } 
              operate={ this.state.multiOperate } 
              loading={ loading } 
              i18n={ i18n }/> }
        </div>
        { !indexLoading && options.total && options.total > 0 ?
          <PaginationList
            total={ options.total || 0 }
            curPage={ query.page || 1 }
            sizePerPage={ options.sizePerPage || 30 }
            paginationSize={ 4 }
            query={ query }
            refresh={ refresh }/>
          : '' }
      </div>
    );
  }
}
