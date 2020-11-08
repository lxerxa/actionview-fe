import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RemindsActions from 'redux/actions/RemindsActions';
import _ from 'lodash';

const qs = require('qs');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(RemindsActions, dispatch)
  };
}

@connect(({ i18n, project, reminds }) => ({ i18n, project, reminds }), mapDispatchToProps)
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
    reminds: PropTypes.object.isRequired
  }

  refresh(query) {
    let pathname = '/project/' + this.pid + '/reminds';
    this.context.router.push({ pathname, query });
  }

  async index(query) {
    query = query || {};
    if (!query.page) { query.page = 1; }
    await this.props.actions.index(this.pid, qs.stringify(query));
    return this.props.reminds.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.reminds.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.reminds.ecode;
  }

  async del(values) {
    const { actions } = this.props;
    await actions.del(this.pid, values);
    return this.props.reminds.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    const { location: { query={} } } = this.props;

    if (this.props.project.options) {
      _.assign(this.props.reminds.options, this.props.project.options);
    }

    return (
      <div>
        <List 
          query={ query }
          index={ this.index.bind(this) } 
          refresh={ this.refresh.bind(this) }
          select={ this.props.actions.select } 
          create={ this.create.bind(this) } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          i18n={ this.props.i18n }
          { ...this.props.reminds }/>
      </div>
    );
  }
}
