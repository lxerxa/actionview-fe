import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const CopyModal = require('./CopyModal');
const DelNotify = require('./DelNotify');
const LayoutConfigModal = require('./LayoutConfigModal');
const LayoutFieldConfigModal = require('./LayoutFieldConfigModal');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      copyModalShow: false, 
      delNotifyShow: false, 
      layoutConfigShow: false, 
      layoutFieldConfigShow: false, 
      operateShow: false,
      hoverRowId: ''
    };
    this.editModalClose = this.editModalClose.bind(this);
    this.copyModalClose = this.copyModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.layoutConfigClose = this.layoutConfigClose.bind(this);
    this.layoutFieldConfigClose = this.layoutFieldConfigClose.bind(this);
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
    config: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
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

  layoutConfigClose() {
    this.setState({ layoutConfigShow: false });
  }

  layoutFieldConfigClose() {
    this.setState({ layoutFieldConfigShow: false });
  }

  async operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { delNotify, show } = this.props;

    if (eventKey === '2') {
      this.setState({ delNotifyShow : true });
      delNotify(hoverRowId);
    } else {
      const ecode = await show(hoverRowId);
      // todo err notify
      eventKey === '3' && this.setState({ layoutConfigShow: true });
      eventKey === '1' && this.setState({ editModalShow: true });
      eventKey === '4' && this.setState({ layoutFieldConfigShow: true });
      eventKey === '5' && this.setState({ copyModalShow: true });
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
        workflow: ( 
          <ul style={ { marginBottom: '0px', paddingLeft: '0px' } }>
            { _.isEmpty(collection[i].workflows) ? '-' : _.map(collection[i].workflows, function(v, i) { return (<li key={ i }>{ v.name }</li>) }) }
          </ul> ),
        operation: (
          <div>
            { operateShow && hoverRowId === collection[i].id && !itemLoading &&
              <DropdownButton bsStyle='link' title='操作' key={ i } id={ `dropdown-basic-${i}` } onSelect={ this.operateSelect.bind(this) }>
                <MenuItem eventKey='3'>界面配置</MenuItem>
                <MenuItem eventKey='4'>字段配置</MenuItem>
                <MenuItem eventKey='5'>复制</MenuItem>
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
          <TableHeaderColumn dataField='workflow'>应用工作流</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ item }/> }
        { this.state.copyModalShow && <CopyModal show close={ this.copyModalClose } copy={ create } data={ item }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
        { this.state.layoutConfigShow && <LayoutConfigModal show close={ this.layoutConfigClose } data={ item } config={ edit } options= { options } loading={ loading }/> }
        { this.state.layoutFieldConfigShow && <LayoutFieldConfigModal show close={ this.layoutFieldConfigClose } data={ item } config={ edit } loading={ loading }/> }
      </div>
    );
  }
}
