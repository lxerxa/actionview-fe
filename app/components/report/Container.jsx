import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ReportActions from 'redux/actions/ReportActions';
const List = require('./List');
const Worklog = require('./Worklog');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ReportActions, dispatch)
  };
}

@connect(({ project, report }) => ({ project, report }), mapDispatchToProps)
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

  async worklog() {
    await this.props.actions.worklog(this.pid);
    return this.props.report.ecode;
  }

  render() {
    const { location: { query={} }, params: { mode } } = this.props;
    return (
      <div>
        { !mode && 
        <List 
          index={ this.index.bind(this) } 
          project={ this.props.project.item }
          { ...this.props.report }/> }
        { mode == 'worklog' && 
        <Worklog 
          index={ this.worklog.bind(this) } 
          project={ this.props.project.item }
          query={ query }
          refresh={ this.refresh.bind(this) }
          { ...this.props.report }/> }
      </div>
    );
  }
}
