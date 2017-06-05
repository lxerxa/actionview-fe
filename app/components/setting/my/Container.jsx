import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MysettingActions from 'redux/actions/MysettingActions';

const List = require('./List');
const SysadminList = require('./SysadminList');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MysettingActions, dispatch)
  };
}

@connect(({ session, mysetting }) => ({ session, mysetting }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    mysetting: PropTypes.object.isRequired
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

  render() {
    const { session } = this.props;
    return (
      <div className='doc-container'>
        <div>
          { session.user.email !== 'admin@action.view' ? 
          <SysadminList 
            getUser={ this.getUser.bind(this) }
            resetPwd={ this.resetPwd.bind(this) }
            { ...this.props.mysetting }/>
          :
          <List 
            getUser={ this.getUser.bind(this) }
            updAccount={ this.updAccount.bind(this) }
            resetPwd={ this.resetPwd.bind(this) }
            updNotify={ this.updNotify.bind(this) }
            updFavorite={ this.updFavorite.bind(this) }
            { ...this.props.mysetting }/> }
        </div>
      </div>
    );
  }
}
