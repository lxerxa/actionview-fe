import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import ProjectModal from './ProjectModal';

export default class Projects extends Component {

  constructor(props) {
    super(props);
    this.state = { laShow: false };
  }

  static propTypes = {
    projectList: PropTypes.array.isRequired
  }

  render() {
    const collection = this.props.projectList;

    const styles = { marginLeft: '25px' };
    const styles2 = { width: '205px', margin: 'auto' };

    const laClose = () => this.setState({ laShow: false });

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h2>#项目中心#</h2>
        </div>
        <ul className='article-list list-unstyled clearfix'>
          { collection.map((items, i) =>
            <li className='article-item'>
              <div key={ i } className='list-top'>
                <h4 className='title'>
                  <Link to='/projects'>
                    { items.name }
                  </Link>
                </h4>
                <div className='list-footer'>
                  <span>键值：{ items.key } </span>
                  <span style={ styles }>创建者：{ items.creator || '无' } </span>
                  <span style={ styles }>创建日：{ items.create_time || '无' } </span>
                  <span style={ styles }>最近访问：{ items.create_time || '无' } </span>
                </div>
              </div>
            </li>
            )
           }
        </ul>
        <div style={ styles2 }>
          <button className='btn btn-primary btn-lg btn-block' onClick={ () => this.setState({ laShow: true }) }>
          创建项目
          </button>
        </div>
        <ProjectModal show={ this.state.laShow } onHide={ laClose } />
      </div>
    );
  }
}
