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
const MultiOperateNotify = require('./MultiOperateNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      editModalShow: false, 
      closeNotifyShow: false, 
      operateShow: false, 
      multiOperateNotifyShow: false,
      multiOperate: '',
      hoverRowId: '', 
      selectedIds: [],
      name: '', 
      status: 'active' };

    this.createModalClose = this.createModalClose.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.closeNotifyClose = this.closeNotifyClose.bind(this);
    this.multiOperateNotifyClose = this.multiOperateNotifyClose.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  static propTypes = {
    options: PropTypes.object,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    reopen: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    multiReopen: PropTypes.func.isRequired,
    multiStop: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, query={} } = this.props;
    if (query.status) this.state.status = query.status;
    if (query.name) this.state.name = query.name;

    const newQuery = {};
    if (this.state.status) {
      newQuery.status = this.state.status;
    }
    if (this.state.name) {
      newQuery.name = this.state.name;
    }
    index(newQuery);
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

  multiOperateNotifyClose() {
    this.setState({ multiOperateNotifyShow: false });
  }

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  componentDidMount() {
    const self = this;
    $('#uname').bind('keypress',function(event) { 
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
  }

  closeNotify(id) {
    this.setState({ closeNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  async reopen(id) {
    const { select, reopen } = this.props;
    select(id);
    const ecode = await reopen(id);
    if (ecode === 0) {
      notify.show('用户已启用。', 'success', 2000);    
    } else {
      notify.show('启用失败。', 'error', 2000);    
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
    }
  }

  multiOperateSelect(eventKey) {
    this.setState({ multiOperateNotifyShow: true, multiOperate: eventKey });
  }

  statusChange(newValue) {
    this.state.status = newValue;
    this.refresh();
  }

  refresh() {
    const { refresh } = this.props;
    const query = {};
    if (_.trim(this.state.name)) {
      query.name = _.trim(this.state.name);
    }
    if (this.state.principal) {
      query.principal = this.state.principal;
    }
    query.status = this.state.status;

    refresh(query);
  }

  onRowMouseOver(rowData) {
    this.setState({ operateShow: true, hoverRowId: rowData.id });
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
    console.log(this.state.selectedIds);
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
    const { collection, selectedItem, loading, indexLoading, itemLoading, refresh, create, stop, multiStop, multiReopen, update, options, query } = this.props;
    const { willSetPrincipalPids, settingPrincipalPids } = this.state;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const states = [];
    const stateNum = collection.length;
    for (let i = 0; i < stateNum; i++) {
      states.push({
        id: collection[i].id,
        name: collection[i].name,
        email: collection[i].email,
        phone: collection[i].phone,
        status: collection[i].status == 'active' ? '活动中' : '已关闭',
        operation: (
          <div>
          { operateShow && hoverRowId === collection[i].id && !itemLoading &&
            <DropdownButton pullRight bsStyle='link' style={ { textDecoration: 'blink' ,color: '#000' } } key={ i } title={ node } id={ `dropdown-basic-${i}` } onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='1'>编辑</MenuItem>
              { collection[i].status == 'active' ? <MenuItem eventKey='2'>禁用</MenuItem> : <MenuItem eventKey='3'>启用</MenuItem> }
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
    opts.onMouseLeave = this.onMouseLeave.bind(this);

    const selectRowProp = {
      mode: 'checkbox',
      selected: this.state.selectedIds,
      onSelect: this.onSelect.bind(this),
      onSelectAll: this.onSelectAll.bind(this)
    };

    return (
      <div>
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            <span style={ { float: 'right', width: '27%' } }>
              <FormControl
                type='text'
                id='uname'
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }) } }
                placeholder={ '用户姓名、邮箱、手机号查询...' } />
            </span>
            <span style={ { float: 'right', width: '90px', marginRight: '10px' } }>
              <Select
                simpleValue
                clearable={ false }
                placeholder='用户状态'
                value={ this.state.status }
                onChange={ this.statusChange.bind(this) }
                options={ [{ value: 'all', label: '全部' }, { value: 'active', label: '启用' }, { value: 'closed', label: '已禁用' }] }/>
            </span>
            { this.state.selectedIds.length > 0 &&
            <span style={ { float: 'left', marginRight: '10px' } }>
              <DropdownButton title='操作' onSelect={ this.multiOperateSelect.bind(this) }>
                <MenuItem eventKey='close'>禁用</MenuItem>
                <MenuItem eventKey='reopen'>启用</MenuItem>
              </DropdownButton>
            </span> }
            <span style={ { float: 'left', width: '20%' } }>
              <Button bsStyle='success' onClick={ () => { this.setState({ createModalShow: true }); } } disabled={ indexLoading }><i className='fa fa-plus'></i>&nbsp;新建用户</Button>
            </span>
          </FormGroup>
        </div>
        <div>
          <BootstrapTable data={ states } bordered={ false } hover options={ opts } trClassName='tr-middle' selectRow={ selectRowProp }>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>姓名</TableHeaderColumn>
            <TableHeaderColumn dataField='email'>邮箱</TableHeaderColumn>
            <TableHeaderColumn dataField='phone'>手机号</TableHeaderColumn>
            <TableHeaderColumn dataField='status' width='80'>状态</TableHeaderColumn>
            <TableHeaderColumn width='60' dataField='operation'/>
          </BootstrapTable>
          { this.state.editModalShow && <EditModal show close={ this.editModalClose } update={ update } data={ selectedItem }/> }
          { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create }/> }
          { this.state.closeNotifyShow && <CloseNotify show close={ this.closeNotifyClose } data={ selectedItem } stop={ stop }/> }
          { this.state.multiOperateNotifyShow && <MultiOperateNotify show close={ this.multiOperateNotifyClose } multiReopen={ multiReopen } multiStop={ multiStop } ids={ this.state.selectedIds } cancelSelected={ this.cancelSelected.bind(this) } operate={ this.state.multiOperate } loading={ loading }/> }
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
