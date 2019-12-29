import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const moment = require('moment');
const $ = require('$');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.configs = { 
      cellWidth: 25, 
      minDays: 75
    };
    this.state = { range: [], dates: [] };
    this.addVtHeader = this.addVtHeader.bind(this);
    this.addHzHeader = this.addHzHeader.bind(this);
    this.addGrid = this.addGrid.bind(this);
    this.addBlocks = this.addBlocks.bind(this);
    this.setBoundaryDatesFromData = this.setBoundaryDatesFromData.bind(this);
    this.setDates = this.setDates.bind(this);
    this.updateData = this.updateData.bind(this);
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

  async componentWillMount() {
    const { index, query={} } = this.props;
    let ecode = await index(query);
  }

  componentWillReceiveProps(nextProps) {
    const { options: { singulars=[] } } = nextProps;
    if (nextProps.collection.length > 0) {
      this.setBoundaryDatesFromData(nextProps.collection);
      this.setDates(singulars);
    }
  }

  addVtHeader() {
    const { collection } = this.props;

    return (
      <div className='ganttview-vtheader'>
        <div className='ganttview-vtheader-item'>
          <div className='ganttview-vtheader-series' style={ { width: '720px' } }>
            <div className='ganttview-vtheader-series-header-item'>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '400px' } }>
	        标题
	      </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
	        经办人 
	      </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
	        开始时间 
	      </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '90px' } }>
	        完成时间 
	      </div>
              <div className='ganttview-vtheader-series-header-item-cell' style={ { width: '50px' } }>
	        进度 
	      </div>
	    </div>
            { _.map(collection, (v, key) => (
            <div className='ganttview-vtheader-series-item' key={ key }>
              <div className='ganttview-vtheader-series-item-cell' style={ { textAlign: 'left', width: '400px' } }>
                <a href='#'>{ v.title }</a>
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                { v.assignee && v.assignee.name || '-' } 
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                2019/08/09
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '90px' } }>
                2019/08/09
              </div>
              <div className='ganttview-vtheader-series-item-cell' style={ { width: '50px' } }>
                80% 
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
    const { collection } = this.props;
    const { dates } = this.state;

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
    const { collection } = this.props;
    const { range } = this.state;
    const origin = range[0];

    return (
      <div className='ganttview-blocks'>
      { _.map(collection, (v, key) => {

        const start = moment.unix(v.expect_start_time || v.created_at).startOf('day').format('X');
        const end = moment.unix(v.expect_complete_time || v.created_at).startOf('day').format('X');
        const size = (end - start) / 3600 / 24 + 1;
        const offset = (start - origin) / 3600 / 24;

        const width = size * cellWidth - 3;

        return (
          <div className='ganttview-block-container' key={ key }>
            <div className='ganttview-block ganttview-block-movable' 
              id={ v.id }
              title='aabb' 
              style={ { width: width + 'px', marginLeft: (offset * cellWidth + 1) + 'px', backgroundColor: '#ddd' } }>
              <div style={ { height: '25px', width: (width * (v.progress || 0) / 100) + 'px', backgroundColor: '#65c16f' } }/>
            </div>
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

  setBoundaryDatesFromData(data) {
    const minDays = this.configs.minDays;

    let start = moment.unix(data[0].expect_start_time || data[0].created_at).startOf('day').format('X');
    let end = moment.unix(data[0].expect_complete_time || data[0].created_at).startOf('day').format('X'); 
    _.forEach(data, (v) => {
      const expect_start_time = v.expect_start_time || v.created_at;
      if (start > expect_start_time) {
        start = expect_start_time;
      }

      const expect_complete_time = v.expect_complete_time || v.created_at;
      if (end < expect_complete_time) {
        end = expect_complete_time;
      }
    });

    start = moment.unix(start).subtract(1, 'days').startOf('day').format('X');
    end = moment.unix(end).add(1, 'days').startOf('day').format('X');

    let days = (end - start) / 3600 / 24 + 1;
    if (days < minDays) {
      end = moment.unix(start).add(minDays, 'days').format('X');
    }

    this.state.range = [ start - 0, end - 0 ];
  }

  componentDidUpdate(prevProps) {
    const { collection } = this.props;

    if (prevProps.collection.length !== collection.length && collection.length > 0) {
      const self = this;
      const cellWidth = this.configs.cellWidth;

      $('.ganttview-block').unbind();

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

  render() {
    const { collection } = this.props;

    if (collection.length <= 0) {
      return <div/>;
    }

    return (
      <div className='ganttview'>
        { this.addVtHeader() }
        <div className='ganttview-slide-container'>
          { this.addHzHeader() }
	  { this.addGrid() }
	  { this.addBlocks() }
        </div>
      </div>);
  }
}
