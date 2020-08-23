import React, { PropTypes, Component } from 'react';
import { Modal, Button, OverlayTrigger, Popover, Grid, Row, Col, ControlLabel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
import { DetailMinWidth, DetailMaxWidth } from '../share/Constants';

const moment = require('moment');
const $ = require('$');
const img = require('../../assets/images/loading.gif');

const PaginationList = require('../share/PaginationList');
const EditModal = require('./EditModal');
const DetailBar = require('../issue/DetailBar');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.configs = { 
      cellWidth: 25, 
      blockHeight: 21, 
      minDays: 60 
    };
    this.state = { 
      range: [], 
      dates: [], 
      foldIssues: [],
      collection: [], 
      selectedIssue: {}, 
      markedIssue: {}, 
      detailBarShow: false,
      editModalShow: false
    };
    this.scrollSide = '';
    this.sortOptions = {
      'start_time_asc': 'expect_start_time asc,expect_complete_time_asc,no desc',
      'start_time_desc': 'expect_start_time desc,expect_complete_time desc,no desc',
      'create_time_asc': 'no asc',
      'create_time_desc': 'no desc'
    };
    this.state.sortkey = window.localStorage && window.localStorage.getItem('gantt-sortkey') || 'start_time_asc';
    this.state.mode = window.localStorage && window.localStorage.getItem('gantt-mode') || 'progress';
    this.addVtHeader = this.addVtHeader.bind(this);
    this.addHzHeader = this.addHzHeader.bind(this);
    this.addGrid = this.addGrid.bind(this);
    this.addBlocks = this.addBlocks.bind(this);
    this.setBoundaryDatesFromData = this.setBoundaryDatesFromData.bind(this);
    this.setDates = this.setDates.bind(this);
    this.updateData = this.updateData.bind(this);
    this.arrangeData = this.arrangeData.bind(this);
    this.clickBar = this.clickBar.bind(this);
    this.show = this.show.bind(this);
    this.fold = this.fold.bind(this);
    this.setSort = this.setSort.bind(this);
    this.selectMode = this.selectMode.bind(this);
    this.locate = this.locate.bind(this);
    this.locateToday = this.locateToday.bind(this);
    this.getDuration = this.getDuration.bind(this);
    this.closeDetail = this.closeDetail.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    isHeaderHidden: PropTypes.bool.isRequired,
    toggleHeader: PropTypes.func.isRequired,
    layout: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    wfCollection: PropTypes.array.isRequired,
    wfLoading: PropTypes.bool.isRequired,
    viewWorkflow: PropTypes.func.isRequired,
    indexComments: PropTypes.func.isRequired,
    sortComments: PropTypes.func.isRequired,
    addComments: PropTypes.func.isRequired,
    editComments: PropTypes.func.isRequired,
    delComments: PropTypes.func.isRequired,
    commentsCollection: PropTypes.array.isRequired,
    commentsIndexLoading: PropTypes.bool.isRequired,
    commentsLoading: PropTypes.bool.isRequired,
    commentsItemLoading: PropTypes.bool.isRequired,
    commentsLoaded: PropTypes.bool.isRequired,
    indexWorklog: PropTypes.func.isRequired,
    worklogSort: PropTypes.string.isRequired,
    sortWorklog: PropTypes.func.isRequired,
    addWorklog: PropTypes.func.isRequired,
    editWorklog: PropTypes.func.isRequired,
    delWorklog: PropTypes.func.isRequired,
    worklogCollection: PropTypes.array.isRequired,
    worklogIndexLoading: PropTypes.bool.isRequired,
    worklogLoading: PropTypes.bool.isRequired,
    worklogLoaded: PropTypes.bool.isRequired,
    indexHistory: PropTypes.func.isRequired,
    sortHistory: PropTypes.func.isRequired,
    historyCollection: PropTypes.array.isRequired,
    historyIndexLoading: PropTypes.bool.isRequired,
    historyLoaded: PropTypes.bool.isRequired,
    indexGitCommits: PropTypes.func.isRequired,
    sortGitCommits: PropTypes.func.isRequired,
    gitCommitsCollection: PropTypes.array.isRequired,
    gitCommitsIndexLoading: PropTypes.bool.isRequired,
    gitCommitsLoaded: PropTypes.bool.isRequired,
    itemData: PropTypes.object.isRequired,
    project: PropTypes.object,
    options: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    query: PropTypes.object,
    show: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    setAssignee: PropTypes.func.isRequired,
    setProgress: PropTypes.func.isRequired,
    setLabels: PropTypes.func.isRequired,
    addLabels: PropTypes.func.isRequired,
    fileLoading: PropTypes.bool.isRequired,
    delFile: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,
    record: PropTypes.func.isRequired,
    forward: PropTypes.func.isRequired,
    cleanRecord: PropTypes.func.isRequired,
    visitedIndex: PropTypes.number.isRequired,
    visitedCollection: PropTypes.array.isRequired,
    createLink: PropTypes.func.isRequired,
    delLink: PropTypes.func.isRequired,
    linkLoading: PropTypes.bool.isRequired,
    doAction: PropTypes.func.isRequired,
    watch: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    convert: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  async show(id) {
    this.setState({ detailBarShow: true });
    const { show, record } = this.props;
    const ecode = await show(id);  //fix me
    if (ecode == 0) {
      record();
    }
  }

  async componentWillMount() {
    const { index, query={} } = this.props;
    await index(query);
  }

  componentWillReceiveProps(nextProps) {
    const { index, query } = this.props;
    const newQuery = nextProps.query || {};
    if (!_.isEqual(newQuery, query)) {
      index(newQuery);
    }

    const { options: { singulars=[] } } = nextProps;
    if (nextProps.collection.length > 0) {
      if (this.state.collection.length <= 0) {
        this.arrangeData(nextProps.collection, this.state.sortkey);
      } else {
        this.arrangeData(this.arrangeCollection(nextProps.collection, this.state.collection));
      }
      this.setBoundaryDatesFromData(this.state.collection);
      this.setDates(singulars);
    } else {
      this.state.collection = [];
      this.state.markedIssue = {};
    }
  }

  arrangeCollection(pc, sc) {
    const data = [];
    // when creating the issue
    const pcLength = pc.length;
    for (let i = 0; i < pcLength; i++) {
      const ind = _.findIndex(sc, { id: pc[i].id });
      if (ind !== -1) {
        break;
      } else {
        data.push(pc[i]);
      }
    }
    _.forEach(sc, (v) => {
      const tmp = _.find(pc, { id: v.id });
      if (tmp) {
        data.push(tmp);
      }
    });
    return data;
  }

  arrangeData(collection, sortkey) {
    const { foldIssues } = this.state;
    //this.state.collection = collection;
    const standardIssues = _.filter(collection, (v) => !v.parent || !v.parent.id);
    const subtaskIssues = _.filter(collection, (v) => v.parent && v.parent.id);

    const parentIssues = [];
    const classifiedSubtasks = {};
    _.forEach(subtaskIssues, (v) => {
      if (classifiedSubtasks[v.parent.id]) {
        classifiedSubtasks[v.parent.id].push(v);
      } else {
        classifiedSubtasks[v.parent.id] = [ v ];
      }

      if (parentIssues.indexOf(v.parent.id) === -1) {
        parentIssues.push(v.parent);
      }
    });

    _.forEach(parentIssues, (v) => {
      if (sortkey) {
        this.sort(classifiedSubtasks[v.id], sortkey);
      } 
      const boundary = this.getBoundaryDatesFromData(classifiedSubtasks[v.id]);

      const i = _.findIndex(standardIssues, (v2) => v2.id == v.id);
      let p = v;
      if (i !== -1) {
        p = standardIssues[i];
      }
      p.expect_start_time = boundary[0]; 
      p.expect_complete_time = boundary[1]; 
      if (i === -1) {
        standardIssues.push(p);
      }
    });

    if (sortkey) {
      this.sort(standardIssues, sortkey);
    }

    const newIssues = [];
    _.forEach(standardIssues, (v, k) => {
      if (classifiedSubtasks[v.id]) {
        v.hasSubtasks = true;
      }
      newIssues.push(v);
      if (classifiedSubtasks[v.id]) {
        _.forEach(classifiedSubtasks[v.id], (v2) => {
          newIssues.push(v2);
        });
      }
    });

    this.state.collection = newIssues; 
  }

  sort(data, sortkey) {
    data.sort((a, b) => {
      if (sortkey == 'start_time_desc') {
        return (b.expect_start_time || b.expect_complete_time || b.created_at) - (a.expect_start_time || a.expect_complete_time || a.created_at);
      } else if (sortkey == 'start_time_asc') {
        return (a.expect_start_time || a.expect_complete_time || a.created_at) - (b.expect_start_time || b.expect_complete_time || b.created_at);
      } else if (sortkey == 'create_time_desc') {
        return b.no - a.no;
      } else if (sortkey == 'create_time_asc') {
        return a.no - b.no;
      }
    });
  }

  addVtHeader() {
    const { collection, mode, foldIssues, markedIssue } = this.state;
    const { options: { states=[] } } = this.props;

    const header = (
      <div className='ganttview-vtheader-series-header-item'>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '400px' } }>
          主题
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '60px' } }>
          NO
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
          经办人
        </div>
        { mode == 'progress' &&
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '80px' } }>
          进度
        </div> }
        { mode == 'status' &&
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '80px' } }>
          状态
        </div> }
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
          开始时间
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
          完成时间
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
          工期(天)
        </div>
        <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '50px' } }/>
      </div>
    );

    return (
      <div className='ganttview-vtheader'>
        <div className='ganttview-vtheader-item'>
          <div className='ganttview-vtheader-series' style={ { width: '950px' } }>
            { header }
            { _.map(_.reject(collection, (v) => v.parent && foldIssues.indexOf(v.parent.id) != -1), (v, key) => (
            <div className='ganttview-vtheader-series-item' key={ key } id={ v.id } onClick={ (e) => { e.preventDefault(); this.setState({ markedIssue: markedIssue.id == v.id ? {} : v }); } }>
              <div className='ganttview-vtheader-series-item-cell' style={ { textAlign: 'left', width: '400px' } }>
                <span style={ { paddingRight: '5px', paddingLeft: v.parent && v.parent.id ? '12px' : '0px', visibility: v.hasSubtasks ? 'visible' : 'hidden', cursor: 'pointer' } }>
                  { foldIssues.indexOf(v.id) !== -1 ? <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); this.fold(v.id) } }><i className='fa fa-plus-square-o'></i></a> : <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); this.fold(v.id) } }><i className='fa fa-minus-square-o'></i></a> }
                </span>
                <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); this.show(v.id) } } title={ v.title }>
                  <span style={ { marginLeft: '3px' } }>{ v.title }</span>
                </a>
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '60px' } }>
                { v.no } 
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.assignee && v.assignee.name || '-' } 
              </div>
              { mode == 'progress' &&
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '80px' } }>
                { v.progress ? v.progress + '%' : '0%' } 
              </div> }
              { mode == 'status' &&
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '80px' } }>
                { _.findIndex(states, { id: v.state }) !== -1 ? <span className={ 'state-' + _.find(states, { id: v.state }).category + '-label' }>{ _.find(states, { id: v.state }).name }</span> : '-' } 
              </div> }
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.expect_start_time ? moment.unix(v.expect_start_time).format('YYYY/MM/DD') : '-' } 
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.expect_complete_time ? moment.unix(v.expect_complete_time).format('YYYY/MM/DD') : '-' }
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.expect_complete_time && v.expect_start_time ? this.getDuration(v.expect_start_time, v.expect_complete_time) : '-' }
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '50px' } }>
                <a href='#' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); this.locate(v.expect_start_time || v.expect_complete_time || v.created_at); } }>
                  <i className='fa fa-dot-circle-o'></i>
                </a> 
              </div>
            </div> ) ) }
          </div>
        </div>
      </div>);
  }

  getDuration(start_time, complete_time) {
    const { options: { singulars=[] } } = this.props;

    const new_start_time = moment.unix(start_time).startOf('day').format('X') - 0; 
    const new_complete_time = moment.unix(complete_time).startOf('day').format('X') - 0; 

    let duration = 0;
    for (let i = new_start_time; i <= new_complete_time; i = i + 3600 * 24) {
      const m = moment.unix(i);
      const date = m.format('YYYY/MM/DD');
      const index = _.findIndex(singulars, { date });
      if (index !== -1) {
        if (singulars[index].notWorking !== 1) {
          duration += 1;
        }
        continue;
      }

      const week = m.format('d'); 
      if (week % 6 !== 0) {
        duration += 1;
      }
    }
    return duration;
  }

  addHzHeader() {  
    const cellWidth = this.configs.cellWidth; 
    const { dates } = this.state;
    const { options: { today = '' } } = this.props;

    const w = _.flatten(_.values(dates)).length * cellWidth + 'px';
    return (
      <div className='ganttview-hzheader'>
        <div className='ganttview-hzheader-months' style={ { width: w } }>
        { _.map(dates, (v, key) =>
          <div className='ganttview-hzheader-month' key={ v.date } style={ { width: v.length * cellWidth + 'px' } }>
            { key }
          </div> ) }
        </div>
        <div className='ganttview-hzheader-days' style={ { width: w } }>
          { _.map(_.flatten(_.values(dates)), (v) =>
            <div className={ 'ganttview-hzheader-day ' + (v.date == today ? 'ganttview-today' : (v.notWorking === 1 ? 'ganttview-weekend' : '')) } key={ v.date }>
              { v.day }
            </div> ) }
        </div>
      </div>);
  }

  addGrid() {
    const cellWidth = this.configs.cellWidth;
    const { collection, dates, foldIssues, markedIssue } = this.state;
    const { options: { today = '' } } = this.props;

    const dates2 = _.flatten(_.values(dates));
    return (
      <div 
        className='ganttview-grid' 
        style={ { width: dates2.length * cellWidth + 'px' } }>
      { _.map(_.reject(collection, (v) => v.parent && foldIssues.indexOf(v.parent.id) != -1), (v, key) => (
        <div 
          className='ganttview-grid-row' 
          style={ { width: dates2.length * cellWidth + 'px' } } 
          key={ v.id }>
        { _.map(dates2, (v2, key2) => 
          <div 
            className={ 'ganttview-grid-row-cell ' + (v2.date == today ? 'ganttview-today' : (v2.notWorking === 1 ? 'ganttview-weekend' : '')) } 
            style={ { backgroundColor: markedIssue.id == v.id ? '#FFFACD' : '' } }
            key={ v2.date }/> ) }
        </div> ) ) }
      </div>);
  }

  addBlocks() {
    const cellWidth = this.configs.cellWidth;
    const blockHeight = this.configs.blockHeight;

    const { options: { states=[] } } = this.props;
    const { mode, collection, range, foldIssues } = this.state;
    const origin = range[0];

    const stateColors = { new : '#ccc', inprogress: '#3db9d3', completed: '#3c9445' };

    return (
      <div className='ganttview-blocks'>
      { _.map(_.reject(collection, (v) => v.parent && foldIssues.indexOf(v.parent.id) != -1), (v, key) => {
        const popover=(
          <Popover id='popover-trigger-hover' style={ { maxWidth: '350px', padding: '15px 0px' } }>
            <Grid>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>主题</Col>
                <Col sm={ 8 }><div style={ { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' } }>{ v.title }</div></Col>
              </Row>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>开始时间</Col>
                <Col sm={ 8 }>{ v.expect_start_time ? moment.unix(v.expect_start_time).format('YYYY/MM/DD') : <span style={ { fontStyle: 'italic', color: '#aaa' } }>未指定</span> }</Col>
              </Row>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>结束时间</Col>
                <Col sm={ 8 }>{ v.expect_complete_time ? moment.unix(v.expect_complete_time).format('YYYY/MM/DD') : <span style={ { fontStyle: 'italic', color: '#aaa' } }>未指定</span> }</Col>
              </Row>
              { mode == 'progress' &&
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>进度</Col>
                <Col sm={ 8 }>{ v.progress ? v.progress + '%' : '0%' }</Col>
              </Row> }
              { mode == 'status' &&
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>状态</Col>
                <Col sm={ 8 }>{ _.findIndex(states, { id: v.state }) != -1 ? <span className={ 'state-' + _.find(states, { id: v.state }).category + '-label' }>{ _.find(states, { id: v.state }).name }</span>: '-' }</Col>
              </Row> }
            </Grid>
          </Popover>);

        const start = moment.unix(v.expect_start_time || v.expect_complete_time || v.created_at).startOf('day').format('X');
        const end = moment.unix(v.expect_complete_time || v.expect_start_time || v.created_at).startOf('day').format('X');
        const size = (end - start) / 3600 / 24 + 1;
        const offset = (start - origin) / 3600 / 24;

        const width = size * cellWidth - 3;

        let backgroundColor = '#ccc';
        if (mode == 'progress') {
          if ((!v.expect_start_time || !v.expect_complete_time) && (!v.progress || v.progress < 100)) {
            backgroundColor = '#555';
          } else {
            backgroundColor = v.hasSubtasks ? '#65c16f' : '#3db9d3';
          }
        } else if (mode == 'status') {
          const stateInd = _.findIndex(states, { id: v.state });
          if (stateInd !== -1) {
            const category = states[stateInd].category;
            if ((!v.expect_start_time || !v.expect_complete_time) && category !== 'completed') {
              backgroundColor = '#555';
            } else {
              backgroundColor = stateColors[category]; 
            }
          }
        }

        const progressBGColor = v.hasSubtasks ? '#3c9445' : '#2898b0';

        return (
          <div className='ganttview-block-container' key={ v.id }>
            <OverlayTrigger trigger={ [ 'hover', 'focus' ] } rootClose placement='top' overlay={ popover }>
              { v.hasSubtasks && foldIssues.indexOf(v.id) === -1 ?
              <div className='ganttview-block-parent' 
                id={ v.id }
                style={ { width: width + 'px', marginLeft: (offset * cellWidth + 1) + 'px' } }>
                <div className='ganttview-block-parent-left'/>
                <div className='ganttview-block-parent-right'/>
              </div>
              :
              <div 
                className={ 'ganttview-block ' + (v.hasSubtasks ? '' : 'ganttview-block-movable') } 
                id={ v.id }
                style={ { width: width + 'px', height: blockHeight + 'px', marginLeft: (offset * cellWidth + 1) + 'px', backgroundColor } }>
                { mode == 'progress' &&
                <div 
                  className='ganttview-block-progress' 
                  style={ { height: blockHeight + 'px', width: (width * _.min([ _.max([ v.progress || 0, 0 ]), 100 ]) / 100) + 'px', backgroundColor: progressBGColor } }/> }
              </div> }
            </OverlayTrigger>
          </div> ) } ) }
      </div> );
  }

  locateToday() {
    const cellWidth = this.configs.cellWidth;
    const { options: { today='' } } = this.props;
    if (!today) {
      return;
    }

    const containerWidth = $('div.ganttview-slide-container').width();
    const cellNum = _.floor(containerWidth / cellWidth / 2);

    const target = moment(today).subtract(cellNum, 'days').format('X');
    this.locate(target);
  }

  locate(target) {
    const cellWidth = this.configs.cellWidth;
    const { range } = this.state;
    const start = range[0];

    this.closeDetail();

    const offset = _.floor((target - start) / 3600 / 24 - 1) * cellWidth;
    const container = $('div.ganttview-slide-container');
    container.scrollLeft(offset);
  }

  async updateData(block) {
    const cellWidth = this.configs.cellWidth;
    const blockHeight = this.configs.blockHeight;
    const { edit } = this.props;
    const { range } = this.state;
    const start = range[0];

    const container = $('div.ganttview-slide-container');
    const scroll = container.scrollLeft();
    const offset = block.offset().left - container.offset().left - 1 + scroll;

    //console.log('scroll:', scroll, 'bleft:', block.offset().left, 'cleft:', container.offset().left, 'offset:', offset);

    const daysFromStart = _.round(offset / cellWidth);
    const newStart = _.add(start, daysFromStart * 3600 * 24);

    const width = block.outerWidth();
    const numberOfDays = _.round(width / cellWidth);
    const newEnd = _.add(newStart, (numberOfDays - 1) * 3600 * 24);

    const ecode = await edit(block.attr('id'), { expect_start_time: newStart, expect_complete_time: newEnd });
    if (ecode === 0) {
      notify.show('已更新。', 'success', 2000);
    } else {
      notify.show('更新失败。', 'error', 2000);
    }

    block.css('top', '0px').css('left', '0px').css('height', blockHeight).css('position', 'relative');
    //console.log(daysFromStart, newStart, numberOfDays, newEnd, block.attr('id'));
  }

  setDates(singulars) {
    const { range } = this.state;
    const start = range[0];
    const end = range[1];

    const dates = {};
    for (let i = start; i <= end; i = i + 3600 * 24) {
      const m = moment.unix(i);

      const date = m.format('YYYY/MM/DD');
      const month = m.format('YYYY/MM');
      const day = m.format('D');
      const week = m.format('d');

      const d = { date, day, notWorking: week % 6 === 0 ? 1 : 0 };
      const si = _.findIndex(singulars, { date });
      if (si !== -1) {
        d.notWorking = singulars[si].notWorking;
      }

      if (dates[month]) {
        dates[month].push(d);
      } else {
        dates[month] = [ d ];
      }
    }
    this.state.dates = dates;
  }

  getBoundaryDatesFromData(data) {
    let start = moment.unix(data[0].expect_start_time || data[0].expect_complete_time || data[0].created_at).startOf('day').format('X');
    let end = moment.unix(data[0].expect_complete_time || data[0].expect_start_time || data[0].created_at).startOf('day').format('X'); 
    _.forEach(data, (v) => {
      const expect_start_time = v.expect_start_time || v.expect_complete_time || v.created_at;
      if (start > expect_start_time) {
        start = expect_start_time;
      }

      const expect_complete_time = v.expect_complete_time || v.expect_start_time || v.created_at;
      if (end < expect_complete_time) {
        end = expect_complete_time;
      }
    });

    start = moment.unix(start).startOf('day').format('X');
    end = moment.unix(end).startOf('day').format('X');

    //let maxStamp = 0;
    //if (data.length > 50) {
    //  maxStamp = moment.unix(start).add(1, 'year').startOf('day').format('X');
    //} else {
    //  maxStamp = moment.unix(start).add(2, 'year').startOf('day').format('X');
    //}

    //if (maxStamp < end) {
    //  end = maxStamp; 
    //}

    return [ start - 0, end - 0 ]; 
  }

  setBoundaryDatesFromData(data) {
    const minDays = this.configs.minDays;

    const boundary = this.getBoundaryDatesFromData(data);
    let start = moment.unix(boundary[0]).subtract(1, 'days').format('X');
    let end = moment.unix(boundary[1]).add(15, 'days').format('X');

    let days = (end - start) / 3600 / 24 + 1;
    if (days < minDays) {
      end = moment.unix(start).add(minDays, 'days').format('X');
    }

    this.state.range = [ start - 0, end - 0 ];
  }

  componentDidUpdate(prevProps) {
    const { itemData, options, isHeaderHidden } = this.props;
    const { collection, markedIssue } = this.state;

    const self = this;

    $('.ganttview-vtheader-series-item').each(function(i) {
      if (markedIssue.id === $(this).attr('id')) {
        $(this).css('background-color', '#FFFACD');
      } else if (itemData.id === $(this).attr('id') && self.state.detailBarShow) {
        $(this).css('background-color', '#e6f7ff');
      } else {
        $(this).css('background-color', '');
      }
    });

    if (collection.length > 0) {
      const cellWidth = this.configs.cellWidth;

      let isIE = false; 
      if (navigator.userAgent.indexOf('compatible') !== -1 || navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
        isIE = true;
      }

      $('div.ganttview').css('height', _.min([ document.body.clientHeight - (isHeaderHidden ? 150 : 200), collection.length * 31 + (isIE ? 59 : 53) ]));//?

      //$('div.ganttview-slide-container').focus(function() {
      //  self.scrollSide = 'right'; 
      //});
      //$('div.ganttview-vtheader-item').focus(function() {
      //  self.scrollSide = 'left'; 
      //});

      $('div.ganttview-slide-container').scroll(function() {
        setTimeout(function() {
          $('div.ganttview-hzheader').css('top', $('div.ganttview-slide-container').scrollTop());
          $('div.ganttview-slide-container').scrollLeft(_.ceil($('div.ganttview-slide-container').scrollLeft() / cellWidth) * cellWidth);
          if ($('div.ganttview-vtheader-item').scrollTop() === $('div.ganttview-slide-container').scrollTop()) {
            return false;
          }
          $('div.ganttview-vtheader-item').scrollTop($('div.ganttview-slide-container').scrollTop());
        }, 200);
      });

      $('div.ganttview-vtheader-item').scroll(function() {
        setTimeout(function() {
          $('div.ganttview-vtheader-series-header-item').css('left', -$('div.ganttview-vtheader-item').scrollLeft());
          if ($('div.ganttview-vtheader-item').scrollTop() === $('div.ganttview-slide-container').scrollTop()) {
            return false;
          }
          $('div.ganttview-slide-container').scrollTop($('div.ganttview-vtheader-item').scrollTop());
          $('div.ganttview-hzheader').css('top', $('div.ganttview-slide-container').scrollTop());
        }, 200);
      });

      /*$('div.ganttview-slide-container').get(0).onmousewheel = function(e) {
        if (e.wheelDelta > 0) {
          $('div.ganttview-slide-container').scrollTop($('div.ganttview-slide-container').scrollTop() - 30);
        } else {
          $('div.ganttview-slide-container').scrollTop($('div.ganttview-slide-container').scrollTop() + 30);
        }

        $('div.ganttview-vtheader-item').scrollTop($('div.ganttview-slide-container').scrollTop());
        $('div.ganttview-hzheader').css('top', $('div.ganttview-slide-container').scrollTop());
        return false;
      }

      if (isFF) {
        $('div.ganttview-vtheader-item').css('overflowY', 'auto');
      }

      $('div.ganttview-vtheader-item').get(0).onmousewheel = function(e) {
        if (e.wheelDelta > 0) {
          $('div.ganttview-vtheader-item').scrollTop($('div.ganttview-vtheader-item').scrollTop() - 30);
        } else {
          $('div.ganttview-vtheader-item').scrollTop($('div.ganttview-vtheader-item').scrollTop() + 30);
        }

        $('div.ganttview-slide-container').scrollTop($('div.ganttview-vtheader-item').scrollTop());
        $('div.ganttview-hzheader').css('top', $('div.ganttview-slide-container').scrollTop());
        return false;
      }*/

      if (options.permissions && options.permissions.indexOf('edit_issue') === -1) {
        return;
      }

      $('div.ganttview-block-movable').unbind('dblclick').bind('dblclick', function() {
        const block = $(this);
        self.clickBar(block);
      });

      $('div.ganttview-block-movable').resizable({
        grid: cellWidth, 
        handles: 'e,w',
        start: function() {
          if ($(this).children('div.ganttview-block-progress').length > 0) {
            $(this).children('div.ganttview-block-progress').css('display', 'none');
          }
        },
        stop: function () {
          const block = $(this);
          const start = moment.unix(start).subtract(1, 'days').startOf('day').format('X'); 
          self.updateData(block);
          if ($(this).children('div.ganttview-block-progress').length > 0) {
            $(this).children('div.ganttview-block-progress').css('display', '');
          }
          //callback(block.data('block-data'));
        }
      });

      $('div.ganttview-block-movable').draggable({
        axis: 'x', 
        grid: [cellWidth, cellWidth],
        stop: function () {
          var block = $(this);
          self.updateData(block);
          //callback(block.data('block-data'));
        }
      });
    }
  }

  clickBar(block) {
    const { collection } = this.props;

    const id = block.attr('id')
    const issue = _.find(collection, { id });

    this.setState({ editModalShow: true, selectedIssue: issue });
  }

  closeDetail() {
    const { markedIssue } = this.state;

    const { layout } = this.props;
    const width = _.min([ _.max([ layout.containerWidth / 2, DetailMinWidth ]), DetailMaxWidth ]);
    const animateStyles = { right: -width };
    $('.animate-dialog').animate(animateStyles);

    setTimeout(() => {
      this.setState({ detailBarShow: false });
    }, 300);

    $('.ganttview-vtheader-series-item').each(function(i) {
      if (markedIssue.id === $(this).attr('id')) {
        $(this).css('background-color', '#FFFACD');
      } else {
        $(this).css('background-color', '');
      }
    });
    const { cleanRecord } = this.props;
    cleanRecord();
  }

  fold(issueId) {
    const index = this.state.foldIssues.indexOf(issueId);
    if (index !== -1) {
      this.state.foldIssues.splice(index, 1);
    } else {
      this.state.foldIssues.push(issueId);
    }

    this.setState({ foldIssues: this.state.foldIssues });
  }

  async setSort(sortkey) {
    this.arrangeData(this.props.collection, sortkey);
    if (window.localStorage) {
      window.localStorage.setItem('gantt-sortkey', sortkey);
    }
    this.setState({ sortkey });
    this.closeDetail();
    //const { index, query={} } = this.props;
    //await index(_.assign({}, query, { 'orderBy': this.sortOptions[sortkey] || 'no desc' }));
  }

  selectMode(mode) {
    if (window.localStorage) {
      window.localStorage.setItem('gantt-mode', mode);
    }
    this.setState({ mode });
  }

  render() {
    const { 
      i18n,
      isHeaderHidden,
      toggleHeader,
      layout,
      itemData={},
      loading,
      indexLoading,
      itemLoading,
      options={},
      show,
      record,
      forward,
      visitedIndex,
      visitedCollection,
      del,
      edit,
      create,
      setAssignee,
      setProgress,
      setLabels,
      addLabels,
      query,
      refresh,
      project,
      delFile,
      addFile,
      fileLoading,
      wfCollection,
      wfLoading,
      viewWorkflow,
      indexComments,
      sortComments,
      commentsCollection,
      commentsIndexLoading,
      commentsLoading,
      commentsLoaded,
      addComments,
      editComments,
      delComments,
      commentsItemLoading,
      indexWorklog,
      worklogSort,
      sortWorklog,
      worklogCollection,
      worklogIndexLoading,
      worklogLoading,
      worklogLoaded,
      addWorklog,
      editWorklog,
      delWorklog,
      indexHistory,
      sortHistory,
      historyCollection,
      historyIndexLoading,
      historyLoaded,
      indexGitCommits,
      sortGitCommits,
      gitCommitsCollection,
      gitCommitsIndexLoading,
      gitCommitsLoaded,
      createLink,
      delLink,
      linkLoading,
      watch,
      copy,
      move,
      convert,
      resetState,
      doAction,
      user } = this.props;
    const { mode, collection, selectedIssue } = this.state;

    return (
      <div>
        <div style={ { marginTop: '10px' } }>
          <a href='#' onClick={ (e) => { e.preventDefault(); this.setSort(this.state.sortkey === 'start_time_desc' ? 'start_time_asc' : 'start_time_desc') } }>
            <span style={ { marginLeft: '5px' } }>
              { (this.state.sortkey == 'start_time_asc' || this.state.sortkey == 'start_time_desc') && <i className={ this.state.sortkey == 'start_time_asc' ? 'fa fa-sort-amount-asc' : 'fa fa-sort-amount-desc' }></i> } 开始时间
            </span>
          </a>
          <a href='#' onClick={ (e) => { e.preventDefault(); this.setSort(this.state.sortkey === 'create_time_desc' ? 'create_time_asc' : 'create_time_desc') } }>
            <span style={ { marginLeft: '15px' } }>
              { (this.state.sortkey == 'create_time_asc' || this.state.sortkey == 'create_time_desc') && <i className={ this.state.sortkey == 'create_time_asc' ? 'fa fa-sort-amount-asc' : 'fa fa-sort-amount-desc' }></i> } 创建时间
            </span>
          </a>
          <a href='#' onClick={ (e) => { e.preventDefault(); this.locateToday(); } }>
            <span style={ { marginLeft: '15px' } }>
              <i className='fa fa-dot-circle-o'></i> 今天 
            </span>
          </a>
          { options.permissions && options.permissions.indexOf('edit_issue') !== -1 && <span style={ { marginLeft: '15px', fontSize: '12px', color: 'red' } }>注：移动或调整任务条将改变任务的开始时间和完成时间，也可通过双击任务条修改。</span> }
          <span style={ { float: 'right', marginRight: '5px' } }>
            { mode == 'progress' ?
            <span>按任务进度</span>
            :
            <a href='#' onClick={ (e) => { e.preventDefault(); this.selectMode('progress'); } }>按任务进度</a> }
            <span style={ { margin: '0px 2px' } }> | </span>
            { mode == 'status' ?
            <span>按问题状态</span>
            :
            <a href='#' onClick={ (e) => { e.preventDefault(); this.selectMode('status'); } }>按问题状态</a> }
            <a href='#' onClick={ (e) => {  e.preventDefault(); toggleHeader(); } } style={ { marginLeft: '8px' } }>
              <span style={ { border: '1px solid #ddd', borderRadius: '2px', padding: '0px 3px' } } title={ isHeaderHidden ? '展示头部' : '隐藏头部' }>
                <i className={ isHeaderHidden ? 'fa fa-angle-double-down' : 'fa fa-angle-double-up' }></i>
              </span>
            </a>
          </span>
        </div>
        { indexLoading && 
        <div style={ { textAlign: 'center', paddingTop: '50px' } }>
          <img src={ img } className='loading'/>
        </div> }
        { !indexLoading && collection.length <= 0 &&  
        <div style={ { textAlign: 'center', marginTop: '50px' } }>
          <span style={ { fontSize: '160px', color: '#FFC125' } } >
            <i className='fa fa-warning'></i>
          </span><br/>
          <span>抱歉，暂无满足该检索条件的数据。</span>
        </div> }
        { !indexLoading && collection.length > 0 &&  
        <div className='ganttview'>
          { this.addVtHeader() }
          <div className='ganttview-slide-container'>
            { this.addHzHeader() }
            { this.addGrid() }
            { this.addBlocks() }
          </div>
        </div> }
        { this.state.editModalShow &&
        <EditModal
          show
          i18n={ i18n }
          mode='progress'
          close={ () => { this.setState({ editModalShow: false }) } }          
          edit={ edit }
          data={ selectedIssue }/> }
        { this.state.detailBarShow &&
        <DetailBar
          i18n={ i18n }
          layout={ layout }
          create={ create }
          edit={ edit }
          del={ del }
          setAssignee={ setAssignee }
          setProgress={ setProgress }
          setLabels={ setLabels }
          addLabels={ addLabels }
          close={ this.closeDetail }
          options={ options }
          data={ itemData }
          record={ record }
          forward={ forward }
          visitedIndex={ visitedIndex }
          visitedCollection={ visitedCollection }
          issueCollection={ collection }
          show = { show }
          itemLoading={ itemLoading }
          loading={ loading }
          fileLoading={ fileLoading }
          project={ project }
          delFile={ delFile }
          addFile={ addFile }
          wfCollection={ wfCollection }
          wfLoading={ wfLoading }
          viewWorkflow={ viewWorkflow }
          indexComments={ indexComments }
          sortComments={ sortComments }
          commentsCollection={ commentsCollection }
          commentsIndexLoading={ commentsIndexLoading }
          commentsLoading={ commentsLoading }
          commentsItemLoading={ commentsItemLoading }
          commentsLoaded={ commentsLoaded }
          addComments={ addComments }
          editComments={ editComments }
          delComments={ delComments }
          indexWorklog={ indexWorklog }
          worklogSort={ worklogSort }
          sortWorklog={ sortWorklog }
          worklogCollection={ worklogCollection }
          worklogIndexLoading={ worklogIndexLoading }
          worklogLoading={ worklogLoading }
          worklogLoaded={ worklogLoaded }
          addWorklog={ addWorklog }
          editWorklog={ editWorklog }
          delWorklog={ delWorklog }
          indexHistory={ indexHistory }
          sortHistory={ sortHistory }
          historyCollection={ historyCollection }
          historyIndexLoading={ historyIndexLoading }
          historyLoaded={ historyLoaded }
          indexGitCommits={ indexGitCommits }
          sortGitCommits={ sortGitCommits }
          gitCommitsCollection={ gitCommitsCollection }
          gitCommitsIndexLoading={ gitCommitsIndexLoading }
          gitCommitsLoaded={ gitCommitsLoaded }
          linkLoading={ linkLoading }
          createLink={ createLink }
          delLink={ delLink }
          watch={ watch }
          copy={ copy }
          move={ move }
          convert={ convert }
          resetState={ resetState }
          doAction={ doAction }
          user={ user }/> }
        { !indexLoading && options.total && options.total > 0 ?
          <PaginationList
            total={ options.total || 0 }
            curPage={ query.page ? (query.page - 0) : 1 }
            sizePerPage={ options.sizePerPage || 100 }
            paginationSize={ 4 }
            query={ query }
            refresh={ refresh }/>
          : '' }
      </div>);
  }
}
