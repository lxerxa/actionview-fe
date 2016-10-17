import React, { PropTypes, Component } from 'react';
import { Button, Label, DropdownButton, MenuItem, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';
import _ from 'lodash';

const CreateModal = require('./CreateModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, searchShow: false, type: '', assignee: '', reporter: '', state: '', priority: '', title: '' };
    this.createModalClose = this.createModalClose.bind(this);
  }

  componentWillMount() {
    const { query={} } = this.props;
    this.state.type = query.type || ''; 
    this.state.assignee = query.assignee || ''; 
    this.state.reporter = query.reporter || ''; 
    this.state.state = query.state || ''; 
    this.state.priority = query.priority || ''; 
    this.state.title = query.title || ''; 
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

  clean() {
    this.setState({ type: '', assignee: '', reporter: '', state: '', priority: '', title: '' });
  }

  search() {
    const { query={}, refresh } = this.props;

    const newQuery = {};
    if (this.state.type) {  newQuery.type = this.state.type; }
    if (this.state.assignee) { newQuery.assignee = this.state.assignee; }
    if (this.state.reporter) { newQuery.reporter = this.state.reporter; }
    if (this.state.state) { newQuery.state = this.state.state; }
    if (this.state.priority) { newQuery.prioirity = this.state.priority; }
    if (this.state.title) { newQuery.title = this.state.title; }

    if (query.orderBy) { newQuery.orderBy = query.orderBy; }

    refresh(newQuery);
  }

  render() {
    const { create, indexLoading, options: { config: { types=[], states=[], priorities=[] } = {}, users=[] } } = this.props;
    

    const typeOptions = _.map(types, (val) => { return { label: val.name, value: val.id } });
    const userOptions = _.map(users, (val) => { return { label: val.name, value: val.id } });
    const stateOptions = _.map(states, (val) => { return { label: val.name, value: val.id } });
    const priorityOptions = _.map(priorities, (val) => { return { label: val.name, value: val.id } });

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h3>#问题#</h3>
        </div>
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
              <Link to='aa' style={ { marginLeft: '15px', textDecoration: 'underline' } }>分配给我的</Link>
            </Col>
          </FormGroup>
        </Form>
        <Form horizontal style={ { marginTop: '10px', marginBottom: '30px' } } className={ !this.state.searchShow && 'hide' }>
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              类型 
            </Col>
            <Col sm={ 3 }>
              <Select
                simpleValue
                placeholder='选择类型'
                value={ this.state.type }
                onChange={ (newValue) => { this.setState({ type: newValue }); } }
                options={ typeOptions }/>
            </Col>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              经办人
            </Col>
            <Col sm={ 3 }>
              <Select
                simpleValue
                placeholder='选择经办人'
                value={ this.state.assignee }
                onChange={ (newValue) => { this.setState({ assignee: newValue }); } }
                options={ userOptions }/>
            </Col>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              报告人
            </Col>
            <Col sm={ 3 }>
              <Select
                simpleValue
                placeholder='选择报告人'
                value={ this.state.reporter }
                onChange={ (newValue) => { this.setState({ reporter: newValue }); } }
                options={ userOptions }/>
            </Col>
          </FormGroup>
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              状态
            </Col>
            <Col sm={ 3 }>
              <Select
                simpleValue
                placeholder='选择状态'
                value={ this.state.state }
                onChange={ (newValue) => { this.setState({ state: newValue }); } }
                options={ stateOptions }/>
            </Col>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              优先级 
            </Col>
            <Col sm={ 3 }>
              <Select
                simpleValue
                placeholder='选择优先级'
                value={ this.state.priority }
                onChange={ (newValue) => { this.setState({ priority: newValue }); } }
                options={ priorityOptions }/>
            </Col>
            <Col sm={ 1 } componentClass={ ControlLabel }>
              主题
            </Col>
            <Col sm={ 3 }>
              <FormControl
                type='text'
                value={ this.state.title }
                onChange={ (e) => { this.setState({ title: e.target.value }) } }
                placeholder={ '输入关键字' } />
            </Col>
          </FormGroup>
          <FormGroup controlId='formControlsLabel'>
            <Col sm={ 9 }>
              <Button className='create-btn' onClick={ this.clean.bind(this) }>清空 <i className='fa fa-undo'></i></Button>
            </Col>
            <Col sm={ 3 }>
              <Button style={ { float: 'right' } } className='create-btn' disabled={ indexLoading } onClick={ () => { this.setState({ searchShow: false }) } }>隐藏 <i className='fa fa-angle-double-up'></i></Button>
              <Button style={ { float: 'right' } } className='create-btn' onClick={ this.search.bind(this) }>搜索 <i className='fa fa-search'></i></Button>
            </Col>
          </FormGroup>
        </Form>
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create }/> }
      </div>
    );
  }
}
