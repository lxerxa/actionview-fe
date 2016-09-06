import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false, willSetScreenTypeIds: [], settingScreenTypeIds: [], willSetWorkflowTypeIds: [], settingWorkflowTypeIds: [] , screen: {}, workflow: {} };
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
    const index = _.indexOf(this.state.willSetScreenTypeIds, typeId);
    this.state.willSetScreenTypeIds.splice(index, 1);
    this.setState({ settingScreenTypeIds: this.state.settingScreenTypeIds, willSetScreenTypeIds: this.state.willSetScreenTypeIds });

    const { edit } = this.props;
    const ecode = await edit({ screen: _.map(this.state.screen[typeId], _.iteratee('value')), id: typeId });
    if (ecode === 0) {
      const index = _.indexOf(this.state.settingScreenTypeIds, typeId);
      this.state.settingScreenTypeIds.splice(index, 1);
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
    const index = _.indexOf(this.state.willSetWorkflowTypeIds, typeId);
    this.state.willSetWorkflowTypeIds.splice(index, 1);
    this.setState({ settingWorkflowTypeIds: this.state.settingWorkflowTypeIds, willSetWorkflowTypeIds: this.state.willSetWorkflowTypeIds });

    const { edit } = this.props;
    const ecode = await edit({ workflow: _.map(this.state.workflow[typeId], _.iteratee('value')), id: typeId });
    if (ecode === 0) {
      const index = _.indexOf(this.state.settingWorkflowTypeIds, typeId);
      this.state.settingWorkflowTypeIds.splice(index, 1);
      this.setState({ settingWorkflowTypeIds: this.state.settingWorkflowTypeIds });
    }
  }

  handleWorkflowSelectChange(typeId, value) {
    this.state.workflow[typeId] = value;
    this.setState({ workflow: this.state.workflow });
  }

  render() {
    const { collection, selectedItem, item, options, indexLoading, itemLoading, del, edit } = this.props;
    const { willSetScreenTypeIds, settingScreenTypeIds, willSetWorkflowTypeIds, settingWorkflowTypeIds } = this.state;

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
        name: ( 
          <div>
            <span className='table-td-title'>{ collection[i].name }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        screen: (
          <div>
          { _.indexOf(willSetScreenTypeIds, collection[i].id) === -1 && _.indexOf(settingScreenTypeIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              {
                collection[i].screen && collection[i].screen.name ?
                <div style={ { display: 'inline-block', marginLeft: '5px', marginTop: '7px' } }> { collection[i].screen.name } </div> :
                '-'
              }
              <Button className='edit-icon' onClick={ this.willSetScreen.bind(this, collection[i].id) } style={ { display:'inline-block', float: 'right' } }><i className='fa fa-pencil'></i></Button>
            </div>
            :
            <div>
              <Select clearable={ false } searchable={ false } disabled={ _.indexOf(settingScreenTypeIds, collection[i].id) !== -1 && true } options={ screenOptions } value={ this.state.screen[collection[i].id] || collection[i].screen.id } onChange={ this.handleScreenSelectChange.bind(this, collection[i].id) } placeholder='请选择相应权限'/>
              <div className={ _.indexOf(settingScreenTypeIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setScreen.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetScreen.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div>
          }
          <image src={ img } style={ { float: 'right' } } className={ _.indexOf(settingScreenTypeIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ),
        workflow: (
          <div>
          { _.indexOf(willSetWorkflowTypeIds, collection[i].id) === -1 && _.indexOf(settingWorkflowTypeIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              {
                collection[i].workflow && collection[i].workflow.name ?
                <div style={ { display: 'inline-block', marginLeft: '5px', marginTop: '7px' } }> { collection[i].workflow.name } </div> :
                '-'
              }
              <Button className='edit-icon' onClick={ this.willSetWorkflow.bind(this, collection[i].id) } style={ { display:'inline-block', float: 'right' } }><i className='fa fa-pencil'></i></Button>
            </div>
            :
            <div>
              <Select clearable={ false } searchable={ false } disabled={ _.indexOf(settingWorkflowTypeIds, collection[i].id) !== -1 && true } options={ workflowOptions } value={ this.state.workflow[collection[i].id] || collection[i].workflow.id } onChange={ this.handleWorkflowSelectChange.bind(this, collection[i].id) } placeholder='请选择相应权限'/>
              <div className={ _.indexOf(settingWorkflowTypeIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setWorkflow.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetWorkflow.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div>
          }
          <image src={ img } style={ { float: 'right' } } className={ _.indexOf(settingWorkflowTypeIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
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
        <BootstrapTable data={ types } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='name' isKey>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='screen'>界面</TableHeaderColumn>
          <TableHeaderColumn dataField='workflow'>工作流</TableHeaderColumn>
          <TableHeaderColumn width='120' dataField='operation'>操作</TableHeaderColumn>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ selectedItem } options={ options }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
