import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import Footer from './Footer';

import * as ProjectActions from 'redux/actions/ProjectActions';

const img = require('../assets/images/shanghai.jpg');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProjectActions, dispatch)
  };
}

@connect(({ project, issue }) => ({ project, issue }), mapDispatchToProps)
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.createProject = this.createProject.bind(this);
    this.createIssue = this.createIssue.bind(this);
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    values: PropTypes.object
  }

  async createProject(values) {
    await this.props.actions.create(values);
    return this.props.project.ecode;
  }

  async createIssue(values) {
    await this.props.actions.createIssue(this.props.project.item.key, values);
    return this.props.project.ecode;
  }

  render() {
    return (
      <div className='doc-main'>
        <div className='toc-container'>
          <Sidebar indexImg={ img } project={ this.props.project } issue={ this.props.issue } createProject={ this.createProject } createIssue={ this.createIssue }/>
        </div>
        { this.props.children }
      </div>
    );
  }
}
