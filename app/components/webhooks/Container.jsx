import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as WebhooksActions from 'redux/actions/WebhooksActions';

const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(WebhooksActions, dispatch)
  };
}

@connect(({ i18n, session, webhooks }) => ({ i18n, session, webhooks }), mapDispatchToProps)
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
    i18n: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    webhooks: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.webhooks.ecode;
  }

  async test() {
    await this.props.actions.test(this.pid);
    return this.props.webhooks.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.webhooks.ecode;
  }

  async update(id, values) {
    await this.props.actions.update(this.pid, id, values);
    return this.props.webhooks.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.webhooks.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
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
      <List 
        index={ this.index.bind(this) } 
        create={ this.create.bind(this) } 
        select={ this.props.actions.select } 
        update={ this.update.bind(this) } 
        del={ this.del.bind(this) } 
        test={ this.test.bind(this) } 
        i18n={ i18n }
        { ...this.props.webhooks }/>
    );
  }
}
