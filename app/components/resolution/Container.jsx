import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ResolutionActions from 'redux/actions/ResolutionActions';

const Header = require('./Header');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ResolutionActions, dispatch)
  };
}

@connect(({ resolution }) => ({ resolution }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    resolution: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.resolution.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.resolution.ecode;
  }

  async update(values) {
    await this.props.actions.update(this.pid, values);
    return this.props.resolution.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.resolution.ecode;
  }

  async setSort(values) {
    await this.props.actions.setSort(this.pid, values);
    return this.props.resolution.ecode;
  }

  async setDefault(values) {
    await this.props.actions.setDefault(this.pid, values);
    return this.props.resolution.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div>
        <Header 
          setSort={ this.setSort.bind(this) } 
          setDefault={ this.setDefault.bind(this) } 
          create={ this.create.bind(this) } 
          { ...this.props.resolution }/>
        <List 
          index={ this.index.bind(this) } 
          select={ this.props.actions.select } 
          update={ this.update.bind(this) } 
          del={ this.del.bind(this) } 
          delNotify={ this.props.actions.delNotify } 
          { ...this.props.resolution }/>
      </div>
    );
  }
}
