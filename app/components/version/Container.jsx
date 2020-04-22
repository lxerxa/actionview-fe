import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as VersionActions from 'redux/actions/VersionActions';
import _ from 'lodash';

const qs = require('qs');
const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(VersionActions, dispatch)
  };
}

@connect(({ i18n, project, version }) => ({ i18n, project, version }), mapDispatchToProps)
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
    version: PropTypes.object.isRequired
  }

  refresh(query) {
    let pathname = '/project/' + this.pid + '/version';
    this.context.router.push({ pathname, query });
  }

  async index(query) {
    query = query || {};
    if (!query.page) { query.page = 1; }
    await this.props.actions.index(this.pid, qs.stringify(query));
    return this.props.version.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.version.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.version.ecode;
  }

  async merge(values) {
    await this.props.actions.merge(this.pid, values);
    return this.props.version.ecode;
  }

  async release(values) {
    await this.props.actions.release(this.pid, values);
    return this.props.version.ecode;
  }

  async del(values) {
    const { actions } = this.props;
    await actions.del(this.pid, values);
    return this.props.version.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    const { location: { query={} } } = this.props;

    if (this.props.project.options) {
      _.assign(this.props.version.options, this.props.project.options);
    }

    return (
      <div>
        <Header 
          create={ this.create.bind(this) } 
          merge={ this.merge.bind(this) } 
          i18n={ this.props.i18n } 
          { ...this.props.version }/>
        <List 
          query={ query }
          index={ this.index.bind(this) } 
          refresh={ this.refresh.bind(this) }
          select={ this.props.actions.select } 
          release={ this.release.bind(this) } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          i18n={ this.props.i18n }
          { ...this.props.version }/>
      </div>
    );
  }
}
