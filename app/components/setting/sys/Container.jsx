import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SyssettingActions from 'redux/actions/SyssettingActions';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SyssettingActions, dispatch)
  };
}

@connect(({ i18n, session, syssetting }) => ({ i18n, session, syssetting }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    syssetting: PropTypes.object.isRequired
  }

  async show() {
    await this.props.actions.show();
    return this.props.syssetting.ecode;
  }

  async update(values) {
    await this.props.actions.update(values);
    return this.props.syssetting.ecode;
  }

  async resetPwd(values) {
    await this.props.actions.resetPwd(values);
    return this.props.syssetting.ecode;
  }

  async sendTestMail(values) {
    await this.props.actions.sendTestMail(values);
    return this.props.syssetting.ecode;
  }

  render() {
    const { i18n: { errMsg }, session } = this.props;

    if (_.isEmpty(session.user)) {
      return (<div/>);
    } else if (!session.user.permissions || !session.user.permissions.sys_admin) {
      notify.show(errMsg[-10002], 'warning', 2000);
      return (<div/>);
    }

    return (
      <div className='doc-container'>
        <div>
          <List 
            show={ this.show.bind(this) }
            update={ this.update.bind(this) }
            resetPwd={ this.resetPwd.bind(this) }
            sendTestMail={ this.sendTestMail.bind(this) }
            { ...this.props.syssetting }/>
        </div>
      </div>
    );
  }
}
