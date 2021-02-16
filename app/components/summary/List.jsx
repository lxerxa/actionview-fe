import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { FormGroup, Col, Button, Label, Table, Panel } from 'react-bootstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { LineChart, Line, XAxis, YAxis, Legend, CartesianGrid, Tooltip, Cell } from 'recharts';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const qs = require('qs');
const img = require('../../assets/images/loading.gif');
const ArchiveNotify = require('../project/ArchiveNotify');
const EditModal = require('../project/EditModal');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      pulseShowModel: 'charts', 
      pulseStatItems: [ 'new', 'resolve', 'close' ], 
      assigneeShowModel: 'percentage', 
      priorityShowModel: 'percentage', 
      moduleShowModel: 'percentage', 
      editModalShow: false,
      archiveNotifyShow: false
    };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    update: PropTypes.func.isRequired,
    archive: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired
  }

  render() {
    const { 
      i18n, 
      layout, 
      user, 
      project, 
      data, 
      update,
      archive,
      options, 
      loading 
    } = this.props;

    const filterStyle = { marginRight: '50px' };
    const bgColors = [ '#58ca9a', '#ee706d', '#f7da47', '#447eff' ];   

    return ( loading ?
      <div style={ { marginTop: '50px', textAlign: 'center' } }>
        <img src={ img } className='loading'/>
      </div>
      :
      <div style={ { marginTop: '20px', marginBottom: '30px' } }>
        <div className='project-summary-header'>
          <span style={ { fontSize: '16px' } }>{ project.name || '-' }</span>
          <span style={ { marginLeft: '15px' } }>{ project.status == 'active' ? <span className='project-inprogress-label'>活动中</span> : <span className='project-close-label'>已归档</span> }</span>
          <span className='item-title'>键值：</span><span>{ project.key || '-' }</span>
          <span className='item-title'>负责人：</span><span>{ project.principal && project.principal.name || '-' }</span>
          <span className='item-title'>描述：</span><span>{ project.description || '-' }</span>
          { project.status == 'active' && project.principal && project.principal.id == user.id &&
            <span style={ { float: 'right' } }>
              <span className='project-summary-button' onClick={ () => { this.setState({ editModalShow: true }); } } title='编辑'><i className='fa fa-edit'></i></span>
              <span className='project-summary-button' onClick={ () => { this.setState({ archiveNotifyShow: true }); } } title='归档'><i className='fa fa-archive'></i></span>
            </span> }
        </div>
        { data.filters && data.filters.length > 0 ? 
        <div style={ { height: '160px', marginBottom: '20px', padding: '16px 0px', backgroundColor: '#f7f7f7', borderRadius: '4px', borderBottom: '1px solid #ddd' } }>
          { _.map(data.filters || [], (v, i) => {
            return (
            <Col sm={ 3 } key={ i }>
              <div style={ { padding : '30px 0px', textAlign: 'center', backgroundColor: bgColors[i], borderRadius: '4px' } }>
                <div style={ { fontWeight: 600, fontSize: '30px' } }>
                  <Link to={ '/project/' + project.key + '/issue' + (!_.isEmpty(v.query) ? '?' + qs.stringify(v.query || {}) : '') } style={ { color: '#fff' } }>{ v.count }</Link>
                </div>
                <div style={ { fontSize: '14px', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' } } title={ v.name }>{ v.name }</div>
              </div>
            </Col> ) }) }
        </div> 
        :
        <div style={ { marginBottom: '20px', padding: '15px', backgroundColor: '#f7f7f7', borderRadius: '4px', borderBottom: '1px solid #ddd' } }>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue' }>全部问题</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?resolution=Unresolved' }>未解决的</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?assignee=me&resolution=Unresolved' }>分配给我的</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?reporter=me' }>我报告的</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?watcher=me' }>我关注的</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?created_at=2w~' }>最近增加的</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?updated_at=2w~' }>最近更新的</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?resolved_at=2w~' }>最近解决的</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?closed_at=2w~' }>最近关闭的</Link></span>
        </div> }
        <Panel
          style={ { height: '320px' } }
          header={ 
            <div>
              <span>{ '问题动态：' + (options.twoWeeksAgo || '') + ' ~ 现在' }</span>
              <span className='exchange-icon' onClick={ () => this.setState({ pulseShowModel: this.state.pulseShowModel == 'detail' ? 'charts' : 'detail' }) } title='切换'><i className='fa fa-retweet'></i></span>
            </div> }>
          { this.state.pulseShowModel == 'detail' &&
          <Table responsive hover>
            <thead>
              <tr>
                <th>日期</th>
                { _.map(data.trend || [], (v, i) => { return (<th key={ i }>{ v.day.substr(5) }</th>) }) }
                <th>合计</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link to={ '/project/' + project.key + '/issue?created_at=2w~' }>
                    新建问题
                  </Link>
                </td>
                { _.map(data.trend || [], (v, i) => <td key={ i }><Link to={ '/project/' + project.key + '/issue?created_at=' + v.day + '~' + v.day }>{ v.new }</Link></td>) }
                <td>
                  <Link to={ '/project/' + project.key + '/issue?created_at=2w~' }>
                    { _.reduce(data.trend || [], (sum, v) => { return sum + v.new }, 0) }
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <Link to={ '/project/' + project.key + '/issue?resolved_at=2w~' }>
                    解决问题
                  </Link>
                </td>
                { _.map(data.trend || [], (v, i) => <td key={ i }><Link to={ '/project/' + project.key + '/issue?resolved_at=' + v.day + '~' + v.day }>{ v.resolved }</Link></td>) }
                <td>
                  <Link to={ '/project/' + project.key + '/issue?resolved_at=2w~' }>
                    { _.reduce(data.trend || [], (sum, v) => { return sum + v.resolved }, 0) }
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <Link to={ '/project/' + project.key + '/issue?closed_at=2w~' }>
                    关闭问题
                  </Link>
                </td>
                { _.map(data.trend || [], (v, i) => <td key={ i }><Link to={ '/project/' + project.key + '/issue?closed_at=' + v.day + '~' + v.day }>{ v.closed }</Link></td>) }
                <td>
                  <Link to={ '/project/' + project.key + '/issue?closed_at=2w~' }>
                    { _.reduce(data.trend || [], (sum, v) => { return sum + v.closed }, 0) }
                  </Link>
                </td>
              </tr>
            </tbody>
          </Table> }
          { this.state.pulseShowModel == 'charts' &&
          <div>
            <CheckboxGroup 
              name='statItems' 
              value={ this.state.pulseStatItems } 
              onChange={ (newValue) => { this.setState({ pulseStatItems: newValue }) } } 
              style={ { float: 'right', margin: '5px 10px 0px 0px', height: '30px' } }>
              <div style={ { float: 'left' } }>
                <label style={ { fontWeight: 400 } }>
                  <Checkbox value='new' style={ { float: 'left' } }/><span style={ { marginLeft: '2px' } }>新建的</span>
                </label>
              </div>
              <div style={ { float: 'left', marginLeft: '8px' } }>
                <label style={ { fontWeight: 400 } }>
                  <Checkbox value='resolve'/><span style={ { marginLeft: '2px' } }>已解决的</span>
                </label>
              </div>
              <div style={ { float: 'left', marginLeft: '8px' } }>
                <label style={ { fontWeight: 400 } }>
                  <Checkbox value='close'/><span style={ { marginLeft: '2px' } }>已关闭的</span>
                </label>
              </div>
            </CheckboxGroup>
          </div> }
          { this.state.pulseShowModel == 'charts' &&
          <div className='report-shape-container'>
            <LineChart
              width={ layout.containerWidth * 0.95 }
              height={ 200 }
              data={ data.trend || [] }
              style={ { margin: '35px auto' } }>
              <XAxis dataKey='day'/>
              <YAxis />
              <CartesianGrid strokeDasharray='3 3'/>
              <Tooltip/>
              <Legend />
              { this.state.pulseStatItems.indexOf('new') !== -1 && <Line type='monotone' dataKey='new' name='新建的' stroke='#4572A7' fill='#4572A7'/> }
              { this.state.pulseStatItems.indexOf('resolve') !== -1 && <Line type='monotone' dataKey='resolved' name='已解决的' stroke='#89A54E' fill='#89A54E'/> }
              { this.state.pulseStatItems.indexOf('close') !== -1 && <Line type='monotone' dataKey='closed' name='已关闭的' stroke='#AA4643' fill='#AA4643'/> }
            </LineChart>
          </div> }
        </Panel>
        <Panel 
          header={ 
            <div>
              <span>未解决问题：按负责人</span>
              <span className='exchange-icon' onClick={ () => this.setState({ assigneeShowModel: this.state.assigneeShowModel == 'detail' ? 'percentage' : 'detail' }) } title='切换'><i className='fa fa-retweet'></i></span>
            </div> }>
          { data.assignee_unresolved_issues && !_.isEmpty(data.assignee_unresolved_issues) ?
          <Table responsive hover>
            { this.state.assigneeShowModel == 'detail' && 
            <thead>
              <tr>
                <th>负责人</th>
                <th>问题</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead> }
            { this.state.assigneeShowModel == 'percentage' &&
            <thead>
              <tr>
                <th>负责人</th>
                <th>问题</th>
                <th>百分比</th>
              </tr>
            </thead> }
            { this.state.assigneeShowModel == 'detail' && 
            <tbody>
              { _.map(data.assignee_unresolved_issues, (val, key) => {
                return (
                <tr key={ key }>
                  <td style={ { width: '20%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&assignee=' + key }>
                      { options.users && options.users[key] || '' }
                    </Link>
                  </td>
                  <td style={ { width: '10%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&assignee=' + key }>
                      { val['total'] || 0 }
                    </Link>
                  </td>
                  { _.map(options.types || [], (v) => { 
                    return (
                      <td key={ v.id }>
                        <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&type=' + v.id + '&assignee=' + key }>
                          { val[v.id] || 0 }
                        </Link>
                      </td>) }) }
                </tr>) }) }
            </tbody> }
            { this.state.assigneeShowModel == 'percentage' && 
            <tbody>
              { _.map(data.assignee_unresolved_issues, (val, key) => {
                return (
                <tr key={ key }>
                  <td style={ { width: '20%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&assignee=' + key }>
                      { options.users && options.users[key] || '' }
                    </Link>
                  </td>
                  <td style={ { width: '10%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&assignee=' + key }>
                      { val['total'] || 0 }
                    </Link>
                  </td>
                  <td>
                    <table style={ { width: '100%' } }>
                      <tbody><tr>
                        <td style={ { width: val.percent + '%' } }>
                          <div className='color-bar'/> 
                        </td>
                        <td style={ { width: (100 - val.percent) + '%', paddingLeft: '10px' } }>
                          { val.percent + '%' } 
                        </td>
                      </tr></tbody>
                    </table>
                  </td>
                </tr>) }) }
            </tbody> }
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        <Panel 
          header={ 
            <div>
              <span>未解决问题：按优先级</span>
              <span className='exchange-icon' onClick={ () => this.setState({ priorityShowModel: this.state.priorityShowModel == 'detail' ? 'percentage' : 'detail' }) } title='切换'><i className='fa fa-retweet'></i></span>
            </div> }>
          { data.priority_unresolved_issues && !_.isEmpty(data.priority_unresolved_issues) ?
          <Table responsive hover>
            { this.state.priorityShowModel == 'detail' &&
            <thead>
              <tr>
                <th>优先级</th>
                <th>问题</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead> }
            { this.state.priorityShowModel == 'percentage' &&
            <thead>
              <tr>
                <th>优先级</th>
                <th>问题</th>
                <th>百分比</th>
              </tr>
            </thead> }
            { this.state.priorityShowModel == 'detail' &&
            <tbody>
              { _.map(data.priority_unresolved_issues, (val, key) => {
                return (
                <tr key={ key }>
                  <td style={ { width: '20%' } }>
                    { options.priorities && options.priorities[key] ?
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&priority=' + key }>
                      { options.priorities[key] }
                    </Link>
                    :
                    '其他' }
                  </td>
                  <td style={ { width: '10%' } }>
                    { options.priorities && options.priorities[key] ?
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&priority=' + key }>
                      { val['total'] || 0 }
                    </Link>
                    :
                    ( val['total'] || 0 ) }
                  </td>
                  { _.map(options.types || [], (v) => { 
                    return (
                      <td key={ v.id }>
                        { options.priorities && options.priorities[key] ?
                        <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&type=' + v.id + '&priority=' + key }>
                          { val[v.id] || 0 }
                        </Link>
                        :
                        ( val[v.id] || 0 ) }
                      </td>) }) }
                </tr>) }) }
            </tbody> }
            { this.state.priorityShowModel == 'percentage' &&
            <tbody>
              { _.map(data.priority_unresolved_issues, (val, key) => {
                return (
                <tr key={ key }>
                  <td style={ { width: '20%' } }>
                    { options.priorities && options.priorities[key] ?
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&priority=' + key }>
                      { options.priorities[key] }
                    </Link>
                    :
                    '其他' }
                  </td>
                  <td style={ { width: '10%' } }>
                    { options.priorities && options.priorities[key] ?
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&priority=' + key }>
                      { val['total'] || 0 }
                    </Link>
                    :
                    ( val['total'] || 0 ) }
                  </td>
                  <td>
                    <table style={ { width: '100%' } }>
                      <tbody><tr>
                        <td style={ { width: val.percent + '%' } }>
                          <div className='color-bar'/>
                        </td>
                        <td style={ { width: (100 - val.percent) + '%', paddingLeft: '10px' } }>
                          { val.percent + '%' }
                        </td>
                      </tr></tbody>
                    </table>
                  </td>
                </tr>) }) }
            </tbody> }
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        <Panel
          header={ 
            <div>
              <span>未解决问题：按模块</span>
              <span className='exchange-icon' onClick={ () => this.setState({ moduleShowModel: this.state.moduleShowModel == 'detail' ? 'percentage' : 'detail' }) } title='切换'><i className='fa fa-retweet'></i></span>
            </div> }>
          { data.module_unresolved_issues && !_.isEmpty(data.module_unresolved_issues) ?
          <Table responsive hover>
            { this.state.moduleShowModel == 'detail' &&
            <thead>
              <tr>
                <th>模块</th>
                <th>问题</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead> }
            { this.state.moduleShowModel == 'percentage' &&
            <thead>
              <tr>
                <th>模块</th>
                <th>问题</th>
                <th>百分比</th>
              </tr>
            </thead> }
            { this.state.moduleShowModel == 'detail' &&
            <tbody>
              { _.map(data.module_unresolved_issues, (val, key) => {
                return (
                <tr key={ key }>
                  <td style={ { width: '20%' } }>
                    { options.modules && options.modules[key] ?
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&module=' + key }>
                      { options.modules[key] }
                    </Link>
                    :
                    '其他' }
                  </td>
                  <td style={ { width: '10%' } }>
                    { options.modules && options.modules[key] ?
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&module=' + key }>
                      { val['total'] || 0 }
                    </Link>
                    :
                    ( val['total'] || 0 ) }
                  </td>
                  { _.map(options.types || [], (v) => { 
                    return (
                      <td key={ v.id }>
                        { options.modules && options.modules[key] ?
                        <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&type=' + v.id + '&module=' + key }>
                          { val[v.id] || 0 }
                        </Link>
                        :
                        ( val[v.id] || 0 ) }
                      </td>) }) }
                </tr>) }) }
            </tbody> }
            { this.state.moduleShowModel == 'percentage' &&
            <tbody>
              { _.map(data.module_unresolved_issues, (val, key) => {
                return (
                <tr key={ key }>
                  <td style={ { width: '20%' } }>
                    { options.modules && options.modules[key] ?
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&module=' + key }>
                      { options.modules[key] }
                    </Link>
                    :
                    '其他' }
                  </td>
                  <td style={ { width: '10%' } }>
                    { options.modules && options.modules[key] ?
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&module=' + key }>
                      { val['total'] || 0 }
                    </Link>
                    :
                    ( val['total'] || 0 ) }
                  </td>
                  <td>
                    <table style={ { width: '100%' } }>
                      <tbody><tr>
                        <td style={ { width: val.percent + '%' } }>
                          <div className='color-bar'/>
                        </td>
                        <td style={ { width: (100 - val.percent) + '%', paddingLeft: '10px' } }>
                          { val.percent + '%' }
                        </td>
                      </tr></tbody>
                    </table>
                  </td>
                </tr>) }) }
            </tbody> }
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        { this.state.editModalShow &&
          <EditModal
            show
            close={ () => { this.setState({ editModalShow: false }) } }
            update={ update }
            data={ project }
            i18n={ i18n }/> }
        { this.state.archiveNotifyShow &&
          <ArchiveNotify
            show
            close={ () => { this.setState({ archiveNotifyShow: false }) } }
            data={ project }
            archive={ archive }/> }
      </div>
    );
  }
}
