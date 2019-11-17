import React, { PropTypes, Component } from 'react';
import { Button, Label, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import DateTime from 'react-datetime';
import ApiClient from '../../../shared/api-client';
import _ from 'lodash';

const moment = require('moment');
const PaginationList = require('../share/PaginationList');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExtended: false,
      module: null,
      project_key: '',
      project: null,
      uid: '',
      user: null,
      method: null,
      request_source_ip: '',
      start_time: '',
      end_time: '',
      exec_time: null
    }; 
  }

  static propTypes = {
    query: PropTypes.object.isRequired,
    index: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired
  }

  async componentWillMount() {
    const newQuery = {};
    const { index, query={} } = this.props;

    if (query.uid) {
      newQuery.uid = this.state.uid = query.uid;

      const api = new ApiClient;
      const result = await api.request({ url: '/user/' + query.uid });
      if (result.data) {
        this.state.user = { id: result.data.id, nameAndEmail:  result.data.first_name + '(' + result.data.email + ')' };
      }
    }
    if (query.project_key) {
      newQuery.project_key = this.state.project_key = query.project_key;

      const api = new ApiClient;
      const result = await api.request({ url: '/project/' + query.project_key });
      if (result.data) {
        this.state.project = { id: result.data.key, name: result.data.name };
      }
    }
    if (query.module) {
      newQuery.module = this.state.module = query.module;
    }
    if (query.exec_time) {
      newQuery.exec_time = this.state.exec_time = query.exec_time;
    }
    if (query.method) {
      newQuery.method = this.state.method = query.method;
    }
    if (query.request_source_ip) {
      newQuery.request_source_ip = this.state.request_source_ip = query.request_source_ip;
    }
    if (query.request_time) {
      const sections = query.request_time.split('~');
      newQuery.start_time = sections[0] ? moment(sections[0]) : '';
      newQuery.end_time = sections[1] ? moment(sections[1]) : '';
    }

    index(newQuery);
  }

  componentWillReceiveProps(nextProps) {
    const newQuery = nextProps.query || {};
    const { index, query } = this.props;
    if (!_.isEqual(newQuery, query)) {
      index(newQuery);
    }
    this.state.request_source_ip = newQuery.request_source_ip || '';
    this.state.method = newQuery.method || null;
    this.state.exec_time = newQuery.exec_time || null;
    this.state.module = newQuery.module || null;

    if (newQuery.project_key) {
      this.state.project_key = newQuery.project_key;
    } else {
      this.state.project_key = ''; 
      this.state.project = null; 
    }

    if (newQuery.uid) {
      this.state.uid = newQuery.uid; 
    } else {
      this.state.uid = ''; 
      this.state.user = null; 
    }

    if (newQuery.request_time) {
      const sections = newQuery.request_time.split('~');
      this.state.start_time = sections[0] ? moment(sections[0]) : '';
      this.state.end_time = sections[1] ? moment(sections[1]) : '';
    } else {
      this.state.start_time = this.state.end_time = ''; 
    }
  }

  async searchUsers(input) {
    input = input.toLowerCase();
    if (!input)
    {
      return { options: [] };
    }
    const api = new ApiClient;
    const results = await api.request( { url: '/user/search?s=' + input } );
    return { options: _.map(results.data, (val) => { val.nameAndEmail = val.name + '(' + val.email + ')'; return val; }) };
  }

  async searchProjects(input) {
    if (!input)
    {
      return { options: [] };
    }
    const api = new ApiClient;
    const results = await api.request( { url: '/project/search?s=' + input } );
    return { options: results.data };
  }

  refresh() {
    const { refresh } = this.props;
    const query = {};
    if (this.state.project_key) {
      query.project_key = this.state.project_key;
    }
    if (this.state.module) {
      query.module = this.state.module;
    }
    if (this.state.method) {
      query.method = this.state.method;
    }
    if (this.state.exec_time) {
      query.exec_time = this.state.exec_time;
    }
    if (this.state.request_source_ip) {
      query.request_source_ip = this.state.request_source_ip;
    }
    if (this.state.uid) {
      query.uid = this.state.uid;
    }
    if (this.state.start_time || this.state.end_time) {
      query.request_time = '';
      if (this.state.start_time) {
        query.request_time += moment(this.state.start_time).format('YYYY/MM/DD');
      }
      query.request_time += '~';
      if (this.state.end_time) {
        query.request_time += moment(this.state.end_time).format('YYYY/MM/DD');
      }
    }
    refresh(query);
  }

  moduleChange(newValue) {
    this.state.module = newValue;
    this.refresh();
  }

  methodChange(newValue) {
    this.state.method = newValue;
    this.refresh();
  }

  execChange(newValue) {
    this.state.exec_time = newValue;
    this.refresh();
  }

  userChange(newValue) {
    this.state.user = newValue;
    this.state.uid = newValue.id;
    this.refresh();
  }

  projectChange(newValue) {
    this.state.project = newValue;
    this.state.project_key = newValue.key;
    this.refresh();
  }

  startTimeChange(newValue) {
    this.state.start_time = newValue;
    this.refresh();
  }

  endTimeChange(newValue) {
    this.state.end_time = newValue;
    this.refresh();
  }

  reset() {
    const { refresh } = this.props;
    refresh({});
  }

  render() {
    const moduleOptions = [
      { value: 'login', label: '登录' },
      { value: 'issue', label: '问题列表' },
      { value: 'activity', label: '活动' },
      { value: 'kanban', label: '看板' },
      { value: 'version', label: '版本' },
      { value: 'module', label: '模块' },
      { value: 'document', label: '文档' },
      { value: 'wiki', label: 'Wiki' },
      { value: 'team', label: '成员' },
      { value: 'type', label: '问题类型' },
      { value: 'state', label: '状态' },
      { value: 'workflow', label: '流程' },
      { value: 'field', label: '字段' },
      { value: 'screen', label: '界面' },
      { value: 'prioiry', label: '优先级' },
      { value: 'resolution', label: '解决结果' },
      { value: 'role', label: '角色权限' },
      { value: 'events', label: '通知事件' },
      { value: 'integrations', label: '外部用户' },
      { value: 'webhooks', label: 'Webhooks' }
    ]; 

    const methodOptions = [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
      { value: 'PUT', label: 'PUT' },
      { value: 'DELETE', label: 'DELETE' }
    ];

    const execOptions = [
      { value: '-5ms', label: '< 0.5s' },
      { value: '-1s', label: '< 1s' },
      { value: '-2s', label: '< 2s' },
      { value: '+2s', label: '> 2s' },
      { value: '+3s', label: '> 3s' }
    ] 
    return (
      <Form
        id='search-form'
        horizontal
        style={ { marginTop: '15px', marginBottom: '10px', padding: '15px 10px 0px 0px', backgroundColor: '#f5f5f5', borderRadius: '4px' } }>
        <FormGroup>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            时间 
          </Col>
          <Col sm={ 5 }>
            <div style={ { width: '47%', display: 'inline-block', float: 'left' } }>
              <DateTime
                mode='date'
                locale='zh-cn'
                dateFormat={ 'YYYY/MM/DD' }
                timeFormat={ false }
                closeOnSelect={ true }
                inputProps={ { placeholder: '请选择' } }
                value={ this.state.start_time }
                onChange={ (newValue) => { this.startTimeChange(newValue); } }/>
            </div>
            <div style={ { width: '6%', marginTop: '8px', textAlign: 'center', display: 'inline-block', float: 'left' } }>
              ～
            </div>
            <div style={ { width: '47%', display: 'inline-block', float: 'left' } }>
              <DateTime
                mode='date'
                locale='zh-cn'
                dateFormat={ 'YYYY/MM/DD' }
                timeFormat={ false }
                closeOnSelect={ true }
                inputProps={ { placeholder: '请选择' } }
                value={ this.state.end_time }
                onChange={ (newValue) => { this.endTimeChange(newValue); } }/>
            </div>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            用户
          </Col>
          <Col sm={ 5 }>
            <Select.Async
              clearable={ false }
              options={ [] }
              value={ this.state.user }
              onChange={ this.userChange.bind(this) }
              valueKey='id'
              labelKey='nameAndEmail'
              loadOptions={ this.searchUsers }
              placeholder='输入用户'/>
          </Col>
        </FormGroup>
        { this.state.isExtended &&
        <FormGroup>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            项目
          </Col>
          <Col sm={ 5 }>
            <Select.Async
              clearable={ false }
              options={ [] }
              value={ this.state.project }
              onChange={ this.projectChange.bind(this) }
              valueKey='key'
              labelKey='name'
              loadOptions={ this.searchProjects }
              placeholder='输入项目名称或健值'/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            模块
          </Col>
          <Col sm={ 5 }>
            <Select
              simpleValue
              placeholder='模块'
              value={ this.state.module }
              onChange={ this.moduleChange.bind(this) }
              options={ moduleOptions }/>
          </Col>
        </FormGroup> }
        { this.state.isExtended &&
        <FormGroup>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            方法
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              placeholder='选择方法'
              value={ this.state.method }
              onChange={ this.methodChange.bind(this) }
              options={ methodOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            请求时长
          </Col>
          <Col sm={ 3 }>
            <Select
              simpleValue
              placeholder='选择请求时长'
              value={ this.state.exec_time }
              onChange={ this.execChange.bind(this) }
              options={ execOptions }/>
          </Col>
          <Col sm={ 1 } componentClass={ ControlLabel }>
            来源IP 
          </Col>
          <Col sm={ 3 }>
            <FormControl
              type='text'
              value={ this.state.request_source_ip }
              onKeyPress={ (e) => { if (e.charCode == '13') { this.refresh(); } } }
              onChange={ (e) => { this.state.request_source_ip = e.target.value; this.setState({ request_source_ip: this.state.request_source_ip }); } }
              placeholder={ '输入IP地址' } />
          </Col>
        </FormGroup> }
        <FormGroup>
          <Col sm={ 12 }>
            <div style={ { float: 'right', marginBottom: '5px' } }>
              <Button bsStyle='link' onClick={ () => { this.reset(); } }>重置 <i className='fa fa-undo'></i></Button>
              { this.state.isExtended ? 
                <Button bsStyle='link' onClick={ () => { this.setState({ isExtended: false }) } }>收起 <i className='fa fa-angle-double-up'></i></Button>
                :
                <Button bsStyle='link' onClick={ () => { this.setState({ isExtended: true }) } }>展开 <i className='fa fa-angle-double-down'></i></Button> }
            </div>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
