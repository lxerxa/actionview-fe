import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem, Label } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const EditModal = require('./EditModal');
const BackTop = require('../share/BackTop');
const DelNotify = require('./DelNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      delNotifyShow: false, 
      operateShow: false, 
      hoverRowId: '', 
      willSetPrincipalModuleIds: [], 
      settingPrincipalModuleIds: [], 
      willSetDefalutAssigneeModuleIds: [], 
      settingDefaultAssigneeModuleIds: [] , 
      principal: {}, 
      defaultAssignee: {} 
    };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    gotoIssueList: PropTypes.func.isRequired,
    gotoGantt: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
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

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { gotoIssueList, gotoGantt } = this.props;

    if (eventKey === '1') {
      this.edit(hoverRowId);
    } else if (eventKey === '2') {
      this.delNotify(hoverRowId);
    } else if (eventKey === '3') {
      gotoIssueList(hoverRowId);
    } else if (eventKey === '4') {
      gotoGantt(hoverRowId);
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

  willSetPrincipal(moduleId, ind) {
    const { collection } = this.props;
    if (collection[ind].principal && collection[ind].principal.id) {
      this.state.principal[collection[ind].id] = collection[ind].principal.id;
    }
    this.state.willSetPrincipalModuleIds.push(moduleId);
    this.setState({});
  }

  cancelSetPrincipal(moduleId) {
    const index = this.state.willSetPrincipalModuleIds.indexOf(moduleId);
    this.state.willSetPrincipalModuleIds.splice(index, 1);
    // clean permission in the state
    this.state.principal[moduleId] = undefined;

    this.setState({});
  }

  async setPrincipal(moduleId) {
    this.state.settingPrincipalModuleIds.push(moduleId);
    this.setState({});

    const { update } = this.props;
    const ecode = await update({ principal: this.state.principal[moduleId] || '', id: moduleId });
    if (ecode === 0) {
      const willSetIndex = _.indexOf(this.state.willSetPrincipalModuleIds, moduleId);
      this.state.willSetPrincipalModuleIds.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingPrincipalModuleIds, moduleId);
      this.state.settingPrincipalModuleIds.splice(settingIndex, 1);

      this.setState({});
      notify.show('设置完成。', 'success', 2000);
    } else {
      const settingIndex = _.indexOf(this.state.settingPrincipalModuleIds, moduleId);
      this.state.settingPrincipalModuleIds.splice(settingIndex, 1);

      this.setState({});
      notify.show('设置失败。', 'error', 2000);
    }
  }

  handlePrincipalSelectChange(moduleId, value) {
    this.state.principal[moduleId] = value;
    this.setState({});
  }

  willSetDefaultAssignee(moduleId, ind) {
    const { collection } = this.props;
    if (collection[ind].defaultAssignee) {
      this.state.defaultAssignee[collection[ind].id] = collection[ind].defaultAssignee;
    }
    this.state.willSetDefalutAssigneeModuleIds.push(moduleId);
    this.setState({});
  }

  cancelSetDefaultAssignee(moduleId) {
    const index = this.state.willSetDefalutAssigneeModuleIds.indexOf(moduleId);
    this.state.willSetDefalutAssigneeModuleIds.splice(index, 1);
    // clean permission in the state
    this.state.defaultAssignee[moduleId] = undefined;

    this.setState({});
  }

  async setDefaultAssignee(moduleId) {
    this.state.settingDefaultAssigneeModuleIds.push(moduleId);
    this.setState({});

    const { update } = this.props;
    const ecode = await update({ defaultAssignee: this.state.defaultAssignee[moduleId] || '', id: moduleId });
    if (ecode === 0) {
      const willSetIndex = _.indexOf(this.state.willSetDefalutAssigneeModuleIds, moduleId);
      this.state.willSetDefalutAssigneeModuleIds.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingDefaultAssigneeModuleIds, moduleId);
      this.state.settingDefaultAssigneeModuleIds.splice(settingIndex, 1);

      this.setState({});
      notify.show('设置完成。', 'success', 2000);
    } else {
      const settingIndex = _.indexOf(this.state.settingDefaultAssigneeModuleIds, moduleId);
      this.state.settingDefaultAssigneeModuleIds.splice(settingIndex, 1);

      this.setState({});
      notify.show('设置失败。', 'error', 2000);
    }
  }

  handleDefaultAssigneeSelectChange(moduleId, value) {
    this.state.defaultAssignee[moduleId] = value;
    this.setState({});
  }

  render() {
    const { 
      i18n, 
      collection, 
      selectedItem, 
      options, 
      indexLoading, 
      itemLoading, 
      loading, 
      del, 
      update 
    } = this.props;

    const { 
      hoverRowId, 
      operateShow, 
      willSetPrincipalModuleIds, 
      settingPrincipalModuleIds, 
      willSetDefalutAssigneeModuleIds, 
      settingDefaultAssigneeModuleIds 
    } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const { users = [] } = options;
    const userOptions = _.map(users, function(val) {
      return { label: val.name + '(' + val.email + ')', value: val.id };
    });

    const defaultAssigneeOptions = [ 
      { value: 'projectPrincipal', label: '项目负责人' }, 
      { value: 'modulePrincipal', label: '模块负责人' }, 
      { value: 'none', label: '未分配' } 
    ];

    const modules = [];
    const moduleNum = collection.length;
    for (let i = 0; i < moduleNum; i++) {
      modules.push({
        id: collection[i].id,
        name: ( 
          <div>
            <span className='table-td-title'>{ collection[i].name }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        principal: (
          options.permissions && options.permissions.indexOf('manage_project') === -1 ?
          <div>
            { collection[i].principal && collection[i].principal.name ? 
            <div style={ { display: 'inline-block', float: 'left', margin: '3px 3px 6px 3px' } }>
              <Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } }>
                { collection[i].principal.name }
              </Label>
            </div>
            :
            <span>
              <div style={ { display: 'inline-block', margin: '3px 3px 6px 3px' } }>-</div>
            </span> }
          </div> 
          :
          <div>
          { _.indexOf(willSetPrincipalModuleIds, collection[i].id) === -1 && _.indexOf(settingPrincipalModuleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
                { collection[i].principal && collection[i].principal.name ? 
                <div style={ { display: 'inline-block', float: 'left', margin: '3px 3px 6px 3px' } }>
                  <Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } }>
                    { collection[i].principal.name }
                  </Label>
                </div>
                :
                <span>
                  <div style={ { display: 'inline-block', margin: '3px 3px 6px 3px' } }>-</div>
                </span> }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetPrincipal.bind(this, collection[i].id, i) }><i className='fa fa-pencil'></i></span>
              </div>
            </div>
            :
            <div>
              <Select 
                simpleValue 
                clearable={ true } 
                disabled={ _.indexOf(settingPrincipalModuleIds, collection[i].id) !== -1 && true } 
                options={ userOptions } 
                value={ _.isUndefined(this.state.principal[collection[i].id]) ? collection[i].principal.id : this.state.principal[collection[i].id] } 
                onChange={ this.handlePrincipalSelectChange.bind(this, collection[i].id) } 
                placeholder='请选择用户'/>
              <div className={ _.indexOf(settingPrincipalModuleIds, collection[i].id) !== -1 ? 'hide' : 'edit-button-group' }>
                <Button 
                  className='edit-ok-button' 
                  onClick={ this.setPrincipal.bind(this, collection[i].id) } 
                  disabled={ collection[i].principal.id == this.state.principal[collection[i].id] }>
                  <i className='fa fa-check'></i>
                </Button>
                <Button 
                  className='edit-cancel-button' 
                  onClick={ this.cancelSetPrincipal.bind(this, collection[i].id) }>
                  <i className='fa fa-close'></i>
                </Button>
              </div>
            </div>
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingPrincipalModuleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ),
        defaultAssignee: (
          options.permissions && options.permissions.indexOf('manage_project') === -1 ?
          <div>
            <span>
            { _.find(defaultAssigneeOptions, { value: collection[i].defaultAssignee }) ? _.find(defaultAssigneeOptions, { value: collection[i].defaultAssignee }).label : '-' }
            </span>
          </div> 
          :
          <div>
          { _.indexOf(willSetDefalutAssigneeModuleIds, collection[i].id) === -1 && _.indexOf(settingDefaultAssigneeModuleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].defaultAssignee ?
                <span>
                  <div style={ { display: 'inline-block', float: 'left', margin: '5px 3px' } }> 
                    { _.find(defaultAssigneeOptions, { value: collection[i].defaultAssignee }) ? _.find(defaultAssigneeOptions, { value: collection[i].defaultAssignee }).label : '-' } 
                  </div>
                </span> 
                :
                <span>
                  <div style={ { display: 'inline-block', margin: '5px 3px' } }>-</div>
                </span> }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetDefaultAssignee.bind(this, collection[i].id, i) }><i className='fa fa-pencil'></i></span>
              </div>
            </div>
            :
            <div>
              <Select 
                simpleValue 
                clearable={ false } 
                searchable={ false } 
                disabled={ _.indexOf(settingDefaultAssigneeModuleIds, collection[i].id) !== -1 && true } 
                options={ defaultAssigneeOptions } 
                value={ this.state.defaultAssignee[collection[i].id] || collection[i].defaultAssignee } 
                onChange={ this.handleDefaultAssigneeSelectChange.bind(this, collection[i].id) } 
                placeholder='默认负责人(项目负责人)'/>
              <div className={ _.indexOf(settingDefaultAssigneeModuleIds, collection[i].id) !== -1 ? 'hide' : 'edit-button-group' }>
                <Button 
                  className='edit-ok-button' 
                  disabled={ collection[i].defaultAssignee == this.state.defaultAssignee[collection[i].id] }
                  onClick={ this.setDefaultAssignee.bind(this, collection[i].id) }>
                  <i className='fa fa-check'></i>
                </Button>
                <Button 
                  className='edit-cancel-button' 
                  onClick={ this.cancelSetDefaultAssignee.bind(this, collection[i].id) }>
                  <i className='fa fa-close'></i>
                </Button>
              </div>
            </div>
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingDefaultAssigneeModuleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ),
        operation: (
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
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='1'>编辑</MenuItem> }
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='2'>删除</MenuItem> }
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem divider/> }
              <MenuItem eventKey='3'>问题列表</MenuItem>
              <MenuItem eventKey='4'>甘特图</MenuItem>
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
        <BackTop />
        <BootstrapTable data={ modules } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='principal'>负责人</TableHeaderColumn>
          <TableHeaderColumn dataField='defaultAssignee'>默认负责人</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal 
            show 
            close={ this.editModalClose } 
            update={ update } 
            data={ selectedItem } 
            options={ options } 
            collection={ collection } 
            i18n={ i18n }/> }
        { this.state.delNotifyShow && 
          <DelNotify 
            show 
            loading={ loading }
            close={ this.delNotifyClose } 
            modules={ collection } 
            data={ selectedItem } 
            del={ del }
            i18n={ i18n }/> }
      </div>
    );
  }
}
