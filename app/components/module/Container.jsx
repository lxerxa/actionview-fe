import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ModuleActions from 'redux/actions/ModuleActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ModuleActions, dispatch)
  };
}

@connect(({ module }) => ({ module }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    module: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.module.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.module.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.module.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.module.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {

    //if (this.props.module && this.props.project && this.props.project.options) {
    //  this.props.module.options = {};
    //  this.props.module.options.users = this.props.project.options.users || [];
    //}

    return (
      <div>
        <Header 
          create={ this.create.bind(this) } 
          { ...this.props.module }/>
        <List 
          index={ this.index.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          delNotify={ this.props.actions.delNotify } 
          { ...this.props.module }/>
      </div>
    );
  }
}
