import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Form, FormGroup, ControlLabel, Col, Table, ButtonGroup, Button } from 'react-bootstrap';
import Select from 'react-select';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import _ from 'lodash';
import Duration from '../share/Duration';

const img = require('../../assets/images/loading.gif');
const SearchList = require('../issue/SearchList');

export default class Worklog extends Component {
  constructor(props) {
    super(props);
    this.state = { recorded_at: '', issueFilterShow: false, sort: 'default', shape: 'pie' };
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    worklog: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    query: PropTypes.object,
    worklogLoading: PropTypes.bool.isRequired,
    worklogDetailLoading: PropTypes.bool.isRequired,
    refresh: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { index, query } = this.props;
    if (!_.isEqual(newQuery, query)) {
      index(newQuery);
    }
    this.setState({ recorded_at: newQuery.recorded_at ? newQuery.recorded_at : '' });
  }

  search() {
    const { query={}, refresh } = this.props;

    const newQuery = _.assign({}, query);
    if (this.state.recorded_at) {  newQuery.recorded_at = this.state.recorded_at; }
    refresh(newQuery);
  }

  render() {
    const COLORS = [ '#3b7fc4', '#815b3a', '#f79232', '#d39c3f', '#654982', '#4a6785', '#8eb021', '#f15c75', '#ac707a' ];
    const sortOptions = [ { value: 'default', label: '默认顺序' }, { value: 'total_asc', label: '总数升序' }, { value: 'total_desc', label: '总数降序' } ];

    const { project, worklog, options, worklogLoading, refresh, query } = this.props;

    const srcData = _.map(worklog, (v) => { return { name: v.user.name, value: v.value } });
    let data = [];
    if (this.state.sort == 'total_asc') {
      data = _.sortBy(srcData, (v) => { return v.value });
    } else if (this.state.sort == 'total_desc') {
      data = _.sortBy(srcData, (v) => { return -v.value });
    } else {
      data = srcData;
    }

    return ( 
      <div style={ { margin: '20px 10px 10px 10px' } }>
        <div style={ { display: 'block', fontSize: '19px', marginTop: '20px' } }>
          人员工作日志报告 
          <Link to={ '/project/' + project.key + '/report' }>
            <Button bsStyle='link'>返回</Button>
          </Link>
        </div>
        <Form horizontal style={ { marginTop: '10px', marginBottom: '15px', padding: '15px 10px 1px 10px', backgroundColor: '#f5f5f5', borderRadius: '4px' } }>
          <FormGroup>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              填报时间
            </Col>
            <Col sm={ 5 }>
              <Duration
                value={ this.state.recorded_at }
                onChange={ (newValue) => { this.setState({ recorded_at: newValue }); this.search(); } }/>
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
        <SearchList
          query={ query }
          searchShow={ this.state.issueFilterShow }
          options={ options }
          refresh={ refresh } />
        { worklogLoading ?
        <div style={ { height: '600px' } }>
          <div style={ { textAlign: 'center' } }>
            <img src={ img } className='loading'/>
          </div>
        </div>
        :
        <div style={ { height: '600px' } }>
          <div style={ { marginTop: '10px' } }>
            <div className='cond-bar' style={ { marginTop: '0px', float: 'left' } }>
              <div className='cond-contents' title={ 'aaabbccc' }><b>检索条件</b>：{ 'aabbcc' }</div>
              <div className='remove-icon' onClick={ () => { refresh({}); } } title='清空当前检索'><i className='fa fa-remove'></i></div>
              <div className='remove-icon' onClick={ () => { this.setState({ addSearcherShow: true }); } } title='保存当前检索'><i className='fa fa-save'></i></div>
            </div>
            <ButtonGroup style={ { float: 'right', marginRight: '6px' } }>
              <Button title='饼状图' style={ { height: '36px', backgroundColor: this.state.shape == 'pie' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'pie' }) } }>饼状图</Button>
              <Button title='柱状图' style={ { height: '36px', backgroundColor: this.state.shape == 'bar' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'bar' }) } }>柱状图</Button>
              <Button title='折线图' style={ { height: '36px', backgroundColor: this.state.shape == 'line' && '#eee' } } onClick={ ()=>{ this.setState({ shape: 'line' }) } }>折线图</Button>
            </ButtonGroup> 
            <div style={ { float: 'right', width: '120px', marginRight: '15px' } }>
              <Select
                simpleValue
                clearable={ false }
                placeholder='选择顺序'
                value={ this.state.sort || 'default' }
                onChange={ (newValue) => { this.setState({ sort: newValue }); } }
                options={ sortOptions }/>
            </div>
          </div>
          { this.state.shape === 'pie' &&
          <div style={ { width: '100%', height: '450px', float: 'left' } }>
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
                  data.map((entry, index) => <Cell key={ index } fill={ COLORS[index % COLORS.length] } />)
                }
              </Pie>
              <Tooltip />
            </PieChart>
          </div> }
          { this.state.shape === 'bar' &&
          <div style={ { width: '100%', height: '450px', float: 'left' } }>
            <BarChart
              width={ 800 }
              height={ 380 }
              data={ data }
              barSize={ 25 }
              style={ { margin: '25px auto' } }>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis yAxisId='left' orientation='left' stroke='#8884d8' />
              <Tooltip />
              <Bar yAxisId='left' dataKey='value' fill='#3b7fc4' />
            </BarChart>
          </div> }
          { this.state.shape === 'line' &&
          <div style={ { width: '100%', height: '450px', float: 'left' } }>
            <LineChart 
              width={ 800 } 
              height={ 380 } 
              style={ { margin: '25px auto' } }>
              <XAxis dataKey='name' type='category' allowDuplicatedCategory={ true } />
              <YAxis dataKey='value'/>
              <CartesianGrid strokeDasharray='3 3'/>
              <Tooltip/>
              <Line dataKey='value' data={ data } stroke='#d04437' />
            </LineChart>
          </div> }
          <div style={ { float: 'left', width: '100%' } }>
            <span>注：图表值是以分钟(m)为单位</span>
            <Table responsive bordered={ true }>
              <thead>
                <tr>
                  <th>总计</th>
                  { _.map(data, (v, i) => <th key={ i }>{ v.name }</th>) }
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ _.reduce(data, (sum, v) => { return sum + v.value }, 0) }</td>
                  { _.map(data, (v, i) => <td key={ i }>{ v.value }</td>) }
                </tr>
              </tbody>
            </Table>
          </div>
        </div> }
      </div>
    );
  }
}
