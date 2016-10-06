import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem, Label } from 'react-bootstrap';
import { Link } from 'react-router'
import _ from 'lodash';

var moment = require('moment');
const DelNotify = require('./DelNotify');
const img = require('../../assets/images/loading.gif');
const PaginationList = require('./PaginationList');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      delNotifyShow: false, 
      operateShow: false, 
      hoverRowId: ''
    };
    this.delNotifyClose = this.delNotifyClose.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    options: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    pid: PropTypes.string.isRequired,
    query: PropTypes.object,
    show: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    delNotify: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { index, query } = this.props;
    if (JSON.stringify(newQuery) !== JSON.stringify(query))
    {
      index();
    }
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { delNotify, show } = this.props;

    if (eventKey === '2') {
      this.setState({ delNotifyShow : true });
      delNotify(hoverRowId);
    } else {
      show(hoverRowId);
      // todo err notify
      eventKey === '1' && this.setState({ editModalShow: true });
      eventKey === '3' && this.setState({ defaultValueConfigShow: true });
      eventKey === '4' && this.setState({ optionValuesConfigShow: true });
    }
  }

  onRowMouseOver(rowData) {
    this.setState({ operateShow: true, hoverRowId: rowData.id });
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  render() {
    const { collection, selectedItem, loading, indexLoading, itemLoading, options={}, del, pid, query } = this.props;
    const { operateShow, hoverRowId } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const issues = [];
    const issueNum = collection.length;
    for (let i = 0; i < issueNum; i++) {

      const priorityStyle = { backgroundColor: options.config && _.findIndex(options.config.priorities, { id: collection[i].priority }) !== -1 ? _.find(options.config.priorities, { id: collection[i].priority }).color : '#cccccc', marginLeft: '14px' };

      issues.push({
        id: collection[i].id,
        type: (<span className='type-abb' title={ options.config && _.findIndex(options.config.types, { id: collection[i].type }) !== -1 ? _.find(options.config.types, { id: collection[i].type }).name : '' }>{ options.config && _.findIndex(options.config.types, { id: collection[i].type }) !== -1 ? _.find(options.config.types, { id: collection[i].type }).abb : '-' }</span>),
        name: (
          <div>
            <span className='table-td-issue-title'>{ collection[i].no + ' - ' + collection[i].title }</span>
            { collection[i].creator && <span className='table-td-issue-desc'>{ collection[i].creator.name + ' ' + moment(collection[i].created_at).format('YYYY/MM/DD HH:mm') }</span> }
          </div>
        ), 
        assignee: collection[i].assignee ? collection[i].assignee.name : '-',
        priority: ( <div className='circle' style={ priorityStyle } title={ options.config && _.findIndex(options.config.priorities, { id: collection[i].priority }) !== -1 ? _.find(options.config.priorities, { id: collection[i].priority }).name : '' } /> ),
        state: options.config && _.findIndex(options.config.states, { id: collection[i].state }) !== -1 ? _.find(options.config.states, { id: collection[i].state }).name : '-', 
        operation: (
          <div>
            { operateShow && hoverRowId === collection[i].id && !itemLoading &&
              <DropdownButton pullRight bsStyle='link' style={ { textDecoration: 'blink' ,color: '#000' } } title={ node } key={ i } id={ `dropdown-basic-${i}` } onSelect={ this.operateSelect.bind(this) }>
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
        <BootstrapTable data={ issues } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' hidden isKey>ID</TableHeaderColumn>
          <TableHeaderColumn width='50' dataField='type'><span>类型<i className='fa fa-arrow-up'></i></span></TableHeaderColumn>
          <TableHeaderColumn dataField='name'><Link to={ '/project/' + pid + '/issue' } query={ { sort: 'aa' } }>名称</Link></TableHeaderColumn>
          <TableHeaderColumn width='120' dataField='assignee'>经办人</TableHeaderColumn>
          <TableHeaderColumn width='70' dataField='priority'>优先级</TableHeaderColumn>
          <TableHeaderColumn width='100' dataField='state'>状态</TableHeaderColumn>
          <TableHeaderColumn width='100' dataField='state'>解决结果</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        <PaginationList total={ 8 } curPage={ query.page || 1 } sizePerPage={ 3 } paginationSize={ 4 } url={ '/project/' + pid + '/issue' } query={ { sort: 'aa' } }/>
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
