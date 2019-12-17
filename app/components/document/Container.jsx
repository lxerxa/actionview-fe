import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as DocumentActions from 'redux/actions/DocumentActions';

const qs = require('qs');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DocumentActions, dispatch)
  };
}

@connect(({ i18n, session, project, document }) => ({ i18n, session, project, document }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
    this.directory = '0';
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    document: PropTypes.object.isRequired
  }

  refresh(query) {
    const pathname = '/project/' + this.pid + '/document' + (this.directory != '0' ? ('/' + this.directory) : '');
    this.context.router.push({ pathname, query });
  }

  async index(query) {
    await this.props.actions.index(this.pid, this.directory || '0', qs.stringify(query || {}));
    return this.props.document.ecode;
  }

  async createFolder(values) {
    await this.props.actions.createFolder(this.pid, { ...values, parent: this.directory });
    return this.props.document.ecode;
  }

  async update(id, values) {
    await this.props.actions.update(this.pid, id, values);
    return this.props.document.ecode;
  }

  async copy(values) {
    await this.props.actions.copy(this.pid, values);
    return this.props.document.ecode;
  }

  async move(values) {
    await this.props.actions.move(this.pid, values);
    return this.props.document.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.document.ecode;
  }

  componentWillMount() {
    const { params: { key, id } } = this.props;
    this.props.actions.getOptions(key);
    this.pid = key;
    this.directory = id || '0';
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id } } = nextProps;
    if (!_.isEqual(this.directory, id)) {
      this.directory = id || '0';
    }
  }

  render() {
    if (this.props.project.options) {
      _.assign(this.props.document.options, this.props.project.options);
    }

    const { i18n, location: { query={} } } = this.props;

    return (
      <List 
        user={ this.props.session.user }
        project_key={ this.pid }
        directory={ this.directory }
        index={ this.index.bind(this) } 
        refresh={ this.refresh.bind(this) } 
        createFolder={ this.createFolder.bind(this) } 
        select={ this.props.actions.select } 
        addFile={ this.props.actions.addFile } 
        sort={ this.props.actions.sort } 
        update={ this.update.bind(this) } 
        copy={ this.copy.bind(this) } 
        move={ this.move.bind(this) } 
        del={ this.del.bind(this) } 
        query={ query }
        i18n={ i18n }
        { ...this.props.document }/>
    );
  }
}
