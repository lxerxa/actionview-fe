import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Button, Label, Table, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { pulseShowModel: 'percentage', assigneeShowModel: 'percentage', priorityShowModel: 'percentage', moduleShowModel: 'percentage' };
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

    const filterStyle = { marginRight: '50px' };

    return ( loading ?
      <div style={ { marginTop: '20px' } }>
        <div className='detail-view-blanket' style={ { display: loading ? 'block' : 'none' } }>
          <img src={ img } className='loading'/>
        </div>
      </div>
      :
      <div style={ { marginTop: '20px', marginBottom: '30px' } }>
        <div style={ { marginBottom: '15px' } }>
          <span style={ { fontSize: '19px' } }>{ project.name || '-' }</span>
          <span style={ { marginLeft: '15px', fontSize: '14px' } }>键值：{ project.key || '-' }</span>
          <span style={ { marginLeft: '15px', fontSize: '14px' } }>负责人：{ project.principal && project.principal.name || '-' }</span>
          <span style={ { marginLeft: '15px', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis' } }>备注：{ project.description || '-' }</span>
        </div>
        <div style={ { paddingLeft: '5px', marginBottom: '20px' } }>
          <Link to={ '/project/' + project.key + '/issue' }><span style={ filterStyle }>全部问题</span></Link>
          <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved' }><span style={ filterStyle }>未解决的</span></Link>
          <Link to={ '/project/' + project.key + '/issue?assignee=me' }><span style={ filterStyle }>分配给我的</span></Link>
          <Link to={ '/project/' + project.key + '/issue?reporter=me' }><span style={ filterStyle }>我报告的</span></Link>
          <Link to={ '/project/' + project.key + '/issue?watcher=me' }><span style={ filterStyle }>我关注的</span></Link>
          <Link to={ '/project/' + project.key + '/issue?created_at=2w' }><span style={ filterStyle }>最近增加的</span></Link>
          <Link to={ '/project/' + project.key + '/issue?updated_at=2w' }><span style={ filterStyle }>最近更新的</span></Link>
        </div>
        <Panel
          header={ 
            <div>
              <span>{ '一周动态：' + (options.weekAgo || '') + ' ~ 现在' }</span>
              <span className='exchange-icon' onClick={ () => this.setState({ pulseShowModel: this.state.pulseShowModel == 'detail' ? 'percentage' : 'detail' }) }><i className='fa fa-exchange'></i></span>
            </div> }>
          { data.new_issues && data.new_issues.total ?
          <Table responsive hover>
            { this.state.pulseShowModel == 'detail' &&
            <thead>
              <tr>
                <th>类别</th>
                <th>问题</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead> }
            { this.state.pulseShowModel == 'percentage' &&
            <thead>
              <tr>
                <th>类别</th>
                <th>问题</th>
              </tr>
            </thead> }
            { this.state.pulseShowModel == 'detail' &&
            <tbody>
              <tr>
                <td style={ { width: '20%' } }>
                  <Link to={ '/project/' + project.key + '/issue?created_at=1w' }>
                    新建问题
                  </Link>
                </td>
                <td style={ { width: '10%' } }>
                  <Link to={ '/project/' + project.key + '/issue?created_at=1w' }>
                    { data.new_issues && data.new_issues['total'] || 0 }
                  </Link>
                </td>
                { _.map(options.types || [], (v) => { 
                  return (
                    <td key={ v.id }>
                      <Link to={ '/project/' + project.key + '/issue?type=' + v.id + '&created_at=1w' }>
                        { data.new_issues && data.new_issues[v.id] || 0 }
                      </Link>
                    </td>) }) }
              </tr>
              <tr>
                <td>
                  <Link to={ '/project/' + project.key + '/issue?state=Closed&updated_at=1w' }>
                    关闭问题
                  </Link>
                </td>
                <td>
                  <Link to={ '/project/' + project.key + '/issue?state=Closed&updated_at=1w' }>
                    { data.closed_issues && data.closed_issues['total'] || 0 }
                  </Link>
                </td>
                { _.map(options.types || [], (v) => { 
                  return (
                    <td key={ v.id }>
                      <Link to={ '/project/' + project.key + '/issue?type=' + v.id + '&state=Closed&updated_at=1w' }>
                        { data.closed_issues && data.closed_issues[v.id] || 0 }
                      </Link>
                    </td>) }) }
              </tr>
            </tbody> }
            { this.state.pulseShowModel == 'percentage' &&
            <tbody>
              <tr>
                <td style={ { width: '20%' } }>
                  <Link to={ '/project/' + project.key + '/issue?created_at=1w' }>
                    新建问题
                  </Link>
                </td>
                <td>
                  <table style={ { width: '90%' } }>
                    <tr>
                      <td style={ { width: data.new_issues.percent + '%' } }>
                        <div className='green-bar'/>
                      </td>
                      <td style={ { width: (100 - data.new_issues.percent) + '%', paddingLeft: '10px' } }>
                        <Link to={ '/project/' + project.key + '/issue?created_at=1w' }>
                          { data.new_issues && data.new_issues['total'] || 0 }
                        </Link>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <Link to={ '/project/' + project.key + '/issue?state=Closed&updated_at=1w' }>
                    关闭问题
                  </Link>
                </td>
                <td>
                  <table style={ { width: '90%' } }>
                    <tr>
                      <td style={ { width: data.closed_issues.percent + '%' } }>
                        <div className='red-bar'/>
                      </td>
                      <td style={ { width: (100 - data.closed_issues.percent) + '%', paddingLeft: data.closed_issues.percent ? '10px' : '0px' } }>
                        <Link to={ '/project/' + project.key + '/issue?state=Closed&updated_at=1w' }>
                          { data.closed_issues && data.closed_issues['total'] || 0 }
                        </Link>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody> }
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        <Panel 
          header={ 
            <div>
              <span>未解决问题：按经办人</span>
              <span className='exchange-icon' onClick={ () => this.setState({ assigneeShowModel: this.state.assigneeShowModel == 'detail' ? 'percentage' : 'detail' }) }><i className='fa fa-exchange'></i></span>
            </div> }>
          { data.assignee_unresolved_issues && !_.isEmpty(data.assignee_unresolved_issues) ?
          <Table responsive hover>
            { this.state.assigneeShowModel == 'detail' && 
            <thead>
              <tr>
                <th>经办人</th>
                <th>问题</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead> }
            { this.state.assigneeShowModel == 'percentage' &&
            <thead>
              <tr>
                <th>经办人</th>
                <th>问题</th>
                <th>百分比</th>
              </tr>
            </thead> }
            { this.state.assigneeShowModel == 'detail' && 
            <tbody>
              { _.map(data.assignee_unresolved_issues, (val, key) => {
                return (
                <tr>
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
                <tr>
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
                      <tr>
                        <td style={ { width: val.percent + '%' } }>
                          <div className='color-bar'/> 
                        </td>
                        <td style={ { width: (100 - val.percent) + '%', paddingLeft: '10px' } }>
                          { val.percent + '%' } 
                        </td>
                      </tr>
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
              <span className='exchange-icon' onClick={ () => this.setState({ priorityShowModel: this.state.priorityShowModel == 'detail' ? 'percentage' : 'detail' }) }><i className='fa fa-exchange'></i></span>
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
                <tr>
                  <td style={ { width: '20%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&priority=' + key }>
                      { options.priorities && options.priorities[key] || '其他' }
                    </Link>
                  </td>
                  <td style={ { width: '10%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&priority=' + key }>
                      { val['total'] || 0 }
                    </Link>
                  </td>
                  { _.map(options.types || [], (v) => { 
                    return (
                      <td key={ v.id }>
                        <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&type=' + v.id + '&priority=' + key }>
                          { val[v.id] || 0 }
                        </Link>
                      </td>) }) }
                </tr>) }) }
            </tbody> }
            { this.state.priorityShowModel == 'percentage' &&
            <tbody>
              { _.map(data.priority_unresolved_issues, (val, key) => {
                return (
                <tr>
                  <td style={ { width: '20%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&priority=' + key }>
                      { options.priorities && options.priorities[key] || '其他' }
                    </Link>
                  </td>
                  <td style={ { width: '10%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&priority=' + key }>
                      { val['total'] || 0 }
                    </Link>
                  </td>
                  <td>
                    <table style={ { width: '100%' } }>
                      <tr>
                        <td style={ { width: val.percent + '%' } }>
                          <div className='color-bar'/>
                        </td>
                        <td style={ { width: (100 - val.percent) + '%', paddingLeft: '10px' } }>
                          { val.percent + '%' }
                        </td>
                      </tr>
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
              <span className='exchange-icon' onClick={ () => this.setState({ moduleShowModel: this.state.moduleShowModel == 'detail' ? 'percentage' : 'detail' }) }><i className='fa fa-exchange'></i></span>
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
                <tr>
                  <td style={ { width: '20%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&module=' + key }>
                      { options.modules && options.modules[key] || '其他' }
                    </Link>
                  </td>
                  <td style={ { width: '10%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&module=' + key }>
                      { val['total'] || 0 }
                    </Link>
                  </td>
                  { _.map(options.types || [], (v) => { 
                    return (
                      <td key={ v.id }>
                        <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&type=' + v.id + '&module=' + key }>
                          { val[v.id] || 0 }
                        </Link>
                      </td>) }) }
                </tr>) }) }
            </tbody> }
            { this.state.moduleShowModel == 'percentage' &&
            <tbody>
              { _.map(data.module_unresolved_issues, (val, key) => {
                return (
                <tr>
                  <td style={ { width: '20%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&module=' + key }>
                      { options.modules && options.modules[key] || '其他' }
                    </Link>
                  </td>
                  <td style={ { width: '10%' } }>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&module=' + key }>
                      { val['total'] || 0 }
                    </Link>
                  </td>
                  <td>
                    <table style={ { width: '100%' } }>
                      <tr>
                        <td style={ { width: val.percent + '%' } }>
                          <div className='color-bar'/>
                        </td>
                        <td style={ { width: (100 - val.percent) + '%', paddingLeft: '10px' } }>
                          { val.percent + '%' }
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>) }) }
            </tbody> }
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
      </div>
    );
  }
}
