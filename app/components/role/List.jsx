import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false, willSetPermissionRoleIds: [], settingPermissionRoleIds: [], willSetUserRoleIds: [], settingUserRoleIds: [] };
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
    delNotify: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
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
  }

  cancelSetPermissions(roleId) {
    const index = this.state.willSetPermissionRoleIds.indexOf(roleId);
    this.state.willSetPermissionRoleIds.splice(index, 1);
  }

  async setPermissions(roleId) {
    this.state.settingPermissionRoleIds.push(roleId);
    const index = _.indexOf(this.state.willSetPermissionRoleIds, roleId);
    this.state.willSetPermissionRoleIds.splice(index, 1);
  }

  willSetUsers(roleId) {
    this.state.willSetUserRoleIds.push(roleId);
  }

  cancelSetUsers(roleId) {
    const index = _.indexOf(this.state.willSetUserRoleIds, roleId);
    this.state.willSetUserRoleIds.splice(index, 1);
  }

  async setUsers(roleId) {
    this.state.settingUserRoleIds.push(roleId);
    const index = this.state.willSetUserRoleIds.indexOf(roleId);
    this.state.willSetUserRoleIds.splice(index, 1);
  }

  render() {
    const { collection, selectedItem, item, options, indexLoading, itemLoading, del, edit } = this.props;
    const { willSetPermissionRoleIds, settingPermissionRoleIds, willSetUserRoleIds, settingUserRoleIds } = this.state;

    const types = [];
    const typeNum = collection.length;
    for (let i = 0; i < typeNum; i++) {
      const permissions = _.filter(options.permissions, function(o) { return _.indexOf(collection[i].permissions, o.id) !== -1; });
      types.push({
        id: collection[i].id,
        name: collection[i].name,
        permissions: (
          <div className={ _.indexOf(willSetPermissionRoleIds, collection[i].id) === -1 && _.indexOf(settingPermissionRoleIds, collection[i].id) === -1 ? 'editable-list-field' : 'hide' }>
            <ul style={ { marginBottom: '0px', padding: '3px', display: 'inline-block' } }>
              { _.map(permissions, function(v){ 
                return <li key={ v.id }>{ v.name }</li> }) 
              }
            </ul>
            <Button className='edit-icon' onClick={ () => { this.willSetPermissions.bind(this, collection[i].id) } } style={ { display:'inline-block', float: 'right' } }><i className='fa fa-pencil'></i></Button>
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
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ selectedItem } options={ options }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
