import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      delNotifyShow: false, 
      willSetScreenTypeIds: [], 
      settingScreenTypeIds: [], 
      willSetWorkflowTypeIds: [], 
      settingWorkflowTypeIds: [] , 
      screen: {}, 
      workflow: {}, 
      operateShow: false, 
      operation: '', 
      hoverRowId: '' };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.delNotify = this.delNotify.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    isSysConfig: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
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

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  delNotify(id, operation) {
    this.setState({ delNotifyShow: true, operation });
    const { select } = this.props;
    select(id);
  }

  willSetScreen(typeId) {
    this.state.willSetScreenTypeIds.push(typeId);
    this.setState({ willSetScreenTypeIds: this.state.willSetScreenTypeIds });
  }

  cancelSetScreen(typeId) {
    const index = this.state.willSetScreenTypeIds.indexOf(typeId);
    this.state.willSetScreenTypeIds.splice(index, 1);
    // clean permission in the state
    this.state.screen[typeId] = undefined;

    this.setState({ willSetScreenTypeIds: this.state.willSetScreenTypeIds, screen: this.state.screen });
  }

  async setScreen(typeId) {
    this.state.settingScreenTypeIds.push(typeId);
    this.setState({ settingScreenTypeIds: this.state.settingScreenTypeIds });

    const { update } = this.props;
    const ecode = await update({ screen_id: this.state.screen[typeId], id: typeId });
    if (ecode === 0) {
      const willSetIndex = _.indexOf(this.state.willSetScreenTypeIds, typeId);
      this.state.willSetScreenTypeIds.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingScreenTypeIds, typeId);
      this.state.settingScreenTypeIds.splice(settingIndex, 1);
      this.setState({ settingScreenTypeIds: this.state.settingScreenTypeIds, willSetScreenTypeIds: this.state.willSetScreenTypeIds });
    } else {
      const settingIndex = _.indexOf(this.state.settingScreenTypeIds, typeId);
      this.state.settingScreenTypeIds.splice(settingIndex, 1);
      this.setState({ settingScreenTypeIds: this.state.settingScreenTypeIds });
    }
  }

  handleScreenSelectChange(typeId, value) {
    this.state.screen[typeId] = value;
    this.setState({ screen: this.state.screen });
  }

  willSetWorkflow(typeId) {
    this.state.willSetWorkflowTypeIds.push(typeId);
    this.setState({ willSetWorkflowTypeIds: this.state.willSetWorkflowTypeIds });
  }

  cancelSetWorkflow(typeId) {
    const index = this.state.willSetWorkflowTypeIds.indexOf(typeId);
    this.state.willSetWorkflowTypeIds.splice(index, 1);
    // clean permission in the state
    this.state.workflow[typeId] = undefined;

    this.setState({ willSetWorkflowTypeIds: this.state.willSetWorkflowTypeIds, workflow: this.state.workflow });
  }

  async setWorkflow(typeId) {
    this.state.settingWorkflowTypeIds.push(typeId);
    this.setState({ settingWorkflowTypeIds: this.state.settingWorkflowTypeIds });

    const { update } = this.props;
    const ecode = await update({ workflow_id: this.state.workflow[typeId], id: typeId });
    if (ecode === 0) {
      const willSetIndex = _.indexOf(this.state.willSetWorkflowTypeIds, typeId);
      this.state.willSetWorkflowTypeIds.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingWorkflowTypeIds, typeId);
      this.state.settingWorkflowTypeIds.splice(settingIndex, 1);

      this.setState({ settingWorkflowTypeIds: this.state.settingWorkflowTypeIds, willSetWorkflowTypeIds: this.state.willSetWorkflowTypeIds });
    } else {
      const settingIndex = _.indexOf(this.state.settingWorkflowTypeIds, typeId);
      this.state.settingWorkflowTypeIds.splice(settingIndex, 1);
      this.setState({ settingWorkflowTypeIds: this.state.settingWorkflowTypeIds });
    }
  }

  handleWorkflowSelectChange(typeId, value) {
    this.state.workflow[typeId] = value;
    this.setState({ workflow: this.state.workflow });
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;

    if (eventKey === '1') {
      this.edit(hoverRowId);
    } else if (eventKey === '2') {
      this.delNotify(hoverRowId, 'del');
    } else if (eventKey === '3') {
      this.delNotify(hoverRowId, 'disable');
    } else if (eventKey === '4') {
      this.delNotify(hoverRowId, 'enable');
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
      isSysConfig, 
      collection, 
      selectedItem, 
      options, 
      indexLoading, 
      loading, 
      del, 
      update } = this.props;
    const { 
      operateShow, 
      hoverRowId, 
      willSetScreenTypeIds, 
      settingScreenTypeIds, 
      willSetWorkflowTypeIds, 
      settingWorkflowTypeIds } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const { screens = [], workflows = [] } = options;
    const screenOptions = _.map(screens, function(val) {
      return { label: val.name, value: val.id };
    });
    const workflowOptions = _.map(workflows, function(val) {
      return { label: val.name, value: val.id };
    });

    const types = [];
    const typeNum = collection.length;
    for (let i = 0; i < typeNum; i++) {
      types.push({
        id: collection[i].id,
        name: ( 
          <div>
            <span className='table-td-title'>
              { collection[i].name }
              { collection[i].abb && ' (' + collection[i].abb + ')' }
              { collection[i].default && <span style={ { fontWeight: 'normal' } }> (默认)</span> }
              { collection[i].type == 'subtask' && <span style={ { fontWeight: 'normal' } }> (子任务)</span> } 
            </span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        type: ( <span>{ collection[i].type == 'subtask' ? '子任务' : '标准' }</span> ),
        screen: (
          <div>
          { _.indexOf(willSetScreenTypeIds, collection[i].id) === -1 && _.indexOf(settingScreenTypeIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].screen_id ?
                <span>
                  <div style={ { display: 'inline-block', float: 'left', margin: '3px 3px 6px 3px' } }> 
                    { _.find(screens, { id: collection[i].screen_id }) ? _.find(screens, { id: collection[i].screen_id }).name : '-' } 
                  </div>
                </span> :
                '-' }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetScreen.bind(this, collection[i].id) }>
                  <i className='fa fa-pencil'></i>
                </span>
              </div>
            </div>
            :
            <div>
              <Select 
                simpleValue 
                clearable={ false } 
                searchable={ false } 
                disabled={ _.indexOf(settingScreenTypeIds, collection[i].id) !== -1 && true } 
                options={ screenOptions } 
                value={ this.state.screen[collection[i].id] || collection[i].screen_id } 
                onChange={ this.handleScreenSelectChange.bind(this, collection[i].id) } 
                placeholder='请选择界面'/>
              <div className={ _.indexOf(settingScreenTypeIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setScreen.bind(this, collection[i].id) }>
                  <i className='fa fa-check'></i>
                </Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetScreen.bind(this, collection[i].id) }>
                  <i className='fa fa-close'></i>
                </Button>
              </div>
            </div>
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingScreenTypeIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ),
        workflow: (
          <div>
          { _.indexOf(willSetWorkflowTypeIds, collection[i].id) === -1 && _.indexOf(settingWorkflowTypeIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].workflow_id ?
                <span>
                  <div style={ { display: 'inline-block', float: 'left', margin: '3px 3px 6px 3px' } }> 
                    { _.find(workflows, { id: collection[i].workflow_id }) ? _.find(workflows, { id: collection[i].workflow_id }).name : '-' } 
                  </div>
                </span> :
                '-' }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetWorkflow.bind(this, collection[i].id) }><i className='fa fa-pencil'></i></span>
              </div>
            </div>
            :
            <div>
              <Select 
                simpleValue 
                clearable={ false } 
                searchable={ false } 
                disabled={ _.indexOf(settingWorkflowTypeIds, collection[i].id) !== -1 && true } 
                options={ workflowOptions } 
                value={ this.state.workflow[collection[i].id] || collection[i].workflow_id } 
                onChange={ this.handleWorkflowSelectChange.bind(this, collection[i].id) } 
                placeholder='请选择工作流'/>
              <div className={ _.indexOf(settingWorkflowTypeIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setWorkflow.bind(this, collection[i].id) }>
                  <i className='fa fa-check'></i>
                </Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetWorkflow.bind(this, collection[i].id) }>
                  <i className='fa fa-close'></i>
                </Button>
              </div>
            </div>
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingWorkflowTypeIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ),
        status: ( <span>{ collection[i].disabled  ? <Label>无效</Label> : <Label bsStyle='success'>有效</Label> }</span> ), 
        operation: (
          <div>
            { operateShow && hoverRowId === collection[i].id &&
              <DropdownButton 
                pullRight 
                bsStyle='link' 
                style={ { textDecoration: 'blink' ,color: '#000' } } 
                key={ i } 
                title={ node } 
                id={ `dropdown-basic-${i}` } 
                onSelect={ this.operateSelect.bind(this) }>
                <MenuItem eventKey='1'>编辑</MenuItem>
                { !collection[i].is_used && <MenuItem eventKey='2'>删除</MenuItem> }
                { !isSysConfig && collection[i].disabled && <MenuItem eventKey='4'>启用</MenuItem> }
                { !isSysConfig && !collection[i].disabled && <MenuItem eventKey='3'>禁用</MenuItem> }
              </DropdownButton>
            }
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
        <BootstrapTable data={ types } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' hidden isKey>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='screen'>界面</TableHeaderColumn>
          <TableHeaderColumn dataField='workflow'>工作流</TableHeaderColumn>
          <TableHeaderColumn width='100' dataField='status'>状态</TableHeaderColumn>
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
             close={ this.delNotifyClose } 
             data={ selectedItem } 
             loading={ loading } 
             del={ del } 
             update={ update } 
             operation={ this.state.operation } 
             i18n={ i18n }/> }
      </div>
    );
  }
}
