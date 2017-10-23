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

    return ( loading ?
      <div style={ { marginTop: '15px' } }>
        <div className='detail-view-blanket' style={ { display: loading ? 'block' : 'none' } }>
          <img src={ img } className='loading'/>
        </div>
      </div>
      :
      <div style={ { marginTop: '15px', marginBottom: '30px' } }>
        <div style={ { marginBottom: '15px' } }>
          <span style={ { fontSize: '19px' } }>{ project.name || '-' }</span>
          <span style={ { marginLeft: '15px', fontSize: '14px' } }>键值：{ project.key || '-' }</span>
          <span style={ { marginLeft: '15px', fontSize: '14px' } }>负责人：{ project.principal && project.principal.name || '-' }</span>
          <span style={ { marginLeft: '15px', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis' } }>备注：{ project.description || '-' }</span>
        </div>
        <Panel header={ '一周动态：' + (options.weekAgo || '') + ' ~ 现在' }>
          { data.new_issues && data.new_issues.total ?
          <Table responsive hover>
            <thead>
              <tr>
                <th>问题类型</th>
                <th>全部</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link to={ '/project/' + project.key + '/issue?created_at=1w' }>
                    新建问题
                  </Link>
                </td>
                <td>
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
                      <Link to={ '/project/' + project.key + '/issue?type=' + v.id + '&updated_at=1w' }>
                        { data.closed_issues && data.closed_issues[v.id] || 0 }
                      </Link>
                    </td>) }) }
              </tr>
            </tbody>
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        <Panel header='未解决问题：按经办人'>
          { data.assignee_unresolved_issues && !_.isEmpty(data.assignee_unresolved_issues) ?
          <Table responsive hover>
            <thead>
              <tr>
                <th>问题类型</th>
                <th>全部</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead>
            <tbody>
              { _.map(data.assignee_unresolved_issues, (val, key) => {
                return (
                <tr>
                  <td>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&assignee=' + key }>
                      { options.users && options.users[key] || '' }
                    </Link>
                  </td>
                  <td>
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
            </tbody>
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        <Panel header='未解决问题：按优先级'>
          { data.priority_unresolved_issues && !_.isEmpty(data.priority_unresolved_issues) ?
          <Table responsive hover>
            <thead>
              <tr>
                <th>问题类型</th>
                <th>全部</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead>
            <tbody>
              { _.map(data.priority_unresolved_issues, (val, key) => {
                return (
                <tr>
                  <td>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&priority=' + key }>
                      { options.priorities && options.priorities[key] || '' }
                    </Link>
                  </td>
                  <td>
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
            </tbody>
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        <Panel header='未解决问题：按模块'>
          { data.module_unresolved_issues && !_.isEmpty(data.module_unresolved_issues) ?
          <Table responsive hover>
            <thead>
              <tr>
                <th>问题类型</th>
                <th>全部</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead>
            <tbody>
              { _.map(data.module_unresolved_issues, (val, key) => {
                return (
                <tr>
                  <td>
                    <Link to={ '/project/' + project.key + '/issue?resolution=Unresolved&module=' + key }>
                      { options.modules && options.modules[key] || '' }
                    </Link>
                  </td>
                  <td>
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
            </tbody>
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
      </div>
    );
  }
}
