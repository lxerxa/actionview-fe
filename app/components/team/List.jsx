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
      users: {} };
    this.searchUsers = this.searchUsers.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    setActor: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  onRowMouseOver(rowData) {
    this.setState({ operateShow: true, hoverRowId: rowData.id });
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
    const results = await api.request( { url: '/user?s=' + input } );
    return { options: _.map(results.data, (val) => { val.nameAndEmail = val.name + '(' + val.email + ')'; return val; }) };
  }

  render() {
    const { collection, indexLoading, setActor } = this.props;
    const { willSetUserRoleIds, settingUserRoleIds, hoverRowId } = this.state;

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
          <div>
          { _.indexOf(willSetUserRoleIds, collection[i].id) === -1 && _.indexOf(settingUserRoleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].users && collection[i].users.length > 0 ?
                <span>
                { _.map(collection[i].users, function(v){ return <div style={ { display: 'inline-block', float: 'left', margin: '3px 3px 6px 3px' } }><Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } } key={ v.id }>{ v.name }</Label></div> }) }
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
              <Select.Async multi clearable={ false } disabled={ _.indexOf(settingUserRoleIds, collection[i].id) !== -1 && true } options={ [] } value={ this.state.users[collection[i].id] || collection[i].users } onChange={ this.handleUserSelectChange.bind(this, collection[i].id) } valueKey='id' labelKey='nameAndEmail' loadOptions={ this.searchUsers } placeholder='请输入用户'/>
              <div className={ _.indexOf(settingUserRoleIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setUsers.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetUsers.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div> 
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingUserRoleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
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

    return (
      <div style={ { marginBottom: '30px' } }>
        <BootstrapTable data={ roles } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>角色</TableHeaderColumn>
          <TableHeaderColumn dataField='users'>用户</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
