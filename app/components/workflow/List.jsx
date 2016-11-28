import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem, Label } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const CopyModal = require('./CopyModal');
const DelNotify = require('./DelNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      copyModalShow: false, 
      delNotifyShow: false, 
      operateShow: false,
      hoverRowId: ''
    };
    this.editModalClose = this.editModalClose.bind(this);
    this.copyModalClose = this.copyModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
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
    edit: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    goConfig: PropTypes.func.isRequired,
    delNotify: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  copyModalClose() {
    this.setState({ copyModalShow: false });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  async operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { delNotify, show, goConfig } = this.props;

    if (eventKey === '2') {
      this.setState({ delNotifyShow : true });
      delNotify(hoverRowId);
    } else if (eventKey === '3') {
      goConfig(hoverRowId);
    } else {
      const ecode = await show(hoverRowId);
      // todo err notify
      eventKey === '1' && this.setState({ editModalShow: true });
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
    const { collection, selectedItem, item, options, loading, indexLoading, itemLoading, del, edit, create } = this.props;
    const { operateShow, hoverRowId } = this.state;

    const workflows = [];
    const workflowNum = collection.length;
    for (let i = 0; i < workflowNum; i++) {
      workflows.push({
        id: collection[i].id,
        name:  (
          <div>
            <span className='table-td-title'>{ collection[i].name } { collection[i].category && <Label style={ { color: 'red', backgroundColor: '#ffffbd' } }>全局</Label> } </span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        latest_modify: ( <span> { collection[i].latest_modified_time } <br/> { collection[i].latest_modifier && collection[i].latest_modifier.name } </span> ),
        step: collection[i].steps,
        operation: (
          <div>
            { operateShow && hoverRowId === collection[i].id && !itemLoading &&
              <DropdownButton pullRight bsStyle='link' title='操作' key={ i } id={ `dropdown-basic-${i}` } onSelect={ this.operateSelect.bind(this) }>
                <MenuItem eventKey='3'>配置</MenuItem>
                <MenuItem eventKey='5'>查看</MenuItem>
                <MenuItem eventKey='4'>复制</MenuItem>
                <MenuItem eventKey='1'>编辑</MenuItem>
                <MenuItem eventKey='2'>删除</MenuItem>
              </DropdownButton>
            }
            <img src={ img } className={ itemLoading && selectedItem.id === collection[i].id ? 'loading' : 'hide' }/>
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
        <BootstrapTable pullRight data={ workflows } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' >名称</TableHeaderColumn>
          <TableHeaderColumn dataField='latest_modify'>最近配置修改</TableHeaderColumn>
          <TableHeaderColumn dataField='step' width='200'>步骤</TableHeaderColumn>
          <TableHeaderColumn width='80' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ item }/> }
        { this.state.copyModalShow && <CopyModal show close={ this.copyModalClose } copy={ create } data={ item }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
