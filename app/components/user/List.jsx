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
const ImportModal = require('./ImportModal');
const CreateModal = require('./CreateModal');
const EditModal = require('./EditModal');
const OperateNotify = require('./OperateNotify');
const MultiOperateNotify = require('./MultiOperateNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      importModalShow: false, 
      createModalShow: false, 
      editModalShow: false, 
      operateNotifyShow: false, 
      operate: '',
      operateShow: false, 
      multiOperateNotifyShow: false,
      multiOperate: '',
      hoverRowId: '', 
      selectedIds: [],
      name: '', 
      group: null,
      directory: null }; 

    this.importModalClose = this.importModalClose.bind(this);
    this.createModalClose = this.createModalClose.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
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
    imports: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    renew: PropTypes.func.isRequired,
    invalidate: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    multiRenew: PropTypes.func.isRequired,
    multiInvalidate: PropTypes.func.isRequired,
    multiDel: PropTypes.func.isRequired
  }

  componentWillMount() {
    const newQuery = {};
    const { index, query={} } = this.props;
    if (query.name) {
      newQuery.name = this.state.name = query.name;
    }
    if (query.group) {
      newQuery.group = this.state.group = query.group;
    }
    if (query.directory) {
      newQuery.directory = this.state.directory = query.directory;
    }
    index(newQuery);
  }

  importModalClose() {
    this.setState({ importModalShow: false });
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  editModalClose() {
    this.setState({ editModalShow: false });
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

    this.state.name = query.name || '';
    this.state.group = query.group || null;
    this.state.directory = query.directory || null;
  }

  operateNotify(id) {
    this.setState({ operateNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;

    if (eventKey === 'edit') {
      this.edit(hoverRowId);
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
    if (_.trim(this.state.group)) {
      query.group = _.trim(this.state.group);
    }
    if (_.trim(this.state.directory)) {
      query.directory = _.trim(this.state.directory);
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

  groupChange(newValue) {
    this.state.group = newValue;
    this.refresh();
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
      imports, 
      del, 
      renew, 
      invalidate, 
      multiDel, 
      multiRenew, 
      multiInvalidate, 
      update, 
      options, 
      query } = this.props;

    const { willSetPrincipalPids, settingPrincipalPids } = this.state;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const users = [];
    const userNum = collection.length;
    for (let i = 0; i < userNum; i++) {
      users.push({
        id: collection[i].id,
        name: (
          <span>
            <span style={ { marginRight: '5px' } }>{ collection[i].first_name || '-' }</span>
            { collection[i].status === 'inactive' &&  <Label>未激活</Label> }
            { collection[i].status === 'invalid' &&  <Label bsStyle='danger'>已禁用</Label> }
          </span>),
        email: collection[i].email || '-',
        phone: collection[i].phone || '-',
        groups: (
          <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
            { _.isEmpty(collection[i].groups) ? '-' : _.map(collection[i].groups, function(v, i) { return (<li key={ i }>{ v }</li>) }) }
          </ul> 
        ),
        directory: collection[i].directory && collection[i].directory !== 'self' && _.find(options.directories, { id: collection[i].directory }) ? _.find(options.directories, { id: collection[i].directory }).name : '-',
        operation: (
          <div>
          { operateShow && hoverRowId === collection[i].id && !itemLoading && (!collection[i].directory || collection[i].directory === 'self') &&
            <DropdownButton pullRight bsStyle='link' style={ { textDecoration: 'blink' ,color: '#000' } } key={ i } title={ node } id={ `dropdown-basic-${i}` } onSelect={ this.operateSelect.bind(this) }>
              { collection[i].status === 'active' && <MenuItem eventKey='edit'>编辑</MenuItem> }
              { collection[i].status === 'active' && <MenuItem eventKey='invalidate'>禁用</MenuItem> }
              { collection[i].status === 'invalid' && <MenuItem eventKey='validate'>启用</MenuItem> }
              <MenuItem eventKey='del'>删除</MenuItem>
              { collection[i].status === 'active' && <MenuItem eventKey='renew'>重置密码</MenuItem> }
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

    const selectRowProp = {
      mode: 'checkbox',
      selected: this.state.selectedIds,
      onSelect: this.onSelect.bind(this),
      onSelectAll: this.onSelectAll.bind(this)
    };

    let multiDelShow = false,  multiValidShow = false, multiInvalidateShow = false;
    _.map(collection, (v) => {
      if (_.indexOf(this.state.selectedIds, v.id) === -1) {
        return;
      }
      if (!v.directory || v.directory == 'self') {
        multiDelShow = true;
        if (v.status == 'invalid') {
          multiValidShow = true;
        } else if (v.status = 'active') {
          multiInvalidateShow = true;
        }
      }
    });

    return (
      <div>
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            <span style={ { float: 'right', width: '18%' } }>
              <Select
                simpleValue
                placeholder='用户目录'
                value={ this.state.directory }
                onChange={ this.directoryChange.bind(this) }
                options={ _.map(options.directories || [], (val) => { return { label: val.name, value: val.id } }) }/>
            </span>
            <span style={ { float: 'right', width: '18%', marginRight: '10px' } }>
              <Select
                simpleValue
                placeholder='所属组'
                value={ this.state.group }
                onChange={ this.groupChange.bind(this) }
                options={ _.map(options.groups || [], (val) => { return { label: val.name, value: val.id } }) }/>
            </span>
            <span style={ { float: 'right', width: '20%', marginRight: '10px' } }>
              <FormControl
                type='text'
                id='uname'
                style={ { height: '36px' } }
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }) } }
                placeholder={ '用户姓名、邮箱查询...' } />
            </span>
            { this.state.selectedIds.length > 0 &&
            <span style={ { float: 'left', marginRight: '10px' } }>
              <DropdownButton title='操作' onSelect={ this.multiOperateSelect.bind(this) }>
                { !multiDelShow && <MenuItem disabled eventKey='null'>无</MenuItem> }
                { multiDelShow && <MenuItem eventKey='del'>删除</MenuItem> }
                { multiValidShow && <MenuItem eventKey='validate'>启用</MenuItem> }
                { multiInvalidateShow && <MenuItem eventKey='invalidate'>禁用</MenuItem> }
                {/*<MenuItem eventKey='renew'>重置密码</MenuItem>*/}
              </DropdownButton>
            </span> }
            <span style={ { float: 'left', marginRight: '20px' } }>
              <Button onClick={ () => { this.setState({ createModalShow: true }); } } disabled={ indexLoading }><i className='fa fa-plus'></i>&nbsp;新建用户</Button>
            </span>
            <span style={ { float: 'left', width: '20%' } }>
              <Button onClick={ () => { this.setState({ importModalShow: true }); } } disabled={ indexLoading }><i className='fa fa-users'></i>&nbsp;批量导入</Button>
            </span>
          </FormGroup>
        </div>
        <div>
          <div className='info-col'>
            <div className='info-icon'><i className='fa fa-info-circle'></i></div>
            <div className='info-content'>
              <span>
                请使用邮箱登录，若在系统配置里配置了“默认登录邮箱域名”可使用邮箱前缀登录。<br/>
                新建或批量导入的用户，默认密码是：actionview。从外部用户目录同步过来的用户，密码和用户目录的保持一致。<br/>
                从外部用户目录同步过来的用户，不能对其做任何操作。
              </span>
            </div>
          </div>
          <BootstrapTable data={ users } bordered={ false } hover options={ opts } trClassName='tr-middle' selectRow={ selectRowProp }>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>姓名</TableHeaderColumn>
            <TableHeaderColumn dataField='email'>邮箱</TableHeaderColumn>
            <TableHeaderColumn dataField='groups'>所属组</TableHeaderColumn>
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
          { this.state.importModalShow && 
            <ImportModal 
              show 
              close={ this.importModalClose } 
              imports={ imports } 
              loading={ loading } 
              index={ index } 
              i18n={ i18n }/> }
          { this.state.operateNotifyShow && 
             <OperateNotify 
               show 
               close={ this.operateNotifyClose } 
               data={ selectedItem } 
               operate={ this.state.operate } 
               del={ del } 
               renew={ renew } 
               invalidate={ invalidate } 
               i18n={ i18n }/> }
          { this.state.multiOperateNotifyShow && 
            <MultiOperateNotify 
              show 
              close={ this.multiOperateNotifyClose } 
              collection={ collection }
              multiDel={ multiDel } 
              multiRenew={ multiRenew } 
              multiInvalidate={ multiInvalidate } 
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
