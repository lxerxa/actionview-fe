import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as DirectoryActions from 'redux/actions/DirectoryActions';

const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DirectoryActions, dispatch)
  };
}

@connect(({ i18n, session, directory }) => ({ i18n, session, directory }), mapDispatchToProps)
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
    directory: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index();
    return this.props.directory.ecode;
  }

  async create(values) {
    await this.props.actions.create(values);
    return this.props.directory.ecode;
  }

  async update(id, values) {
    await this.props.actions.update(id, values);
    return this.props.directory.ecode;
  }

  async test(id) {
    await this.props.actions.test(id);
    return this.props.directory.ecode;
  }

  async sync(id) {
    await this.props.actions.sync(id);
    return this.props.directory.ecode;
  }

  async invalidate(id, values) {
    await this.props.actions.invalidate(id, values);
    return this.props.directory.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(id);
    return this.props.directory.ecode;
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
          create={ this.create.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          test={ this.test.bind(this) } 
          sync={ this.sync.bind(this) } 
          invalidate={ this.invalidate.bind(this) } 
          del={ this.del.bind(this) } 
          i18n={ i18n }
          { ...this.props.directory }/>
      </div>
    );
  }
}
