import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as ProjectActions from 'redux/actions/ProjectActions';

const qs = require('qs');
const List = require('./List');
const Mylist = require('./Mylist');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProjectActions, dispatch)
  };
}

@connect(({ session, project }) => ({ session, project }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  }

  refresh(query) {
    const pathname = '/admin/project';
    this.context.router.push({ pathname, query });
  }

  entry(pathname) {
    this.context.router.push({ pathname });
  }

  async index(query) {
    if (!query.page) { query.page = 1; }
    await this.props.actions.index(qs.stringify(query || {}));
    return this.props.project.ecode;
  }

  async myIndex(query) {
    await this.props.actions.myIndex(qs.stringify(query || {}));
    return this.props.project.ecode;
  }

  async more(query) {
    await this.props.actions.more(qs.stringify(query || {}));
    return this.props.project.ecode;
  }

  async create(values) {
    await this.props.actions.create(values);
    return this.props.project.ecode;
  }

  async update(id, values) {
    await this.props.actions.update(id, values);
    return this.props.project.ecode;
  }

  async close(id) {
    const { actions } = this.props;
    await actions.close(id);
    return this.props.project.ecode;
  }

  async reopen(id) {
    const { actions } = this.props;
    await actions.reopen(id);
    return this.props.project.ecode;
  }

  async createIndex(id) {
    alert('aa');
  }

  async multiClose(ids) {
    const { actions } = this.props;
    await actions.multiClose(ids);
    return this.props.project.ecode;
  }

  async multiReopen(ids) {
    const { actions } = this.props;
    await actions.multiReopen(ids);
    return this.props.project.ecode;
  }

  async multiCreateIndex(ids) {
    alert('aa');
  }

  async show(id) {
    const { actions } = this.props;
    await actions.show(id);
    return this.props.project.ecode;
  }

  async getOptions() {
    const { actions } = this.props;
    await actions.getOptions();
    return this.props.project.ecode;
  }

  render() {
    const { session, location: { pathname, query={} } } = this.props;

    if (_.isEmpty(session.user)) {
      return (<div/>);
    } else if (!session.user.permissions || !session.user.permissions.sys_admin) {
      notify.show('权限不足。', 'warning', 2000);
      return (<div/>);
    }

    return (
      <div className='doc-container'>
        { pathname.indexOf('admin') === 1 ?
        <List 
          index={ this.index.bind(this) } 
          entry={ this.entry.bind(this) } 
          refresh={ this.refresh.bind(this) } 
          create={ this.create.bind(this) } 
          show={ this.show.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          stop={ this.close.bind(this) } 
          reopen={ this.reopen.bind(this) } 
          createIndex={ this.createIndex.bind(this) }
          multiStop={ this.multiClose.bind(this) }
          multiReopen={ this.multiReopen.bind(this) }
          multiCreateIndex={ this.multiCreateIndex.bind(this) }
          getOptions={ this.getOptions.bind(this) } 
          query={ query }
          { ...this.props.project }/>
        :
        <Mylist
          index={ this.myIndex.bind(this) }
          more={ this.more.bind(this) }
          entry={ this.entry.bind(this) }
          create={ this.create.bind(this) }
          select={ this.props.actions.select } 
          show={ this.show.bind(this) }
          update={ this.update.bind(this) }
          stop={ this.close.bind(this) }
          reopen={ this.reopen.bind(this) }
          createIndex={ this.createIndex.bind(this) }
          user={ this.props.session.user }
          { ...this.props.project }/> }
      </div>
    );
  }
}
