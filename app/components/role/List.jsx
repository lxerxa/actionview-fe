import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');

const img = require('../../assets/images/loading.gif');
const allPermissions = require('../share/Permissions.js');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false, willSetPermissionRoleIds: [], settingPermissionRoleIds: [], willSetUserRoleIds: [], settingUserRoleIds: [], permissions:{} };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
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
    const ecode = await edit(this.state.permissions[roleId]);
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
    this.setState({ willSetUserRoleIds: this.state.willSetUserRoleIds });
  }

  async setUsers(roleId) {
    this.state.settingUserRoleIds.push(roleId);
    const index = this.state.willSetUserRoleIds.indexOf(roleId);
    this.state.willSetUserRoleIds.splice(index, 1);
    this.setState({ willSetUserRoleIds: this.state.willSetUserRoleIds, settingUserRoleIds: this.state.settingUserRoleIds });
  }

  handlePermissionSelectChange(roleId, value) {
    this.state.permissions[roleId] = value;
    this.setState({ permissions: this.state.permissions });
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
        name: collection[i].name,
        permissions: (
          <div>
          { _.indexOf(willSetPermissionRoleIds, collection[i].id) === -1 && _.indexOf(settingPermissionRoleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <ul style={ { marginBottom: '0px', padding: '3px', display: 'inline-block' } }>
              { _.map(permissions, function(v){ 
                return <li key={ v.id }>{ v.name }</li> }) 
              }
              </ul>
              <Button className='edit-icon' onClick={ this.willSetPermissions.bind(this, collection[i].id) } style={ { display:'inline-block', float: 'right' } }><i className='fa fa-pencil'></i></Button>
            </div> 
            :
            <div>
              <Select options={ _.map(allPermissions, function(v) { return { value: v.id, label: v.name }; }) } value={ this.state.permissions[collection[i].id] || collection[i].permissions } onChange={ this.handlePermissionSelectChange.bind(this, collection[i].id) } placeholder='请选择相应权限' multi/>
              <image src={ img } className={ _.indexOf(settingPermissionRoleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
              <div className={ _.indexOf(settingPermissionRoleIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setPermissions.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetPermissions.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div> 
          }
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
        <BootstrapTable data={ types } bordered={ false } hover options={ opts }>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>角色</TableHeaderColumn>
          <TableHeaderColumn dataField='permissions'>权限</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='operation'>操作</TableHeaderColumn>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ selectedItem }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
