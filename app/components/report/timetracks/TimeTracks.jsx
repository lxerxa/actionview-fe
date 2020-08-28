import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, ControlLabel, Col, Table, ButtonGroup, Button, Radio, Checkbox } from 'react-bootstrap';
import Select from 'react-select';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import _ from 'lodash';
import { IssueFilterList, parseQuery } from '../../issue/IssueFilterList';
import { ttFormat } from '../../share/Funcs'
import SaveFilterModal from '../SaveFilterModal';
import Summary from './Summary';
import DetailModal from './DetailModal';

const moment = require('moment');
const img = require('../../../assets/images/loading.gif');

export default class TimeTracks extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      scale: 'all',
      selectedIds: [],
      detailShow: false,
      issueFilterShow: false, 
      saveFilterShow: false };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    optionsLoading: PropTypes.bool.isRequired,
    query: PropTypes.object,
    item: PropTypes.array.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    refresh: PropTypes.func.isRequired,
    saveFilter: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired
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
    this.setState({ scale: newQuery.scale ? newQuery.scale : 'all' });
  }

  search() {
    const { query={}, refresh } = this.props;

    const newQuery = _.assign({}, query);
    if (this.state.scale) {
      newQuery.scale = this.state.scale;
    } else {
      delete newQuery.scale;
    }

    refresh(newQuery);
  }

  showDetail(issue) {
    this.setState({ detailShow: true, selectedIssue: issue });
  }

  onSelectAll(isSelected, rows) {
    if (isSelected) {
      const length = rows.length;
      for (let i = 0; i < length; i++) {
        this.state.selectedIds.push(rows[i].id);
      }
    } else {
      this.state.selectedIds = [];
    }
    this.setState({ selectedIds: this.state.selectedIds });
  }

  onSelect(row, isSelected) {
    if (isSelected) {
      this.state.selectedIds.push(row.id);
    } else {
      const newSelectedIds = [];
      const length = this.state.selectedIds.length;
      for (let i = 0; i < length; i++) {
        if (this.state.selectedIds[i] !== row.id) {
          newSelectedIds.push(this.state.selectedIds[i]);
        }
      }
      this.state.selectedIds = newSelectedIds;
    }
    this.setState({ selectedIds: this.state.selectedIds });
  }

  render() {

    const { 
      i18n, 
      project, 
      filters, 
      options,
      options: { states=[], types=[] }, 
      optionsLoading, 
      collection, 
      indexLoading, 
      select,
      item,
      itemLoading,
      refresh, 
      query, 
      saveFilter } = this.props;

    let sqlTxt = '';
    if (!optionsLoading) {
      sqlTxt = '统计范围～' + (query.scale === 'only' ? '仅包含有初始预估时间of' : 'All issues');
      const issueSqlTxt = parseQuery(query, options);
      if (issueSqlTxt) {
        sqlTxt += ' | ' + issueSqlTxt;
      }
    }

    const { selectedIds } = this.state;

    const w2m = (options.w2d || 5) * (options.d2h || 8) * 60;
    const d2m = (options.d2h || 8) * 60;

    const  total = { origin_m: 0, spend_m: 0, left_m: 0 };
    _.forEach(collection, (v) => {
      if ((selectedIds.length > 0 && selectedIds.indexOf(v.id) !== -1) || selectedIds.length <= 0) {
        total.origin_m += (v.origin_m || 0);
        total.spend_m += (v.spend_m || 0);
        total.left_m += (v.left_m || 0);
      }
    });

    total.origin = ttFormat(total.origin_m, w2m, d2m);
    total.spend = ttFormat(total.spend_m, w2m, d2m);
    total.left = ttFormat(total.left_m, w2m, d2m);

    total.diff_m = total.origin_m - total.spend_m - total.left_m;
    total.diff = ttFormat(total.diff_m, w2m, d2m);

    const timetracks = [];
    const timetrackNum = collection.length;
    for (let i = 0; i < timetrackNum; i++) {
      const stateInd = collection[i].state ? _.findIndex(states, { id: collection[i].state }) : -1;
      let stateClassName = '';
      if (stateInd !== -1) {
        stateClassName = 'state-' + (states[stateInd].category || '') + '-label';
      }

      timetracks.push({
        id: collection[i].id,
        type: (
          <span className='type-abb' title={ _.findIndex(types, { id: collection[i].type }) !== -1 ? _.find(types, { id: collection[i].type }).name : '' }>
            { _.findIndex(types, { id: collection[i].type }) !== -1 ? _.find(types, { id: collection[i].type }).abb : '-' }
          </span>),
        name: (
          <div>
            { collection[i].spend_m > 0 ?
              <a href='#' onClick={ (e) => { e.preventDefault(); this.showDetail(collection[i]) } } style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
                <span>{ collection[i].no + ' - ' + collection[i].title }</span>
              </a>
              :
              <span style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>{ collection[i].no + ' - ' + collection[i].title }</span> }
          </div>
        ),
        state: stateInd !== -1 ? <span className={ stateClassName }>{ states[stateInd].name || '-' }</span> : '-',
        origin: collection[i].origin || '-',
        spend: collection[i].spend || '-',
        left: collection[i].left || '-',
        diff: collection[i].origin ? ttFormat(collection[i].origin_m - collection[i].spend_m - collection[i].left_m, w2m, d2m) : '-' 
      });
    }

    let selectRowProp = {};
    if (collection.length > 0) {
      selectRowProp = {
        mode: 'checkbox',
        selected: _.filter(this.state.selectedIds, (v) => v !== 'xxx'),
        unselectable: [ 'xxx' ],
        onSelect: this.onSelect.bind(this),
        onSelectAll: this.onSelectAll.bind(this)
      };
      timetracks.push({
        id: 'xxx',
        type: '',
        name: '合计',
        state: '',
        origin: total.origin,
        spend: total.spend,
        left: total.left,
        diff: total.diff
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = 'No data displayed';
    }

    return ( 
      <div className='project-report-container'>
        <div className='report-title'>
          问题时间跟踪报告 
          <Link to={ '/project/' + project.key + '/report' }>
            <Button bsStyle='link'>返回</Button>
          </Link>
        </div>
        <Form horizontal className='report-filter-form'>
          <FormGroup>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              统计范围
            </Col>
            <Col sm={ 4 }>
              <Select
                simpleValue
                clearable={ false }
                placeholder='set value'
                value={ this.state.scale }
                onChange={ (newValue) => { this.state.scale = newValue; this.search(); } }
                options={ [ { value: 'all', label: 'All issues' }, { value: 'only', label: '仅包含有初始预估时间of' } ] }/>
            </Col>
            <Col sm={ 7 }>
              <Button
                bsStyle='link'
                onClick={ () => { this.setState({ issueFilterShow: !this.state.issueFilterShow }) } }
                style={ { float: 'right', marginTop: '0px' } }>
                更多问题过滤 { this.state.issueFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
              </Button>
            </Col>
          </FormGroup>
        </Form>
        <div>
          <IssueFilterList
            values={ query }
            searchShow={ this.state.issueFilterShow }
            notShowFields={ [ 'watcher' ] }
            options={ options }
            onChange={ (newValue) => { refresh(newValue) } } />
        </div>
        <div className='report-conds-style'>
          { sqlTxt &&
          <div className='cond-bar' style={ { marginTop: '0px', float: 'left' } }>
            <div className='cond-contents' title={ sqlTxt }><b>检索条件</b>：{ sqlTxt }</div>
            <div className='remove-icon' onClick={ () => { refresh({}); } } title='清空当前检索'><i className='fa fa-remove'></i></div>
            <div className='remove-icon' onClick={ () => { this.setState({ saveFilterShow: true }); } } title='Save filter'><i className='fa fa-save'></i></div>
          </div> }
        </div>
        { !indexLoading && collection.length > 0 && <Summary options={ options } values={ total }/> }
        <div style={ { marginBottom: '30px' } }>
          <BootstrapTable selectRow={ selectRowProp } data={ timetracks } bordered={ false } headerStyle={ { backgroundColor: '#fff' } } hover options={ opts }>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='type' width='50'>Type</TableHeaderColumn>
            <TableHeaderColumn dataField='state' width='100'>Status</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='origin' width='120'>初始预估时间</TableHeaderColumn>
            <TableHeaderColumn dataField='spend' width='120'>Spent time</TableHeaderColumn>
            <TableHeaderColumn dataField='left' width='120'>Remaining time</TableHeaderColumn>
            <TableHeaderColumn dataField='diff' width='120'>误差</TableHeaderColumn>
          </BootstrapTable>
          { collection.length > 0 &&
          <div>
            <span>Total count { timetracks.length } Items</span>
          </div> }
        </div>
        { this.state.saveFilterShow &&
        <SaveFilterModal
          show
          close={ () => { this.setState({ saveFilterShow: false }) } }
          filters={ filters.data || [] }
          options={ options }
          save={ saveFilter }
          mode={ 'timetrack' }
          query={ query }
          sqlTxt={ sqlTxt }
          i18n={ i18n }/> }
        { this.state.detailShow &&
        <DetailModal
          show
          options={ this.props.options }
          close={ () => { this.setState({ detailShow: false }) } }
          issue={ this.state.selectedIssue }
          index={ select }
          data={ item }
          loading={ itemLoading }
          i18n={ i18n }/> }
      </div>
    );
  }
}
