import React, { PropTypes, Component } from 'react';
import { Button, Label, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';
import _ from 'lodash';

const CreateModal = require('./CreateModal');
const SearchList = require('./SearchList');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, searchShow: false, condShow: true };
    this.createModalClose = this.createModalClose.bind(this);
    this.condsTxt = this.condsTxt.bind(this);
  }

  static propTypes = {
    create: PropTypes.func.isRequired,
    refresh: PropTypes.func,
    query: PropTypes.object,
    options: PropTypes.object,
    indexLoading: PropTypes.bool.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  condsTxt() {
    const { options: { config: { types=[], states=[], priorities=[], resolutions=[] } = {}, users=[] }, query } = this.props;
    const dateOptions = [{ label: '一周内', value: '1w' }, { label: '两周内', value: '2w' }, { label: '一月内', value: '1m' }, { label: '一月外', value: '-1m' }];

    const queryConds = [];
    let index;
    if (query.type) { queryConds.push('类型：' + ((index = _.findIndex(types, { id: query.type })) !== -1 ? types[index].name : query.type)); }
    if (query.assignee) { queryConds.push('经办人：' + ((index = _.findIndex(users, { id: query.assignee })) !== -1 ? users[index].name : query.assignee)); }
    if (query.reporter) { queryConds.push('报告人：' + ((index = _.findIndex(users, { id: query.reporter })) !== -1 ? users[index].name : query.reporter)); }
    if (query.state) { queryConds.push('状态：' + ((index = _.findIndex(states, { id: query.state })) !== -1 ? states[index].name : query.state)); }
    if (query.resolution) { queryConds.push('解决结果：' + ((index = _.findIndex(resolutions, { id: query.resolution })) !== -1 ? resolutions[index].name : query.resolution)); }
    if (query.priority) { queryConds.push('优先级：' + ((index = _.findIndex(priorities, { id: query.priority })) !== -1 ? priorities[index].name : query.priority)); }
    if (query.created_at) { queryConds.push('创建时间：' + ((index = _.findIndex(dateOptions, { value: query.created_at })) !== -1 ? dateOptions[index].label : query.created_at)); }
    if (query.updated_at) { queryConds.push('更新时间：' + ((index = _.findIndex(dateOptions, { value: query.updated_at })) !== -1 ? dateOptions[index].label : query.updated_at)); }
    if (query.title) { queryConds.push('主题~' + query.title); }

    if (queryConds.length <= 0) { return '全部问题'; }

    return queryConds.join(' | ');
  }

  render() {
    const { create, indexLoading, options={}, refresh, query } = this.props;

    const sqlTxt = this.condsTxt();
    
    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h3>#问题#</h3>
        </div>
        { this.state.condShow &&
        <div className='cond-bar'>
          <span>{ sqlTxt }</span>
          <span className='remove-icon' onClick={ () => { this.setState({ condShow: false }); } }><i className='fa fa-remove'></i></span>
        </div> }
        <div>
          <Button className='create-btn' disabled={ indexLoading } onClick={ () => { this.setState({ createModalShow: true }); } }>过滤器&nbsp;<i className='fa fa-angle-double-down'></i></Button>
          <Button className='create-btn' disabled={ indexLoading } onClick={ () => { this.setState({ searchShow: !this.state.searchShow }); } }>检索&nbsp;<i className={ this.state.searchShow ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down' }></i></Button>
          <div style={ { marginTop: '8px', float: 'right' } }>
            <DropdownButton pullRight bsStyle='link' style={ { float: 'right' } } title='更多'>
              <MenuItem eventKey='2'>删除</MenuItem>
            </DropdownButton>
          </div>
        </div>
        <Form horizontal style={ { marginTop: '10px', marginBottom: '30px' } }>
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 3 }>
              <span className='searcher'>
                <Link to='aa'>
                  <span style={ { color: '#3b73af' } }>分配给我的</span>
                </Link>
                <span className='remove-icon'>
                  <i className='fa fa-remove'></i>
                </span>
              </span>
            </Col>
            <Col sm={ 3 }>
              <Link to='aa' style={ { marginLeft: '15px', textDecoration: 'underline' } }>最近一周创建的</Link><span style={ { marginLeft: '15px' } }><i className='fa fa-remove'></i></span>
            </Col>
            <Col sm={ 3 }>
              <Link to='aa' style={ { marginLeft: '15px', textDecoration: 'underline' } }>分配给我的</Link><span style={ { marginLeft: '15px' } }><i className='fa fa-remove'></i></span>
            </Col>
            <Col sm={ 3 }>
              <Link to='aa' style={ { marginLeft: '15px', textDecoration: 'underline' } }>分配给我的</Link><span style={ { marginLeft: '15px' } }><i className='fa fa-remove'></i></span>
            </Col>
          </FormGroup>
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 3 }>
              <Link to='aa' style={ { marginLeft: '15px', textDecoration: 'underline' } }>分配给我的</Link><span style={ { marginLeft: '15px' } }><i className='fa fa-remove'></i></span>
            </Col>
            <Col sm={ 3 }>
              <Link to='aa' style={ { marginLeft: '15px', textDecoration: 'underline' } }>分配给我的</Link><span style={ { marginLeft: '15px' } }><i className='fa fa-remove'></i></span>
            </Col>
            <Col sm={ 3 }>
              <Link to='aa' style={ { marginLeft: '15px', textDecoration: 'underline' } }>分配给我的</Link><span style={ { marginLeft: '15px' } }><i className='fa fa-remove'></i></span>
            </Col>
            <Col sm={ 3 }>
              <Link to='aa' style={ { marginLeft: '15px', textDecoration: 'underline' } }>分配给我的</Link><span style={ { marginLeft: '15px' } }><i className='fa fa-remove'></i></span>
            </Col>
          </FormGroup>
        </Form>
        <SearchList className={ !this.state.searchShow && 'hide' } query={ query } searchShow={ this.state.searchShow } indexLoading={ indexLoading } options={ options } refresh={ refresh }/>
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create }/> }
      </div>
    );
  }
}
