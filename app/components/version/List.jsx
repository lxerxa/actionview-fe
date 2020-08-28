import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem, Label } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const ReleaseModal = require('./ReleaseModal');
const DelNotify = require('./DelNotify');
const PaginationList = require('../share/PaginationList');

var moment = require('moment');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      delNotifyShow: false, 
      operateShow: false, 
      hoverRowId: '' };
    this.editModalClose = this.editModalClose.bind(this);
    this.releaseModalClose = this.releaseModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    query: PropTypes.object,
    select: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    release: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, query } = this.props;
    index(query);
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { index, query } = this.props;
    if (!_.isEqual(newQuery, query)) {
      index(newQuery);
    }
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  releaseModalClose() {
    this.setState({ releaseModalShow: false });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  release(id) {
    this.setState({ releaseModalShow: true });
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
    if (eventKey === 'edit') {
      this.edit(hoverRowId);
    } else if (eventKey === 'del') {
      this.delNotify(hoverRowId);
    } else if (eventKey === 'release' || eventKey === 'unrelease') {
      this.release(hoverRowId);
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
      query,
      refresh,
      options={}, 
      collection, 
      selectedItem, 
      indexLoading, 
      itemLoading, 
      loading, 
      del, 
      release, 
      update } = this.props;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const versions = [];
    const versionNum = collection.length;
    for (let i = 0; i < versionNum; i++) {
      versions.push({
        id: collection[i].id,
        name: ( 
          <div>
            <span className='table-td-title'>{ collection[i].name }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        start_time: (
          <div style={ { display: 'table', width: '100%' } }>
            <div style={ { display: 'inline-block', float: 'left', margin: '3px', marginBottom: '6px' } }> 
              { collection[i].start_time ? moment.unix(collection[i].start_time).format('YYYY/MM/DD') : '-' }
            </div>
          </div>
        ),
        end_time: (
          <div style={ { display: 'table', width: '100%' } }>
            <div style={ { display: 'inline-block', float: 'left', margin: '3px', marginBottom: '6px', color: (collection[i].end_time && options.current_time > collection[i].end_time && collection[i].status !== 'released') ? 'red' : '#000' } }> 
              { collection[i].end_time ? moment.unix(collection[i].end_time).format('YYYY/MM/DD') : '-' }
            </div>
          </div>
        ),
        released_time: (
          <div style={ { display: 'table', width: '100%' } }>
            <div style={ { display: 'inline-block', float: 'left', margin: '3px', marginBottom: '6px' } }>
              { collection[i].released_time ? moment.unix(collection[i].released_time).format('YYYY/MM/DD') : '-' }
            </div>
          </div>
        ),
        issues: (
          <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
            <li>All issues - <Link to={ '/project/' + collection[i].project_key + '/issue?resolve_version=' + collection[i].id }>{ collection[i].all_cnt || 0 }</Link></li>
            <li>Unresolved - <Link to={ '/project/' + collection[i].project_key + '/issue?resolution=Unresolved&resolve_version=' + collection[i].id }><span style={ { color: 'red' } }>{ collection[i].unresolved_cnt || 0 }</span></Link></li>
          </ul>
        ),
        status: (
          <span>{ collection[i].status === 'released' ? <span style={ { color: '#009900' } } title='已发布'><i className='fa fa-check'></i></span> : '未发布' }</span>
        ),
        operation: (
          options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
          <div>
            { operateShow && hoverRowId === collection[i].id && !itemLoading &&
            <DropdownButton 
              pullRight 
              bsStyle='link' 
              style={ { textDecoration: 'blink' ,color: '#000' } } 
              key={ i } 
              title={ node } 
              id={ `dropdown-basic-${i}` } 
              onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='edit'>Edit</MenuItem>
              {/* collection[i].status == 'released' ? <MenuItem eventKey='unrelease'>Unrelease</MenuItem> : <MenuItem eventKey='release'>Release</MenuItem> */}
              { collection[i].status != 'released' && <MenuItem eventKey='release'>Release</MenuItem> }
              <MenuItem eventKey='del'>Delete</MenuItem>
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
      opts.noDataText = 'No data displayed';
    }

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);
    // opts.onMouseLeave = this.onMouseLeave.bind(this);

    return (
      <div style={ { marginBottom: '30px' } }>
        <BootstrapTable data={ versions } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
          <TableHeaderColumn dataField='start_time' width='120'>Start date</TableHeaderColumn>
          <TableHeaderColumn dataField='end_time' width='120'>End date</TableHeaderColumn>
          <TableHeaderColumn dataField='released_time' width='120'>Release date</TableHeaderColumn>
          <TableHeaderColumn dataField='issues' width='150'>Issue completion</TableHeaderColumn>
          <TableHeaderColumn dataField='status' width='100'>Status</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { !indexLoading && options.total && options.total > 0 ?
          <PaginationList
            total={ options.total || 0 }
            curPage={ query.page ? (query.page - 0) : 1 }
            sizePerPage={ options.sizePerPage || 50 }
            paginationSize={ 4 }
            query={ query }
            refresh={ refresh }/>
          : '' }
        { this.state.editModalShow && 
          <EditModal 
            show 
            close={ this.editModalClose } 
            edit={ update } 
            data={ selectedItem } 
            collection={ collection } 
            i18n={ i18n }/> }
        { this.state.delNotifyShow && 
          <DelNotify 
            show 
            close={ this.delNotifyClose } 
            data={ selectedItem } 
            versions={ collection }
            del={ del } 
            i18n={ i18n }/> }
        { this.state.releaseModalShow &&
          <ReleaseModal
            show
            loading={ loading }
            close={ this.releaseModalClose }
            data={ selectedItem }
            versions={ collection }
            release={ release }
            i18n={ i18n }/> }
      </div>
    );
  }
}
