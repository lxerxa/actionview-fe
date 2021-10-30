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
const ViewUsersModal = require('./ViewUsersModal');

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      editModalShow: false, 
      viewUsersModalShow: false, 
      usersConfigModalShow: false, 
      operateNotifyShow: false, 
      operateShow: false, 
      hoverRowId: '', 
      name: '',
      scale: null 
    }; 

    this.createModalClose = this.createModalClose.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.viewUsersModalClose = this.viewUsersModalClose.bind(this);
    this.usersConfigModalClose = this.usersConfigModalClose.bind(this);
    this.operateNotifyClose = this.operateNotifyClose.bind(this);
    this.viewUsers = this.viewUsers.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object,
    user: PropTypes.object.isRequired,
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
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, query={} } = this.props;
    if (query.name) this.state.name = query.name;
    if (query.scale) this.state.scale = query.scale;

    const newQuery = {};
    if (this.state.name) {
      newQuery.name = this.state.name;
    }
    if (this.state.scale) {
      newQuery.scale = this.state.scale;
    }
    index(newQuery);
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  viewUsersModalClose() {
    this.setState({ viewUsersModalShow: false });
  }

  usersConfigModalClose() {
    this.setState({ usersConfigModalShow: false });
  }

  operateNotifyClose() {
    this.setState({ operateNotifyShow: false });
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
    this.state.scale = newQuery.scale || null;
  }

  scaleChange(newValue) {
    this.state.scale = newValue;
    this.refresh();
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { select, entry } = this.props;
    select(hoverRowId);

    if (eventKey === 'edit') {
      this.setState({ editModalShow: true });
    } else if (eventKey === 'config') {
      this.setState({ usersConfigModalShow: true });
    } else if (eventKey === 'del') {
      this.setState({ operateNotifyShow: true, operate: eventKey });
    }
  }

  viewUsers() {
    const { hoverRowId } = this.state;
    const { select } = this.props;
    select(hoverRowId);
    this.setState({ viewUsersModalShow: true });
  }

  refresh() {
    const { refresh } = this.props;
    const query = {};
    if (_.trim(this.state.name)) {
      query.name = _.trim(this.state.name);
    }
    if (this.state.scale) {
      query.scale = this.state.scale;
    }
    refresh(query, 'my');
  }

  onRowMouseOver(rowData) {
    if (rowData.id !== this.state.hoverRowId) {
      this.setState({ operateShow: true, hoverRowId: rowData.id });
    }
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  render() {
    const { 
      i18n, 
      user,
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      index, 
      refresh, 
      create, 
      del, 
      update, 
      options, 
      query 
    } = this.props;

    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const scopeOptions = { '1': '公开', '2': '私有', '3': '成员可见' };
    const scaleOptions = [ { value: 'myprincipal', label: '我负责的' }, { value: 'myjoin', label: '我参与的' } ];

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
        count: collection[i].users && collection[i].users.length > 0 ? <a href='#' onClick={ (e) => { e.preventDefault(); this.viewUsers(); } }>{ collection[i].users.length }</a> : 0,
        principal: collection[i].principal && collection[i].principal.name || '系统管理员', 
        public_scope: collection[i].public_scope && scopeOptions[collection[i].public_scope] || '公开', 
        operation: (
          <div>
          { operateShow && hoverRowId === collection[i].id && !itemLoading && collection[i].principal && collection[i].principal.id == user.id &&
            <DropdownButton pullRight bsStyle='link' style={ { textDecoration: 'blink' ,color: '#000' } } key={ i } title={ node } onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='config'>成员配置</MenuItem>
              <MenuItem eventKey='edit'>编辑</MenuItem>
              <MenuItem eventKey='del'>删除</MenuItem>
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

    return (
      <div>
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            <span style={ { float: 'right', width: '130px' } }>
              <Select
                simpleValue
                placeholder='全部'
                value={ this.state.scale }
                onChange={ this.scaleChange.bind(this) }
                options={ scaleOptions }/>
            </span>
            <span style={ { float: 'right', width: '20%', marginRight: '10px' } }>
              <FormControl
                type='text'
                id='gname'
                style={ { height: '36px' } }
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }) } }
                placeholder={ '组名查询...' } />
            </span>
            <span style={ { float: 'left', marginRight: '20px' } }>
              <Button onClick={ () => { this.setState({ createModalShow: true }); } } disabled={ indexLoading }><i className='fa fa-plus'></i>&nbsp;新建组</Button>
            </span>
          </FormGroup>
        </div>
        <div>
          <div className='info-col'>
            <div className='info-icon'><i className='fa fa-info-circle'></i></div>
            <div className='info-content'>
              公开范围：公开 - 所有人可对其授权；私有 - 仅负责人可对其授权；成员可见 - 仅负责人和组成员可对其授权。 
            </div>
          </div>
          <BootstrapTable data={ groups } bordered={ false } hover options={ opts } trClassName='tr-middle'>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>组名</TableHeaderColumn>
            <TableHeaderColumn dataField='principal'>负责人</TableHeaderColumn>
            <TableHeaderColumn dataField='count'>成员个数</TableHeaderColumn>
            <TableHeaderColumn dataField='public_scope'>公开范围</TableHeaderColumn>
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
              loading={ loading }
              i18n={ i18n }/> }
          { this.state.operateNotifyShow && 
            <OperateNotify 
              show 
              close={ this.operateNotifyClose } 
              data={ selectedItem } 
              operate={ this.state.operate } 
              del={ del } 
              i18n={ i18n }/> }
          { this.state.viewUsersModalShow &&
            <ViewUsersModal
              show
              close={ this.viewUsersModalClose.bind(this) }
              users={ selectedItem.users || [] } /> }
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
