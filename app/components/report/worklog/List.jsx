import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';
import DetailModal from './DetailModal';
import { ttFormat } from '../../share/Funcs'

const img = require('../../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { detailShow: false, selectedIssue: {} };
    this.showDetail = this.showDetail.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    showedUser: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    item: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { showedUser, index, query } = this.props;
    index(_.assign({}, query, { recorder: showedUser.id }));
  }

  componentWillReceiveProps(nextProps) {
    const newShowedUser = nextProps.showedUser || {};
    const { index, query, showedUser } = this.props;
    if (showedUser.id != newShowedUser.id) {
      index(_.assign({}, query, { recorder: newShowedUser.id }));
    }
  }

  showDetail(issue) {
    this.setState({ detailShow: true, selectedIssue: issue });
  }

  render() {
    const { 
      i18n, 
      query,
      options: { states=[], types=[], w2d=5, d2h=8 }, 
      collection, 
      indexLoading, 
      showedUser, 
      select, 
      item, 
      itemLoading } = this.props;

    const w2m = w2d * d2h * 60;
    const d2m = d2h * 60;

    const worklogs = [];
    const worklogNum = collection.length;
    for (let i = 0; i < worklogNum; i++) {
      const stateInd = collection[i].state ? _.findIndex(states, { id: collection[i].state }) : -1;
      let stateClassName = '';
      if (stateInd !== -1) {
        stateClassName = 'state-' + (states[stateInd].category || '') + '-label';
      }

      worklogs.push({
        id: collection[i].id,
        type: (
          <span className='type-abb' title={ _.findIndex(types, { id: collection[i].type }) !== -1 ? _.find(types, { id: collection[i].type }).name : '' }>
            { _.findIndex(types, { id: collection[i].type }) !== -1 ? _.find(types, { id: collection[i].type }).abb : '-' }
          </span>),
        name: ( 
          <div>
            <a href='#' onClick={ (e) => { e.preventDefault(); this.showDetail(collection[i]) } } style={ { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }>
              { collection[i].no + ' - ' + collection[i].title }
            </a> 
          </div>
        ),
        state: stateInd !== -1 ? <span className={ stateClassName }>{ states[stateInd].name || '-' }</span> : '-',
        total_value: ttFormat(collection[i].total_value, w2m, d2m)
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    return (
      <div style={ { marginBottom: '30px' } }>
        <BootstrapTable data={ worklogs } bordered={ false } hover options={ opts }>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='type' width='50'>类型</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='state' width='100'>状态</TableHeaderColumn>
          <TableHeaderColumn dataField='total_value' width='100'>耗费时间</TableHeaderColumn>
        </BootstrapTable>
        { this.state.detailShow &&
        <DetailModal
          show
          options={ this.props.options }
          close={ () => { this.setState({ detailShow: false }) } }
          showedUser={ showedUser }
          query={ query }
          issue={ this.state.selectedIssue }
          index={ select }
          data={ item }
          loading={ itemLoading }
          i18n={ i18n }/> }
      </div>
    );
  }
}
