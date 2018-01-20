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

@connect(({ i18n, events }) => ({ i18n, events }), mapDispatchToProps)
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

  async setNotify(values) {
    await this.props.actions.setNotify(this.pid, values);
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
    const { location: { pathname='' } } = this.props;
    if (/^\/admin\/scheme/.test(pathname)) {
      this.pid = '$_sys_$';
    } else {
      const { params: { key } } = this.props;
      this.pid = key;
    }
  }

  render() {
    return (
      <div>
        <Header 
          create={ this.create.bind(this) } 
          i18n={ this.props.i18n }
          { ...this.props.events }/>
        <List 
          pkey={ this.pid }
          index={ this.index.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          setNotify={ this.setNotify.bind(this) } 
          del={ this.del.bind(this) } 
          reset={ this.reset.bind(this) } 
          i18n={ this.props.i18n }
          { ...this.props.events }/>
      </div>
    );
  }
}
