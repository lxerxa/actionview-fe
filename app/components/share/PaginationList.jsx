import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router'
import _ from 'lodash';

export default class PaginationList extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    query: PropTypes.object,
    refresh: PropTypes.func,
    total: PropTypes.number.isRequired,
    curPage: PropTypes.number,
    sizePerPage: PropTypes.number,
    paginationSize : PropTypes.number
  }

  goPage(page) {
    const { query, refresh } = this.props;
    refresh({ ...query, page });
  }

  render() {

    let { total, curPage = 1, sizePerPage, paginationSize = 4 } = this.props;

    const pages = _.ceil(total / sizePerPage);
    if (curPage > pages || curPage <= 0) {
      curPage = 1;
    }

    const pageList = [];
    for (let i = 0; i < paginationSize; i++) {
      let tmp = curPage - paginationSize + i;
      if (tmp <= 0) continue;
      pageList.push(tmp);
    }
    pageList.push(curPage);
    for (let i = 1; i <= paginationSize; i++) {
      let tmp = _.add(curPage, i);
      if (tmp > pages) break;
      pageList.push(tmp);
    }

    return (
      <div style={ { marginTop: '10px', height: '40px' } }>
        <div className='col-md-6'>
          <span>{ _.add((curPage - 1) * sizePerPage, 1) }-{ curPage * sizePerPage >= total ? total : curPage * sizePerPage } 共{ total }条 { pages }页</span>
        </div>
        <div className='col-md-6'>
          { pages > 1 &&
          <ul className='pagination' style={ { float:'right', marginTop: '0px', marginBottom: '10px' } }>
            { curPage - paginationSize > 1 &&
            <li key='first'>
              <span className='page-button' onClick={ this.goPage.bind(this, 1) } title='首页'>&lt;&lt;</span>
            </li> }
            { curPage-1 > 0 && pages > 1 &&
            <li key='pre'>
              <span className='page-button' onClick={ this.goPage.bind(this, curPage-1) } title='前页'>&lt;</span>
            </li> }

            { _.map(pageList, (val, key) =>
              <li key={ key } className={ val === curPage ? 'active' : '' }>
                <span className='page-button' onClick={ this.goPage.bind(this, val) }>{ val }</span>
              </li>
            ) }

            { curPage < pages && pages > 1 &&
            <li key='next'>
              <span className='page-button' onClick={ this.goPage.bind(this, _.add(curPage,1)) } title='后页'>&gt;</span>
            </li> }
            { pages - paginationSize > curPage &&
            <li key='last'>
              <span className='page-button' onClick={ this.goPage.bind(this, pages) } title='尾页'>&gt;&gt;</span>
            </li> }
          </ul> }
        </div>
      </div>
    );
  }
}
