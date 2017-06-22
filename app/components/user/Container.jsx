import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as UserActions from 'redux/actions/UserActions';

const qs = require('qs');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UserActions, dispatch)
  };
}

@connect(({ i18n, session, user }) => ({ i18n, session, user }), mapDispatchToProps)
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
    i18n: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  refresh(query) {
    const pathname = '/admin/user';
    this.context.router.push({ pathname, query });
  }

  entry(pathname) {
    this.context.router.push({ pathname });
  }

  async index(query) {
    if (!query) { query = {} }
    if (!query.page) { query.page = 1; }
    await this.props.actions.index(qs.stringify(query));
    return this.props.user.ecode;
  }

  async create(values) {
    await this.props.actions.create(values);
    return this.props.user.ecode;
  }

  async imports(values) {
    await this.props.actions.imports(values);
    return this.props.user.ecode;
  }

  async update(id, values) {
    await this.props.actions.update(id, values);
    return this.props.user.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(id);
    return this.props.user.ecode;
  }

  async renewPwd(id) {
    const { actions } = this.props;
    await actions.renewPwd(id);
    return this.props.user.ecode;
  }

  async multiRenewPwd(ids) {
    const { actions } = this.props;
    await actions.multiRenewPwd(ids);
    return this.props.user.ecode;
  }

  async multiDel(ids) {
    const { actions } = this.props;
    await actions.multiDel(ids);
    return this.props.user.ecode;
  }

  render() {
    const { i18n, session, location: { pathname, query={} } } = this.props;

    if (_.isEmpty(session.user)) {
      return (<div/>);
    } else if (!session.user.permissions || !session.user.permissions.sys_admin) {
      notify.show(i18n.errMsg[-10002], 'warning', 2000);
      return (<div/>);
    }

    return (
      <div className='doc-container'>
        <List 
          index={ this.index.bind(this) } 
          entry={ this.entry.bind(this) } 
          refresh={ this.refresh.bind(this) } 
          create={ this.create.bind(this) } 
          imports={ this.imports.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          renew={ this.renewPwd.bind(this) } 
          del={ this.del.bind(this) } 
          multiRenew={ this.multiRenewPwd.bind(this) }
          multiDel={ this.multiDel.bind(this) }
          query={ query }
          i18n={ i18n }
          { ...this.props.user }/>
      </div>
    );
  }
}
