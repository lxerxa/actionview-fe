import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ProjectActions from 'redux/actions/ProjectActions';

const qs = require('qs');
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProjectActions, dispatch)
  };
}

@connect(({ project }) => ({ project }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  }

  refresh(query) {
    const pathname = '/project';
    this.context.router.push({ pathname, query });
  }

  entry(pathname) {
    this.context.router.push({ pathname });
  }

  async index(query) {
    if (!query.page) { query.page = 1; }
    await this.props.actions.index(qs.stringify(query || {}));
    return this.props.project.ecode;
  }

  async create(values) {
    await this.props.actions.create(values);
    return this.props.project.ecode;
  }

  async edit(id, values) {
    await this.props.actions.edit(id, values);
    return this.props.project.ecode;
  }

  async close(id) {
    const { actions } = this.props;
    await actions.close(id);
    return this.props.project.ecode;
  }

  async reopen(id) {
    const { actions } = this.props;
    await actions.reopen(id);
    return this.props.project.ecode;
  }

  async getOptions() {
    const { actions } = this.props;
    await actions.getOptions();
    return this.props.project.ecode;
  }

  render() {
    const { location: { query={} } } = this.props;

    return (
      <div className='doc-container'>
        <List 
          index={ this.index.bind(this) } 
          entry={ this.entry.bind(this) } 
          refresh={ this.refresh.bind(this) } 
          create={ this.create.bind(this) } 
          show={ this.props.actions.show } 
          edit={ this.edit.bind(this) } 
          stop={ this.close.bind(this) } 
          reopen={ this.reopen.bind(this) } 
          getOptions={ this.getOptions.bind(this) } 
          query={ query }
          { ...this.props.project }/>
      </div>
    );
  }
}
