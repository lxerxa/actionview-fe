import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Projects from './Projects';

import * as ProjectActions from 'redux/actions/ProjectActions';
const img = require('../assets/images/shanghai.jpg');

@connect(({ projects }) => ({ projects }))
export default class Home extends Component {

  static propTypes = {
    projects: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = { store: PropTypes.object.isRequired }

  componentWillMount() {
    const { resolver } = this.context.store;
    const { dispatch } = this.props;
    this.actions = bindActionCreators(ProjectActions, dispatch);

    return resolver.resolve(this.actions.index);
  }

  render() {
    const { collection = [] } = this.props.projects;
    const styles = { minHeight: '745px' };

    return (
      <div>
        <div className='container-fluid main-box'>
          <div className='row'>
            <Sidebar indexImg={ img } />
            <div className='col-sm-7 col-sm-offset-3 main-content' style={ styles }>
              <Projects projectList={ collection } />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
