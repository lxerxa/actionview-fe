import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ProjectActions from 'redux/actions/ProjectActions';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProjectActions, dispatch)
  };
}

@connect(({ project }) => ({ project }), mapDispatchToProps)
export default class ProjectList extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { actions } = this.props;
    actions.index();
  }

  render() {
    const { collection = [] } = this.props.project;
    const styles = { marginLeft: '25px' };
    const styles2 = { minHeight: '595px' };

    return (
      <div className='col-sm-7 col-sm-offset-3 main-content' style={ styles2 }>
        <div className='list-unstyled clearfix'>
          <h2>#项目中心#</h2>
        </div>
        <ul className='article-list list-unstyled clearfix'>
          { collection.map((items, i) =>
            <li key={ i } className='article-item'>
              <div className='list-top'>
                <h4 className='title'>
                  <Link to={ '/project/' + items.key }>
                    { items.name }
                  </Link>
                </h4>
                <div className='list-footer'>
                  <span>键值：{ items.key } </span>
                  <span style={ styles }>负责人：{ items.principal || '无' } </span>
                  <span style={ styles }>创建日：{ items.created_at || '无' } </span>
                  <span style={ styles }>最近访问：{ items.latest_accese_time || '无' } </span>
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
