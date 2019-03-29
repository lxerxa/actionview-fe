import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Button, Label, Table, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
import ResetNotify from './ResetNotify';

const qs = require('qs');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { resetShow: false, editShow: false };
    this.getClassifiedData = this.getClassifiedData.bind(this);
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    saveLoading: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  getClassifiedData(data, mode, columns) {

    const { project } = this.props;

    const tmp = [];
    const len = data.length;
    for (let i = 0; i < len; ) {
      tmp.push(data.slice(i, i + columns));
      i += columns;
    }

    const classifiedData = _.map(tmp, (v) => 
      <tr>
        { _.map(v, (v2, i) => 
          <td key={ i }>
            <Link to={ '/project/' + project.key + '/report/' + mode + (!_.isEmpty(v2.query) ? ('?' + qs.stringify(v2.query)) : '') }>{ v2.name }</Link>
          </td>) }
      </tr> 
    );
    return classifiedData;
  }

  render() {

    const { project, filters, loading, saveLoading, edit, reset } = this.props;

    const issueTitle = (
      <div className='report-list-header'>
        <span><i className='fa fa-pie-chart'></i> 问题分布图</span>
        <span className='report-button report-edit-button' onClick={ () => { } } title='编辑'><i className='fa fa-pencil'></i></span>
        <span className='report-button report-edit-button' onClick={ () => { } } title='重置'><i className='fa fa-repeat'></i></span>
      </div>);
    const trendTitle = (<span><i className='fa fa-line-chart'></i> 问题趋势图</span>)
    const worklogTitle = (<span><i className='fa fa-bar-chart'></i> 人员工作日志报告</span>)
    const trackTitle = (<span><i className='fa fa-clock-o'></i> 时间跟踪报告</span>)
    const compareTitle = (<span><i className='fa fa-area-chart'></i> 创建问题和解决问题对比报告</span>)
    const othersTitle = (<span><i className='fa fa-bar-chart'></i> 其它报表</span>)

    const issueItems = this.getClassifiedData(filters.issue || [], 'issue', 4);
    const worklogItems = this.getClassifiedData(filters.worklog || [], 'worklog', 4);

    return ( loading ?
      <div style={ { marginTop: '30px' } }>
        <div className='detail-view-blanket' style={ { display: loading ? 'block' : 'none' } }>
          <img src={ img } className='loading'/>
        </div>
      </div>
      :
      <div style={ { marginTop: '15px', marginBottom: '30px' } } className='report-container'>
        <Panel header={ issueTitle }>
          <Table responsive>
            <tbody>
              { issueItems }
            </tbody>
          </Table>
        </Panel>
        <Panel header={ trendTitle }>
          <Table responsive>
            <thead><tr>
              <td>aa</td>
              <td>bb</td>
              <td>bb</td>
              <td>bb</td>
            </tr></thead>
          </Table>
        </Panel>
        <Panel header={ worklogTitle }>
          <Table responsive>
            <tbody>
              { worklogItems }
            </tbody>
          </Table>
        </Panel>
        <Panel header={ trackTitle }>
          <Table responsive hover>
            <thead><tr>
              <td>aa</td>
              <td>bb</td>
              <td>bb</td>
              <td>bb</td>
            </tr></thead>
          </Table>
        </Panel>
        <Panel header={ compareTitle }>
          <Table responsive hover>
            <thead><tr>
              <td>aa</td>
              <td>bb</td>
              <td>bb</td>
              <td>bb</td>
            </tr></thead>
          </Table>
        </Panel>
        <Panel header={ othersTitle }>
          <Table responsive hover>
            <thead><tr>
              <td>延误率延误率延误率延误率延误率延误率延误率延误率延误率延误率延误率</td>
              <td>完成率</td>
              <td>bb</td>
              <td>bb</td>
            </tr></thead>
          </Table>
        </Panel>
      </div>
    );
  }
}
