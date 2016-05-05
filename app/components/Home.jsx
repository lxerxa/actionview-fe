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

@connect(({ project }) => ({ project }), mapDispatchToProps)
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.createProject = this.createProject.bind(this);
    this.createIssue = this.createIssue.bind(this);
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    values: PropTypes.object
  }

  async createProject(values) {
    await this.props.actions.create(values);
    return this.props.project.ecode;
  }

  async createIssue(values) {
    await this.props.actions.create(values);
    return this.props.project.ecode;
  }

  render() {
    return (
      <div>
        <div className='container-fluid main-box'>
          <div className='row'>
            <Sidebar indexImg={ img } project={ this.props.project } createProject={ this.createProject } createIssue={ this.createIssue }/>
            { this.props.children }
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}
