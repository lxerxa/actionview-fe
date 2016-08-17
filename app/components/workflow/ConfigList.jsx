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

  operateSelect(eventKey) {

    const { hoverRowId } = this.state;
    const { delStepNotify, show } = this.props;

    if (eventKey === '2') {
      this.setState({ delStepNotifyShow : true });
      delStepNotify(hoverRowId);
    } else if (eventKey !== '3') {
      const ecode = show(hoverRowId);
      // todo err notify
      eventKey === '1' && this.setState({ editStepModalShow: true });
      eventKey === '4' && this.setState({ copyModalShow: true });
    }
  }

  onRowMouseOver(rowData) {
    this.setState({ operateShow: true, hoverRowId: rowData.id });
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  render() {
    const { collection, selectedItem, item, loading, indexLoading, itemLoading, editStep, delStep } = this.props;
    const { operateShow, hoverRowId } = this.state;

    const fields = [];
    const fieldNum = collection.length;
    for (let i = 0; i < fieldNum; i++) {
      fields.push({
        id: collection[i].id,
        name:  (
          <div>
            <span className='table-td-title'>{ collection[i].name }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        latest_modify: ( <span> { collection[i].latest_modified_time } <br/> { collection[i].latest_modifier && collection[i].latest_modifier.name } </span> ),
        step: collection[i].steps,
        operation: (
          <div>
            { operateShow && hoverRowId === collection[i].id && !itemLoading &&
              <DropdownButton bsStyle='link' title='操作' key={ i } id={ `dropdown-basic-${i}` } onSelect={ this.operateSelect.bind(this) }>
                <MenuItem eventKey='4'>复制</MenuItem>
                <MenuItem eventKey='1'>编辑</MenuItem>
                <MenuItem eventKey='2'>删除</MenuItem>
              </DropdownButton>
            }
            <image src={ img } className={ itemLoading && selectedItem.id === collection[i].id ? 'loading' : 'hide' }/>
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
        <BootstrapTable data={ fields } bordered={ false } hover options={ opts }>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' >名称</TableHeaderColumn>
          <TableHeaderColumn dataField='latest_modify' width='280'>最近配置修改</TableHeaderColumn>
          <TableHeaderColumn dataField='step' width='120'>步骤</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='operation'/>
        </BootstrapTable>
        { this.state.editStepModalShow && <EditStepModal show close={ this.editStepModalClose } edit={ editStep } data={ item }/> }
        { this.state.delStepNotifyShow && <DelStepNotify show close={ this.delStepNotifyClose } data={ selectedItem } del={ delStep }/> }
      </div>
    );
  }
}
