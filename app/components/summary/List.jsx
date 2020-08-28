import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { FormGroup, Col, Button, Label, Table, Panel } from 'react-bootstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { LineChart, Line, XAxis, YAxis, Legend, CartesianGrid, Tooltip, Cell } from 'recharts';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const qs = require('qs');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      pulseShowModel: 'charts', 
      pulseStatItems: [ 'new', 'resolve', 'close' ], 
      assigneeShowModel: 'percentage', 
      priorityShowModel: 'percentage', 
      moduleShowModel: 'percentage' };
  }

  static propTypes = {
    layout: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired
  }

  render() {
    const { layout, project, data, options, loading } = this.props;

    const filterStyle = { marginRight: '50px' };
    const bgColors = [ '#58ca9a', '#ee706d', '#f7da47', '#447eff' ];   

    return ( loading ?
      <div style={ { marginTop: '50px', textAlign: 'center' } }>
        <img src={ img } className='loading'/>
      </div>
      :
      <div style={ { marginTop: '20px', marginBottom: '30px' } }>
        <div style={ { marginBottom: '15px' } }>
          <span style={ { fontSize: '19px' } }>{ project.name || '-' }</span>
          <span style={ { marginLeft: '15px', fontSize: '14px' } }>Key value：{ project.key || '-' }</span>
          <span style={ { marginLeft: '15px', fontSize: '14px' } }>Principal：{ project.principal && project.principal.name || '-' }</span>
          <span style={ { marginLeft: '15px', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis' } }>Comments：{ project.description || '-' }</span>
        </div>
        { data.filters && data.filters.length > 0 ? 
        <div style={ { height: '120px', margin: '0px -10px 25px -10px' } }>
          <FormGroup>
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
          </FormGroup>
        </div> 
        :
        <div style={ { paddingLeft: '5px', marginBottom: '20px' } }>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue' }>All issues</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?resolution=Unresolved' }>Unresolved</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?assignee=me&resolution=Unresolved' }>Assigned to me</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?reporter=me' }>我报告of</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?watcher=me' }>Watcher</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?created_at=2w' }>最近增加of</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?updated_at=2w' }>最近更新of</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?resolved_at=2w' }>最近解决of</Link></span>
          <span style={ filterStyle }><Link to={ '/project/' + project.key + '/issue?closed_at=2w' }>最近关闭of</Link></span>
        </div> }
        <Panel
          style={ { height: '320px' } }
          header={ 
            <div>
              <span>{ 'Date range：' + (options.twoWeeksAgo || '') + ' ~ Now' }</span>
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
                  <Link to={ '/project/' + project.key + '/issue?created_at=2w' }>
                    New 问题
                  </Link>
                </td>
                { _.map(data.trend || [], (v, i) => <td key={ i }><Link to={ '/project/' + project.key + '/issue?created_at=' + v.day + '~' + v.day }>{ v.new }</Link></td>) }
                <td>
                  <Link to={ '/project/' + project.key + '/issue?created_at=2w' }>
                    { _.reduce(data.trend || [], (sum, v) => { return sum + v.new }, 0) }
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <Link to={ '/project/' + project.key + '/issue?resolved_at=2w' }>
                    Resolve issue
                  </Link>
                </td>
                { _.map(data.trend || [], (v, i) => <td key={ i }><Link to={ '/project/' + project.key + '/issue?resolved_at=' + v.day + '~' + v.day }>{ v.resolved }</Link></td>) }
                <td>
                  <Link to={ '/project/' + project.key + '/issue?resolved_at=2w' }>
                    { _.reduce(data.trend || [], (sum, v) => { return sum + v.resolved }, 0) }
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <Link to={ '/project/' + project.key + '/issue?closed_at=2w' }>
                    Close issue
                  </Link>
                </td>
                { _.map(data.trend || [], (v, i) => <td key={ i }><Link to={ '/project/' + project.key + '/issue?closed_at=' + v.day + '~' + v.day }>{ v.closed }</Link></td>) }
                <td>
                  <Link to={ '/project/' + project.key + '/issue?closed_at=2w' }>
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
              <div style={ { float: 'left' } }><Checkbox value='new' style={ { float: 'left' } }/><span style={ { marginLeft: '2px' } }>New</span></div>
              <div style={ { float: 'left', marginLeft: '8px' } }><Checkbox value='resolve'/><span style={ { marginLeft: '2px' } }>Resolved</span></div>
              <div style={ { float: 'left', marginLeft: '8px' } }><Checkbox value='close'/><span style={ { marginLeft: '2px' } }>Closed</span></div>
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
              { this.state.pulseStatItems.indexOf('new') !== -1 && <Line type='monotone' dataKey='new' name='New' stroke='#4572A7' fill='#4572A7'/> }
              { this.state.pulseStatItems.indexOf('resolve') !== -1 && <Line type='monotone' dataKey='resolved' name='Resolved' stroke='#89A54E' fill='#89A54E'/> }
              { this.state.pulseStatItems.indexOf('close') !== -1 && <Line type='monotone' dataKey='closed' name='Closed' stroke='#AA4643' fill='#AA4643'/> }
            </LineChart>
          </div> }
        </Panel>
        <Panel 
          header={ 
            <div>
              <span>Opened issues：By reported</span>
              <span className='exchange-icon' onClick={ () => this.setState({ assigneeShowModel: this.state.assigneeShowModel == 'detail' ? 'percentage' : 'detail' }) } title='切换'><i className='fa fa-retweet'></i></span>
            </div> }>
          { data.assignee_unresolved_issues && !_.isEmpty(data.assignee_unresolved_issues) ?
          <Table responsive hover>
            { this.state.assigneeShowModel == 'detail' && 
            <thead>
              <tr>
                <th>Assignee</th>
                <th>Issue</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead> }
            { this.state.assigneeShowModel == 'percentage' &&
            <thead>
              <tr>
                <th>Assignee</th>
                <th>Issue</th>
                <th>Percentage</th>
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
          <div>No information</div> }
        </Panel>
        <Panel 
          header={ 
            <div>
              <span>Opened issues：By priority</span>
              <span className='exchange-icon' onClick={ () => this.setState({ priorityShowModel: this.state.priorityShowModel == 'detail' ? 'percentage' : 'detail' }) } title='切换'><i className='fa fa-retweet'></i></span>
            </div> }>
          { data.priority_unresolved_issues && !_.isEmpty(data.priority_unresolved_issues) ?
          <Table responsive hover>
            { this.state.priorityShowModel == 'detail' &&
            <thead>
              <tr>
                <th>Priority</th>
                <th>Issue</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead> }
            { this.state.priorityShowModel == 'percentage' &&
            <thead>
              <tr>
                <th>Priority</th>
                <th>Issue</th>
                <th>Percentage</th>
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
                    'Other' }
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
                    'Other' }
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
          <div>No information</div> }
        </Panel>
        <Panel
          header={ 
            <div>
              <span>Opened issues：By module</span>
              <span className='exchange-icon' onClick={ () => this.setState({ moduleShowModel: this.state.moduleShowModel == 'detail' ? 'percentage' : 'detail' }) } title='切换'><i className='fa fa-retweet'></i></span>
            </div> }>
          { data.module_unresolved_issues && !_.isEmpty(data.module_unresolved_issues) ?
          <Table responsive hover>
            { this.state.moduleShowModel == 'detail' &&
            <thead>
              <tr>
                <th>Module</th>
                <th>Issue</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead> }
            { this.state.moduleShowModel == 'percentage' &&
            <thead>
              <tr>
                <th>Module</th>
                <th>Issue</th>
                <th>Percentage</th>
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
                    'Other' }
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
                    'Other' }
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
          <div>No information</div> }
        </Panel>
      </div>
    );
  }
}
