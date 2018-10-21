import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Panel } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as WikiActions from 'redux/actions/WikiActions';

const qs = require('qs');
const List = require('./List');
const Preview = require('./Preview');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(WikiActions, dispatch)
  };
}

@connect(({ i18n, session, project, wiki }) => ({ i18n, session, project, wiki }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
    this.directory = 'root';
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
    wiki: PropTypes.object.isRequired
  }

  reload(query) {
    const pathname = '/project/' + this.pid + '/wiki' + (this.directory != 'root' ? ('/' + this.directory) : '');
    this.context.router.push({ pathname, query });
  }

  async show(id, version) {
    await this.props.actions.show(this.pid, id, version);
    return this.props.wiki.ecode;
  }

  async index(query) {
    await this.props.actions.index(this.pid, this.directory == 'root' ? '0' : this.directory, qs.stringify(query || {}));
    return this.props.wiki.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, this.directory, values);
    return this.props.wiki.ecode;
  }

  async update(id, values) {
    await this.props.actions.update(this.pid, id, values);
    return this.props.wiki.ecode;
  }

  async show(fid, v) {
    await this.props.actions.show(this.pid, fid, v);
    return this.props.wiki.ecode;
  }

  async checkin(fid) {
    await this.props.actions.checkin(this.pid, fid);
    return this.props.wiki.ecode;
  }

  async checkout(fid) {
    await this.props.actions.checkout(this.pid, fid);
    return this.props.wiki.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.wiki.ecode;
  }

  componentWillMount() {
    const { params: { key, id, fid } } = this.props;
    this.pid = key;
    this.directory = id || '0';
    this.fid = fid || '';
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id, fid } } = nextProps;
    if (!_.isEqual(this.directory, id)) {
      this.directory = id || 'root';
    }
    if (!_.isEqual(this.fid, fid)) {
      this.fid = fid || '';
    }
  }

  render() {
    if (this.props.project.options) {
      _.assign(this.props.wiki.options, this.props.project.options);
    }

    const { i18n, location: { query={} } } = this.props;

    return (
      this.fid ?
      <Preview
        i18n={ i18n }
        project_key={ this.pid }
        fid={ this.fid }
        update={ this.update.bind(this) }
        show={ this.show.bind(this) }
        checkin={ this.checkin.bind(this) }
        checkout={ this.checkout.bind(this) }
        del={ this.del.bind(this) }
        reload={ this.reload.bind(this) } 
        user={ this.props.session.user }
        { ...this.props.wiki }/>
      :
      <List 
        project_key={ this.pid }
        directory={ this.directory == 'root' ? '0' : this.directory }
        index={ this.index.bind(this) } 
        reload={ this.reload.bind(this) } 
        create={ this.create.bind(this) } 
        select={ this.props.actions.select } 
        checkin={ this.checkin.bind(this) }
        checkout={ this.checkout.bind(this) }
        update={ this.update.bind(this) } 
        del={ this.del.bind(this) } 
        query={ query }
        user={ this.props.session.user }
        i18n={ i18n }
        { ...this.props.wiki }/>
    );
  }
}
