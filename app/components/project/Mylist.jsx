import React, { PropTypes, Component } from 'react';
//import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FormGroup, FormControl, ButtonGroup, Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import ApiClient from '../../../shared/api-client';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const $ = require('$');
const CreateModal = require('../project/CreateModal2');
const EditModal = require('../project/EditModal');
const CloseNotify = require('../project/CloseNotify');
const loadingImg = require('../../assets/images/loading.gif');

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
      name: '', 
      mode: 'card',
      status: 'active' };

    this.createModalClose = this.createModalClose.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.closeNotifyClose = this.closeNotifyClose.bind(this);
    this.entry = this.entry.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    increaseCollection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    moreLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    more: PropTypes.func.isRequired,
    entry: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    reopen: PropTypes.func.isRequired,
    createIndex: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index({ status: this.state.status });
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

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  entry(key) {
    const { entry } = this.props;
    entry('/project/' + key); 
  }

  componentDidMount() {
    const self = this;
    $('#pname').bind('keypress',function(event){  
      if(event.keyCode == '13') {  
        const { index } = self.props;
        if (_.trim(self.state.name)) {
          index({ status: self.state.status, name: _.trim(self.state.name) });
        } else {
          index({ status: self.state.status });
        }
      }
    });
  }

  closeNotify(id) {
    this.setState({ closeNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  async reopen(id) {
    const { select, reopen } = this.props;
    select(id);
    const ecode = await reopen(id);
    if (ecode === 0) {
      notify.show('项目已打开。', 'success', 2000);    
    } else {
      notify.show('打开失败。', 'error', 2000);    
    }
  }

  async createIndex(id) {
    const { select, createIndex } = this.props;
    select(id);
    const ecode = await createIndex(id);
    if (ecode === 0) {
      notify.show('索引已创建。', 'success', 2000);
    } else {
      notify.show('创建失败。', 'error', 2000);
    }
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    console.log(this.state)
    if (eventKey === '1') {
      this.edit(hoverRowId);
    } else if (eventKey === '2') {
      this.closeNotify(hoverRowId);
    } else if (eventKey === '3') {
      this.reopen(hoverRowId);
    } else if (eventKey === '4') {
      this.createIndex(hoverRowId);
    }
  }

  more() {
    const { more, collection } = this.props;
    more({ status: this.state.status, name: this.state.name, offset_key: collection[collection.length - 1].key });
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

    const { update, collection } = this.props;
    const ecode = await update(pid, { principal_id: (this.state.principal[pid] || _.find(collection, { id: pid }).principal || {}).id });
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
    const results = await api.request( { url: '/user/search?s=' + input } );
    return { options: _.map(results.data, (val) => { val.nameAndEmail = val.name + '(' + val.email + ')'; return val; }) };
  }

  statusChange(newValue) {
    this.setState({ status: newValue }); 

    const { index } = this.props;
    if (_.trim(this.state.name)) {
      index({ status: newValue, name: _.trim(this.state.name) });
    } else {
      index({ status: newValue });
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
      user, 
      collection, 
      increaseCollection, 
      selectedItem, 
      indexLoading, 
      itemLoading, 
      moreLoading, 
      create, 
      stop, 
      update, 
      options={} } = this.props;
    const { willSetPrincipalPids, settingPrincipalPids } = this.state;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const projects = [];
    const projectNum = collection.length;
    for (let i = 0; this.state.mode == 'list' && i < projectNum; i++) {
      projects.push({
        id: collection[i].id,
        no: i + 1,
        name: ( 
          <div> 
            <a href='#' onClick={ (e) => { e.preventDefault(); this.entry(collection[i].key); } }>{ collection[i].name }</a>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div> ),
        key: collection[i].key,
        principal: (
          collection[i].principal.id !== user.id ?
          <div>
            <span>{ collection[i].principal.name }</span>
          </div>
          : 
          <div>
          { _.indexOf(willSetPrincipalPids, collection[i].id) === -1 && _.indexOf(settingPrincipalPids, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].principal ?
                <span>
                  <div style={ { display: 'inline-block', float: 'left', margin: '4px' } }> 
                    { collection[i].principal.name || '-' }
                  </div>
                </span>
                :
                '-' }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetPrincipal.bind(this, collection[i].id) }>
                  <i className='fa fa-pencil'></i>
                </span>
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
                <Button className='edit-ok-button' onClick={ this.setPrincipal.bind(this, collection[i].id) }>
                  <i className='fa fa-check'></i>
                </Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetPrincipal.bind(this, collection[i].id) }>
                  <i className='fa fa-close'></i>
                </Button>
              </div>
            </div>
          }
          <img src={ loadingImg } style={ { float: 'right' } } className={ _.indexOf(settingPrincipalPids, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ),
        status: collection[i].status == 'active' ? <Label bsStyle='success'>活动中</Label> : <Label>已关闭</Label>,
        operation: (
          collection[i].principal.id === user.id &&
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
              { collection[i].status == 'active' && <MenuItem eventKey='1'>编辑</MenuItem> }
              { collection[i].status == 'active' ? <MenuItem eventKey='2'>关闭</MenuItem> : <MenuItem eventKey='3'>重新打开</MenuItem> }
              { collection[i].status == 'active' && <MenuItem eventKey='4'>重建索引</MenuItem> }
            </DropdownButton> }
            <img src={ loadingImg } className={ (itemLoading && selectedItem.id === collection[i].id) ? 'loading' : 'hide' }/>
          </div>
        )
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ loadingImg } className='loading'/></div> );
    } else {
      opts.noDataText = ( <div>暂无数据显示<br/><br/>您可创建项目 或 联系其他项目管理员将您添加到项目成员中</div> ); 
    } 

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);

    return (
      <div>
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            { options.allow_create_project === 1 && 
            <span style={ { float: 'left', width: '20%' } }>
              <Button bsStyle='success' onClick={ () => { this.setState({ createModalShow: true }); } } disabled={ indexLoading }><i className='fa fa-plus'></i>&nbsp;新建项目</Button>
            </span> }
            <ButtonGroup style={ { float: 'right', marginLeft: '10px' } }>
              <Button title='卡片模式' style={ { backgroundColor: this.state.mode == 'card' && '#eee' } } onClick={ ()=>{ this.setState({ mode: 'card' }) } }><i className='fa fa-th-large fa-lg'></i></Button>
              <Button title='列表模式' style={ { backgroundColor: this.state.mode == 'list' && '#eee' } } onClick={ ()=>{ this.setState({ mode: 'list' }) } }><i className='fa fa-bars fa-lg'></i></Button>
            </ButtonGroup>
            <span style={ { float: 'right', width: '90px' } }>
              <Select
                simpleValue
                clearable={ false }
                placeholder='项目状态'
                value={ this.state.status }
                onChange={ this.statusChange.bind(this) }
                options={ [{ value: 'all', label: '全部' }, { value: 'active', label: '活动中' }, { value: 'closed', label: '已关闭' }] }/>
            </span>
            <span style={ { float: 'right', width: '22%', marginRight: '10px' } }>
              <FormControl
                type='text'
                id='pname'
                style={ { height: '36px' } }
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }) } }
                placeholder={ '名称、键值查询...' } />
            </span>
          </FormGroup>
        </div>
        <div className='clearfix' style={ { marginLeft: this.state.mode === 'card' ? '-15px' : 0 } }>
          { this.state.mode === 'list' &&
          <BootstrapTable data={ projects } bordered={ false } hover options={ opts } trClassName='tr-middle'>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn width='50' dataField='no'>NO</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
            <TableHeaderColumn dataField='key' width='170'>键值</TableHeaderColumn>
            <TableHeaderColumn dataField='principal' width='320'>责任人</TableHeaderColumn>
            <TableHeaderColumn dataField='status' width='80'>状态</TableHeaderColumn>
            <TableHeaderColumn width='60' dataField='operation'/>
            </BootstrapTable> }
          { this.state.mode === 'card' && indexLoading &&
            <div style={ { marginTop: '50px', marginBottom: '50px', textAlign: 'center' } }>
              <img src={ loadingImg } className='loading'/>
            </div> }
          { this.state.mode === 'card' && !indexLoading && collection.length <= 0 &&
            <div style={ { marginTop: '50px', marginBottom: '50px', textAlign: 'center' } }>
              暂无数据显示<br/><br/>
              您可创建项目 或 联系其他项目管理员将您添加到项目成员中
            </div> }
          { this.state.mode === 'card' && !indexLoading && collection.length > 0 &&
          collection.map((model) => {
            return (
              <div className='col-lg-3 col-md-4 col-sm-6 col-xs-12 cardContainer'>
                <div className='card'>
                  { model.status !== 'active' &&
                  <div className='status'><Label>已关闭</Label></div> }
                  <div className='content'>
                    <span className='title'>
                      { model.status == 'active'
                      ? <p className='name'><a href='#' onClick={ (e) => { e.preventDefault(); this.entry(model.key); } }>{ model.name }</a></p>
                      : <p className='name'>{ model.name }</p> }
                      <p className='key'>{ model.key }</p>
                    </span>
                  </div>
                  <div className='leader'>
                    <span>负责人: { model.principal.name }</span>
                  </div>
                  { model.principal.id === user.id && 
                  <div className='btns'>
                    { model.status == 'active' && 
                      <span style={ { marginLeft: '3px' } } title='编辑' onClick={ this.edit.bind(this, model.id) } className='comments-button'><i className='fa fa-pencil' aria-hidden='true'></i></span> }
                    { model.status == 'active' && 
                      <span style={ { marginLeft: '3px' } } title='重建索引' onClick={ this.createIndex.bind(this, model.id) } className='comments-button'><i className='fa fa-repeat' aria-hidden='true'></i></span> }
                    { model.status === 'active' 
                    ? <span style={ { marginLeft: '3px' } } title='关闭' onClick={ this.closeNotify.bind(this, model.id) } className='comments-button'><i className='fa fa-close' aria-hidden='true'></i></span>
                    : <span style={ { marginLeft: '3px' } } title='重新打开' onClick={ this.reopen.bind(this, model.id) } className='comments-button'><i className='fa fa-check' aria-hidden='true'></i></span> }
                  </div> }
                </div>
              </div>
            )
          }) }
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
          { this.state.closeNotifyShow && 
            <CloseNotify 
              show 
              close={ this.closeNotifyClose } 
              data={ selectedItem } 
              stop={ stop }/> }
        </div>
        { increaseCollection.length > 0 && increaseCollection.length % (options.limit || 4) === 0 && 
        <ButtonGroup vertical block style={ { marginTop: '15px' } }>
          <Button onClick={ this.more.bind(this) }>{ <div><img src={ loadingImg } className={ moreLoading ? 'loading' : 'hide' }/><span>{ moreLoading ? '' : '更多...' }</span></div> }</Button>
        </ButtonGroup> }
      </div>
    );
  }
}
