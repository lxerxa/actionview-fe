import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Issues extends Component {

  static propTypes = {
    issueList: PropTypes.array.isRequired
  }

  render() {
    const { issueList = [] } = this.props;

    return (
      <ul className='article-list list-unstyled clearfix'>
        { issueList.length > 0 &&
          issueList.map((issue, i) =>
            <div>
              <h4 className='title'>
                <Link to={ '/issue/' + issue._id } className='link-title'>{ issue.title }</Link>
              </h4>
              <div className='list-footer'>
                <span>阅读</span>
                <span>{ i }</span>
              </div>
            </div>
          )
        }
      </ul>
    );
  }
}
