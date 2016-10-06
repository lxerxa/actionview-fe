import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
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
    collection: PropTypes.array,
    indexLoading: PropTypes.bool.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {
    const { create, indexLoading, collection } = this.props;

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h3>#问题#</h3>
        </div>
        <div>
          <Link to={ { pathname: '/projecr/boba/workflow', query: { showAge: true } } } >aa</Link><Button className='create-btn' disabled={ indexLoading } onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i>&nbsp;新建问题</Button>
        </div>
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create } collection={ collection }/> }
      </div>
    );
  }
}
