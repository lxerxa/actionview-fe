import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class Projects extends Component {
  static propTypes = {
    projectList: PropTypes.array.isRequired
  }

  render() {
    const collection = this.props.projectList;
    const styles = { marginLeft: '25px' };

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h2>#项目中心#</h2>
        </div>
        <ul className='article-list list-unstyled clearfix'>
          { collection.map((items, i) =>
            <li key={ i }className='article-item'>
              <div className='list-top'>
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
      </div>
    );
  }
}
