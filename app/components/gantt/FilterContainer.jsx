import React, { PropTypes, Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { parseQuery } from '../issue/IssueFilterList';

import * as IssueActions from 'redux/actions/IssueActions';
const img = require('../../assets/images/loading.gif');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(IssueActions, dispatch)
  };
}

const qs = require('qs');

@connect(({ i18n, issue }) => ({ i18n, issue }), mapDispatchToProps)
export default class FilterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.pid = '';
    this.getOptions = this.getOptions.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired
  }

  async getOptions() {
    await this.props.actions.getOptions(this.pid);
    return this.props.issue.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
    this.getOptions();
  }

  go(query) {
    const pathname = '/project/' + this.pid + '/gantt';
    this.context.router.push({ pathname, query });
  }

  render() {
    const { options, optionsLoading } = this.props.issue;

    return (
      optionsLoading ? 
      <div style={ { marginTop: '50px', textAlign: 'center' } }>
        <img src={ img } className='loading'/>
      </div>
      :
      <div style={ { marginTop: '15px' } }>
        <div style={ { fontSize: '16px', marginBottom: '8px' } }>
          选择过滤器
        </div>
        <ListGroup>
          { _.map(options.filters, (v) =>
            <ListGroupItem href='#' onClick={ this.go.bind(this, v.query || {}) }>
              <b>{ v.name }</b> - { _.isEmpty(v.query) ? '全部问题' : parseQuery(v.query || {}, options) }
            </ListGroupItem>
            ) }
        </ListGroup>
      </div>
    );
  }
}
