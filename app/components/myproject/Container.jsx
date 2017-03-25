import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MyprojectActions from 'redux/actions/MyprojectActions';

const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MyprojectActions, dispatch)
  };
}

@connect(({ myproject }) => ({ myproject }), mapDispatchToProps)
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
    params: PropTypes.object.isRequired,
    myproject: PropTypes.object.isRequired
  }

  entry(pathname) {
    this.context.router.push({ pathname });
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.myproject.ecode;
  }

  async create(values) {
    await this.props.actions.create(values);
    return this.props.myproject.ecode;
  }

  async edit(id, values) {
    await this.props.actions.edit(id, values);
    return this.props.myproject.ecode;
  }

  async close(id) {
    const { actions } = this.props;
    await actions.close(id);
    return this.props.myproject.ecode;
  }

  render() {
    return (
      <div>
        <List index={ this.index.bind(this) } show={ this.props.actions.show } edit={ this.edit.bind(this) } stop={ this.close.bind(this) } { ...this.props.myproject }/>
      </div>
    );
  }
}
