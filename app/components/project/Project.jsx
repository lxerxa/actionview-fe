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
export default class Project extends Component {
  constructor(props) {
    super(props);
    this.key = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    params: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { actions, params: { key } } = this.props;
    actions.show(key);
    this.key = key;
  }

  componentWillReceiveProps(nextProps) {
    const { actions } = this.props;
    const { params: { key } } = nextProps;
    if (key !== this.key) {
      actions.show(key);
      this.key = key;
    }
  }

  render() {
    return (
      <div className='doc-container'>
      { this.props.children }
      </div>
    );
  }
}
