import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
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
const UsersConfigModal = require('./UsersConfigModal');
const OperateNotify = require('./OperateNotify');
const MultiOperateNotify = require('./MultiOperateNotify');

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      editModalShow: false, 
      usersConfigModalShow: false, 
      operateNotifyShow: false, 
      operate: '',
      operateShow: false, 
      multiOperateNotifyShow: false,
      multiOperate: '',
      hoverRowId: '', 
      selectedIds: [],
      name: '', 
      directory: null }; 

    this.createModalClose = this.createModalClose.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.usersConfigModalClose = this.usersConfigModalClose.bind(this);
    this.operateNotifyClose = this.operateNotifyClose.bind(this);
    this.multiOperateNotifyClose = this.multiOperateNotifyClose.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
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
    entry: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    multiDel: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, query={} } = this.props;
    if (query.name) this.state.name = query.name;

    const newQuery = {};
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

  usersConfigModalClose() {
    this.setState({ usersConfigModalShow: false });
  }

  operateNotifyClose() {
    this.setState({ operateNotifyShow: false });
  }

  multiOperateNotifyClose() {
    this.setState({ multiOperateNotifyShow: false });
  }

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  config(id) {
    this.setState({ usersConfigModalShow: true });
    const { select } = this.props;
    select(id);
  }

  componentDidMount() {
    const self = this;
    $('#gname').bind('keypress',function(event) { 
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

    this.state.name = newQuery.name || '';
    this.state.directory = newQuery.directory || null;
  }

  operateNotify(id) {
    this.setState({ operateNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { entry } = this.props;

    if (eventKey === 'edit') {
      this.edit(hoverRowId);
    } else if (eventKey === 'view') {
      entry('/admin/user', { group: hoverRowId });
    } else if (eventKey === 'config') {
      this.config(hoverRowId);
    } else {
      this.operateNotify(hoverRowId);
      this.setState({ operate: eventKey });
    }
  }

  multiOperateSelect(eventKey) {
    this.setState({ multiOperateNotifyShow: true, multiOperate: eventKey });
  }

  refresh() {
    const { refresh } = this.props;
    const query = {};
    if (_.trim(this.state.name)) {
      query.name = _.trim(this.state.name);
    }
    if (this.state.directory) {
      query.directory = this.state.directory;
    }
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

  directoryChange(newValue) {
    this.state.directory = newValue;
    this.refresh(); 
  }

  render() {
    const { 
      i18n, 
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      index, 
      refresh, 
      create, 
      del, 
      multiDel, 
      update, 
      options, 
      query } = this.props;

    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const groups = [];
    const groupNum = collection.length;
    for (let i = 0; i < groupNum; i++) {
      groups.push({
        id: collection[i].id,
        name: ( 
          <div>
            <span className='table-td-title'>{ collection[i].name || '-' }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div> ),
        count: collection[i].users ? <Link to={ '/admin/user?group=' + collection[i].id }>{ collection[i].users.length }</Link> : 0,
        directory: collection[i].directory && collection[i].directory !== 'self' && _.find(options.directories, { id: collection[i].directory }) ? _.find(options.directories, { id: collection[i].directory }).name : '-',
        operation: (
          <div>
          { operateShow && hoverRowId === collection[i].id && !itemLoading &&
            <DropdownButton pullRight bsStyle='link' style={ { textDecoration: 'blink' ,color: '#000' } } key={ i } title={ node } id={ `dropdown-basic-${i}` } onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='view'>查看人员</MenuItem>
              { (!collection[i].directory || collection[i].directory === 'self') && <MenuItem eventKey='config'>配置人员</MenuItem> }
              { (!collection[i].directory || collection[i].directory === 'self') && <MenuItem eventKey='edit'>Edit</MenuItem> }
              { (!collection[i].directory || collection[i].directory === 'self') && <MenuItem eventKey='del'>Delete</MenuItem> }
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
      opts.noDataText = 'No data displayed'; 
    } 

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);
    // opts.onMouseLeave = this.onMouseLeave.bind(this);

    let selectRowProp = {};
    if (groups.length > 0) {
      selectRowProp = {
        mode: 'checkbox',
        selected: this.state.selectedIds,
        onSelect: this.onSelect.bind(this),
        onSelectAll: this.onSelectAll.bind(this)
      };
    }

    let multiDelShow = false;
    _.map(collection, (v) => {
      if (_.indexOf(this.state.selectedIds, v.id) === -1) {
        return;
      }
      if (!v.directory || v.directory == 'self') {
        multiDelShow = true;
      }
    });

    return (
      <div>
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            <span style={ { float: 'right', width: '18%' } }>
              <Select
                simpleValue
                placeholder='Directory'
                value={ this.state.directory }
                onChange={ this.directoryChange.bind(this) }
                options={ _.map(options.directories || [], (val) => { return { label: val.name, value: val.id } }) }/>
            </span>
            <span style={ { float: 'right', width: '20%', marginRight: '10px' } }>
              <FormControl
                type='text'
                id='gname'
                style={ { height: '37px' } }
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }) } }
                placeholder={ '组名查询...' } />
            </span>
            { this.state.selectedIds.length > 0 &&
            <span style={ { float: 'left', marginRight: '10px' } }>
              <DropdownButton title='操作' onSelect={ this.multiOperateSelect.bind(this) }>
                { !multiDelShow && <MenuItem disabled eventKey='null'>无</MenuItem> }
                { multiDelShow && <MenuItem eventKey='del'>Delete</MenuItem> }
              </DropdownButton>
            </span> }
            <span style={ { float: 'left', marginRight: '20px' } }>
              <Button onClick={ () => { this.setState({ createModalShow: true }); } } disabled={ indexLoading }><i className='fa fa-plus'></i>&nbsp;New 组</Button>
            </span>
          </FormGroup>
        </div>
        <div>
          <div className='info-col'>
            <div className='info-icon'><i className='fa fa-info-circle'></i></div>
            <div className='info-content'>
              <span>
                从外部用户目录同步过来of用户组，不能对其做任何操作。
              </span>
            </div>
          </div>
          <BootstrapTable data={ groups } bordered={ false } hover options={ opts } trClassName='tr-middle' selectRow={ selectRowProp }>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>用户组名</TableHeaderColumn>
            <TableHeaderColumn dataField='count'>用户个数</TableHeaderColumn>
            <TableHeaderColumn dataField='directory'>目录</TableHeaderColumn>
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
          { this.state.usersConfigModalShow &&
            <UsersConfigModal
              show
              close={ this.usersConfigModalClose }
              config={ update }
              data={ selectedItem }
              i18n={ i18n }/> }
          { this.state.operateNotifyShow && 
            <OperateNotify 
              show 
              close={ this.operateNotifyClose } 
              data={ selectedItem } 
              operate={ this.state.operate } 
              del={ del } 
              i18n={ i18n }/> }
          { this.state.multiOperateNotifyShow && 
            <MultiOperateNotify 
              show 
              close={ this.multiOperateNotifyClose } 
              collection={ collection }
              multiDel={ multiDel } 
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
