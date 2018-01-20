import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Button, Label, Table, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');
const allPermissions = require('../share/Permissions.js');

const PreviewModal = require('../workflow/PreviewModal');
const ScreenPreviewModal = require('../screen/PreviewModal');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { screenPreviewModalShow: false, screenSchema: [], screenName: '', wfPreviewModalShow: false, wfSteps: [], wfName: '' };
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
        <Panel header='问题类型'>
          { data.types && data.types.length > 0 ?
          <Table responsive hover>
            <thead>
              <tr>
                <th>名称</th>
                <th>类型</th>
                <th>界面</th>
                <th>工作流</th>
              </tr>
            </thead>
            <tbody>
              { _.map(data.types, (v) => {
                return (
                  <tr>
                    <td>
                      <span className='table-td-title-nobold'>
                        { v.name || '' }({ v.abb || '' })
                        { v.default && <span style={ { fontWeight: 'normal' } }> (默认)</span> }
                        { v.type == 'subtask' && <span style={ { fontWeight: 'normal' } }> (子任务)</span> }
                      </span>
                      <span className='table-td-desc'>{ v.description || '' }</span>
                    </td>
                    <td>{ v.type === 'subtask' ? '子任务' : '标准' }</td>
                    <td>
                      <a href='#' onClick={ (e) => { e.preventDefault(); this.setState({ screenPreviewModalShow: true, screenSchema: v.screen && v.screen.schema || [], screenName: v.screen && v.screen.name || '' }); } }>
                        { v.screen && v.screen.name || '' }
                      </a>
                    </td>
                    <td>
                      <a href='#' onClick={ (e) => { e.preventDefault(); this.setState({ wfPreviewModalShow: true, wfSteps: v.workflow && v.workflow.contents && v.workflow.contents.steps || [], wfName: v.workflow && v.workflow.name || '' }); } }>
                        { v.workflow && v.workflow.name || '' }
                      </a>
                    </td>
                  </tr>
                );
              }) }
            </tbody>
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        <Panel header='问题优先级'>
          { data.priorities && data.priorities.length > 0 ?
          <Table responsive hover>
            <thead>
              <tr>
                <th>名称</th>
                <th>图案</th>
                <th>描述</th>
              </tr>
            </thead>
            <tbody>
              { _.map(data.priorities || [], (v) => {
                return (
                  <tr>
                    <td><span className='table-td-title-nobold'>{ v.name || '' }{ v.default && <span style={ { fontWeight: 'normal' } }> (默认)</span> }</span></td>
                    <td><div className='circle' style={ { backgroundColor: v.color || '#ccc' } } /></td>
                    <td>{ v.description || '-' }</td>
                  </tr>
                );
              }) }
            </tbody>
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        <Panel header='项目角色'>
          { data.roles && data.roles.length > 0 ?
          <Table responsive hover>
            <thead>
              <tr>
                <th style={ { width: '300px' } }>名称</th>
                <th>权限</th>
              </tr>
            </thead>
            <tbody>
              { _.map(data.roles, (v) => {
                return (
                  <tr>
                    <td>
                      <span className='table-td-title-nobold'>{ v.name || '' }</span>
                      <span className='table-td-desc'>{ v.description || '' }</span>
                    </td>
                    <td>
                      <div style={ { display: 'table', width: '100%' } }>
                      { v.permissions && v.permissions.length > 0 ?
                        <span>
                        { _.map(_.filter(allPermissions, function(o) { return _.indexOf(v.permissions, o.id) !== -1 }), function(val, i) { return <div style={ { display: 'inline-block', float: 'left', margin: '3px 3px 6px 3px' } }><Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } } key={ i }>{ val.name || '' }</Label></div> }) }
                       </span>
                       :
                       <span>
                         <div style={ { display: 'inline-block', margin: '3px 3px 6px 3px' } }>-</div>
                       </span> }
                      </div>
                    </td>
                  </tr>
                );
              }) }
            </tbody>
          </Table>
          :
          <div>暂无信息</div> }
        </Panel>
        { this.state.wfPreviewModalShow &&
          <PreviewModal show
            close={ () => { this.setState({ wfPreviewModalShow: false }); } }
            name={ this.state.wfName }
            collection={ this.state.wfSteps } /> }
        { this.state.screenPreviewModalShow &&
          <ScreenPreviewModal show
            close={ () => { this.setState({ screenPreviewModalShow: false }); } }
            name={ this.state.screenName }
            data={ this.state.screenSchema } /> }
      </div>
    );
  }
}
