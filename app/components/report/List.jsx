import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Button, Label, Table, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
import ResetNotify from './ResetNotify';

const qs = require('qs');
const FilterConfigModal = require('../share/FilterConfigModal');
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
      const section = data.slice(i, i + columns);
      for (let j = section.length; j <= 4; j++) {
        section.push({});
      }
      tmp.push(section);
      i += columns;
    }

    let classifiedData = [ 
      <tr>
        <td>
          该模块过滤器已被删除，请点击<a href='#' onClick={ (e) => { e.preventDefault(); this.setState({ selectedBlock: mode, resetShow: true }) } }>重置</a>。
        </td>
      </tr> 
    ];
    if (tmp.length > 0) {
      classifiedData = _.map(tmp, (v, k) => 
        <tr key={ k }>
        { _.map(v, (v2, i) => 
          <td key={ i }>
            { v2.name && <Link to={ '/project/' + project.key + '/report/' + mode + (!_.isEmpty(v2.query) ? ('?' + qs.stringify(v2.query)) : '') }>{ v2.name }</Link> }
          </td>) }
        </tr> );
    }
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
      worklog: '人员工作日志报告',
      track: '时间跟踪报告',
      compare: '创建问题和解决问题对比报告',
      others: '其它报表'
    };

    const blockIcons = { 
      issue: 'fa fa-pie-chart',
      trend: 'fa fa-line-chart',
      worklog: 'fa fa-bar-chart',
      track: 'fa fa-clock-o',
      compare: 'fa fa-area-chart',
      others: 'fa fa-bar-chart'
    };

    const blockHeaders = {};
    const blockItems = {};
    const blocks = [ 'issue', 'trend', 'worklog', 'track', 'compare', 'others' ];
    _.forEach(blocks, (v, i) => {
      blockHeaders[v] = (
        <div className='report-list-header' key={ i }>
          <span><i className={ blockIcons[v] }></i> { blockTitles[v] }</span>
          { filters[v] && filters[v].length > 0 &&
          <span
            className='report-button report-edit-button'
            onClick={ () => { this.setState({ selectedBlock: v, searchConfigShow: true }) } }
            title='编辑顺序'>
            <i className='fa fa-pencil'></i>
          </span> }
          <span
            className='report-button report-edit-button'
            onClick={ () => { this.setState({ selectedBlock: v, resetShow: true }) } }
            title='重置'>
            <i className='fa fa-repeat'></i>
          </span>
        </div>
      );
      blockItems[v] = this.getClassifiedData(filters[v] || [], v, 4);
    });

    return ( loading ?
      <div style={ { marginTop: '30px' } }>
        <div className='detail-view-blanket' style={ { display: loading ? 'block' : 'none' } }>
          <img src={ img } className='loading'/>
        </div>
      </div>
      :
      <div style={ { marginTop: '15px', marginBottom: '30px' } } className='report-container'>
        <Panel header={ blockHeaders['issue'] }>
          <Table responsive>
            <tbody>
              { blockItems['issue'] }
            </tbody>
          </Table>
        </Panel>
        <Panel header={ blockHeaders['trend'] }>
          <Table responsive>
            <tbody>
              { blockItems['trend'] }
            </tbody>
          </Table>
        </Panel>
        <Panel header={ blockHeaders['worklog'] }>
          <Table responsive>
            <tbody>
              { blockItems['worklog'] }
            </tbody>
          </Table>
        </Panel>
        <Panel header={ blockHeaders['track'] }>
          <Table responsive hover>
            <tbody>
              { blockItems['track'] }
            </tbody>
          </Table>
        </Panel>
        <Panel header={ blockHeaders['compare'] }>
          <Table responsive hover>
            <tbody>
              { blockItems['compare'] }
            </tbody>
          </Table>
        </Panel>
        <Panel header={ blockHeaders['others'] }>
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
            blockTitles={ blockTitles }
            mode={ this.state.selectedBlock }
            close={ () => { this.setState({ resetShow: false }) } }
            reset={ reset }
            loading={ saveLoading }
            i18n={ i18n }/> }
        { this.state.searchConfigShow &&
          <FilterConfigModal
            show
            title={ blockTitles[this.state.selectedBlock] + ' - 过滤器管理' }
            close={ () => { this.setState({ searchConfigShow: false }) } }
            filters={ filters[this.state.selectedBlock] }
            config={ this.edit.bind(this) }
            loading={ saveLoading }
            i18n={ i18n }/> }
      </div>
    );
  }
}
