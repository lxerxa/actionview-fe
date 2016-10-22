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
  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    params: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { actions } = this.props;
    const { params: { key } } = this.props;
    actions.show(key);
  }

  render() {
    const styles = { minHeight: '595px', width: '78%', marginLeft: '22%' };
    return (
      <div className='col-sm-7 col-sm-offset-3' style={ styles }>
      { this.props.children }
      </div>
    );
  }
}
