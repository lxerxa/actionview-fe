import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, ControlLabel, Col, Table, ButtonGroup, Button, Radio, Checkbox } from 'react-bootstrap';
import Select from 'react-select';
import { Area, AreaChart, linearGradient, defs, stop, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import _ from 'lodash';
import { IssueFilterList, getCondsTxt } from '../issue/IssueFilterList';
import Duration from '../share/Duration';
import SaveFilterModal from './SaveFilterModal';

const moment = require('moment');
const img = require('../../assets/images/loading.gif');

export default class Trend extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      stat_time: '', 
      issueFilterShow: false, 
      saveFilterShow: false, 
      notWorkingShow: true, 
      interval: 'day',
      is_accu: '0',
      shape: 'bar' };
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
    trend: PropTypes.array.isRequired,
    trendLoading: PropTypes.bool.isRequired,
    refresh: PropTypes.func.isRequired,
    gotoIssue: PropTypes.func.isRequired,
    saveFilter: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index, query } = this.props;
    if (query.stat_time) {
      index(_.assign({}, query, { interval: query.interval || 'day' }, { is_accu: query.is_accu || '0' }));
    }
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { index, query } = this.props;
    if (!_.isEqual(newQuery, query) && newQuery.stat_time) {
      index(_.assign({}, newQuery, { interval: newQuery.interval || 'day' }, { is_accu: newQuery.is_accu || '0' }));
    }
    this.setState({ 
      stat_time: newQuery.stat_time ? newQuery.stat_time : '', 
      is_accu: newQuery.is_accu ? newQuery.is_accu : '0', 
      interval: newQuery.interval ? newQuery.interval : 'day' 
    });
  }

  gotoIssue(mode, type, time) {
    let t = {}, start_time = '', end_time = '';

    const { query, gotoIssue } = this.props;
    if (type === 'sub') {
      if (query.interval === 'week') {
        start_time = moment(time).startOf('week').format('YYYY/MM/DD');
        end_time = moment(time).endOf('week').format('YYYY/MM/DD');
      } else if (query.interval === 'month') {
        start_time = moment(time).startOf('month').format('YYYY/MM/DD');
        end_time = moment(time).endOf('month').format('YYYY/MM/DD');
      } else {
        start_time = time;
        end_time = time;
      }
      if (query.is_accu === '1') {
        t[mode] = '~' + end_time;
      } else {
        t[mode] = start_time + '~' + end_time;
      }
    } else {
      t[mode] = query.stat_time;
    }
    gotoIssue(_.assign({}, _.omit(query, [ 'stat_time', 'interval', 'is_accu' ]), t));
  }

  search() {
    const { query={}, refresh } = this.props;

    const newQuery = _.assign({}, query);
    if (this.state.stat_time) {
      newQuery.stat_time = this.state.stat_time; 
    } else {
      delete newQuery.stat_time;
    }

    newQuery.interval = this.state.interval || 'day';
    newQuery.is_accu = this.state.is_accu === '1' ? '1' : '0';

    refresh(newQuery);
  }

  render() {

    const { 
      i18n, 
      layout,
      project, 
      filters, 
      options, 
      optionsLoading, 
      trend, 
      trendLoading, 
      refresh, 
      query, 
      saveFilter } = this.props;

    const units = { w: '周', m: '月', y: '年' };
    let sqlTxt = '';
    if (!optionsLoading) {
      const stat_time = query['stat_time'];
      if (stat_time) {
        if (_.endsWith(stat_time, 'w') || _.endsWith(stat_time, 'm') || _.endsWith(stat_time, 'y')) {
          const pattern = new RegExp('^(-?)(\\d+)(w|m|y)$');
          if (pattern.exec(stat_time)) {
            sqlTxt = '统计时间～' + RegExp.$2 + units[RegExp.$3] + (RegExp.$1 === '-' ? '外' : '内');
          }
        } else {
          sqlTxt = '统计时间～' + stat_time;
        }
      }

      sqlTxt += ' | 是否累计～' + (query.is_accu === '1' ? '是' : '否');

      const intervals = { 'day': '天', 'week': '周', 'month': '月' };
      const interval = query['interval'] || 'day';
      sqlTxt += ' | 时间间隔～' + intervals[interval];

      const issueSqlTxt = getCondsTxt(query, options);
      if (sqlTxt && issueSqlTxt) {
        sqlTxt += ' | ' + issueSqlTxt;
      } else if (issueSqlTxt) {
        sqlTxt = issueSqlTxt;
      }
    }

    let data = trend;
    if (!this.state.notWorkingShow) {
      data = _.reject(trend, { notWorking : 1 });
    }

    const hasErr = trend.length > 100 || !query.stat_time;

    return ( 
      <div className='project-report-container'>
        <div className='report-title'>
          问题趋势图 
          <Link to={ '/project/' + project.key + '/report' }>
            <Button bsStyle='link'>返回</Button>
          </Link>
        </div>
        <Form horizontal className='report-filter-form'>
          <FormGroup>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              统计时间
            </Col>
            <Col sm={ 6 }>
              <Duration
                value={ this.state.stat_time }
                onChange={ (newValue) => { this.state.stat_time = newValue; this.search(); } }/>
            </Col>
            <Col sm={ 1 } componentClass={ ControlLabel }>
             是否累计 
            </Col>
            <Col sm={ 4 }>
              <Radio
                inline
                name='is_accu'
                onClick={ () => { this.state.is_accu = '1'; this.search(); } }
                checked={ this.state.is_accu === '1' }>
                是
              </Radio>
              <Radio
                inline
                name='is_accu'
                onClick={ () => { this.state.is_accu = '0'; this.search(); } }
                checked={ this.state.is_accu !== '1' }>
                否 
              </Radio>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              时间间隔
            </Col>
            <Col sm={ 2 }>
              <Select
                simpleValue
                clearable={ false }
                placeholder='选择时间间隔'
                value={ this.state.interval }
                onChange={ (newValue) => { this.state.interval = newValue; this.search(); } }
                options={ [ { value: 'day', label: '天' }, { value: 'week', label: '周' }, { value: 'month', label: '月' } ] }/>
            </Col>
            <Col sm={ 9 }>
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
          notShowBlocks={ [ 'time' ] }
          options={ options }
          refresh={ refresh } />
        <div className='report-conds-style'>
          { query.stat_time && sqlTxt &&
          <div className='cond-bar' style={ { marginTop: '0px', float: 'left' } }>
            <div className='cond-contents' title={ sqlTxt }><b>检索条件</b>：{ sqlTxt }</div>
            <div className='remove-icon' onClick={ () => { refresh({}); } } title='清空当前检索'><i className='fa fa-remove'></i></div>
            <div className='remove-icon' onClick={ () => { this.setState({ saveFilterShow: true }); } } title='保存当前检索'><i className='fa fa-save'></i></div>
          </div> }
          <ButtonGroup className='report-shape-buttongroup'>
            <Button title='柱状图' style={ { height: '36px', backgroundColor: this.state.shape == 'bar' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'bar' }) } }>柱状图</Button>
            <Button title='面积图' style={ { height: '36px', backgroundColor: this.state.shape == 'area' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'area' }) } }>面积图</Button>
            <Button title='折线图' style={ { height: '36px', backgroundColor: this.state.shape == 'line' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'line' }) } }>折线图</Button>
          </ButtonGroup> 
          { this.state.interval === 'day' &&
          <div style={ { float: 'right' } }>
            <Checkbox
              disabled={ trendLoading }
              checked={ this.state.notWorkingShow }
              onClick={ () => { this.setState({ notWorkingShow: !this.state.notWorkingShow }) } }
              style={ { display: 'inline-block', marginRight: '20px', marginLeft: '10px' } }>
              显示非工作日 
            </Checkbox>
          </div> }
        </div>
        { trendLoading ?
        <div style={ { height: '550px', paddingTop: '40px' } }>
          <div style={ { textAlign: 'center' } }>
            <img src={ img } className='loading'/>
          </div>
        </div>
        :
        <div style={ { height: '565px' } }>
          { hasErr &&
          <div className='report-shape-container' style={ { paddingTop: '40px' } }>
            <div style={ { textAlign: 'center' } }>
              <span style={ { fontSize: '160px', color: '#FFC125' } } >
                <i className='fa fa-warning'></i>
              </span><br/> 
              { trend.length > 100 &&  
              <span>统计结果数据量太大，无法生成统计图，建议您重新选择过滤条件。</span> }
              { !query.stat_time &&  
              <span>抱歉，统计时间段不能为空。</span> }
            </div>
          </div> }
          { this.state.shape === 'bar' && !hasErr && 
          <div className='report-shape-container'>
            <BarChart
              width={ layout.containerWidth - 60 }
              height={ 380 }
              barSize={ 25 }
              data={ data }
              style={ { margin: '25px auto' } }>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='category' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='new' name='新建的' stackId='a' fill='#4572A7' />
              <Bar dataKey='resolved' name='已解决的' stackId='a' fill='#AA4643' />
              <Bar dataKey='closed' name='已关闭的' stackId='a' fill='#89A54E' />
            </BarChart>
          </div> }
          { this.state.shape === 'line' && !hasErr &&
          <div className='report-shape-container'>
            <LineChart
              width={ layout.containerWidth - 60 }
              height={ 380 }
              data={ data }
              style={ { margin: '25px auto' } }>
              <XAxis dataKey='category'/>
              <YAxis />
              <CartesianGrid strokeDasharray='3 3'/>
              <Tooltip/>
              <Legend />
              <Line dataKey='new' name='新建的' stroke='#4572A7' type='monotone'/>
              <Line dataKey='resolved' name='已解决的' stroke='#AA4643' type='monotone'/>
              <Line dataKey='closed' name='已关闭的' stroke='#89A54E' type='monotone'/>
            </LineChart>
          </div> }
          { this.state.shape === 'area' && !hasErr &&
          <div className='report-shape-container'>
            <AreaChart 
              width={ layout.containerWidth - 60 } 
              height={ 380 } 
              data={ data }
              style={ { margin: '25px auto' } }>
              <defs>
                <linearGradient id='colorNew' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#4572A7' stopOpacity={ 0.8 }/>
                  <stop offset='95%' stopColor='#4572A7' stopOpacity={ 0 }/>
                </linearGradient>
                <linearGradient id='colorResolved' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#AA4643' stopOpacity={ 0.8 }/>
                  <stop offset='95%' stopColor='#AA4643' stopOpacity={ 0 }/>
                </linearGradient>
                <linearGradient id='colorClosed' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#89A54E' stopOpacity={ 0.8 }/>
                  <stop offset='95%' stopColor='#89A54E' stopOpacity={ 0 }/>
                </linearGradient>
              </defs>
              <XAxis dataKey='category'/>
              <YAxis />
              <CartesianGrid strokeDasharray='3 3'/>
              <Tooltip/>
              <Legend />
              <Area dataKey='new' name='新建的' fillOpacity={ 1 } stroke='#4572A7' fill='url(#colorNew)' type='monotone'/>
              <Area dataKey='resolved' name='已解决的' fillOpacity={ 1 } stroke='#AA4643' fill='url(#colorResolved)' type='monotone'/>
              <Area dataKey='closed' name='已关闭的' fillOpacity={ 1 } stroke='#89A54E' fill='url(#colorClosed)' type='monotone'/>
            </AreaChart>
          </div> }
          { !hasErr &&
          <div style={ { float: 'left', width: '100%', marginBottom: '30px' } }>
            <span>注：该图表最多展示100条目。</span>
            <Table responsive bordered={ true }>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>新建的</th>
                  <th>已解决的</th>
                  <th>已关闭的</th>
                </tr>
              </thead>
              <tbody>
                { _.map(trend, (v, i) => {
                  return (
                    <tr key={ i }>
                      <td>{ v.category }</td>
                      <td><a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue('created_at', 'sub', v.category); } }>{ v.new }</a></td>
                      <td><a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue('resolved_at', 'sub', v.category); } }>{ v.resolved }</a></td>
                      <td><a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue('closed_at', 'sub', v.category); } }>{ v.closed }</a></td>
                    </tr> ) }) }
                { this.state.is_accu === '0' &&
                <tr>
                  <td>合计</td>
                  <td>
                    <a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue('created_at', 'total'); } }>
                      { _.reduce(trend, (sum, v) => { return sum + v.new }, 0) }
                    </a>
                  </td>
                  <td>
                    <a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue('resolved_at', 'total'); } }>
                      { _.reduce(trend, (sum, v) => { return sum + v.resolved }, 0) }
                    </a>
                  </td>
                  <td>
                    <a href='#' onClick={ (e) => { e.preventDefault(); this.gotoIssue('closed_at', 'total'); } }>
                      { _.reduce(trend, (sum, v) => { return sum + v.closed }, 0) }
                    </a>
                  </td>
                </tr> }
              </tbody>
            </Table>
          </div> }
        </div> }
        { this.state.saveFilterShow &&
        <SaveFilterModal
          show
          close={ () => { this.setState({ saveFilterShow: false }) } }
          filters={ filters.data || [] }
          options={ options }
          save={ saveFilter }
          mode={ 'trend' }
          query={ query }
          sqlTxt={ sqlTxt }
          i18n={ i18n }/> }
      </div>
    );
  }
}
