import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const CreateModal = require('./CreateModal');
const EditModal = require('./EditModal');
const OperateNotify = require('./OperateNotify');

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      editModalShow: false, 
      delNotifyShow: false, 
      operateShow: false, 
      operate: '',
      hoverRowId: '' 
    };
    this.createModalClose = this.createModalClose.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.operateNotifyClose = this.operateNotifyClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  operateNotifyClose() {
    this.setState({ operateNotifyShow: false });
  }

  async operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { select } = this.props;
    await select(hoverRowId);

    if (eventKey == 'edit') {
      this.setState({ editModalShow: true });
    } else {
      this.setState({ operate: eventKey, operateNotifyShow: true });
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
      options, 
      collection, 
      selectedItem, 
      indexLoading, 
      loading, 
      del, 
      update, 
      create, 
      index 
    } = this.props;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const reminds = [];
    const remindNum = collection.length;
    for (let i = 0; i < remindNum; i++) {

      reminds.push({
        id: collection[i].id,
        name: ( 
          <div>
            <span className='table-td-title'>{ collection[i].name }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        status: collection[i].status == 'disabled' ? <Label>无效</Label> : <Label bsStyle='success'>有效</Label>,
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
              <MenuItem eventKey='edit'>编辑</MenuItem>
              { collection[i].status == 'enabled' ? <MenuItem eventKey='disable'>禁用</MenuItem> : <MenuItem eventKey='enable'>启用</MenuItem> }
              <MenuItem eventKey='del'>删除</MenuItem>
            </DropdownButton> }
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
        <div style={ { marginTop: '15px' } }>
          <Button onClick={ () => { this.setState({ createModalShow: true }) } }>
            <i className='fa fa-plus'></i>&nbsp;新建提醒
          </Button>
        </div>
        <BootstrapTable 
          hover
          data={ reminds } 
          bordered={ false } 
          options={ opts } 
          trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='status'>状态</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal 
            show 
            close={ this.editModalClose } 
            update={ update } 
            data={ selectedItem } 
            collection={ collection } 
            i18n={ i18n }/> }
        { this.state.createModalShow &&
          <CreateModal
            show
            close={ this.createModalClose }
            create={ create }
            collection={ collection }
            i18n={ i18n }/> }
        { this.state.operateNotifyShow &&
          <OperateNotify
            show
            close={ this.operateNotifyClose }
            data={ selectedItem }
            operate={ this.state.operate }
            del={ del }
            update={ update }
            i18n={ i18n }/> }
      </div>
    );
  }
}
