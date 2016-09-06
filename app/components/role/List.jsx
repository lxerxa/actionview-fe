import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import ApiClient from '../../../shared/api-client';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');

const img = require('../../assets/images/loading.gif');
const allPermissions = require('../share/Permissions.js');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false, willSetPermissionRoleIds: [], settingPermissionRoleIds: [], willSetUserRoleIds: [], settingUserRoleIds: [], permissions: {}, users: {} };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    delNotify: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  show(id) {
    this.setState({ editModalShow: true });
    const { show } = this.props;
    show(id);
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { delNotify } = this.props;
    delNotify(id);
  }

  willSetPermissions(roleId) {
    this.state.willSetPermissionRoleIds.push(roleId);
    this.setState({ willSetPermissionRoleIds: this.state.willSetPermissionRoleIds });
  }

  cancelSetPermissions(roleId) {
    const index = this.state.willSetPermissionRoleIds.indexOf(roleId);
    this.state.willSetPermissionRoleIds.splice(index, 1);
    // clean permission in the state
    this.state.permissions[roleId] = undefined;

    this.setState({ willSetPermissionRoleIds: this.state.willSetPermissionRoleIds, permissions: this.state.permissions });
  }

  async setPermissions(roleId) {
    this.state.settingPermissionRoleIds.push(roleId);
    const index = _.indexOf(this.state.willSetPermissionRoleIds, roleId);
    this.state.willSetPermissionRoleIds.splice(index, 1);
    this.setState({ settingPermissionRoleIds: this.state.settingPermissionRoleIds, willSetPermissionRoleIds: this.state.willSetPermissionRoleIds });

    const { edit } = this.props;
    const ecode = await edit({ permissions: _.map(this.state.permissions[roleId], _.iteratee('value')), id: roleId });
    if (ecode === 0) {
      const index = _.indexOf(this.state.settingPermissionRoleIds, roleId);
      this.state.settingPermissionRoleIds.splice(index, 1);
      this.setState({ settingPermissionRoleIds: this.state.settingPermissionRoleIds });
    }
  }

  willSetUsers(roleId) {
    this.state.willSetUserRoleIds.push(roleId);
    this.setState({ willSetUserRoleIds: this.state.willSetUserRoleIds });
  }

  cancelSetUsers(roleId) {
    const index = _.indexOf(this.state.willSetUserRoleIds, roleId);
    this.state.willSetUserRoleIds.splice(index, 1);
    // clean permission in the state
    this.state.users[roleId] = undefined;

    this.setState({ willSetUserRoleIds: this.state.willSetUserRoleIds });
  }

  async setUsers(roleId) {
    this.state.settingUserRoleIds.push(roleId);
    const index = this.state.willSetUserRoleIds.indexOf(roleId);
    this.state.willSetUserRoleIds.splice(index, 1);
    this.setState({ willSetUserRoleIds: this.state.willSetUserRoleIds, settingUserRoleIds: this.state.settingUserRoleIds });

    const { edit } = this.props;
    const ecode = await edit({ users: _.map(this.state.users[roleId], _.iteratee('id')), id: roleId });
    if (ecode === 0) {
      const index = _.indexOf(this.state.settingUserRoleIds, roleId);
      this.state.settingUserRoleIds.splice(index, 1);
      this.setState({ settingUserRoleIds: this.state.settingUserRoleIds });
    }
  }

  handlePermissionSelectChange(roleId, value) {
    this.state.permissions[roleId] = value;
    this.setState({ permissions: this.state.permissions });
  }

  handleUserSelectChange(roleId, value) {
    this.state.users[roleId] = value;
    this.setState({ users: this.state.users });
  }

  async searchUsers(input) {
    input = input.toLowerCase();
    if (!input)
    {
      return { options: [] };
    }
    const api = new ApiClient;
    const results = await api.request( { url: '/user?s=' + input } );
    return { options: results.data };
  }

  render() {
    const { collection, selectedItem, item, indexLoading, itemLoading, del, edit } = this.props;
    const { willSetPermissionRoleIds, settingPermissionRoleIds, willSetUserRoleIds, settingUserRoleIds } = this.state;

    const types = [];
    const typeNum = collection.length;
    for (let i = 0; i < typeNum; i++) {
      const permissions = _.filter(allPermissions, function(o) { return _.indexOf(collection[i].permissions, o.id) !== -1; });
      types.push({
        id: collection[i].id,
        name:  (
          <div>
            <span className='table-td-title'>{ collection[i].name }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        permissions: (
          <div>
          { _.indexOf(willSetPermissionRoleIds, collection[i].id) === -1 && _.indexOf(settingPermissionRoleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              { 
                permissions.length > 0 ?
                <ul style={ { marginBottom: '0px', padding: '3px', display: 'inline-block' } }>
                { _.map(permissions, function(v){ return <li key={ v.id }>{ v.name }</li> }) }
                </ul>
                :
                '-'
              }
              <Button className='edit-icon' onClick={ this.willSetPermissions.bind(this, collection[i].id) } style={ { display:'inline-block', float: 'right' } }><i className='fa fa-pencil'></i></Button>
            </div> 
            :
            <div>
              <Select multi clearable={ false } searchable={ false } disabled={ _.indexOf(settingPermissionRoleIds, collection[i].id) !== -1 && true } options={ _.map(allPermissions, function(v) { return { value: v.id, label: v.name }; }) } value={ this.state.permissions[collection[i].id] || collection[i].permissions } onChange={ this.handlePermissionSelectChange.bind(this, collection[i].id) } placeholder='请选择相应权限'/>
              <div className={ _.indexOf(settingPermissionRoleIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setPermissions.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetPermissions.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div> 
          }
          <image src={ img } style={ { float: 'right' } } className={ _.indexOf(settingPermissionRoleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ), 
        users: (
          <div>
          { _.indexOf(willSetUserRoleIds, collection[i].id) === -1 && _.indexOf(settingUserRoleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              { 
                collection[i].users.length > 0 ?
                <ul style={ { marginBottom: '0px', padding: '3px', display: 'inline-block' } }>
                { _.map(collection[i].users, function(v){ return <li key={ v.id }>{ v.name }</li> }) }
                </ul>
                :
                '-'
              }
              <Button className='edit-icon' onClick={ this.willSetUsers.bind(this, collection[i].id) } style={ { display:'inline-block', float: 'right' } }><i className='fa fa-pencil'></i></Button>
            </div> 
            :
            <div>
              <Select.Async multi clearable={ false } disabled={ _.indexOf(settingUserRoleIds, collection[i].id) !== -1 && true } options={ [] } value={ this.state.users[collection[i].id] || collection[i].users } onChange={ this.handleUserSelectChange.bind(this, collection[i].id) } valueKey='id' labelKey='name' loadOptions={ this.searchUsers } placeholder='请输入用户'/>
              <div className={ _.indexOf(settingUserRoleIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setUsers.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetUsers.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div> 
          }
          <image src={ img } style={ { float: 'right' } } className={ _.indexOf(settingUserRoleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ), 
        operation: (
          <div>
            <div className={ itemLoading && selectedItem.id === collection[i].id && 'hide' }>
              <Button bsStyle='link' disabled = { itemLoading && true } onClick={ this.show.bind(this, collection[i].id) }>编辑</Button>
              <Button bsStyle='link' disabled = { itemLoading && true } onClick={ this.delNotify.bind(this, collection[i].id) }>删除</Button>
            </div>
            <image src={ img } className={ (itemLoading && selectedItem.id === collection[i].id) ? 'loading' : 'hide' }/>
          </div>
        )
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><image src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    return (
      <div>
        <BootstrapTable data={ types } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>角色</TableHeaderColumn>
          <TableHeaderColumn dataField='permissions'>权限</TableHeaderColumn>
          <TableHeaderColumn dataField='users'>用户</TableHeaderColumn>
          <TableHeaderColumn width='120' dataField='operation'>操作</TableHeaderColumn>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ selectedItem }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
