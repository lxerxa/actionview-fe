import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as EventsActions from 'redux/actions/EventsActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(EventsActions, dispatch)
  };
}

@connect(({ events }) => ({ events }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.events.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.events.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.events.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.events.ecode;
  }

  async reset(id) {
    const { actions } = this.props;
    await actions.reset(this.pid, id);
    return this.props.events.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div>
        <Header 
          create={ this.create.bind(this) } 
          { ...this.props.events }/>
        <List 
          index={ this.index.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          reset={ this.reset.bind(this) } 
          { ...this.props.events }/>
      </div>
    );
  }
}
