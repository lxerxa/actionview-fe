import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, ControlLabel, Col, Table, ButtonGroup, Button, Radio, Checkbox } from 'react-bootstrap';
import Select from 'react-select';
import { LineChart, Line, PieChart, Pie, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import _ from 'lodash';
import { Dimensions } from '../../share/Constants';
import { IssueFilterList, getCondsTxt } from '../../issue/IssueFilterList';
import SaveFilterModal from '../SaveFilterModal';

const moment = require('moment');
const img = require('../../../assets/images/loading.gif');

export default class Issues extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      stat_x: '', 
      stat_y: '', 
      shape: 'pie',
      sort: 'default',
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
    issues: PropTypes.array.isRequired,
    issuesLoading: PropTypes.bool.isRequired,
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
      stat_x: newQuery.stat_x || 'type', 
      stat_y: newQuery.stat_y || '' 
    });
  }

  search() {
    const { query={}, refresh } = this.props;

    const newQuery = _.assign({}, query);
    if (this.state.stat_x) {
      newQuery.stat_x = this.state.stat_x; 
    } else {
      delete newQuery.stat_x;
    }

    if (this.state.stat_y) {
      newQuery.stat_y = this.state.stat_y;
    } else {
      delete newQuery.stat_y;
    }

    refresh(newQuery);
  }

  gotoIssue(q) {
    const { query, gotoIssue } = this.props;
    gotoIssue(_.assign({}, _.omit(query, [ 'stat_x', 'stat_y' ]), q));
  }

  render() {

    const { 
      i18n, 
      layout,
      project, 
      filters, 
      options, 
      optionsLoading, 
      issues, 
      issuesLoading, 
      refresh, 
      query, 
      saveFilter } = this.props;

    const { stat_x, stat_y, shape, sort } = this.state;

    const COLORS = [ '#3b7fc4', '#815b3a', '#8eb021', '#d39c3f', '#654982', '#4a6785', '#f79232', '#f15c75', '#ac707a' ];
    const sortOptions = [ { value: 'default', label: '默认顺序' }, { value: 'total_asc', label: '总数升序' }, { value: 'total_desc', label: '总数降序' } ];

    let sqlTxt = '';
    if (!optionsLoading) {
      const stat_x = query['stat_x'];
      if (stat_x) {
        const ind = _.findIndex(Dimensions, { id: stat_x });
        sqlTxt = 'X轴～' + (ind !== -1 ? Dimensions[ind].name : '');
      }

      const stat_y = query['stat_y'];
      if (stat_y) {
        const ind = _.findIndex(Dimensions, { id: stat_y });
        sqlTxt += (stat_x ? ' | ' : '') + 'Y轴～' + (ind !== -1 ? Dimensions[ind].name : '');
      }

      const issueSqlTxt = getCondsTxt(query, options);
      if (issueSqlTxt) {
        sqlTxt += (sqlTxt ? ' | ' : '') + issueSqlTxt;
      }
    }

    let showShape = shape;
    if (stat_x != stat_y && stat_y && shape == 'pie') {
      showShape = 'bar';
    }

    let data = [];
    if (sort == 'total_asc') {
      data = _.sortBy(issues, (v) => { return v.cnt });
    } else if (sort == 'total_desc') {
      data = _.sortBy(issues, (v) => { return -v.cnt });
    } else {
      data = issues;
    }

    if (stat_x != stat_y) {
      _.forEach(data, (v) => {
        _.forEach(v.y || [], (v2, i) => {
          v['y_' + i + '_cnt' ] = v2.cnt;
        });
      });
    } else {
      _.forEach(data, (v) => {
        if (v.y) {
          delete v.y;
        }
      });
    }

    return ( 
      <div className='project-report-container'>
        <div className='report-title'>
          问题分布图
          <Link to={ '/project/' + project.key + '/report' }>
            <Button bsStyle='link'>返回</Button>
          </Link>
        </div>
        <Form horizontal className='report-filter-form'>
          <FormGroup>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              X轴
            </Col>
            <Col sm={ 3 }>
              <Select
                simpleValue
                placeholder='请选择'
                clearable={ false }
                value={ stat_x || null }
                onChange={ (newValue) => { this.state.stat_x = newValue; this.search(); } }
                options={ _.map(Dimensions, (v) => { return { value: v.id, label: v.name } }) }/>
            </Col>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              Y轴
            </Col>
            <Col sm={ 3 }>
              <Select
                simpleValue
                placeholder='请选择'
                value={ this.state.stat_y || null }
                onChange={ (newValue) => { this.state.stat_y = newValue; this.search(); } }
                options={ _.map(Dimensions, (v) => { return { value: v.id, label: v.name } }) }/>
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
          <ButtonGroup className='report-shape-buttongroup'>
            { (stat_x === stat_y || !stat_y) &&
            <Button title='饼状图' style={ { height: '36px', backgroundColor: showShape == 'pie' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'pie' }) } }>饼状图</Button> }
            <Button title='柱状图' style={ { height: '36px', backgroundColor: showShape == 'bar' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'bar' }) } }>柱状图</Button>
            <Button title='折线图' style={ { height: '36px', backgroundColor: showShape == 'line' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'line' }) } }>折线图
