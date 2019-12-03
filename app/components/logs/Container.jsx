import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as LogsActions from 'redux/actions/LogsActions';

const qs = require('qs');
const List = require('./List');
const Header = require('./Header');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(LogsActions, dispatch)
  };
}

@connect(({ i18n, session, logs }) => ({ i18n, session, logs }), mapDispatchToProps)
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
    logs: PropTypes.object.isRequired
  }

  refresh(query) {
    const pathname = '/admin/logs';
    this.context.router.push({ pathname, query });
  }

  entry(pathname) {
    this.context.router.push({ pathname });
  }

  async index(query) {
    if (!query) { query = {} }
    await this.props.actions.index(qs.stringify(_.assign({}, query, { page: query.page || 1 })));
    return this.props.logs.ecode;
  }

  exportExcel(query) {
    const newQuery = _.clone(query);
    newQuery.from = 'export';
    newQuery.page = 1;
    newQuery.limit = 1000000;

    const eleLink = document.createElement('a');
    eleLink.style.display = 'none';
    eleLink.href = '/api/logs?' + qs.stringify(newQuery || {});
    eleLink.target = '_blank';
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
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
        <Header
          index={ this.index.bind(this) }
          refresh={ this.refresh.bind(this) }
          query={ query }
          { ...this.props.logs }/>
        <List 
          index={ this.index.bind(this) }
          refresh={ this.refresh.bind(this) } 
          exportExcel={ this.exportExcel.bind(this) }
          query={ query }
          { ...this.props.logs }/>
      </div>
    );
  }
}
