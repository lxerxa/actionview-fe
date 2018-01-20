import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');

const img = require('../../assets/images/loading.gif');
const allPermissions = require('../share/Permissions.js');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      delNotifyShow: false, 
      resetNotifyShow: false,
      willSetPermissionRoleIds: [], 
      settingPermissionRoleIds: [], 
      permissions: {}, 
      operateShow: false, 
      hoverRowId: '' };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.resetNotifyClose = this.resetNotifyClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    pkey: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    setPermission: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
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

  resetNotifyClose() {
    this.setState({ resetNotifyShow: false });
  }

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  resetNotify(id) {
    this.setState({ resetNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;

    if (eventKey === '1') {
      this.edit(hoverRowId);
    } else if (eventKey === '2') {
      this.delNotify(hoverRowId);
    } else if (eventKey === '3') {
      this.resetNotify(hoverRowId);
    }
  }

  onRowMouseOver(rowData) {
    if (rowData.id !== this.state.hoverRowId) {
      this.setState({ operateShow: true, hoverRowId: rowData.id });
    }
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
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
    this.setState({ settingPermissionRoleIds: this.state.settingPermissionRoleIds });

    const { setPermission, collection } = this.props;
    const ecode = await setPermission({ permissions: _.map(this.state.permissions[roleId] || _.map(_.find(collection, { id: roleId }).permissions || [], (v) => { return { value: v } }), _.iteratee('value')), id: roleId });
    if (ecode === 0) {
      const willSetIndex = _.indexOf(this.state.willSetPermissionRoleIds, roleId);
      this.state.willSetPermissionRoleIds.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingPermissionRoleIds, roleId);
      this.state.settingPermissionRoleIds.splice(settingIndex, 1);

      this.setState({ settingPermissionRoleIds: this.state.settingPermissionRoleIds, willSetPermissionRoleIds: this.state.willSetPermissionRoleIds });
      notify.show('配置完成。', 'success', 2000);
    }else {
      const settingIndex = _.indexOf(this.state.settingPermissionRoleIds, roleId);
      this.state.settingPermissionRoleIds.splice(settingIndex, 1);

      this.setState({ settingPermissionRoleIds: this.state.settingPermissionRoleIds, willSetPermissionRoleIds: this.state.willSetPermissionRoleIds });
      notify.show('配置失败。', 'error', 2000);
    }
  }

  handlePermissionSelectChange(roleId, value) {
    this.state.permissions[roleId] = value;
    this.setState({ permissions: this.state.permissions });
  }

  render() {
    const { i18n, pkey, collection, selectedItem, indexLoading, itemLoading, del, reset, update } = this.props;
    const { willSetPermissionRoleIds, settingPermissionRoleIds } = this.state;
    const { hoverRowId, operateShow } = this.state;

    const somePermissions = _.clone(allPermissions); somePermissions.shift();
    const node = ( <span><i className='fa fa-cog'></i></span> );

    const roles = [];
    const roleNum = collection.length;
    for (let i = 0; i < roleNum; i++) {
      const isGlobal = pkey !== '$_sys_$' && collection[i].project_key === '$_sys_$';
      const permissions = _.filter(somePermissions, function(o) { return _.indexOf(collection[i].permissions || [], o.id) !== -1; });
      roles.push({
        id: collection[i].id,
        name:  (
          <div>
            <span className='table-td-title'>
              { collection[i].name }{ isGlobal && <span style={ { fontWeight: 'normal' } }> (全局)</span> }
            </span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        permissions: (
          <div>
          { _.indexOf(willSetPermissionRoleIds, collection[i].id) === -1 && _.indexOf(settingPermissionRoleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { permissions.length > 0 ?
                <span>
                { _.map(permissions, function(v) { 
                  return (
                    <div style={ { display: 'inline-block', float: 'left', margin: '3px 3px 6px 3px' } }>
                      <Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } } key={ v.id }>{ v.name }</Label>
                   </div> ) }) }
                </span>
                :
                <span>
                  <div style={ { display: 'inline-block', margin: '3px 3px 6px 3px' } }>-</div>
                </span> }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetPermissions.bind(this, collection[i].id) }>
                  <i className='fa fa-pencil'></i>
                </span>
              </div>
            </div> 
            :
            <div>
              <Select 
                multi 
                clearable={ false } 
                searchable={ false } 
                disabled={ _.indexOf(settingPermissionRoleIds, collection[i].id) !== -1 && true } 
                options={ _.map(somePermissions, function(v) { return { value: v.id, label: v.name }; }) } value={ this.state.permissions[collection[i].id] || collection[i].permissions } 
                onChange={ this.handlePermissionSelectChange.bind(this, collection[i].id) } 
                placeholder='请选择相应权限'/>
              <div className={ _.indexOf(settingPermissionRoleIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setPermissions.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetPermissions.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div> 
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingPermissionRoleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ), 
        operation:(
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
              { !isGlobal && <MenuItem eventKey='1'>编辑</MenuItem> }
              { !isGlobal && !collection[i].is_used && <MenuItem eventKey='2'>删除</MenuItem> }
              { isGlobal && <MenuItem eventKey='3'>重置权限</MenuItem> }
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
      <div style={ { marginBottom: '30px' } }>
        <BootstrapTable data={ roles } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' width='300'>角色</TableHeaderColumn>
          <TableHeaderColumn dataField='permissions'>权限集</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal 
            show 
            close={ this.editModalClose } 
            update={ update } 
            data={ selectedItem } 
            i18n={ i18n }/> }
        { this.state.delNotifyShow && 
          <DelNotify 
            show 
            close={ this.delNotifyClose } 
            data={ selectedItem } 
            del={ del }/> }
        { this.state.resetNotifyShow &&
          <DelNotify
            show
            close={ this.resetNotifyClose }
            data={ selectedItem }
            reset={ reset }/> }
      </div>
    );
  }
}
