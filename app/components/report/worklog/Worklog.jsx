import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Table, ButtonGroup, Button } from 'react-bootstrap';
import Select from 'react-select';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');
const SearchList = require('../../issue/SearchList');

export default class Worklog extends Component {
  constructor(props) {
    super(props);
    this.state = { sort: 'default', shape: 'pie' };
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    worklog: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    worklogLoading: PropTypes.bool.isRequired,
    worklogDetailLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  render() {
    const COLORS = [ '#3b7fc4', '#815b3a', '#f79232', '#d39c3f', '#654982', '#4a6785', '#8eb021', '#f15c75', '#ac707a' ];
    const sortOptions = [ { value: 'default', label: '默认顺序' }, { value: 'total_asc', label: '总数升序' }, { value: 'total_desc', label: '总数降序' } ];

    const { project, worklog, options, worklogLoading } = this.props;

    const srcData = _.map(worklog, (v) => { return { name: v.user.name, value: v.value } });
    let data = [];
    if (this.state.sort == 'total_asc') {
      data = _.sortBy(srcData, (v) => { return v.value });
    } else if (this.state.sort == 'total_desc') {
      data = _.sortBy(srcData, (v) => { return -v.value });
    } else {
      data = srcData;
    }

    return ( worklogLoading ?
      <div style={ { marginTop: '20px' } }>
        <div className='detail-view-blanket' style={ { display: worklogLoading ? 'block' : 'none' } }>
          <img src={ img } className='loading'/>
        </div>
      </div>
      :
      <div style={ { margin: '20px 10px 10px 10px' } }>
        <div style={ { display: 'block', fontSize: '19px', marginTop: '20px' } }>
          人员工作日志报告 
          <Link to={ '/project/' + project.key + '/report' }>
            <Button bsStyle='link'>返回</Button>
          </Link>
        </div>
        <div style={ { marginTop: '10px' } }>
          <ButtonGroup style={ { float: 'right' } }>
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
        <div style={ { width: '100%', height: '450px', marginTop: '20px', float: 'left' } }>
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
        <div style={ { width: '100%', height: '450px', marginTop: '20px', float: 'left' } }>
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
        <div style={ { width: '100%', height: '450px', marginTop: '20px', float: 'left' } }>
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
        <div style={ { float: 'left', marginTop: '0px', width: '100%' } }>
          <span>注：图表值是以分钟(m)为单位</span>
          <Table responsive bordered={ true }>
            <thead>
              <tr>
                <th>总计</th>
                { _.map(data, (v) => <th>{ v.name }</th>) }
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{ _.reduce(data, (sum, v) => { return sum + v.value }, 0) }</td>
                { _.map(data, (v) => <td>{ v.value }</td>) }
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
