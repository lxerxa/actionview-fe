import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ReportActions from 'redux/actions/ReportActions';

const qs = require('qs');
const List = require('./List');
const Worklog = require('./Worklog');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ReportActions, dispatch)
  };
}

@connect(({ i18n, project, report }) => ({ i18n, project, report }), mapDispatchToProps)
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
    project: PropTypes.object.isRequired,
    report: PropTypes.object.isRequired
  }

  refresh(query) {
    const { params: { mode } } = this.props;
    const pathname = '/project/' + this.pid + '/report/' + mode;
    this.context.router.push({ pathname, query });
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
    this.props.actions.getOptions();
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.report.ecode;
  }

  async worklog(query) {
    await this.props.actions.worklog(this.pid, qs.stringify(query || {}));
    return this.props.report.ecode;
  }

  async saveFilter(values) {
    await this.props.actions.saveFilter(this.pid, values);
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
          index={ this.worklog.bind(this) } 
          getWorklogList={ this.getWorklogList.bind(this) }
          getWorklogDetail={ this.getWorklogDetail.bind(this) }
          saveFilter={ this.saveFilter.bind(this) } 
          project={ this.props.project.item }
          query={ query }
          refresh={ this.refresh.bind(this) }
          { ...this.props.report }/> }
      </div>
    );
  }
}
