import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

import * as ProjectActions from 'redux/actions/ProjectActions';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProjectActions, dispatch)
  };
}

@connect(({ i18n, project }) => ({ i18n, project }), mapDispatchToProps)
export default class Project extends Component {
  constructor(props) {
    super(props);
    this.key = '';
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.element,
    location: PropTypes.object.isRequired,
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
    const { project: { ecode, item, options }, location: { pathname }, i18n: { errMsg } } = this.props;

    if (ecode !== 0) {
      notify.show(errMsg[ecode], 'warning', 2000);
      return (<div/>);
    } else if (_.isEmpty(item) || pathname.indexOf('/project/' + item.key) === -1) {
      return (<div/>);
    } else if ((/^\/project\/(\w+)(\/(summary|issue|kanban|activity|version|module|team|config))?$/.test(pathname) && options.permissions.indexOf('view_project') === -1) || ((/^\/project\/(\w+)\/(type|workflow|field|screen|priority|state|resolution|role|events)(\/\w+)*$/).test(pathname) && options.permissions.indexOf('manage_project') === -1)) {
      notify.show(errMsg[-10002], 'warning', 2000);
      return (<div/>);
    }

    return (
      <div className='doc-container'>
      { this.props.children }
      </div>
    );
  }
}
