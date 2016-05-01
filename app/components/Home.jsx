import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Projects from './Projects';
import ProjectModal from './ProjectModal';
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
    this.state = { laShow: false };
    this.laClose = this.laClose.bind(this);
    this.create = this.create.bind(this);
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    values: PropTypes.object
  }

  static contextTypes = { store: PropTypes.object.isRequired }

  componentWillMount() {
    const { actions } = this.props;
    actions.index();
  }

  laClose() {
    this.setState({ laShow: false });
  }

  async create(values) {
    await this.props.actions.create(values);
    return this.props.project.ecode;
  }

  render() {
    const { collection = [] } = this.props.project;
    const styles = { minHeight: '595px' };
    const styles2 = { width: '205px', margin: 'auto' };

    return (
      <div>
        <div className='container-fluid main-box'>
          <div className='row'>
            <Sidebar indexImg={ img } />
            <div className='col-sm-7 col-sm-offset-3 main-content' style={ styles }>
              <Projects projectList={ collection } />
              <div style={ styles2 }>
                <button className='btn btn-primary btn-lg btn-block' onClick={ () => this.setState({ laShow: true }) }>
                创建项目
                </button>
              </div>
              <ProjectModal show={ this.state.laShow } hide={ this.laClose } create={ this.create }/>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}
