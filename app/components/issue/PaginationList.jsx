import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router'
import _ from 'lodash';

export default class PaginationList extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    url: PropTypes.string,
    query: PropTypes.object,
    total: PropTypes.number.isRequired,
    curPage: PropTypes.number,
    sizePerPage: PropTypes.number,
    paginationSize : PropTypes.number
  }

  render() {

    let { url, total, curPage = 1, sizePerPage, paginationSize = 4 } = this.props;

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
      <div className='row' style={ { marginTop: '15px' } }>
        <div>
          <div className='col-md-6'>
            <span>{ _.add((curPage - 1) * sizePerPage, 1) }-{ curPage * sizePerPage >= total ? total : curPage * sizePerPage } 共{ total }条 { pages }页</span>
          </div>
          <div className='col-md-6'>
            <ul className='pagination' style={ { float:'right', marginTop: '0px' } }>
              { curPage - paginationSize > 1 && 
              <li key='first'>
                <Link to={ { pathname: url, query: { page: 1 } } }>&lt;&lt;</Link>
              </li> }
              { curPage > 1 && pages > 1 && 
              <li key='pre'>
                <Link to={ { pathname: url, query: { page: curPage - 1 } } }>&lt;</Link>
              </li> }

              { _.map(pageList, (val, key) =>
                <li key={ key } className={ val === curPage ? 'active' : '' }>
                  <Link to={ { pathname: url, query: { page: val } } }>{ val }</Link>
                </li>
              ) }
              
              { curPage < pages && pages > 1 &&
              <li key='next'>
                <Link to={ { pathname: url, query: { page: _.add(curPage, 1) } } }>&gt;</Link>
              </li> }
              { pages - paginationSize > curPage &&
              <li key='last'>
                <Link to={ { pathname: url, query: { page: pages } } }>&gt;&gt;</Link>
              </li> }

            </ul>
          </div>
        </div>
      </div>
    );
  }
}
