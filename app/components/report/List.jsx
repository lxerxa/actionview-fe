import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Button, Label, Table, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
import ResetNotify from './ResetNotify';

const qs = require('qs');
const SearcherConfigModal = require('../share/SearcherConfigModal');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { resetShow: false, searchConfigShow: false, editShow: false, selectedBlock: '' };
    this.getClassifiedData = this.getClassifiedData.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
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

    const classifiedData = _.map(tmp, (v, k) => 
      <tr key={ k }>
        { _.map(v, (v2, i) => 
          <td key={ i }>
            <Link to={ '/project/' + project.key + '/report/' + mode + (!_.isEmpty(v2.query) ? ('?' + qs.stringify(v2.query)) : '') }>{ v2.name }</Link>
          </td>) }
      </tr> 
    );
    return classifiedData;
  }

  async edit(values) {
    const { selectedBlock } = this.state;
    const { edit } = this.props;
    const ecode = await edit(selectedBlock, values);
    return ecode
  }

  render() {

    const { i18n, project, filters, loading, saveLoading, edit, reset } = this.props;

    const blockTitles = { 
      issue: '问题分布图',
      trend: '问题趋势图',
      worklog: '员工作日志报告',
      track: '时间跟踪报告',
      compare: '创建问题和解决问题对比报告',
      others: '其它报表'
    };

    const issueTitle = (
      <div className='report-list-header'>
        <span><i className='fa fa-pie-chart'></i> { blockTitles['issue'] }</span>
        <span 
          className='report-button report-edit-button' 
          onClick={ () => { this.setState({ selectedBlock: 'issue', searchConfigShow: true }) } } 
          title='编辑顺序'>
          <i className='fa fa-pencil'></i>
        </span>
        <span 
          className='report-button report-edit-button' 
          onClick={ () => { this.setState({ selectedBlock: 'issue', resetShow: true }) } } 
          title='重置'>
          <i className='fa fa-repeat'></i>
        </span>
      </div>);
    const trendTitle = (<span><i className='fa fa-line-chart'></i> { blockTitles['trend'] }</span>)
    const worklogTitle = (<span><i className='fa fa-bar-chart'></i> { blockTitles['worklog'] }</span>)
    const trackTitle = (<span><i className='fa fa-clock-o'></i> { blockTitles['track'] }</span>)
    const compareTitle = (<span><i className='fa fa-area-chart'></i> { blockTitles['compare'] }</span>)
    const othersTitle = (<span><i className='fa fa-bar-chart'></i> { blockTitles['others'] }</span>)

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
        { this.state.resetShow &&
          <ResetNotify 
            show
            mode={ this.state.selectedBlock }
            close={ () => { this.setState({ resetShow: false }) } }
            reset={ reset }
            loading={ saveLoading }
            i18n={ i18n }/> }
        { this.state.searchConfigShow &&
          <SearcherConfigModal
            show
            title={ blockTitles[this.state.selectedBlock] + ' - 过滤器管理' }
            close={ () => { this.setState({ searchConfigShow: false }) } }
            searchers={ filters[this.state.selectedBlock] }
            config={ this.edit.bind(this) }
            loading={ saveLoading }
            i18n={ i18n }/> }
      </div>
    );
  }
}
