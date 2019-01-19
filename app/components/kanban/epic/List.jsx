import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');

const img = require('../../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false, operateShow: false, hoverRowId: '' };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    gotoBacklog: PropTypes.func.isRequired,
    gotoIssueList: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired,
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

  async edit(id) {
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
    const { gotoBacklog, gotoIssueList } = this.props;

    if (eventKey === '1') {
      this.edit(hoverRowId);
    } else if (eventKey === '2') {
      this.delNotify(hoverRowId);
    } else if (eventKey === '3') {
      gotoIssueList(hoverRowId);
    } else if (eventKey === '4') {
      gotoBacklog(hoverRowId);
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
    const { i18n, options, collection, selectedItem, indexLoading, loading, del, update, index } = this.props;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const epics = [];
    const epicNum = collection.length;
    for (let i = 0; i < epicNum; i++) {
      epics.push({
        id: collection[i].id,
        name: ( 
          <span className='epic-title' title={ collection[i].name } style={ { backgroundColor: collection[i].bgColor, borderColor: collection[i].bgColor, maxWith: '10em' } }>
            { collection[i].name }
          </span> ),
        bgColor: ( <div className='epic-label' style={ { backgroundColor: collection[i].bgColor || '#ccc' } } /> ),
        issues: (
          <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
            <li>已完成 - <strong>{ collection[i].completed || 0 }</strong></li>
            <li>未完成 - <strong>{ collection[i].incompleted || 0 }</strong></li>
            <li>不明确 - <strong>{ collection[i].inestimable || 0 }</strong></li>
          </ul>
        ),
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
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='1'>编辑</MenuItem> }
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem eventKey='2'>删除</MenuItem> }
              { options.permissions && options.permissions.indexOf('manage_project') !== -1 && <MenuItem divider/> }
              <MenuItem eventKey='3'>问题列表</MenuItem>
              <MenuItem eventKey='4'>Backlog列表</MenuItem>
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
      <div style={ { marginLeft: '10px', marginTop: '-15px', overflowY: 'auto', height: '100%' } }>
        <div className='info-col'>
          <div className='info-icon'><i className='fa fa-info-circle'></i></div>
          <div className='info-content'>若Epic信息修改后，创建、编辑问题页面Epic内容没及时更新，请刷新页面。</div>
        </div>
        <BootstrapTable 
          hover
          data={ epics } 
          bordered={ false } 
          tableStyle={ { marginBottom: '230px' } } 
          options={ opts } 
          trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='issues'>问题完成情况</TableHeaderColumn>
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
        { this.state.delNotifyShow && 
          <DelNotify 
            show 
            loading={ loading }
            close={ this.delNotifyClose } 
            index={ index }
            epics={ collection }
            data={ selectedItem } 
            del={ del }
            i18n={ i18n }/> }
      </div>
    );
  }
}
