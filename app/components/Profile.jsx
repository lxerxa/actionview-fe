import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ProjectActions from 'redux/actions/ProjectActions';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProjectActions, dispatch)
  };
}

@connect(({ project }) => ({ project }), mapDispatchToProps)
export default class Profile extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { actions } = this.props;
    const { params: { key } } = this.props;
    actions.show(key);
  }

  render() {
    const { item } = this.props.project;
    return (
      <div>
        { item.name }
      </div>
    );
  }
}
