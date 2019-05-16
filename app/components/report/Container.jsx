import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ReportActions from 'redux/actions/ReportActions';

const qs = require('qs');
const List = require('./List');
const Worklog = require('./worklog/Worklog');
const Trend = require('./trend/Trend');
const TimeTracks = require('./timetracks/TimeTracks');
const Regressions = require('./regressions/Regressions');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ReportActions, dispatch)
  };
}

@connect(({ i18n, layout, project, report }) => ({ i18n, layout, project, report }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    report: PropTypes.object.isRequired
  }

  gotoIssue(query) {
    const pathname = '/project/' + this.pid + '/issue';
    this.context.router.push({ pathname, query });
  }

  refresh(query) {
    const { params: { mode } } = this.props;
    const pathname = '/project/' + this.pid + '/report/' + mode;
    this.context.router.push({ pathname, query });
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
    this.props.actions.getOptions(key);
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.report.ecode;
  }

  async worklog(query) {
    await this.props.actions.worklog(this.pid, qs.stringify(query || {}));
    return this.props.report.ecode;
  }

  async saveFilter(mode, values) {
    await this.props.actions.saveFilter(this.pid, mode, values);
    return this.props.report.ecode;
  }

  async resetFilter(mode) {
    await this.props.actions.resetFilter(this.pid, mode);
    return this.props.report.ecode;
  }

  async editFilter(mode, values) {
    await this.props.actions.editFilter(this.pid, mode, values);
    return this.props.report.ecode;
  }

  async getWorklogList(query) {
    await this.props.actions.getWorklogList(this.pid, qs.stringify(query || {}));
    return this.props.report.ecode;
  }

  async getWorklogDetail(issue_id, query) {
    await this.props.actions.getWorklogDetail(this.pid, issue_id, qs.stringify(query || {}));
    return this.props.report.ecode;
  }

  async trend(query) {
    await this.props.actions.trend(this.pid, qs.stringify(query || {}));
    return this.props.report.ecode;
  }

  async timetracks(query) {
    await this.props.actions.timetracks(this.pid, qs.stringify(query || {}));
    return this.props.report.ecode;
  }

  async getTimetrackDetail(issue_id) {
    await this.props.actions.getTimetrackDetail(this.pid, issue_id);
    return this.props.report.ecode;
  }

  async regressions(query) {
    await this.props.actions.regressions(this.pid, qs.stringify(query || {}));
    return this.props.report.ecode;
  }

  render() {
    const { location: { query={} }, params: { mode } } = this.props;
    return (
      <div>
        { !mode && 
        <List 
          i18n={ this.props.i18n }
          index={ this.index.bind(this) } 
          reset={ this.resetFilter.bind(this) } 
          edit={ this.editFilter.bind(this) } 
          project={ this.props.project.item }
          { ...this.props.report }/> }
        { mode == 'worklog' && 
        <Worklog 
          i18n={ this.props.i18n }
          layout={ this.props.layout }
          index={ this.worklog.bind(this) } 
          getWorklogList={ this.getWorklogList.bind(this) }
          getWorklogDetail={ this.getWorklogDetail.bind(this) }
          saveFilter={ this.saveFilter.bind(this) } 
          project={ this.props.project.item }
          query={ query }
          refresh={ this.refresh.bind(this) }
          { ...this.props.report }/> }
        { mode == 'trend' &&
        <Trend
          i18n={ this.props.i18n }
          layout={ this.props.layout }
          index={ this.trend.bind(this) }
          saveFilter={ this.saveFilter.bind(this) }
          project={ this.props.project.item }
          query={ query }
          refresh={ this.refresh.bind(this) }
          gotoIssue={ this.gotoIssue.bind(this) }
          { ...this.props.report }/> }
        { mode == 'timetracks' &&
        <TimeTracks
          i18n={ this.props.i18n }
          saveFilter={ this.saveFilter.bind(this) }
          project={ this.props.project.item }
          index={ this.timetracks.bind(this) }
          collection={ this.props.report.timetracks }
          indexLoading={ this.props.report.timetracksLoading }
          select={ this.getTimetrackDetail.bind(this) }
          item={ this.props.report.timetrackItem }
          itemLoading={ this.props.report.timetrackItemLoading }
          query={ query }
          refresh={ this.refresh.bind(this) }
          { ...this.props.report }/> }
        { mode == 'regressions' &&
        <Regressions
          i18n={ this.props.i18n }
          layout={ this.props.layout }
          saveFilter={ this.saveFilter.bind(this) }
          project={ this.props.project.item }
          index={ this.regressions.bind(this) }
          query={ query }
          refresh={ this.refresh.bind(this) }
          gotoIssue={ this.gotoIssue.bind(this) }
          { ...this.props.report }/> }
      </div>
    );
  }
}
