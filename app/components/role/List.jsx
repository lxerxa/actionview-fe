import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { Permissions } from '../share/Constants';

const ViewUsedModal = require('./ViewUsedModal');
const EditModal = require('./EditModal');
const ConfigModal = require('./ConfigModal');
const DelNotify = require('./DelNotify');

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      delNotifyShow: false, 
      viewUsedShow: false,
      resetNotifyShow: false,
      operateShow: false, 
      hoverRowId: '' };
    this.editModalClose = this.editModalClose.bind(this);
    this.configModalClose = this.configModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.resetNotifyClose = this.resetNotifyClose.bind(this);
    this.viewUsedClose = this.viewUsedClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    pkey: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    setPermission: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    viewUsed: PropTypes.func.isRequired,
    usedProjects: PropTypes.array.isRequired,
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  configModalClose() {
    this.setState({ configModalShow: false });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  resetNotifyClose() {
    this.setState({ resetNotifyShow: false });
  }

  viewUsedClose() {
    this.setState({ viewUsedShow: false });
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { select } = this.props;
    select(hoverRowId);

    if (eventKey === '1') {
      this.setState({ editModalShow: true });
    } else if (eventKey === '2') {
      this.setState({ delNotifyShow: true });
    } else if (eventKey === '3') {
      this.setState({ resetNotifyShow: true });
    } else if (eventKey === '4') {
      this.setState({ viewUsedShow: true });
    } else if (eventKey === '5') {
      this.setState({ configModalShow: true });
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

  render() {
    const { 
      i18n, 
      pkey, 
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      del, 
      reset, 
      update, 
      setPermission,
      viewUsed, 
      usedProjects } = this.props;

    const { willSetPermissionRoleIds, settingPermissionRoleIds } = this.state;
    const { hoverRowId, operateShow } = this.state;

    const somePermissions = _.clone(Permissions); 
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
              <MenuItem eventKey='5'>配置</MenuItem>
              { pkey === '$_sys_$' && <MenuItem eventKey='4'>查看项目应用</MenuItem> }
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
        { this.state.viewUsedShow &&
          <ViewUsedModal
            show
            close={ this.viewUsedClose }
            view={ viewUsed }
            loading={ loading }
            data={ selectedItem }
            projects={ usedProjects }
            i18n={ i18n }/> }
        { this.state.resetNotifyShow &&
          <DelNotify
            show
            close={ this.resetNotifyClose }
            data={ selectedItem }
            reset={ reset }/> }
        { this.state.configModalShow &&
          <ConfigModal
            show
            data={ selectedItem }
            close={ this.configModalClose }
            setPermission={ setPermission }
            i18n={ i18n }/> }
      </div>
    );
  }
}
