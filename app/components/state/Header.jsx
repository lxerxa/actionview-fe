import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import _ from 'lodash';

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
    indexLoading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {
    const { create, indexLoading, collection } = this.props;

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h3><span style={ { marginLeft: '15px' } }>#问题状态#</span></h3>
        </div>
        <div style={ { marginTop: '5px' } }>
          <Button className='create-btn' onClick={ () => { this.setState({ createModalShow: true }); } } disabled={ indexLoading }><i className='fa fa-plus'></i>&nbsp;新建状态</Button>
        </div>
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create } collection={ collection }/> }
      </div>
    );
  }
}
