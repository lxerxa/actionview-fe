import React, { PropTypes, Component } from 'react';
import { Modal, Button, OverlayTrigger, Popover, Grid, Row, Col, ControlLabel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const moment = require('moment');
const $ = require('$');
const img = require('../../assets/images/loading.gif');

const EditModal = require('./EditModal');
const DetailBar = require('../issue/DetailBar');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.configs = { 
      cellWidth: 25, 
      minDays: 75
    };
    this.state = { 
      range: [], 
      dates: [], 
      foldIssues: [],
      collection: [], 
      selectedIssue: {}, 
      sortkey: 'create_time_desc', 
      barShow: false,
      editModalShow: false
    };
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
    this.refresh = this.refresh.bind(this);
    this.setSort = this.setSort.bind(this);
    this.closeDetail = this.closeDetail.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
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
    this.setState({ barShow: true });
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
      this.state.foldIssues = [];
      this.arrangeData(nextProps.collection, [], this.state.sortkey);
      this.setBoundaryDatesFromData(nextProps.collection);
      this.setDates(singulars);
    }
  }

  arrangeData(collection, foldIssues, sortkey) {
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
      this.sort(classifiedSubtasks[v.id], sortkey);
      const boundary = this.getBoundaryDatesFromData(classifiedSubtasks[v.id]);

      const i = _.findIndex(standardIssues, (v2) => v2.id == v.id);
      let p = v;
      if (i !== -1) {
        p = standardIssues[i];
      }
      p.expect_start_time = boundary[0]; 
      p.expect_end_time = boundary[1]; 
      if (i === -1) {
        standardIssues.push(p);
      }
    });

    this.sort(standardIssues, sortkey);

    const newIssues = [];
    _.forEach(standardIssues, (v, k) => {
      if (classifiedSubtasks[v.id]) {
        v.hasChildren = true;
        v.isFolded = false;
      }
      if (foldIssues.indexOf(v.id) !== -1) {
        v.isFolded = true;
      }
      newIssues.push(v);
      if (classifiedSubtasks[v.id] && !v.isFolded) {
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
    const { collection } = this.state;

    return (
      <div className='ganttview-vtheader'>
        <div className='ganttview-vtheader-item'>
          <div className='ganttview-vtheader-series' style={ { width: '870px' } }>
            <div className='ganttview-vtheader-series-header-item'>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '400px' } }>
                标题
              </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '60px' } }>
                NO 
              </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
                经办人 
              </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '50px' } }>
                进度 
              </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
                开始时间 
              </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
                完成时间 
              </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
                工期(天) 
              </div>
            </div>
            { _.map(collection, (v, key) => (
            <div className='ganttview-vtheader-series-item' key={ key } id={ v.id }>
              <div className='ganttview-vtheader-series-item-cell' style={ { textAlign: 'left', width: '400px' } }>
                <span style={ { paddingRight: '5px', paddingLeft: v.parent && v.parent.id ? '10px' : '2px', visibility: v.hasChildren ? 'visible' : 'hidden', cursor: 'pointer' } }>
                  { v.isFolded ? <a href='#' onClick={ (e) => { e.preventDefault(); this.fold(v.id) } }><i className='fa fa-caret-down'></i></a> : <a href='#' onClick={ (e) => { e.preventDefault(); this.fold(v.id) } }><i className='fa fa-caret-up'></i></a> }
                </span>
                <a href='#' onClick={ (e) => { e.preventDefault(); this.show(v.id) } }>{ v.title }</a>
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '60px' } }>
                { v.no } 
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.assignee && v.assignee.name || '-' } 
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '50px' } }>
                { (v.progress || 0) + '%' } 
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.expect_start_time ? moment.unix(v.expect_start_time).format('YYYY/MM/DD') : '-' } 
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.expect_complete_time ? moment.unix(v.expect_complete_time).format('YYYY/MM/DD') : '-' }
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.expect_complete_time && v.expect_start_time ? (moment.unix(v.expect_complete_time).startOf('day').format('X') - moment.unix(v.expect_start_time).startOf('day').format('X')) / 3600 / 24 + 1 : '-' }
              </div>
            </div> ) ) }
          </div>
        </div>
      </div>);
  }

  addHzHeader() {  
    const cellWidth = this.configs.cellWidth; 
    const { dates } = this.state;

    const w = _.flatten(_.values(dates)).length * cellWidth + 'px';
    return (
      <div className='ganttview-hzheader'>
        <div className='ganttview-hzheader-months' style={ { width: w } }>
        { _.map(dates, (v, key) =>
          <div className='ganttview-hzheader-month' key={ key } style={ { width: v.length * cellWidth + 'px' } }>
            { key }
          </div> ) }
        </div>
        <div className='ganttview-hzheader-days' style={ { width: w } }>
          { _.map(_.flatten(_.values(dates)), (v, key) =>
            <div className={ v.notWorking === 1 ? 'ganttview-hzheader-day ganttview-weekend' : 'ganttview-hzheader-day' } key={ key }>
              { v.day }
            </div> ) }
        </div>
      </div>);
  }

  addGrid() {
    const cellWidth = this.configs.cellWidth;
    const { collection, dates } = this.state;

    const dates2 = _.flatten(_.values(dates));
    return (
      <div 
        className='ganttview-grid' 
        style={ { width: dates2.length * cellWidth + 'px' } }>
      { _.map(collection, (v, key) => (
        <div 
          className='ganttview-grid-row' 
          style={ { width: dates2.length * cellWidth + 'px' } } key={ key }>
        { _.map(dates2, (v2, key2) => 
          <div 
            className={  v2.notWorking === 1 ? 'ganttview-grid-row-cell ganttview-weekend' : 'ganttview-grid-row-cell' } 
            key={ key2 }/> ) }
        </div> ) ) }
      </div>);
  }

  addBlocks() {
    const cellWidth = this.configs.cellWidth;
    const { collection, range } = this.state;
    const origin = range[0];


    return (
      <div className='ganttview-blocks'>
      { _.map(collection, (v, key) => {

        const popover=(
          <Popover id='popover-trigger-hover' style={ { maxWidth: '350px', padding: '15px 0px' } }>
            <Grid>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>标题</Col>
                <Col sm={ 8 }>{ v.title }</Col>
              </Row>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>开始时间</Col>
                <Col sm={ 8 }>{ v.expect_start_time ? moment.unix(v.expect_start_time).format('YYYY/MM/DD') : '未指定' }</Col>
              </Row>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>结束时间</Col>
                <Col sm={ 8 }>{ v.expect_complete_time ? moment.unix(v.expect_complete_time).format('YYYY/MM/DD') : '未指定' }</Col>
              </Row>
              <Row>
                <Col sm={ 4 } componentClass={ ControlLabel } style={ { textAlign: 'right' } }>进度</Col>
                <Col sm={ 8 }>{ v.progress ? v.progress + '%' : '0%' }</Col>
              </Row>
            </Grid>
          </Popover>);
        const start = moment.unix(v.expect_start_time || v.expect_complete_time || v.created_at).startOf('day').format('X');
        const end = moment.unix(v.expect_complete_time || v.expect_start_time || v.created_at).startOf('day').format('X');
        const size = (end - start) / 3600 / 24 + 1;
        const offset = (start - origin) / 3600 / 24;

        const width = size * cellWidth - 3;

        return (
          <div className='ganttview-block-container' key={ key }>
            <OverlayTrigger trigger={ [ 'hover', 'focus' ] } rootClose placement='bottom' overlay={ popover }>
              <div className='ganttview-block ganttview-block-movable' 
                id={ v.id }
                style={ { width: width + 'px', marginLeft: (offset * cellWidth + 1) + 'px', backgroundColor: '#ddd' } }>
                <div style={ { height: '23px', width: (width * (v.progress || 0) / 100) + 'px', backgroundColor: '#65c16f' } }/>
              </div>
            </OverlayTrigger>
          </div> ) } ) }
      </div> );
  }

  updateData(block) {
    const cellWidth = this.configs.cellWidth;
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

    const ecode = edit(block.attr('id'), { expect_start_time: newStart, expect_end_time: newEnd });
    if (ecode === 0) {
      notify.show('已更新。', 'success', 2000);
    } else {
      notify.show('更新失败。', 'error', 2000);
    }
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

      const d = { day, notWorking: week % 6 === 0 ? 1 : 0 };
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

    return [ start - 0, end - 0 ]; 
  }

  setBoundaryDatesFromData(data) {
    const minDays = this.configs.minDays;

    const boundary = this.getBoundaryDatesFromData(data);
    let start = moment.unix(boundary[0]).subtract(1, 'days').format('X');
    let end = moment.unix(boundary[1]).add(1, 'days').format('X');

    let days = (end - start) / 3600 / 24 + 1;
    if (days < minDays) {
      end = moment.unix(start).add(minDays, 'days').format('X');
    }

    this.state.range = [ start - 0, end - 0 ];
  }

  componentDidUpdate(prevProps) {
    const { collection, itemData } = this.props;

    const self = this;
    if (this.state.barShow) {
      $('.ganttview-vtheader-series-item').each(function(i) {
        if (itemData.id === $(this).attr('id')) {
          $(this).css('background-color', '#eee');
        } else {
          $(this).css('background-color', '');
        }
      });
    }

    if (prevProps.collection.length !== collection.length && collection.length > 0) {
      const self = this;
      const cellWidth = this.configs.cellWidth;

      $('.ganttview-block').unbind();

      $('.ganttview-block').dblclick(function() {
        const block = $(this);
        self.clickBar(block);
      });

      $('.ganttview-block').resizable({
        grid: cellWidth, 
        handles: 'e,w',
        stop: function () {
          const block = $(this);
          const start = moment.unix(start).subtract(1, 'days').startOf('day').format('X'); 
          self.updateData(block);
          //callback(block.data('block-data'));
        }
      });

      $('.ganttview-block').draggable({
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
    this.setState({ barShow: false });
    $('.ganttview-vtheader-series-item').css('background-color', '');
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

    this.arrangeData(this.props.collection, this.state.foldIssues, this.state.sortkey)
    this.setState({ collection: this.state.collection });
  }

  async refresh() {
    const { index, query={} } = this.props;
    await index(query);
  }

  setSort(sortkey) {
    this.arrangeData(this.props.collection, this.state.foldIssues, sortkey);
    this.setState({ sortkey });
  }

  render() {
    const { 
      i18n,
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
    const { collection, selectedIssue } = this.state;

    if (indexLoading) {
      return (
        <div style={ { marginTop: '50px' } }>
          <div className='detail-view-blanket' style={ { display: 'block' } }>
            <img src={ img } className='loading'/>
          </div>
        </div>);
    } else if (collection.length <= 0) {
      return <div/>;
    }

    return (
      <div>
        <div style={ { marginTop: '10px' } }>
          <a href='#' onClick={ (e) => { e.preventDefault(); this.setSort(this.state.sortkey === 'start_time_desc' ? 'start_time_asc' : 'start_time_desc') } }>
            <span style={ { marginLeft: '5px', float: 'left' } }>
              <i className={ this.state.sortkey == 'start_time_asc' ? 'fa fa-sort-amount-asc' : 'fa fa-sort-amount-desc' }></i> 开始时间
            </span>
          </a>
          <a href='#' onClick={ (e) => { e.preventDefault(); this.setSort(this.state.sortkey === 'create_time_desc' ? 'create_time_asc' : 'create_time_desc') } }>
            <span style={ { marginLeft: '15px', float: 'left' } }>
              <i className={ this.state.sortkey == 'create_time_asc' ? 'fa fa-sort-amount-asc' : 'fa fa-sort-amount-desc' }></i> 创建时间
            </span>
          </a>
          <span style={ { marginLeft: '15px' } }>备注备注注备注注备注注备注注备注注备注</span>
          <a href='#' onClick={ (e) => { e.preventDefault(); this.refresh() } }><span style={ { marginRight: '5px', float: 'right' } }><i className='fa fa-refresh'></i> 刷新</span></a>
        </div>
        <div className='ganttview'>
          { this.addVtHeader() }
          <div className='ganttview-slide-container'>
            { this.addHzHeader() }
            { this.addGrid() }
            { this.addBlocks() }
          </div>
          { this.state.editModalShow &&
          <EditModal
            show
            i18n={ i18n }
            mode='progress'
            close={ () => { this.setState({ editModalShow: false }) } }          
            edit={ edit }
            data={ selectedIssue }/> }
          { this.state.barShow &&
          <DetailBar
            i18n={ i18n }
            layout={ layout }
            create={ create }
            edit={ edit }
            del={ del }
            setAssignee={ setAssignee }
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
        </div>
      </div>);
  }
}
