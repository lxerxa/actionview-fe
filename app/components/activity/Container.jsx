import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import * as ActivityActions from 'redux/actions/ActivityActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ActivityActions, dispatch)
  };
}

@connect(({ activity }) => ({ activity }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    activity: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.activity.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div>
        <Header { ...this.props.activity }/>
        <List index={ this.index.bind(this) } { ...this.props.activity }/>
      </div>
    );
  }
}
