import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');

const img = require('../../assets/images/loading.gif');

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
    const { gotoIssueList } = this.props;

    if (eventKey === '1') {
      this.edit(hoverRowId);
    } else if (eventKey === '2') {
      this.delNotify(hoverRowId);
    } else if (eventKey === '3') {
      gotoIssueList(hoverRowId);
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
      index 
    } = this.props;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const completedStates = options.completed_states || []; 
    const inCompletedStates = options.incompleted_states || []; 

    const labels = [];
    const labelNum = collection.length;
    for (let i = 0; i < labelNum; i++) {
      labels.push({
        id: collection[i].id,
        name: ( 
          <span className='label-title' title={ collection[i].name } style={ { backgroundColor: collection[i].bgColor, borderColor: collection[i].bgColor, maxWith: '10em' } }>
            { collection[i].name }
          </span> ),
        bgColor: ( <div className='label-label' style={ { backgroundColor: collection[i].bgColor || '#ccc' } } /> ),
        issues: (
          <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
            <li>已完成 - <Link to={ '/project/' + collection[i].project_key + '/issue?' + 'labels=' + collection[i].id + '&state=' + completedStates.join(',') }>{ collection[i].completed || 0 }</Link></li>
            <li>未完成 - <Link to={ '/project/' + collection[i].project_key + '/issue?' + 'labels=' + collection[i].id + '&state=' + inCompletedStates.join(',') }><span style={ { color: 'red' } }>{ collection[i].incompleted || 0 }</span></Link></li>
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
              <MenuItem eventKey='1'>编辑</MenuItem>
              <MenuItem eventKey='2'>删除</MenuItem>
              <MenuItem divider/>
              <MenuItem eventKey='3'>问题列表</MenuItem>
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
          <Button>
            <i className='fa fa-plus'></i>&nbsp;新建标签
          </Button>
        </div>
        <BootstrapTable 
          hover
          data={ labels } 
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
            labels={ collection }
            data={ selectedItem } 
            del={ del }
            i18n={ i18n }/> }
      </div>
    );
  }
}
