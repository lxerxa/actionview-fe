import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import ApiClient from '../../../shared/api-client';
import Person from '../share/Person';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      willSetUserRoleIds: [], 
      settingUserRoleIds: [], 
      users: {}, 
      willSetGroupRoleIds: [],
      settingGroupRoleIds: [],
      groups: {} };
    this.searchUsers = this.searchUsers.bind(this);
    this.searchGroups = this.searchGroups.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    selectedItem: PropTypes.object.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    setActor: PropTypes.func.isRequired,
    setGroupActor: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  onRowMouseOver(rowData) {
    if (rowData.id !== this.state.hoverRowId) {
      this.setState({ operateShow: true, hoverRowId: rowData.id });
    }
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
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
    this.setState({ settingUserRoleIds: this.state.settingUserRoleIds });

    const { setActor, collection } = this.props;
    const ecode = await setActor({ users: _.map(this.state.users[roleId] || _.find(collection, { id: roleId }).users, _.iteratee('id')), id: roleId });
    if (ecode === 0) {
      const willSetIndex = this.state.willSetUserRoleIds.indexOf(roleId);
      this.state.willSetUserRoleIds.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingUserRoleIds, roleId);
      this.state.settingUserRoleIds.splice(settingIndex, 1);

      this.setState({ willSetUserRoleIds: this.state.willSetUserRoleIds, settingUserRoleIds: this.state.settingUserRoleIds });
      notify.show('配置完成。', 'success', 2000);
    }else {
      const settingIndex = _.indexOf(this.state.settingUserRoleIds, roleId);
      this.state.settingUserRoleIds.splice(settingIndex, 1);
      this.setState({ settingUserRoleIds: this.state.settingUserRoleIds });
      notify.show('配置失败。', 'error', 2000);
    }
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
    const results = await api.request( { url: '/user/search?s=' + input } );
    return { options: _.map(results.data, (val) => { val.nameAndEmail = val.name + '(' + val.email + ')'; return val; }) };
  }

  willSetGroups(roleId) {
    this.state.willSetGroupRoleIds.push(roleId);
    this.setState({ willSetGroupRoleIds: this.state.willSetGroupRoleIds });
  }

  cancelSetGroups(roleId) {
    const index = _.indexOf(this.state.willSetGroupRoleIds, roleId);
    this.state.willSetGroupRoleIds.splice(index, 1);
    // clean permission in the state
    this.state.groups[roleId] = undefined;

    this.setState({ willSetGroupRoleIds: this.state.willSetGroupRoleIds });
  }

  async setGroups(roleId) {
    this.state.settingGroupRoleIds.push(roleId);
    this.setState({ settingGroupRoleIds: this.state.settingGroupRoleIds });

    const { setGroupActor, collection } = this.props;
    const ecode = await setGroupActor({ groups: _.map(this.state.groups[roleId] || _.find(collection, { id: roleId }).groups, _.iteratee('id')), id: roleId });
    if (ecode === 0) {
      const willSetIndex = this.state.willSetGroupRoleIds.indexOf(roleId);
      this.state.willSetGroupRoleIds.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingGroupRoleIds, roleId);
      this.state.settingGroupRoleIds.splice(settingIndex, 1);

      this.setState({ willSetGroupRoleIds: this.state.willSetGroupRoleIds, settingGroupRoleIds: this.state.settingGroupRoleIds });
      notify.show('配置完成。', 'success', 2000);
    }else {
      const settingIndex = _.indexOf(this.state.settingGroupRoleIds, roleId);
      this.state.settingGroupRoleIds.splice(settingIndex, 1);
      this.setState({ settingGroupRoleIds: this.state.settingGroupRoleIds });
      notify.show('配置失败。', 'error', 2000);
    }
  }

  handleGroupSelectChange(roleId, value) {
    this.state.groups[roleId] = value;
    this.setState({ groups: this.state.groups });
  }

  async searchGroups(input) {
    input = input.toLowerCase();
    if (!input)
    {
      return { options: [] };
    }
    const api = new ApiClient;
    const results = await api.request( { url: '/group/search?s=' + input } );
    return { options: results.data || [] };
  }

  render() {
    const { options, collection, indexLoading, setActor } = this.props;
    const { willSetUserRoleIds, settingUserRoleIds, willSetGroupRoleIds, settingGroupRoleIds, hoverRowId } = this.state;

    const roles = [];
    const roleNum = collection.length;
    for (let i = 0; i < roleNum; i++) {
      roles.push({
        id: collection[i].id,
        name:  (
          <div>
            <span className='table-td-title'>{ collection[i].name }{ collection[i].category && <span style={ { fontWeight: 'normal' } }> (全局)</span> }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        users: (
          options.permissions && options.permissions.indexOf('manage_project') === -1 ?
          <div>
            <span>
            { _.map(collection[i].users, function(v) { 
              return ( 
                <div style={ { display: 'inline-block', float: 'left', margin: '3px' } }>
                  <Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } } key={ v.id }>
                    { v.name }
                  </Label>
                </div> ) }) }
            </span>
          </div>
          :
          <div>
          { _.indexOf(willSetUserRoleIds, collection[i].id) === -1 && _.indexOf(settingUserRoleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].users && collection[i].users.length > 0 ?
                <span>
                { _.map(collection[i].users, function(v){ 
                  return (
                    <div style={ { display: 'inline-block', float: 'left', margin: '3px 3px 6px 3px' } }>
                      <Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } } key={ v.id }>
                        { v.name }
                      </Label>
                    </div> ) }) }
                </span>
                :
                <span>
                  <div style={ { display: 'inline-block', margin: '3px 3px 6px 3px' } }>-</div>
                </span> }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetUsers.bind(this, collection[i].id) }><i className='fa fa-pencil'></i></span>
              </div>
            </div> 
            :
            <div>
              <Select.Async 
                multi 
                clearable={ false } 
                disabled={ _.indexOf(settingUserRoleIds, collection[i].id) !== -1 && true } 
                options={ [] } 
                value={ this.state.users[collection[i].id] || collection[i].users } 
                onChange={ this.handleUserSelectChange.bind(this, collection[i].id) } 
                valueKey='id' 
                labelKey='nameAndEmail' 
                loadOptions={ this.searchUsers } 
                placeholder='请输入用户'/>
              <div className={ _.indexOf(settingUserRoleIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setUsers.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetUsers.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div> 
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingUserRoleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ), 
        groups: (
          options.permissions && options.permissions.indexOf('manage_project') === -1 ?
          <div>
            <span>
            { _.map(collection[i].groups, function(v){ 
              return (
                <div style={ { display: 'inline-block', float: 'left', margin: '3px' } }>
                  <Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } } key={ v.id }>
                    { v.name }
                  </Label>
                </div> ) }) }
            </span>
          </div>
          :
          <div>
          { _.indexOf(willSetGroupRoleIds, collection[i].id) === -1 && _.indexOf(settingGroupRoleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].groups && collection[i].groups.length > 0 ?
                <span>
                { _.map(collection[i].groups, function(v){ 
                  return (
                    <div style={ { display: 'inline-block', float: 'left', margin: '3px 3px 6px 3px' } }>
                      <Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } } key={ v.id }>
                        { v.name }
                      </Label>
                    </div> ) }) }
                </span>
                :
                <span>
                  <div style={ { display: 'inline-block', margin: '3px 3px 6px 3px' } }>-</div>
                </span> }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetGroups.bind(this, collection[i].id) }><i className='fa fa-pencil'></i></span>
              </div>
            </div> 
            :
            <div>
              <Select.Async 
                multi 
                clearable={ false } 
                disabled={ _.indexOf(settingGroupRoleIds, collection[i].id) !== -1 && true } 
                options={ [] } 
                value={ this.state.groups[collection[i].id] || collection[i].groups } 
                onChange={ this.handleGroupSelectChange.bind(this, collection[i].id) } 
                valueKey='id' 
                labelKey='name' 
                loadOptions={ this.searchGroups } 
                placeholder='请输入用户组'/>
              <div className={ _.indexOf(settingGroupRoleIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setGroups.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetGroups.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div> 
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingGroupRoleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
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
      <div style={ { marginBottom: '30px', marginTop: '15px' } }>
        <BootstrapTable data={ roles } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' width='300'>角色</TableHeaderColumn>
          <TableHeaderColumn dataField='users'>用户</TableHeaderColumn>
          <TableHeaderColumn dataField='groups'>用户组</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
