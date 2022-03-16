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
const Grids = require('./Grids');
const VtHeader = require('./VtHeader');
const HzHeader = require('./HzHeader');
const Blocks = require('./Blocks');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.configs = { 
      cellWidth: 25, 
      blockHeight: 20, 
      minDays: 60 
    };
    this.state = { 
      range: [], 
      dates: [], 
      foldIssues: [],
      collection: [], 
      linkedData: [],
      selectedIssue: {}, 
      markedIssue: {}, 
      detailBarShow: false,
      editModalShow: false
    };
    this.scrollSide = '';
    this.state.sortkey = window.localStorage && window.localStorage.getItem('gantt-sortkey') || 'start_time_asc';
    this.state.mode = window.localStorage && window.localStorage.getItem('gantt-mode') || 'progress';
    this.state.scaling = parseFloat(window.localStorage && window.localStorage.getItem('gantt-scaling') || '1');
    this.setBoundaryDatesFromData = this.setBoundaryDatesFromData.bind(this);
    this.setDates = this.setDates.bind(this);
    this.updateData = this.updateData.bind(this);
    this.arrangeData = this.arrangeData.bind(this);
    this.clickBar = this.clickBar.bind(this);
    this.show = this.show.bind(this);
    this.fold = this.fold.bind(this);
    this.setSort = this.setSort.bind(this);
    this.selectMode = this.selectMode.bind(this);
    this.mark = this.mark.bind(this);
    this.locate = this.locate.bind(this);
    this.locateToday = this.locateToday.bind(this);
    this.closeDetail = this.closeDetail.bind(this);
    this.changeScaling = this.changeScaling.bind(this);
    this.drawLinks = this.drawLinks.bind(this);
    this.getSrcAndDestXY = this.getSrcAndDestXY.bind(this);
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
    setItemValue: PropTypes.func.isRequired,
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

  changeScaling(sign) {
    let scaling = this.state.scaling;
    if (sign == '-') {
      if (scaling <= 0.6) {
        return;
      } 
      scaling -= 0.2; 
    } else {
      if (scaling >= 1) {
        return;
      } 
      scaling += 0.2; 
    }
    if (scaling > 1) { 
      scaling = 1; 
    }
    if (scaling < 0.6) { 
      scaling = 0.6; 
    }

    scaling = _.round(scaling, 1)
    if (window.localStorage) {
      window.localStorage.setItem('gantt-scaling', scaling);
    }

    this.setState({ scaling });
  }

  async show(id) {
    this.setState({ detailBarShow: true });
    const { show, record } = this.props;
    const ecode = await show(id);  //fix me
    if (ecode == 0) {
      record();
    }
  }

  //shouldComponentUpdate(newProps, newState) {
  //  if (!_.isEqual(newProps.query, this.props.query)) {
  //    return false;
  //  }
  //  return true;
  //}

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
      this.arrangeLinkedData(this.state.collection);
      this.setBoundaryDatesFromData(this.state.collection);
      this.setDates(singulars);
    } else {
      this.state.collection = [];
      this.state.markedIssue = {};
    }
  }

  arrangeLinkedData(collection) {
    const linkedData = [];
    _.forEach(collection, (v) => {
      _.forEach(v.links, (v2) => {
        let src_id = '', dest_id = '';
        if (v2.relation == 'blocks') {
          src_id = v2.src.id;
          dest_id = v2.dest.id;
        } else if (v2.relation == 'is blocked by') {
          src_id = v2.dest.id;
          dest_id = v2.src.id;
        } else {
          return;
        }

        if (_.findIndex(collection, { src_id, dest_id }) === -1) {
          linkedData.push({ src_id, dest_id });
        }
      });
    });

    this.state.linkedData = _.filter(linkedData, v => _.findIndex(collection, { id: v.src_id }) !== -1 && _.findIndex(collection, { id: v.dest_id }) !== -1);
  }

  drawLinks() {
    const { range, linkedData, collection } = this.state;

    const container = $('.ganttview-slide-container');
    if (container.find('canvas').length <= 0) {
      return;
    }

    $('canvas').attr('height', (parseInt($('div.ganttview-grid').css('height')) + 40) + 'px');
    $('canvas').attr('width', $('div.ganttview-grid').css('width'));

    const ctx = container.find('canvas')[0].getContext('2d');

    const cellWidth = this.configs.cellWidth;
    const offset = 10;
    const origin = range[0];

    const endArrows = [];

    _.forEach(linkedData, (v) => {

      const seXY = this.getSrcAndDestXY(v.src_id, v.dest_id);
      if (!seXY) {
        return;
      }

      let { sx, sy, ex, ey } = seXY;

      //sx = sx - container.scrollLeft();
      //ex = ex - container.scrollLeft();
      sy = sy + container.scrollTop();
      ey = ey + container.scrollTop();

      //绘制连接线条
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + cellWidth / 2 - 2, sy);

      let thirdY = 0;
      if (ey > sy) {
        thirdY = sy + 15;
      } else {
        thirdY = sy - 15;
      }
      ctx.lineTo(sx + cellWidth / 2 - 2, thirdY);

      let forthX = 0;
      let forthY = 0;
      if (ex - sx >= cellWidth) {
        forthX = sx + cellWidth / 2 - 2;
        forthY = ey;
      } else {
        forthX = ex - cellWidth / 2;
        forthY = thirdY;
      }
      ctx.lineTo(forthX, forthY);

      ctx.lineTo(ex - cellWidth / 2, ey);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      if (endArrows.indexOf(v.dest_id) === -1) {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(ex - cellWidth / 3, ey - 4);
        ctx.lineTo(ex, ey);
        ctx.lineTo(ex - cellWidth / 3, ey + 4);
        ctx.fillStyle = 'red';
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  getSrcAndDestXY(srcId, destId) {
    const cellWidth = this.configs.cellWidth;

    const { range, collection } = this.state;
    const origin = range[0];

    const sDiv = $('#' + srcId + '-block');
    const eDiv = $('#' + destId + '-block');
    if (sDiv.length <= 0 || eDiv.length <= 0) {
      return null;
    }

    const srcIssue = _.find(collection, { id: srcId });
    const destIssue = _.find(collection, { id: destId });
    if (!srcIssue || !destIssue) {
      return null;
    }

    const sStart = moment.unix(srcIssue.expect_start_time || srcIssue.expect_complete_time || srcIssue.created_at).startOf('day').format('X');
    const sEnd = moment.unix(srcIssue.expect_complete_time || srcIssue.expect_start_time || srcIssue.created_at).startOf('day').format('X');
    const sSize = (sEnd - sStart) / 3600 / 24 + 1;
    const sOffset = (sStart - origin) / 3600 / 24;

    const sy = sDiv.position().top + 10;
    const sx = sSize * cellWidth - 3 + sOffset * cellWidth;

    const eStart = moment.unix(destIssue.expect_start_time || destIssue.expect_complete_time || destIssue.created_at).startOf('day').format('X');
    const eOffset = (eStart - origin) / 3600 / 24;

    const ey = eDiv.position().top + 10;
    const ex = eOffset * cellWidth;

    return { sx, sy, ex, ey };
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
      } else if (sortkey == 'title_asc') {
        return a.title.localeCompare(b.title);
      }
    });
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

  mark(v) {
    const { markedIssue } = this.state;
    this.setState({ markedIssue: markedIssue.id == v.id ? {} : v });
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

    const ecode = await edit(block.attr('data-id'), { expect_start_time: newStart, expect_complete_time: newEnd });
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
    const { itemData, options, isHeaderHidden, user } = this.props;
    const { collection, markedIssue } = this.state;

    const self = this;

    $('.ganttview-vtheader-series-item').each(function(i) {
      if (markedIssue.id === $(this).attr('data-id')) {
        $(this).css('background-color', '#FFFACD');
      } else if (itemData.id === $(this).attr('data-id') && self.state.detailBarShow) {
        $(this).css('background-color', '#e6f7ff');
      } else {
        $(this).css('background-color', '');
      }
    });

    const cellWidth = this.configs.cellWidth;

    if (collection.length > 0) {
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

      let ssi = 0, ssj = 0;
      $('div.ganttview-slide-container').unbind('scroll').scroll(function() {
        ssi++;
        if (parseInt($('div.ganttview-hzheader').css('top')) != $('div.ganttview-slide-container').scrollTop()) {
          $('div.ganttview-hzheader').css('display', 'none');
        }
        setTimeout(function() {
          ssj++;
          if (ssi > ssj) {
            return;
          }
          $('div.ganttview-hzheader').css('top', $('div.ganttview-slide-container').scrollTop());
          $('div.ganttview-hzheader').css('display', '');
          $('div.ganttview-slide-container').scrollLeft(_.ceil($('div.ganttview-slide-container').scrollLeft() / cellWidth) * cellWidth);
          self.setState({});
          if ($('div.ganttview-vtheader-item').scrollTop() === $('div.ganttview-slide-container').scrollTop()) {
            return false;
          }
          $('div.ganttview-vtheader-item').scrollTop($('div.ganttview-slide-container').scrollTop());
        }, 200);
      });

      let svi = 0, svj = 0;
      $('div.ganttview-vtheader-item').unbind('scroll').scroll(function() {
        svi++;
        setTimeout(function() {
          svj++;
          if (svi > svj) {
            return;
          }
          $('div.ganttview-vtheader-series-header-item').css('left', -$('div.ganttview-vtheader-item').scrollLeft());
          if ($('div.ganttview-vtheader-item').scrollTop() === $('div.ganttview-slide-container').scrollTop()) {
            return false;
          }
          $('div.ganttview-slide-container').scrollTop($('div.ganttview-vtheader-item').scrollTop());
          $('div.ganttview-hzheader').css('top', $('div.ganttview-slide-container').scrollTop());
        }, 200);
      });
    }

    if (!(options.permissions && (options.permissions.indexOf('edit_issue') !== -1 || options.permissions.indexOf('edit_self_issue') !== -1))) {
      return;
    }

    _.forEach(collection, (v) => {
      if (v.hasSubtasks) {
        return;
      }

      if (options.permissions.indexOf('edit_issue') === -1) {
        if ((v.reporter && v.reporter.id) != user.id) {
          return;
        }
      } 

      $('#' + v.id + '-block').unbind('dblclick').bind('dblclick', function() {
        const block = $(this);
        self.clickBar(block);
      });

      $('#' + v.id + '-block').unbind('resizable').resizable({
        grid: cellWidth, 
        handles: 'e,w',
        start: function() {
          if ($(this).children('div.ganttview-block-progress').length > 0) {
            $(this).children('div.ganttview-block-progress').css('display', 'none');
          }
        },
        resize: function() {
          $(this).css('top', '0px').css('height', self.configs.blockHeight + 'px');
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

      $('#' + v.id + '-block').unbind('draggable').draggable({
        axis: 'x', 
        grid: [cellWidth, cellWidth],
        stop: function () {
          var block = $(this);
          self.updateData(block);
          //callback(block.data('block-data'));
        }
      });
    });

    this.drawLinks();
  }

  clickBar(block) {
    const { collection } = this.props;

    const id = block.attr('data-id')
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
      setItemValue,
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
      user 
    } = this.props;

    const { 
      scaling,
      mode, 
      collection, 
      selectedIssue,
      sortkey,
      foldIssues,
      dates,
      range,
      markedIssue
    } = this.state;

    this.configs.cellWidth = 25 * scaling;

    const canvasStyle = { 'position': 'absolute', 'top': '0px', 'left': '0px', 'zIndex': 10, 'marginTop': '0px', 'marginLeft': '0px' };

    return (
      <div>
        <div style={ { marginTop: '10px', height: '25px' } }>
          <span>
            <span style={ { marginRight: '5px', fontWeight: 600 } }>排序:</span> 
            { sortkey== 'start_time_asc' ?
              <span>开始时间</span>
              :
              <a href='#' onClick={ (e) => { e.preventDefault(); this.setSort('start_time_asc') } }>
                开始时间
              </a> }
            <span className='ganttview-divider'> | </span>
            { sortkey== 'create_time_asc' ?
              <span>创建时间</span>
              :
              <a href='#' onClick={ (e) => { e.preventDefault(); this.setSort('create_time_asc') } }>
                创建时间
              </a> }
            <span className='ganttview-divider'> | </span>
            { sortkey== 'title_asc' ?
              <span>主题</span>
              :
              <a href='#' onClick={ (e) => { e.preventDefault(); this.setSort('title_asc') } }>
                主题 
              </a> }
          </span>
          <span style={ { marginLeft: '15px' } }>
            <span style={ { marginRight: '5px', fontWeight: 600 } }> 显示:</span>
            { mode == 'progress' ?
              <span>按进度</span>
              :
              <a href='#' onClick={ (e) => { e.preventDefault(); this.selectMode('progress'); } }>按进度</a> }
            <span className='ganttview-divider'> | </span>
            { mode == 'status' ?
              <span>按状态</span>
              :
              <a href='#' onClick={ (e) => { e.preventDefault(); this.selectMode('status'); } }>按状态</a> }
          </span>
          <a href='#' onClick={ (e) => { e.preventDefault(); this.locateToday(); } }>
            <span style={ { marginLeft: '15px' } }>
              <i className='fa fa-dot-circle-o'></i> 今天 
            </span>
          </a>
          <span style={ { float: 'right', marginRight: '5px' } }>
            <span title='缩小' className={ scaling <= 0.6 || collection.length <= 0 ? 'ganttview-fa-button-disable' : 'ganttview-fa-button' } onClick={ (e) => { this.changeScaling('-') } }>
              <i className='fa fa-search-minus'></i>
            </span>
            <span title='放大' className={ scaling >= 1 || collection.length <= 0 ? 'ganttview-fa-button-disable' : 'ganttview-fa-button' } onClick={ (e) => { this.changeScaling('+') } }>
              <i className='fa fa-search-plus'></i>
            </span>
            <span className='ganttview-fa-button' title={ isHeaderHidden ? '展示头部' : '隐藏头部' } onClick={ toggleHeader }>
              <i className={ isHeaderHidden ? 'fa fa-angle-double-down' : 'fa fa-angle-double-up' }></i>
            </span>
          </span>
          { options.permissions && (options.permissions.indexOf('edit_issue') !== -1 || options.permissions.indexOf('edit_self_issue') !== -1) && <span className='ganttview-msg-notice'>注：移动或调整任务条将改变任务的开始时间和完成时间，也可通过双击任务条修改。</span> }
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
          <VtHeader
            collection={ collection }
            foldIssues={ foldIssues }
            selectedIssue={ itemData }
            options={ options }
            mode={ mode }
            show={ this.show }
            locate={ this.locate }
            mark={ this.mark }
            fold={ this.fold } />
          <div className='ganttview-slide-container'>
            <HzHeader
              cellWidth={ this.configs.cellWidth }
              dates={ dates }
              today={ options.today || '' } />
            <Grids
              cellWidth={ this.configs.cellWidth }
              collection={ collection }
              dates={ dates }
              foldIssues={ foldIssues }
              markedIssue={ markedIssue }
              today={ options.today || '' } />
            <Blocks
              cellWidth={ this.configs.cellWidth }
              blockHeight={ this.configs.blockHeight }
              collection={ collection }
              origin={ range[0] }
              mode={ mode }
              foldIssues={ foldIssues }
              selectedIssue={ itemData }
              options={ options } />
            <canvas style={ canvasStyle } />
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
          setItemValue={ setItemValue }
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
