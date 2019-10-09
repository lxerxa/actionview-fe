import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as IntegrationsActions from 'redux/actions/IntegrationsActions';

const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(IntegrationsActions, dispatch)
  };
}

@connect(({ i18n, integrations }) => ({ i18n, integrations }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    integrations: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.integrations.ecode;
  }

  async handle(values) {
    await this.props.actions.handle(this.pid, values);
    return this.props.integrations.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div>
        <List 
          pkey={ this.pid }
          index={ this.index.bind(this) } 
          handle={ this.handle.bind(this) } 
          i18n={ this.props.i18n }
          { ...this.props.integrations }/>
      </div>
    );
  }
}
