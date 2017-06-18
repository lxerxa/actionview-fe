import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as FieldActions from 'redux/actions/FieldActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(FieldActions, dispatch)
  };
}

@connect(({ i18n, field }) => ({ i18n, field }), mapDispatchToProps)
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
    field: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.field.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.field.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.field.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.field.ecode;
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
    const { location: { pathname='' } } = this.props;
    return (
      <div>
        <Header 
          isSysConfig={ /^\/admin\/scheme/.test(pathname) }
          create={ this.create.bind(this) } 
          i18n={ this.props.i18n }
          { ...this.props.field }/>
        <List 
          pkey={ this.pid }
          index={ this.index.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          delNotify={ this.props.actions.delNotify } 
          i18n={ this.props.i18n }
          { ...this.props.field }/>
      </div>
    );
  }
}
