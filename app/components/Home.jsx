import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';

import * as ProjectActions from 'redux/actions/ProjectActions';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProjectActions, dispatch)
  };
}

@connect(({ project }) => ({ project }), mapDispatchToProps)
export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  }

  render() {
    const { location: { pathname='' }, project } = this.props;

    return (
      <div className='doc-main'>
        <Header project={ project } pathname={ pathname }/>
        <Sidebar project={ project } pathname={ pathname }/>
        { this.props.children }
      </div>
    );
  }
}
