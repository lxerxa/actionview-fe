import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as SchemeActions from 'redux/actions/SchemeActions';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SchemeActions, dispatch)
  };
}

@connect(({ scheme }) => ({ scheme }), mapDispatchToProps)
export default class Scheme extends Component {
  constructor(props) {
    super(props);
    this.key = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    params: PropTypes.object.isRequired
  }

  render() {
    return (
      <div className='doc-container'>
      { this.props.children }
      </div>
    );
  }
}
