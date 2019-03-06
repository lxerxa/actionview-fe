import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Button, Label, Table, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired
  }

  render() {

    const { project, data, options, loading } = this.props;

    const issueTitle = (<span><i className='fa fa-pie-chart'></i> 问题分布图</span>)
    const trendTitle = (<span><i className='fa fa-line-chart'></i> 问题趋势图</span>)
    const worklogTitle = (<span><i className='fa fa-bar-chart'></i> 人员工作量报告</span>)
    const trackTitle = (<span><i className='fa fa-clock-o'></i> 时间跟踪报告</span>)
    const compareTitle = (<span><i className='fa fa-area-chart'></i> 创建问题和解决问题对比报告</span>)
    const otherTitle = (<span><i className='fa fa-bar-chart'></i> 其它报表</span>)

    return ( loading ?
      <div style={ { marginTop: '15px' } }>
        <div className='detail-view-blanket' style={ { display: loading ? 'block' : 'none' } }>
          <img src={ img } className='loading'/>
        </div>
      </div>
      :
      <div style={ { marginTop: '15px', marginBottom: '30px' } } className='report-container'>
        <Panel header={ issueTitle }>
          <Table responsive hover>
            <tr>
              <td>aa</td>
              <td>bb</td>
              <td>bb</td>
              <td>bb</td>
            </tr>
          </Table>
        </Panel>
        <Panel header={ trendTitle }>
          <Table responsive hover>
            <tr>
              <td>aa</td>
              <td>bb</td>
              <td>bb</td>
              <td>bb</td>
            </tr>
          </Table>
        </Panel>
        <Panel header={ worklogTitle }>
          <Table responsive hover>
            <tr>
              <td>aa</td>
              <td>bb</td>
              <td>bb</td>
              <td>bb</td>
            </tr>
          </Table>
        </Panel>
        <Panel header={ trackTitle }>
          <Table responsive hover>
            <tr>
              <td>aa</td>
              <td>bb</td>
              <td>bb</td>
              <td>bb</td>
            </tr>
          </Table>
        </Panel>
        <Panel header={ compareTitle }>
          <Table responsive hover>
            <tr>
              <td>aa</td>
              <td>bb</td>
              <td>bb</td>
              <td>bb</td>
            </tr>
          </Table>
        </Panel>
        <Panel header={ otherTitle }>
          <Table responsive hover>
            <tr>
              <td>延误率延误率延误率延误率延误率延误率延误率延误率延误率延误率延误率</td>
              <td>完成率</td>
              <td>bb</td>
              <td>bb</td>
            </tr>
          </Table>
        </Panel>
      </div>
    );
  }
}
