import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, ControlLabel, Col, Table, ButtonGroup, Button, Radio, Checkbox } from 'react-bootstrap';
import Select from 'react-select';
import { PieChart, Pie, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import _ from 'lodash';
import { Dimensions } from '../../share/Constants';
import { IssueFilterList, getCondsTxt } from '../../issue/IssueFilterList';
import SaveFilterModal from '../SaveFilterModal';

const moment = require('moment');
const img = require('../../../assets/images/loading.gif');

export default class Regressions extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      stat_dimension: '', 
      his_resolvers: '', 
      issueFilterShow: false, 
      saveFilterShow: false };
    this.gotoIssue = this.gotoIssue.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    optionsLoading: PropTypes.bool.isRequired,
    query: PropTypes.object,
    regressions: PropTypes.array.isRequired,
    regressionsLoading: PropTypes.bool.isRequired,
    refresh: PropTypes.func.isRequired,
    gotoIssue: PropTypes.func.isRequired,
    saveFilter: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, query } = this.props;
    index(query);
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { index, query } = this.props;
    if (!_.isEqual(newQuery, query)) {
      index(newQuery);
    }
    this.setState({ 
      stat_dimension: newQuery.stat_dimension || '', 
      his_resolvers: newQuery.his_resolvers || '' 
    });
  }

  search() {
    const { query={}, refresh } = this.props;

    const newQuery = _.assign({}, query);
    if (this.state.stat_dimension) {
      newQuery.stat_dimension = this.state.stat_dimension; 
    } else {
      delete newQuery.stat_dimension;
    }

    if (this.state.his_resolvers) {
      newQuery.his_resolvers = this.state.his_resolvers;
    } else {
      delete newQuery.his_resolvers;
    }

    refresh(newQuery);
  }

  gotoIssue(nos) {
    const { gotoIssue } = this.props;
    gotoIssue({ title: nos.join(',') });
  }

  render() {

    const { 
      i18n, 
      layout,
      project, 
      filters, 
      options, 
      optionsLoading, 
      regressions, 
      regressionsLoading, 
      refresh, 
      query, 
      saveFilter } = this.props;

    const users = options.users || [];

    let sqlTxt = '';
    if (!optionsLoading) {
      const stat_dimension = query['stat_dimension'];
      if (stat_dimension) {
        const ind = _.findIndex(Dimensions, { id: stat_dimension });
        sqlTxt = '统计维度～' + (ind !== -1 ? Dimensions[ind].name : '');
      }

      const his_resolvers = query['his_resolvers'];
      if (his_resolvers) {
        const resolvers = his_resolvers.split(',');
        const resolverNames = [];
        _.forEach(resolvers, (resolver) => {
          let index = -1;
          if ((index = _.findIndex(users, { id: resolver })) !== -1) {
            resolverNames.push(users[index].name);
          }
        });
        if (resolverNames.length > 0) {
          sqlTxt = (sqlTxt ? (sqlTxt + ' | ') : '') + '解决者～' + resolverNames.join(',');
        }
      }

      const issueSqlTxt = getCondsTxt(query, options);
      if (issueSqlTxt) {
        sqlTxt += (sqlTxt ? ' | ' : '') + issueSqlTxt;
      }
    }

    let shape = '';
    const data = [];
    if (this.state.stat_dimension) {
      shape = 'bar';
      _.forEach(regressions, (v) => { 
        const tmp = {};
        tmp.category = v.category;
        tmp.ones = v.ones || [];
        tmp.gt_ones = v.gt_ones || [];
        tmp.ones_cnt = v.ones.length;
        tmp.gt_ones_cnt = v.gt_ones.length;
        tmp.total_cnt = tmp.ones_cnt + tmp.gt_ones_cnt;
        data.push(tmp);
      });
    } else {
      shape = 'pie';
      if (regressions.length > 0) {
        data.push({ name: '一次通过', nos: regressions[0].ones, cnt: regressions[0].ones.length });
        data.push({ name: '大于一次', nos: regressions[0].gt_ones, cnt: regressions[0].gt_ones.length });
      }
    }

    return ( 
      <div className='project-report-container'>
        <div className='report-title'>
          问题解决回归分布 
          <Link to={ '/project/' + project.key + '/report' }>
            <Button bsStyle='link'>返回</Button>
          </Link>
        </div>
        <Form horizontal className='report-filter-form'>
          <FormGroup>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              统计维度
            </Col>
            <Col sm={ 3 }>
              <Select
                simpleValue
                placeholder='请选择'
                value={ this.state.stat_dimension || null }
                onChange={ (newValue) => { this.state.stat_dimension = newValue; this.search(); } }
                options={ _.map(Dimensions, (v) => { return { value: v.id, label: v.name } }) }/>
            </Col>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              解决者
            </Col>
            <Col sm={ 3 }>
              <Select
                simpleValue
                multi
                placeholder='选择解决者'
                value={ this.state.his_resolvers }
                onChange={ (newValue) => { this.state.his_resolvers = newValue; this.search(); } }
                options={ _.map(users, (v) => { return { value: v.id, label: v.name } }) }/>
            </Col>
            <Col sm={ 4 }>
              <Button
                bsStyle='link'
                onClick={ () => { this.setState({ issueFilterShow: !this.state.issueFilterShow }) } }
                style={ { float: 'right', marginTop: '0px' } }>
                更多问题过滤 { this.state.issueFilterShow ? <i className='fa fa-angle-up'></i> : <i className='fa fa-angle-down'></i> }
              </Button>
            </Col>
          </FormGroup>
        </Form>
        <IssueFilterList
          query={ query }
          searchShow={ this.state.issueFilterShow }
          notShowFields={ [ 'watcher' ] }
          options={ options }
          refresh={ refresh } />
        <div className='report-conds-style'>
          { sqlTxt &&
          <div className='cond-bar' style={ { marginTop: '0px', float: 'left' } }>
            <div className='cond-contents' title={ sqlTxt }><b>检索条件</b>：{ sqlTxt }</div>
            <div className='remove-icon' onClick={ () => { refresh({}); } } title='清空当前检索'><i className='fa fa-remove'></i></div>
            <div className='remove-icon' onClick={ () => { this.setState({ saveFilterShow: true }); } } title='保存当前检索'><i className='fa fa-save'></i></div>
          </div> }
        </div>
        { regressionsLoading ?
        <div style={ { height: '550px', paddingTop: '40px' } }>
          <div style={ { textAlign: 'center' } }>
            <img src={ img } className='loading'/>
          </div>
        </div>
        :
        <div style={ { height: '565px' } }>
          { data.length <= 0 &&
          <div className='report-shape-container' style={ { paddingTop: '40px' } }>
            <div style={ { textAlign: 'center' } }>
              <span style={ { fontSize: '160px', color: '#FFC125' } } >
                <i className='fa fa-warning'></i>
              </span><br/>
              <span>抱歉，暂无满足该检索条件的数据。</span>
            </div>
          </div> }
          { shape === 'bar' && data.length > 0 && 
          <div className='report-shape-container'>
            <BarChart
              width={ layout.containerWidth * 0.95 }
              height={ 380 }
              barSize={ 40 }
              data={ data }
              style={ { margin: '25px auto' } }>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='category' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='ones_cnt' name='一次回归' stackId='a' fill='#4572A7' />
              <Bar dataKey='gt_ones_cnt' name='大于一次' stackId='a' fill='#AA4643' />
            </BarChart>
          </div> }
          { shape === 'pie' && data.length > 0 &&
          <div className='report-shape-container'>
            <PieChart
              width={ 800 }
              height={ 380 }
              style={ { margin: '25px auto' } }>
              <Pie
                dataKey='cnt'
                data={ data }
                cx={ 400 }
                cy={ 200 }
                outerRadius={ 130 }
                label>
                <Cell fill='#3b7fc4'/>
                <Cell fill='#f79232'/>
              </Pie>
              <Tooltip />
            </PieChart>
          </div> }
          { data.length > 0 && 
          <div style={ { float: 'left', width: '100%', marginBottom: '30px' } }>
            <span>注：该图表最多统计满足当前检索条件下的10000条结果。</span>
            { this.state.stat_dimension && 
            <Table responsive bordered={ true }>
              <thead>
                <tr>
                  <th>{ _.find(Dimensions, { id: this.state.stat_dimension }).name }</th>
                  <th>一次回归</th>
                  <th>大于一次</th>
                  <th>一次通过率</th>
                </tr>
              </thead>
              <tbody>
                { _.map(data, (v, i) => {
                  return (
                    <tr key={ i }>
                      { this.state.stat_dimension && <td>{ v.category }</td> }
                      <td><a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue(v.ones); } }>{ v.ones_cnt }</a></td>
                      <td><a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue(v.gt_ones); } }>{ v.gt_ones_cnt }</a></td>
                      <td>{ _.round(v.ones_cnt / v.total_cnt * 100, 2) + '%' }</td>
                    </tr> ) }) }
              </tbody>
            </Table> } 
            { !this.state.stat_dimension && 
            <Table responsive bordered={ true }>
              <thead>
                <tr>
                  <th>一次回归</th>
                  <th>大于一次</th>
                  <th>一次通过率</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue(data[0].nos); } }>{ data[0].cnt }</a></td>
                  <td><a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue(data[1].nos); } }>{ data[1].cnt }</a></td>
                  <td>{ _.round(data[0].cnt / (data[0].cnt + data[1].cnt) * 100, 2) + '%' }</td>
                </tr>
              </tbody>
            </Table> }
          </div> }
        </div> }
        { this.state.saveFilterShow &&
        <SaveFilterModal
          show
          close={ () => { this.setState({ saveFilterShow: false }) } }
          filters={ filters.data || [] }
          options={ options }
          save={ saveFilter }
          mode={ 'regressions' }
          query={ query }
          sqlTxt={ sqlTxt }
          i18n={ i18n }/> }
      </div>
    );
  }
}
