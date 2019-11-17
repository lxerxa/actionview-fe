import React, { PropTypes, Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import _ from 'lodash';

const moment = require('moment');
const PaginationList = require('../share/PaginationList');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    options: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    refresh: PropTypes.func.isRequired
  }

  render() {
    const { 
      options,
      collection, 
      indexLoading, 
      refresh, 
      query 
    } = this.props;

    const logs = [];
    const logNum = collection.length;
    for (let i = 0; i < logNum; i++) {
      logs.push({
        id: collection[i].id,
        user: collection[i].user && collection[i].user.name || '', 
        url: collection[i].request_url || '', 
        at: collection[i].requested_start_at ? moment(collection[i].requested_start_at).format('YYYY/MM/DD HH:mm') : '', 
        method: collection[i].method || '-',
        ip: collection[i].request_source_ip || '-',
        operation: (
          <Button bsStyle='link'>详情</Button>
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
      <div>
        <div>
          <BootstrapTable 
            hover
            data={ logs } 
            bordered={ false } 
            options={ opts } 
            trClassName='tr-middle'> 
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='user' width='120'>用户</TableHeaderColumn>
            <TableHeaderColumn dataField='method' width='70'>方法</TableHeaderColumn>
            <TableHeaderColumn dataField='url'>Url</TableHeaderColumn>
            <TableHeaderColumn dataField='at' width='150'>时间</TableHeaderColumn>
            <TableHeaderColumn dataField='ip' width='130'>来源IP</TableHeaderColumn>
            <TableHeaderColumn width='80' dataField='operation'/>
          </BootstrapTable>
        </div>
        { !indexLoading && options.total && options.total > 0 ?
          <PaginationList
            total={ options.total || 0 }
            curPage={ query.page || 1 }
            sizePerPage={ options.sizePerPage || 100 }
            paginationSize={ 4 }
            query={ query }
            refresh={ refresh }/>
          : '' }
      </div>
    );
  }
}
