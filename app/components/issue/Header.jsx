import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem, Col } from 'react-bootstrap';
import { Link } from 'react-router';

const CreateModal = require('./CreateModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false };
    this.createModalClose = this.createModalClose.bind(this);
  }

  static propTypes = {
    create: PropTypes.func.isRequired,
    query: PropTypes.object,
    indexLoading: PropTypes.bool.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {
    const { create, indexLoading } = this.props;

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h3>#问题#</h3>
        </div>
        <div>
          <Button className='create-btn' disabled={ indexLoading } onClick={ () => { this.setState({ createModalShow: true }); } }>过滤器&nbsp;<i className='fa fa-angle-double-down'></i></Button>
          <Button className='create-btn' disabled={ indexLoading } onClick={ () => { this.setState({ createModalShow: true }); } }>检索&nbsp;<i className='fa fa-angle-double-down'></i></Button>
          <div style={ { marginTop: '8px', float: 'right' } }>
            <DropdownButton pullRight bsStyle='link' style={ { float: 'right' } } title='更多'>
              <MenuItem eventKey='2'>删除</MenuItem>
            </DropdownButton>
          </div>
        </div>
        <div>
          <Col sm={ 4 }>
            <div style={ { marginTop: '6px', marginBottom: '6px' } }><span>社交化项目管理系统</span></div>
          </Col>
          <Col sm={ 4 }>
            <div style={ { marginTop: '6px', marginBottom: '6px' } }><span>社交化项目管理系统</span></div>
          </Col>
          <Col sm={ 4 }>
            <div style={ { marginTop: '6px', marginBottom: '6px' } }><span>社交化项目管理系统</span></div>
          </Col>
        </div>
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create }/> }
      </div>
    );
  }
}
