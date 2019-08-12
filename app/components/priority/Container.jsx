import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PriorityActions from 'redux/actions/PriorityActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(PriorityActions, dispatch)
  };
}

@connect(({ i18n, priority }) => ({ i18n, priority }), mapDispatchToProps)
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
    priority: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.priority.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.priority.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.priority.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.priority.ecode;
  }

  async setSort(values) {
    await this.props.actions.setSort(this.pid, values);
    return this.props.priority.ecode;
  }

  async setDefault(values) {
    await this.props.actions.setDefault(this.pid, values);
    return this.props.priority.ecode;
  }

  async viewUsed(id) {
    await this.props.actions.viewUsed(this.pid, id);
    return this.props.priority.ecode;
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
          setDefault={ this.setDefault.bind(this) } 
          setSort={ this.setSort.bind(this) } 
          create={ this.create.bind(this) } 
          i18n={ this.props.i18n }
          { ...this.props.priority }/>
        <List 
          pkey={ this.pid }
          index={ this.index.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          delNotify={ this.props.actions.delNotify } 
          viewUsed={ this.viewUsed.bind(this) }
          i18n={ this.props.i18n }
          { ...this.props.priority }/>
      </div>
    );
  }
}