</Button>
          </ButtonGroup>
          <div className='report-select-sort'>
            <Select
              simpleValue
              clearable={ false }
              placeholder='选择顺序'
              value={ this.state.sort || 'default' }
              onChange={ (newValue) => { this.setState({ sort: newValue }); } }
              options={ sortOptions }/>
          </div>
        </div>
        { issuesLoading ?
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
          { showShape === 'bar' && data.length > 0 && 
          <div className='report-shape-container'>
            <BarChart
              width={ layout.containerWidth * 0.95 }
              height={ 380 }
              barSize={ 40 }
              data={ data }
              style={ { margin: '25px auto' } }>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              { stat_x !== stat_y && stat_y && <Legend /> }
              { stat_x !== stat_y && stat_y ? 
                _.map(data[0].y || [], (v, i) => <Bar key={ i } dataKey={ 'y_' + i + '_cnt' } stackId='a' name={ v.name } fill={ COLORS[i % COLORS.length] } /> ) : 
                <Bar dataKey='cnt' name='个数' fill='#3b7fc4' /> }
            </BarChart>
          </div> }
          { showShape === 'line' && data.length > 0 &&
          <div className='report-shape-container'>
            <LineChart
              width={ layout.containerWidth * 0.95 }
              height={ 380 }
              data={ data }
              style={ { margin: '25px auto' } }>
              <XAxis dataKey='name' />
              <YAxis/>
              <CartesianGrid strokeDasharray='3 3'/>
              <Tooltip />
              { stat_x !== stat_y && stat_y && <Legend /> }
              { stat_x !== stat_y && stat_y ? 
                _.map(data[0].y || [], (v, i) => <Line key={ i } dataKey={ 'y_' + i + '_cnt' } name={ v.name } stroke={ COLORS[i % COLORS.length] } /> ) : 
                <Line dataKey='cnt' name='个数' stroke='#d04437' /> }
            </LineChart>
          </div> }
          { showShape === 'pie' && data.length > 0 &&
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
                { _.map(data, (v, i) => <Cell key={ i } fill={ COLORS[i % COLORS.length] } /> ) }
              </Pie>
              <Tooltip />
            </PieChart>
          </div> }
          { data.length > 0 && 
          <div style={ { float: 'left', width: '100%', marginBottom: '30px' } }>
            <span>注：该图表最多统计满足当前检索条件下的10000条结果。</span>
            { (stat_x == stat_y || !stat_y) ? 
            <Table responsive bordered={ true }>
              <thead>
                <tr>
                  <th>{ stat_x ? _.find(Dimensions, { id: stat_x }).name : '' }</th>
                  <th>个数</th>
                </tr>
              </thead>
              <tbody>
                { _.map(data, (v, i) => {
                  return (
                    <tr key={ i }>
                      <td>{ v.name }</td>
                      <td><a href='#' onClick={ (e) => { e.preventDefault(); const query = {}; query[stat_x] = v.id; this.gotoIssue(query); } }>{ v.cnt }</a></td>
                    </tr> ) }) }
              </tbody>
            </Table> 
            : 
            <Table responsive bordered={ true }>
              <thead>
                <tr>
                  <th>维度</th>
                  { _.map(data[0].y, (v, i) => <th key={ i }>{ v.name }</th>) }
                  {/*<th>合计</th>*/}
                </tr>
              </thead>
              <tbody>
                { _.map(data, (v, i) => 
                <tr key={ i }>
                  <td>{ v.name }</td>
                  { _.map(v.y, (v2, i) => <td key={ i }><a href='#' onClick={ (e) => { e.preventDefault(); const query = {}; query[stat_x] = v.id; query[stat_y] = v2.id; this.gotoIssue(query); } }>{ v2.cnt }</a></td>) }
                  {/*<td><a href='#' onClick={ (e) => { e.preventDefault(); const query = {}; query[stat_x] = v.id; this.gotoIssue(query); } }>{ _.reduce(v.y, (sum, v) => { return sum + v.cnt }, 0) }</a></td>*/}
                </tr>) }
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
          mode={ 'issues' }
          query={ query }
          sqlTxt={ sqlTxt }
          i18n={ i18n }/> }
      </div>
    );
  }
}
