import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const EditStepModal = require('./EditStepModal');
const DelStepNotify = require('./DelStepNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editStepModalShow: false, 
      delStepNotifyShow: false, 
      operateShow: false,
      hoverRowId: ''
    };
    this.editStepModalClose = this.editStepModalClose.bind(this);
    this.delStepNotifyClose = this.delStepNotifyClose.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    editStep: PropTypes.func.isRequired,
    delStep: PropTypes.func.isRequired,
    delStepNotify: PropTypes.func.isRequired,
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

  addAction() {
    this.setState({ editStepModalShow: false });
  }

  delAction() {
    this.setState({ editStepModalShow: false });
  }

  editStep() {
    this.setState({ editStepModalShow: false });
  }

  onRowMouseOver(rowData) {
    this.setState({ operateShow: true, hoverRowId: rowData.id });
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  render() {
    const { collection, selectedItem, item, indexLoading, options, editStep, delStep } = this.props;
    const { operateShow, hoverRowId } = this.state;

    const steps = [];
    const stepNum = collection.length;
    for (let i = 0; i < stepNum; i++) {
      steps.push({
        id: collection[i].id,
        step:  (
          <div>
            <span className='table-td-title'>{ collection[i].name }</span>
          </div>
        ),
        status:  (
          <div>
            { _.find(options.states, { id: collection[i].state }).name || '-' }
          </div>
        ),
        actions:  (
          <div>
            cc
          </div>
        ),
        operation: (
          <div>
            <Button bsStyle='link' onClick={ this.addAction.bind(this, collection[i].id) }>添加动作</Button>
            <Button bsStyle='link' onClick={ this.delAction.bind(this, collection[i].id) }>删除动作</Button>
            <Button bsStyle='link' onClick={ this.editStep.bind(this, collection[i].id) }>编辑</Button>
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

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);
    opts.onMouseLeave = this.onMouseLeave.bind(this);

    return (
      <div>
        <BootstrapTable data={ steps } bordered={ false } hover options={ opts }>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='step'>步骤</TableHeaderColumn>
          <TableHeaderColumn dataField='status'>关联状态</TableHeaderColumn>
          <TableHeaderColumn dataField='actions' width='320'>动作</TableHeaderColumn>
          <TableHeaderColumn width='250' dataField='operation'/>
        </BootstrapTable>
        { this.state.addActionModalShow && <EditStepModal show close={ this.editStepModalClose } edit={ editStep } data={ item }/> }
        { this.state.delActionModalShow && <EditStepModal show close={ this.editStepModalClose } edit={ editStep } data={ item }/> }
        { this.state.ModalShow && <EditStepModal show close={ this.editStepModalClose } edit={ editStep } data={ item }/> }
        { this.state.delStepNotifyShow && <DelStepNotify show close={ this.delStepNotifyClose } data={ selectedItem } del={ delStep }/> }
      </div>
    );
  }
}
