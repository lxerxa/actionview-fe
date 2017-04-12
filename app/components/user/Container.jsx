import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as UserActions from 'redux/actions/UserActions';

const qs = require('qs');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UserActions, dispatch)
  };
}

@connect(({ user }) => ({ user }), mapDispatchToProps)
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
    user: PropTypes.object.isRequired
  }

  refresh(query) {
    const pathname = '/user';
    this.context.router.push({ pathname, query });
  }

  entry(pathname) {
    this.context.router.push({ pathname });
  }

  async index(query) {
    if (!query.page) { query.page = 1; }
    await this.props.actions.index(qs.stringify(query || {}));
    return this.props.user.ecode;
  }

  async create(values) {
    await this.props.actions.create(values);
    return this.props.user.ecode;
  }

  async update(id, values) {
    await this.props.actions.update(id, values);
    return this.props.user.ecode;
  }

  async close(id) {
    const { actions } = this.props;
    await actions.close(id);
    return this.props.user.ecode;
  }

  async reopen(id) {
    const { actions } = this.props;
    await actions.reopen(id);
    return this.props.user.ecode;
  }

  async renewPwd(id) {
    const { actions } = this.props;
    await actions.renewPwd(id);
    return this.props.user.ecode;
  }

  async multiClose(ids) {
    const { actions } = this.props;
    await actions.multiClose(ids);
    return this.props.user.ecode;
  }

  async multiReopen(ids) {
    const { actions } = this.props;
    await actions.multiReopen(ids);
    return this.props.user.ecode;
  }

  render() {
    const { location: { pathname, query={} } } = this.props;

    return (
      <div className='doc-container'>
        <List 
          index={ this.index.bind(this) } 
          entry={ this.entry.bind(this) } 
          refresh={ this.refresh.bind(this) } 
          create={ this.create.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          stop={ this.close.bind(this) } 
          reopen={ this.reopen.bind(this) } 
          multiStop={ this.multiClose.bind(this) }
          multiReopen={ this.multiReopen.bind(this) }
          query={ query }
          { ...this.props.user }/>
      </div>
    );
  }
}
