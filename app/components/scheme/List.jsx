import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';

const EditModal = require('./EditModal');
const OperateNotify = require('./OperateNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, operateNotifyShow: false, operateShow: false, hoverRowId: '' };
    this.editModalClose = this.editModalClose.bind(this);
    this.operateNotifyClose = this.operateNotifyClose.bind(this);
    this.entry = this.entry.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    entry: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  entry(id) {
    const { entry } = this.props;
    entry('/scheme/' + id);
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  operateNotifyClose() {
    this.setState({ operateNotifyShow: false });
  }

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  delNotify(id) {
    this.setState({ operateNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;

    if (eventKey === '1') {
      this.edit(hoverRowId);
    } else if (eventKey === '2') {
      this.delNotify(hoverRowId);
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
    const { collection, selectedItem, indexLoading, itemLoading, del, update } = this.props;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const states = [];
    const stateNum = collection.length;
    for (let i = 0; i < stateNum; i++) {
      states.push({
        id: collection[i].id,
        name: ( <a href='#' style={ { cursor: 'pointer' } } onClick={ (e) => { e.preventDefault(); this.entry(collection[i].id); } }>{ collection[i].name }</a> ),
        description: collection[i].description ? collection[i].description : '-',
        operation: (
          <div>
          { operateShow && hoverRowId === collection[i].id && !itemLoading &&
            <DropdownButton pullRight bsStyle='link' style={ { textDecoration: 'blink' ,color: '#000' } } key={ i } title={ node } id={ `dropdown-basic-${i}` } onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='config'>配置</MenuItem>
              <MenuItem eventKey='edit'>编辑</MenuItem>
              { collection[i].disabled ? <MenuItem eventKey='enable'>启用</MenuItem> : <MenuItem eventKey='disable'>禁用</MenuItem> }
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
        <BootstrapTable data={ states } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='description'>描述</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } update={ update } data={ selectedItem } collection={ collection }/> }
        { this.state.operateNotifyShow && <OperateNotify show close={ this.operateNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
