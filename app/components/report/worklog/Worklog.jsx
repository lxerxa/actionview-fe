import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, ControlLabel, Col, Table, ButtonGroup, Button } from 'react-bootstrap';
import Select from 'react-select';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import _ from 'lodash';
import { IssueFilterList, parseQuery } from '../../issue/IssueFilterList';
import Duration from '../../share/Duration';
import SaveFilterModal from '../SaveFilterModal';
import List from './List';
import { ttFormat } from '../../share/Funcs'

const img = require('../../../assets/images/loading.gif');

export default class Worklog extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      recorded_at: '', 
      issueFilterShow: false, 
      saveFilterShow: false, 
      worklogListShow: false,
      showedUser: {},
      sort: 'default', 
      shape: 'pie' 
    };
    this.showList = this.showList.bind(this);
    this.refreshList = this.refreshList.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    optionsLoading: PropTypes.bool.isRequired,
    query: PropTypes.object,
    worklog: PropTypes.array.isRequired,
    worklogLoading: PropTypes.bool.isRequired,
    getWorklogList: PropTypes.func.isRequired,
    worklogList: PropTypes.array.isRequired,
    worklogListLoading: PropTypes.bool.isRequired,
    getWorklogDetail: PropTypes.func.isRequired,
    worklogDetail: PropTypes.object.isRequired,
    worklogDetailLoading: PropTypes.bool.isRequired,
    refresh: PropTypes.func.isRequired,
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
      this.state.worklogListShow = false;
      this.state.showedUser = {};
    }
    this.setState({ recorded_at: newQuery.recorded_at ? newQuery.recorded_at : '' });
  }

  search() {
    const { query={}, refresh } = this.props;

    const newQuery = _.assign({}, query);
    if (this.state.recorded_at) {
      newQuery.recorded_at = this.state.recorded_at; 
    } else {
      delete newQuery.recorded_at;
    }
    refresh(newQuery);
  }

  showList(user) {
    this.setState({ worklogListShow: true, showedUser: user });
  }

  refreshList() {
    const { query, getWorklogList } = this.props;
    getWorklogList(_.assign({}, query, { recorder: this.state.showedUser.id }));
  }

  render() {
    const COLORS = [ '#3b7fc4', '#815b3a', '#8eb021', '#d39c3f', '#654982', '#4a6785', '#f79232', '#f15c75', '#ac707a' ];
    const sortOptions = [ { value: 'default', label: '默认顺序' }, { value: 'total_asc', label: '总数升序' }, { value: 'total_desc', label: '总数降序' } ];

    const { 
      i18n, 
      layout,
      project, 
      filters, 
      options, 
      optionsLoading, 
      worklog, 
      worklogLoading, 
      getWorklogList,
      worklogList, 
      worklogListLoading, 
      getWorklogDetail,
      worklogDetail, 
      worklogDetailLoading, 
      refresh, 
      query, 
      saveFilter } = this.props;

    const w2m = (options.w2d || 5) * (options.d2h || 8) * 60;
    const d2m = (options.d2h || 8) * 60;

    const srcData = _.map(worklog, (v) => { return { id: v.user.id, name: v.user.name, value: v.value } });
    let data = [];
    if (this.state.sort == 'total_asc') {
      data = _.sortBy(srcData, (v) => { return v.value });
    } else if (this.state.sort == 'total_desc') {
      data = _.sortBy(srcData, (v) => { return -v.value });
    } else {
      data = srcData;
    }
    //data = [];

    const currentDurations = {
      '0d': '当天',
      '0w': '本周',
      '0m': '当月',
      '0y': '当前年'
    };
    const units = { d: '天', w: '周', m: '月', y: '年' };

    let sqlTxt = '';
    if (!optionsLoading) {
      const recorded_at = query['recorded_at'];
      if (recorded_at) {
        let startCond = '', endCond = '';
        const sections = recorded_at.split('~');

        if ([ '0d', '0w', '0m', '0y' ].indexOf(sections[0]) !== -1) {
          startCond = currentDurations[sections[0]];
        } else if ([ 'd', 'w', 'm', 'y' ].indexOf(sections[0].charAt(sections[0].length - 1)) !== -1) {
          const pattern = new RegExp('^(-?)(\\d+)(d|w|m|y)$');
          if (pattern.exec(sections[0])) {
            if (RegExp.$2 == '0') {
              startCond = '当天';
            } else {
              startCond = RegExp.$2 + units[RegExp.$3] + (RegExp.$1 === '-' ? '前' : '后');
            }
          }
        } else {
          startCond = sections[0];
        }

        if (sections[1]) {
          if ([ '0d', '0w', '0m', '0y' ].indexOf(sections[1]) !== -1) {
            endCond = currentDurations[sections[1]];
          } else if ([ 'd', 'w', 'm', 'y' ].indexOf(sections[1].charAt(sections[1].length - 1)) !== -1) {
            const pattern = new RegExp('^(-?)(\\d+)(d|w|m|y)$');
            if (pattern.exec(sections[1])) {
              if (RegExp.$2 == '0') {
                endCond = '当天';
              } else {
                endCond = RegExp.$2 + units[RegExp.$3] + (RegExp.$1 === '-' ? '前' : '后');
              }
            }
          } else {
            endCond = sections[1];
          }
        }
        sqlTxt = '填报时间: ' + startCond + '~' + endCond;
      }
      const issueSqlTxt = parseQuery(query, options);
      if (sqlTxt && issueSqlTxt) {
        sqlTxt += ' | ' + issueSqlTxt;
      } else if (issueSqlTxt) {
        sqlTxt = issueSqlTxt;
      }
    }

    return ( 
      <div className='project-report-container'>
        <div className='report-title'>
          人员工作日志报告 
          <Link to={ '/project/' + project.key + '/report' }>
            <Button bsStyle='link'>返回</Button>
          </Link>
        </div>
        <Form horizontal className='report-filter-form'>
          <FormGroup>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              填报时间
            </Col>
            <Col sm={ 5 }>
              <Duration
                options={ [ 'fixed', 'variable_duration' ] }
                value={ this.state.recorded_at }
                onChange={ (newValue) => { this.state.recorded_at = newValue; this.search(); } }/>
            </Col>
            <Col sm={ 6 }>
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
          values={ query }
          searchShow={ this.state.issueFilterShow }
          notShowFields={ [ 'watcher' ] }
          options={ options }
          onChange={ (newValue) => { refresh(newValue) } } />
        <div className='report-conds-style'>
          { sqlTxt &&
          <div className='cond-bar' style={ { marginTop: '0px', float: 'left' } }>
            <div className='cond-contents' title={ sqlTxt }><b>检索条件</b>：{ sqlTxt }</div>
            <div className='remove-icon' onClick={ () => { refresh({}); } } title='清空当前检索'><i className='fa fa-remove'></i></div>
            <div className='remove-icon' onClick={ () => { this.setState({ saveFilterShow: true }); } } title='保存当前检索'><i className='fa fa-save'></i></div>
          </div> }
          <ButtonGroup className='report-shape-buttongroup'>
            <Button title='饼状图' style={ { height: '36px', backgroundColor: this.state.shape == 'pie' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'pie' }) } }>饼状图</Button>
            <Button title='柱状图' style={ { height: '36px', backgroundColor: this.state.shape == 'bar' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'bar' }) } }>柱状图</Button>
            <Button title='折线图' style={ { height: '36px', backgroundColor: this.state.shape == 'line' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'line' }) } }>折线图</Button>
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
        { worklogLoading ?
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
          { data.length > 0 && <div style={ { marginLeft: '10px', float: 'right' } }>注：图表耗费时间值是以分钟(m)为单位</div> }
          { this.state.shape === 'pie' && data.length > 0 &&
          <div className='report-shape-container'>
            <PieChart 
              width={ 800 } 
              height={ 380 } 
              style={ { margin: '25px auto' } }>
              <Pie 
                dataKey='value' 
                data={ data } 
                cx={ 400 } 
                cy={ 200 } 
                outerRadius={ 130 } 
                label>
                {
                  data.map((entry, index) => <Cell key={ index } fill={ COLORS[index % COLORS.length] }/>)
                }
              </Pie>
              <Tooltip formatter={ (value) => { return ttFormat(value, w2m, d2m) } }/>
            </PieChart>
          </div> }
          { this.state.shape === 'bar' && data.length > 0 && 
          <div className='report-shape-container'>
            <BarChart
              width={ layout.containerWidth * 0.95 }
              height={ 380 }
              data={ data }
              barSize={ 40 }
              style={ { margin: '25px auto' } }>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip formatter={ (value) => { return ttFormat(value, w2m, d2m) } }/>
              <Bar name='工时' stackId='a' dataKey='value' fill='#3b7fc4'/>
            </BarChart>
          </div> }
          { this.state.shape === 'line' && data.length > 0 &&
          <div className='report-shape-container'>
            <LineChart 
              width={ layout.containerWidth * 0.95 } 
              height={ 380 } 
              data={ data }
              style={ { margin: '25px auto' } }>
              <XAxis dataKey='name' />
              <YAxis/>
              <CartesianGrid strokeDasharray='3 3'/>
              <Tooltip formatter={ (value) => { return ttFormat(value, w2m, d2m) } }/>
              <Line name='工时' dataKey='value' stroke='#d04437'/>
            </LineChart>
          </div> }
          { data.length > 0 &&
          <div style={ { float: 'left', width: '100%' } }>
            <Table responsive bordered={ true }>
              <thead>
                <tr>
                  <th>总计</th>
                  { _.map(data, (v, i) => <th key={ i }>{ v.name }</th>) }
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ ttFormat(_.reduce(data, (sum, v) => { return sum + v.value }, 0), w2m, d2m) }</td>
                  { _.map(data, (v, i) => {
                    if (v.id === 'others' || v.id == this.state.showedUser.id) {
                      return (
                        <td key={ i }>{ ttFormat(v.value, w2m, d2m) }</td>
                      );
                    } else {
                      return ( 
                        <td key={ i }><a href='#workloglist' onClick={ (e) => { this.showList({ id: v.id, name: v.name }) } }>{ ttFormat(v.value, w2m, d2m) }</a></td>
                      ); 
                    }
                  }) }
                </tr>
              </tbody>
            </Table>
          </div> }
        </div> }
        { this.state.worklogListShow &&
        <div id='workloglist' style={ { float: 'left', width: '100%', textAlign: 'center', margin: '15px 0px 30px 0px' } }>
          <span style={ { fontWeight: '600' } }>{ this.state.showedUser.name || '' } - 工作日志</span>
          <span title='刷新' onClick={ this.refreshList }><Button bsStyle='link' disabled={ worklogListLoading }><i className='fa fa-refresh'></i></Button></span>
          <List
            show
            showedUser={ this.state.showedUser }
            query={ query }
            options={ options }
            index={ getWorklogList }
            collection={ worklogList }
            indexLoading={ worklogListLoading }
            select={ getWorklogDetail }
            item={ worklogDetail }
            itemLoading={ worklogDetailLoading }
            i18n={ i18n }/>
        </div> }
        { this.state.saveFilterShow &&
        <SaveFilterModal
          show
          close={ () => { this.setState({ saveFilterShow: false }) } }
          filters={ filters.worklog || [] }
          options={ options }
          save={ saveFilter }
          mode={ 'worklog' }
          query={ query }
          sqlTxt={ sqlTxt }
          i18n={ i18n }/> }
      </div>
    );
  }
}
