import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FormGroup, FormControl, ButtonGroup, Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import ApiClient from '../../../shared/api-client';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const $ = require('$');
const CreateModal = require('./CreateModal');
const EditModal = require('./EditModal');
const CloseNotify = require('./CloseNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      editModalShow: false, 
      closeNotifyShow: false, 
      operateShow: false, 
      hoverRowId: '', 
      willSetPrincipalPids: [], 
      settingPrincipalPids: [],
      principal: {},
      limit: 3, 
      name: '', 
      status: 'active' };

    this.createModalClose = this.createModalClose.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.closeNotifyClose = this.closeNotifyClose.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    increaseCollection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    moreLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    more: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    reopen: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index({ status: this.state.status, limit: this.state.limit });
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  closeNotifyClose() {
    this.setState({ closeNotifyShow: false });
  }

  show(id) {
    this.setState({ editModalShow: true });
    const { show } = this.props;
    show(id);
  }

  componentDidMount() {
    const self = this;
    $('#pname').bind('keypress',function(event){  
      if(event.keyCode == '13') {  
        const { index } = self.props;
        if (_.trim(self.state.name)) {
          index({ status: self.state.status, name: _.trim(self.state.name), limit: self.state.limit });
        } else {
          index({ status: self.state.status, limit: self.state.limit });
        }
      }
    });
  }

  closeNotify(id) {
    this.setState({ closeNotifyShow: true });
    const { show } = this.props;
    show(id);
  }

  async reopen(id) {
    const { show, reopen } = this.props;
    show(id);
    const ecode = await reopen(id);
    if (ecode === 0) {
      notify.show('项目已打开。', 'success', 2000);    
    } else {
      notify.show('打开失败。', 'error', 2000);    
    }
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;

    if (eventKey === '1') {
      this.show(hoverRowId);
    } else if (eventKey === '2') {
      this.closeNotify(hoverRowId);
    } else if (eventKey === '3') {
      this.reopen(hoverRowId);
    }
  }

  more() {
    const { more, collection } = this.props;
    more({ status: this.state.status, name: this.state.name, offset_key: collection[collection.length - 1].key, limit: this.state.limit });
  }

  willSetPrincipal(pid) {
    this.state.willSetPrincipalPids.push(pid);
    this.setState({ willSetPrincipalPids: this.state.willSetPrincipalPids });
  }

  cancelSetPrincipal(pid) {
    const index = _.indexOf(this.state.willSetPrincipalPids, pid);
    this.state.willSetPrincipalPids.splice(index, 1);
    // clean permission in the state
    this.state.principal[pid] = undefined;

    this.setState({ willSetPrincipalPids: this.state.willSetPrincipalPids });
  }

  async setPrincipal(pid) {
    this.state.settingPrincipalPids.push(pid);
    this.setState({ settingPrincipalPids: this.state.settingPrincipalPids });

    const { edit, collection } = this.props;
    const ecode = await edit(pid, { principal: (this.state.principal[pid] || _.find(collection, { id: pid }).principal || {}).id });
    if (ecode === 0) {
      const willSetIndex = this.state.willSetPrincipalPids.indexOf(pid);
      this.state.willSetPrincipalPids.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingPrincipalPids, pid);
      this.state.settingPrincipalPids.splice(settingIndex, 1);

      this.setState({ willSetPrincipalPids: this.state.willSetPrincipalPids, settingPrincipalPids: this.state.settingPrincipalPids });
      notify.show('设置完成。', 'success', 2000);
    }else {
      const settingIndex = _.indexOf(this.state.settingPrincipalPids, pid);
      this.state.settingPrincipalPids.splice(settingIndex, 1);
      this.setState({ settingPrincipalPids: this.state.settingPrincipalPids });
      notify.show('设置失败。', 'error', 2000);
    }
  }

  handlePrincipalSelectChange(pid, value) {
    this.state.principal[pid] = value;
    this.setState({ principal: this.state.principal });
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

  statusChange(newValue) {
    this.setState({ status: newValue }); 

    const { index } = this.props;
    if (_.trim(this.state.name)) {
      index({ status: newValue, name: _.trim(this.state.name), limit: this.state.limit });
    } else {
      index({ status: newValue, limit: this.state.limit });
    }
  }

  onRowMouseOver(rowData) {
    this.setState({ operateShow: true, hoverRowId: rowData.id });
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  render() {
    const { collection, increaseCollection, selectedItem, indexLoading, itemLoading, moreLoading, create, stop, edit } = this.props;
    const { willSetPrincipalPids, settingPrincipalPids } = this.state;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    alert(increaseCollection.length);

    const states = [];
    const stateNum = collection.length;
    for (let i = 0; i < stateNum; i++) {
      states.push({
        id: collection[i].id,
        name: ( 
          <div> 
            <span className='table-td-title'>{ collection[i].name }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div> ),
        key: collection[i].key,
        principal: (
          <div>
          { _.indexOf(willSetPrincipalPids, collection[i].id) === -1 && _.indexOf(settingPrincipalPids, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].principal ?
                <span>
                  <div style={ { display: 'inline-block', float: 'left', margin: '3px' } }> 
                    { collection[i].principal.name || '-' }
                  </div>
                </span>
                :
                '-' }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetPrincipal.bind(this, collection[i].id) }><i className='fa fa-pencil'></i></span>
              </div>
            </div>
            :
            <div>
              <Select.Async 
                clearable={ false } 
                disabled={ _.indexOf(settingPrincipalPids, collection[i].id) !== -1 && true } 
                options={ [] } 
                value={ this.state.principal[collection[i].id] || collection[i].principal } 
                onChange={ this.handlePrincipalSelectChange.bind(this, collection[i].id) } 
                valueKey='id' 
                labelKey='nameAndEmail' 
                loadOptions={ this.searchUsers } 
                placeholder='请输入用户'/>
              <div className={ _.indexOf(settingPrincipalPids, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setPrincipal.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetPrincipal.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div>
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingPrincipalPids, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ),

        status: collection[i].status == 'active' ? '活动中' : '已关闭',
        operation: (
          <div>
          { operateShow && hoverRowId === collection[i].id && !itemLoading &&
            <DropdownButton pullRight bsStyle='link' style={ { textDecoration: 'blink' ,color: '#000' } } key={ i } title={ node } id={ `dropdown-basic-${i}` } onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='1'>编辑</MenuItem>
              { collection[i].status == 'active' ? <MenuItem eventKey='2'>关闭</MenuItem> : <MenuItem eventKey='3'>重新打开</MenuItem> }
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
    opts.onMouseLeave = this.onMouseLeave.bind(this);

    return (
      <div>
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            <span style={ { float: 'left', width: '27%' } }>
              <FormControl
                type='text'
                id='pname'
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }) } }
                placeholder={ '项目名称查询...' } />
            </span>
            <span style={ { float: 'left', width: '90px', marginLeft: '10px' } }>
              <Select
                simpleValue
                clearable={ false }
                placeholder='项目状态'
                value={ this.state.status }
                onChange={ this.statusChange.bind(this) }
                options={ [{ value: 'all', label: '全部' }, { value: 'active', label: '活动中' }, { value: 'closed', label: '已关闭' }] }/>
            </span>
            <span style={ { float: 'left', width: '20%', marginLeft: '20px' } }>
              <Button bsStyle='success' onClick={ () => { this.setState({ createModalShow: true }); } } disabled={ indexLoading }><i className='fa fa-plus'></i>&nbsp;新建项目</Button>
            </span>
          </FormGroup>
        </div>
        <div>
          <BootstrapTable data={ states } bordered={ false } hover options={ opts } trClassName='tr-middle'>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
            <TableHeaderColumn dataField='key' width='170'>键值</TableHeaderColumn>
            <TableHeaderColumn dataField='principal' width='320'>责任人</TableHeaderColumn>
            <TableHeaderColumn dataField='status' width='80'>状态</TableHeaderColumn>
            <TableHeaderColumn width='60' dataField='operation'/>
          </BootstrapTable>
          { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ selectedItem }/> }
          { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create }/> }
          { this.state.closeNotifyShow && <CloseNotify show close={ this.closeNotifyClose } data={ selectedItem } stop={ stop }/> }
        </div>
        { increaseCollection.length > 0 && increaseCollection.length % this.state.limit === 0 && 
        <ButtonGroup vertical block>
          <Button onClick={ this.more.bind(this) }>{ <div><img src={ img } className={ moreLoading ? 'loading' : 'hide' }/><span>{ moreLoading ? '' : '更多...' }</span></div> }</Button>
        </ButtonGroup> }
      </div>
    );
  }
}
