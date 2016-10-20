import React, { PropTypes, Component } from 'react';
import { Button, Label, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';
import _ from 'lodash';

const CreateModal = require('./CreateModal');
const SearchList = require('./SearchList');
const SearcherList = require('./SearcherList');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, searcherShow: false, searchShow: false, condShow: true };
    this.createModalClose = this.createModalClose.bind(this);
    this.condsTxt = this.condsTxt.bind(this);
  }

  static propTypes = {
    create: PropTypes.func.isRequired,
    refresh: PropTypes.func,
    getOptions: PropTypes.func,
    query: PropTypes.object,
    options: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    optionsLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired
  }

  componentWillMount() {
    const { getOptions } = this.props;
    getOptions();
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  condsTxt() {
    const { options: { config: { types=[], states=[], priorities=[], resolutions=[] } = {}, users=[] }, query } = this.props;
    const dateOptions = [{ label: '一周内', value: '1w' }, { label: '两周内', value: '2w' }, { label: '一月内', value: '1m' }, { label: '一月外', value: '-1m' }];

    const errorMsg = ' 检索值解析失败，条件无法正常显示。';
    const queryConds = [];
    let index;
    if (query.type) { 
      if ((index = _.findIndex(types, { id: query.type })) !== -1) {
        queryConds.push('类型：' + types[index].name);
      } else {
        return '类型' + errorMsg;
      }
    }
    if (query.assignee) {
      if ((index = _.findIndex(users, { id: query.assignee })) !== -1) {
        queryConds.push('经办人：' + users[index].name);
      } else {
        return '经办人' + errorMsg;
      }
    }
    if (query.reporter) {
      if ((index = _.findIndex(users, { id: query.reporter })) !== -1) {
        queryConds.push('报告人：' + users[index].name);
      } else {
        return '报告人' + errorMsg;
      }
    }
    if (query.state) {
      if ((index = _.findIndex(states, { id: query.state })) !== -1) {
        queryConds.push('状态：' + states[index].name);
      } else {
        return '状态' + errorMsg;
      }
    }
    if (query.resolution) {
      if ((index = _.findIndex(resolutions, { id: query.resolution })) !== -1) {
        queryConds.push('解决结果：' + resolutions[index].name);
      } else {
        return '解决结果' + errorMsg;
      }
    }
    if (query.priority) {
      if ((index = _.findIndex(priorities, { id: query.priority })) !== -1) {
        queryConds.push('优先级：' + priorities[index].name);
      } else {
        return '优先级' + errorMsg;
      }
    }

    if (query.created_at) { queryConds.push('创建时间：' + ((index = _.findIndex(dateOptions, { value: query.created_at })) !== -1 ? dateOptions[index].label : query.created_at)); }
    if (query.updated_at) { queryConds.push('更新时间：' + ((index = _.findIndex(dateOptions, { value: query.updated_at })) !== -1 ? dateOptions[index].label : query.updated_at)); }
    if (query.title) { queryConds.push('主题~' + query.title); }

    if (queryConds.length <= 0) { return '全部问题'; }

    return queryConds.join(' | ');
  }

  render() {
    const { create, indexLoading, optionsLoading, options={}, refresh, query, loading } = this.props;

    const sqlTxt = this.condsTxt();
    
    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h3>#问题#<Button className='btn-primary' disabled={ optionsLoading } onClick={ () => { this.setState({ createModalShow: true }); } } style={ { marginLeft: '20px' } }><i className='fa fa-plus'></i> 创建</Button></h3>
        </div>
        { this.state.condShow &&
        <div className='cond-bar'>
          <span>{ sqlTxt }</span>
          <span className='remove-icon' onClick={ () => { this.setState({ condShow: false }); } }><i className='fa fa-remove'></i></span>
        </div> }
        <div>
          <Button className='create-btn' disabled={ optionsLoading } onClick={ () => { this.setState({ searcherShow: !this.state.searcherShow }); } }>过滤器&nbsp;<i className={ this.state.searcherShow ?  'fa fa-angle-double-up' : 'fa fa-angle-double-down' }></i></Button>
          <Button className='create-btn' disabled={ optionsLoading } onClick={ () => { this.setState({ searchShow: !this.state.searchShow }); } }>检索&nbsp;<i className={ this.state.searchShow ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down' }></i></Button>
          <div style={ { marginTop: '8px', float: 'right' } }>
            <DropdownButton pullRight bsStyle='link' style={ { float: 'right' } } title='更多'>
              <MenuItem eventKey='2'>删除</MenuItem>
            </DropdownButton>
          </div>
        </div>
        <SearcherList className={ !this.state.searcherShow && 'hide' } searcherShow={ this.state.searcherShow } indexLoading={ indexLoading } options={ options }/>
        <SearchList className={ !this.state.searchShow && 'hide' } query={ query } searchShow={ this.state.searchShow } indexLoading={ indexLoading } options={ options } refresh={ refresh }/>
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } options={ options } create={ create } loading={ loading }/> }
      </div>
    );
  }
}
