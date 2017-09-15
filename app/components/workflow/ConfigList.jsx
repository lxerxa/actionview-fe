import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const AddActionModal = require('./AddActionModal');
const DelActionModal = require('./DelActionModal');
const EditStepModal = require('./EditStepModal');
const DelStepNotify = require('./DelStepNotify');
const img = require('../../assets/images/loading.gif');

export default class ConfigList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editStepModalShow: false, 
      delStepNotifyShow: false, 
      item: {},
      actionItem: {} 
    };
    this.addActionModalClose = this.addActionModalClose.bind(this);
    this.delActionModalClose = this.delActionModalClose.bind(this);
    this.editStepModalClose = this.editStepModalClose.bind(this);
    this.delStepNotifyClose = this.delStepNotifyClose.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    editStep: PropTypes.func.isRequired,
    delStep: PropTypes.func.isRequired,
    addAction: PropTypes.func.isRequired,
    editAction: PropTypes.func.isRequired,
    delAction: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  editStepModalClose() {
    this.setState({ editStepModalShow: false });
  }

  delStepNotifyClose() {
    this.setState({ delStepNotifyShow: false });
  }

  addActionModalClose() {
    this.setState({ addActionModalShow: false });
  }

  delActionModalClose() {
    this.setState({ delActionModalShow: false });
  }

  addAction(stepId) {
    this.setState({ addActionModalShow: true });
    const { collection } = this.props; 
    const item = _.find(collection, { id: stepId });
    this.setState({ item, actionItem: {} });
  }

  showAction(stepId, actionId) {
    this.setState({ addActionModalShow: true });
    const { collection } = this.props;
    const item = _.find(collection, { id: stepId });
    const actionItem = _.find(item.actions, { id: actionId });
    this.setState({ item, actionItem });
  }

  delAction(stepId) {
    this.setState({ delActionModalShow: true });
    const { collection } = this.props;
    const item = _.find(collection, { id: stepId });
    this.setState({ item });
  }

  showStep(id) {
    this.setState({ editStepModalShow: true });
    const { collection } = this.props; 
    const item = _.find(collection, { id });
    this.setState({ item });
  }

  delStepNotify(id) {
    this.setState({ delStepNotifyShow: true });
    const { collection } = this.props;
    const item = _.find(collection, { id });
    this.setState({ item });
  }

  render() {
    const { collection, indexLoading, options, editStep, delStep, addAction, editAction, delAction } = this.props;
    const { item, actionItem } = this.state;

    const steps = [];
    const allDestSteps = [];
    const stepNum = collection.length;

    for (let i = 0; i < stepNum; i++) {
      _.map(collection[i].actions, function(v) { 
        _.map(v.results, function(v2) {
          allDestSteps.push(v2.step); 
        });
      });
    }

    for (let i = 0; i < stepNum; i++) {
      steps.push({
        id: collection[i].id,
        step:  (
          <div>
            <span className='table-td-title'>{ collection[i].name || '-' }</span>
          </div>
        ),
        state:  (
          <div>
            { _.find(options.states, { id: collection[i].state }) ? _.find(options.states, { id: collection[i].state }).name : '-' }
          </div>
        ),
        actions:  (
          <ul className='list-unstyled clearfix'>
            { collection[i].actions.map((item, j) =>
              <li key={ j }>
                <span style={ { color: '#337ab7', cursor: 'pointer' } } onClick={ this.showAction.bind(this, collection[i].id, item.id) } >{ item.name }</span>
                { item.results.map((item2, j2) =>
                  <span key={ j2 } style={ { fontSize: '10px', fontStyle: 'italic' } }>
                    <br/> >>{ ' ' + _.find(collection, { id: item2.step }).name }
                  </span>) }
              </li>)
            }
          </ul>
        ),
        operation: (
          <div>
            <Button bsStyle='link' onClick={ this.addAction.bind(this, collection[i].id) }>添加动作</Button>
            <Button bsStyle='link' onClick={ this.delAction.bind(this, collection[i].id) }>删除动作</Button>
            <Button bsStyle='link' onClick={ this.showStep.bind(this, collection[i].id) }>编辑</Button>
            { collection[i].actions.length === 0 && collection[i].id !== 1 && _.indexOf(allDestSteps, collection[i].id) === -1 && <Button bsStyle='link' onClick={ this.delStepNotify.bind(this, collection[i].id) }>删除</Button> }
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

    return (
      <div style={ { marginBottom: '30px' } }>
        <BootstrapTable data={ steps } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='step'>步骤</TableHeaderColumn>
          <TableHeaderColumn dataField='state'>关联状态</TableHeaderColumn>
          <TableHeaderColumn dataField='actions' width='260'>动作</TableHeaderColumn>
          <TableHeaderColumn width='300' dataField='operation'/>
        </BootstrapTable>
        { this.state.addActionModalShow && 
          <AddActionModal 
            show 
            close={ this.addActionModalClose } 
            create={ addAction } 
            edit={ editAction } 
            stepData={ item } 
            options={ options } 
            steps={ collection } 
            data={ actionItem } /> }
        { this.state.delActionModalShow && 
          <DelActionModal 
            show 
            close={ this.delActionModalClose } 
            del={ delAction } 
            stepData={ item }/> }
        { this.state.editStepModalShow && 
          <EditStepModal 
            show 
            close={ this.editStepModalClose } 
            edit={ editStep } 
            data={ item } 
            collection={ collection } 
            options={ options }/> }
        { this.state.delStepNotifyShow && 
          <DelStepNotify 
            show 
            close={ this.delStepNotifyClose } 
            data={ item } 
            del={ delStep }/> }
      </div>
    );
  }
}
