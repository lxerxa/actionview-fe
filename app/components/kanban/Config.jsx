import React, { PropTypes, Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');
const EditModal = require('./EditModal');
const FilterConfigModal = require('./FilterConfigModal');
const FilterList = require('./FilterList');

export default class Config extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      globalFilterModalShow: false,
      quickFilterModalShow: false,
      filterNo: -1,
      notifications: {} };

    this.editModalClose = this.editModalClose.bind(this);
    this.globalFilterModalClose = this.globalFilterModalClose.bind(this);
    this.quickFilterModalClose = this.quickFilterModalClose.bind(this);
    this.condsTxt = this.condsTxt.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired
  }

  condsTxt(query) {
    const { options: { types=[], states=[], priorities=[], resolutions=[], modules=[], users=[] } } = this.props;
    const dateOptions = [{ label: '一周内', value: '1w' }, { label: '两周内', value: '2w' }, { label: '一月内', value: '1m' }, { label: '一月外', value: '-1m' }];

    const errorMsg = ' 检索值解析失败，条件无法正常显示。建议删除，或重新编辑保存。';
    const queryConds = [];
    let index = -1;

    if (query.type) { 
      const typeQuery = query.type;
      const typeQueryNames = [];
      for (let i = 0; i < typeQuery.length; i++) {
        if ((index = _.findIndex(types, { id: typeQuery[i] })) !== -1) {
          typeQueryNames.push(types[index].name);
        } else {
          return '类型' + errorMsg;
        }
      }
      queryConds.push('类型：' + typeQueryNames.join('，'));
    }
    if (query.assignee) {
      const assigneeQuery = query.assignee;
      const assigneeQueryNames = [];
      for (let i = 0; i < assigneeQuery.length; i++) {
        if (assigneeQuery[i] == 'me') {
          assigneeQueryNames.push('当前用户');
        } else if ((index = _.findIndex(users, { id: assigneeQuery[i] })) !== -1) {
          assigneeQueryNames.push(users[index].name);
        } else {
          return '经办人' + errorMsg;
        }
      }
      queryConds.push('经办人：' + assigneeQueryNames.join('，'));
    }
    if (query.reporter) {
      const reporterQuery = query.reporter;
      const reporterQueryNames = [];
      for (let i = 0; i < reporterQuery.length; i++) {
        if (reporterQuery[i] == 'me') {
          reporterQueryNames.push('当前用户');
        } else if ((index = _.findIndex(users, { id: reporterQuery[i] })) !== -1) {
          reporterQueryNames.push(users[index].name);
        } else {
          return '报告人' + errorMsg;
        }
      }
      queryConds.push('报告人：' + reporterQueryNames.join('，'));
    }
    if (query.watcher) {
      const watcherQuery = query.watcher;
      const watcherQueryNames = [];
      for (let i = 0; i < watcherQuery.length; i++) {
        if (watcherQuery[i] == 'me') {
          watcherQueryNames.push('当前用户');
        }
      }
      queryConds.push('关注者：' + watcherQueryNames.join('，'));
    }
    if (query.state) {
      const stateQuery = query.state;
      const stateQueryNames = [];
      for (let i = 0; i < stateQuery.length; i++) {
        if ((index = _.findIndex(states, { id: stateQuery[i] })) !== -1) {
          stateQueryNames.push(states[index].name);
        } else {
          return '状态' + errorMsg;
        }
      }
      queryConds.push('状态：' + stateQueryNames.join('，'));
    }
    if (query.resolution) {
      const resolutionQuery = query.resolution;
      const resolutionQueryNames = [];
      for (let i = 0; i < resolutionQuery.length; i++) {
        if ((index = _.findIndex(resolutions, { id: resolutionQuery[i] })) !== -1) {
          resolutionQueryNames.push(resolutions[index].name);
        } else {
          return '解决结果' + errorMsg;
        }
      }
      queryConds.push('解决结果：' + resolutionQueryNames.join('，'));
    }
    if (query.priority) {
      const priorityQuery = query.priority;
      const priorityQueryNames = [];
      for (let i = 0; i < priorityQuery.length; i++) {
        if ((index = _.findIndex(priorities, { id: priorityQuery[i] })) !== -1) {
          priorityQueryNames.push(priorities[index].name);
        } else {
          return '优先级' + errorMsg;
        }
      }
      queryConds.push('优先级：' + priorityQueryNames.join('，'));
    }
    if (query.module) {
      const moduleQuery = query.module;
      const moduleQueryNames = [];
      for (let i = 0; i < moduleQuery.length; i++) {
        if ((index = _.findIndex(modules, { id: moduleQuery[i] })) !== -1) {
          moduleQueryNames.push(modules[index].name);
        } else {
          return '模块' + errorMsg;
        }
      }
      queryConds.push('模块：' + moduleQueryNames.join('，'));
    }
    if (query.created_at) { queryConds.push('创建时间：' + ((index = _.findIndex(dateOptions, { value: query.created_at })) !== -1 ? dateOptions[index].label : query.created_at)); }
    if (query.updated_at) { queryConds.push('更新时间：' + ((index = _.findIndex(dateOptions, { value: query.updated_at })) !== -1 ? dateOptions[index].label : query.updated_at)); }

    if (queryConds.length <= 0) { return '全部问题'; }

    return queryConds.join(' | ');
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  globalFilterModalClose() {
    this.setState({ globalFilterModalShow: false });
  }

  quickFilterModalClose() {
    this.setState({ quickFilterModalShow: false });
  }

  editFilter(no) {
    this.setState({ quickFilterModalShow: true, filterNo: no });
  }

  delFilter() {
    alert('bb');
  }

  render() {

    const styles = { marginLeft: '20px', marginTop: '10px', marginBottom: '10px' };
 
    const { 
      i18n, 
      options,
      edit,
      config } = this.props;

    const items = [];
    items.push({
      id: 'basic',
      title: (
        <div>
          <span className='kanban-table-td-title'>基本信息</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0, marginBottom: '10px' } }>
            <li>名称：{ config.name || '-' }</li>
            <li>类型：{ config.type || '-' }</li>
            <li>描述：{ config.description || '-' }</li>
          </ul>
          <Button onClick={ () => { this.setState({ editModalShow: true }) } }>编辑</Button>
        </div>
      )
    });
    items.push({
      id: 'query',
      title: (
        <div>
          <span className='kanban-table-td-title'>全局过滤</span>
          <span className='table-td-desc'>用来过滤整个看板的问题，默认显示全部。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          { _.isEmpty(config.query) ?
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0, marginBottom: '10px' } }>
            <li>全部</li>
          </ul>
          :
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0, marginBottom: '10px' } }>
            <li>{ this.condsTxt(config.query) }</li>
          </ul> }
          <Button onClick={ () => { this.setState({ globalFilterModalShow: true }) } }>设置</Button>
        </div>
      )
    });
    items.push({
      id: 'filters',
      title: (
        <div>
          <span className='kanban-table-td-title'>快速过滤器</span>
          <span className='table-td-desc'>可上下拖拽调整过滤器位置</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          { (!config.filters || config.filters.length <= 0) ?
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>未定义</li>
          </ul>
          :
          <FilterList
            editFilter={ this.editFilter.bind(this) }
            delFilter={ this.delFilter.bind(this) }
            filters={ config.filters }
            condsTxt={ this.condsTxt } /> }
          <Button onClick={ () => { this.setState({ quickFilterModalShow: true, filterNo: -1 }) } }>添加</Button>
        </div>
      )
    });
    items.push({
      id: 'fields',
      title: (
        <div>
          <span className='kanban-table-td-title'>显示字段</span>
        </div>
      ),  
      contents: (
        <div style={ styles }>
          <div>暂不支持</div>
        </div>
      )
    });
    items.push({
      id: 'columns',
      title: (
        <div>
          <span className='kanban-table-td-title'>显示列</span>
          <span className='table-td-desc'>可左右拖拽调整列位置</span>
        </div>
      ),  
      contents: (
        <div style={ { ...styles, tableLayout: 'fixed', display: 'table', width: '100%', borderSpacing: '8px 0' } }>
          <div style={ { display: 'table-cell', padding: '10px', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', marginLeft: '10px' } }>aa</div>
          <div style={ { display: 'table-cell', padding: '10px', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', marginLeft: '10px' } }>aa</div>
          <div style={ { display: 'table-cell', padding: '10px', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', marginLeft: '10px' } }>aa</div>
          <div style={ { display: 'table-cell', padding: '10px', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', marginLeft: '10px' } }>aa</div>
        </div>
      )     
    }); 

    return (
      <div style={ { overflowY: 'auto', height: '100%', paddingBottom: '80px' } }>
        <BootstrapTable data={ items } bordered={ false } hover trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn width='200' dataField='title'/>
          <TableHeaderColumn dataField='contents'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal  
            show 
            close={ this.editModalClose } 
            update={ edit } 
            data={ config } 
            i18n={ i18n }/> }
        { this.state.globalFilterModalShow &&
          <FilterConfigModal
            show
            model='global'
            close={ this.globalFilterModalClose }
            update={ edit }
            loading={ false }
            data={ config }
            options={ options }
            i18n={ i18n }/> }
        { this.state.quickFilterModalShow &&
          <FilterConfigModal
            show
            model='filter'
            filterNo={ this.state.filterNo }
            close={ this.quickFilterModalClose }
            update={ edit }
            loading={ false }
            data={ config }
            options={ options }
            i18n={ i18n }/> }
      </div>
    );
  }
}
