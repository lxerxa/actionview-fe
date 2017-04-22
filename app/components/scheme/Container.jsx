import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SchemeActions from 'redux/actions/SchemeActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SchemeActions, dispatch)
  };
}

@connect(({ scheme }) => ({ scheme }), mapDispatchToProps)
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
    scheme: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.scheme.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.scheme.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.scheme.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.scheme.ecode;
  }

  entry(pathname) {
    this.context.router.push({ pathname });
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div className='doc-container'>
        <Header 
          create={ this.create.bind(this) } 
          { ...this.props.scheme }/>
        <List 
          index={ this.index.bind(this) } 
          entry={ this.entry.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          delNotify={ this.props.actions.delNotify } 
          { ...this.props.scheme }/>
      </div>
    );
  }
}
