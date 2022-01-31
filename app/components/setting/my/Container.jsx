import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MysettingActions from 'redux/actions/MysettingActions';
import * as SessionActions from 'redux/actions/SessionActions';

const List = require('./List');
const SysadminList = require('./SysadminList');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MysettingActions, dispatch),
    sessionActions: bindActionCreators(SessionActions, dispatch)
  };
}

@connect(({ i18n, session, mysetting }) => ({ i18n, session, mysetting }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    sessionActions: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    mysetting: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  async getUser() {
    await this.props.actions.getUser();
    return this.props.mysetting.ecode;
  }

  async resetPwd(values) {
    await this.props.actions.resetPwd(values);
    return this.props.mysetting.ecode;
  }

  async updAccount(values) {
    await this.props.actions.updAccount(values);
    return this.props.mysetting.ecode;
  }

  async updNotify(values) {
    await this.props.actions.updNotify(values);
    return this.props.mysetting.ecode;
  }

  async updFavorite(values) {
    await this.props.actions.updFavorite(values);
    return this.props.mysetting.ecode;
  }

  async setAvatar(data) {
    await this.props.actions.setAvatar(data);
    return this.props.mysetting.ecode;
  }

  updAvatar(avatar) {
    this.props.sessionActions.updAvatar(avatar);
  }

  async reLogin() {
    await this.props.sessionActions.destroy();
    if (this.props.session.ecode === 0) {
      this.context.router.push({ pathname: '/login' });
    }
    return this.props.session.ecode;
  }

  render() {
    const { i18n, session } = this.props;

    return (
      <div className='doc-container'>
        <div>
          { session.user.email === 'admin@action.view' ? 
          <SysadminList 
            setAvatar={ this.setAvatar.bind(this) }
            updAvatar={ this.updAvatar.bind(this) }
            getUser={ this.getUser.bind(this) }
            updAccount={ this.updAccount.bind(this) }
            resetPwd={ this.resetPwd.bind(this) }
            i18n={ i18n }
            { ...this.props.mysetting }/>
          :
          <List 
            setAvatar={ this.setAvatar.bind(this) }
            getUser={ this.getUser.bind(this) }
            updAccount={ this.updAccount.bind(this) }
            reLogin={ this.reLogin.bind(this) }
            resetPwd={ this.resetPwd.bind(this) }
            updNotify={ this.updNotify.bind(this) }
            updFavorite={ this.updFavorite.bind(this) }
            updAvatar={ this.updAvatar.bind(this) }
            i18n={ i18n }
            { ...this.props.mysetting }/> }
        </div>
      </div>
    );
  }
}
