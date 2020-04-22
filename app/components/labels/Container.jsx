import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LabelsActions from 'redux/actions/LabelsActions';
import _ from 'lodash';

const qs = require('qs');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(LabelsActions, dispatch)
  };
}

@connect(({ i18n, project, labels }) => ({ i18n, project, labels }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired
  }

  refresh(query) {
    let pathname = '/project/' + this.pid + '/labels';
    this.context.router.push({ pathname, query });
  }

  async index(query) {
    query = query || {};
    if (!query.page) { query.page = 1; }
    await this.props.actions.index(this.pid, qs.stringify(query));
    return this.props.labels.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.labels.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.labels.ecode;
  }

  async del(values) {
    const { actions } = this.props;
    await actions.del(this.pid, values);
    return this.props.labels.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    const { location: { query={} } } = this.props;

    if (this.props.project.options) {
      _.assign(this.props.labels.options, this.props.project.options);
    }

    return (
      <div>
        <List 
          query={ query }
          index={ this.index.bind(this) } 
          refresh={ this.refresh.bind(this) }
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          i18n={ this.props.i18n }
          { ...this.props.labels }/>
      </div>
    );
  }
}
