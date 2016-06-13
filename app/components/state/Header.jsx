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
    collection: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {
    const { create, indexLoading, collection, options } = this.props;
    const styles = { display: 'inline-block', marginLeft: '15px' };
    const defaultIndex = _.findIndex(collection, { default: true }) || 0;

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h2>#问题状态#</h2>
        </div>
        <div>
          <Button className='create-btn' onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i>&nbsp;新建状态</Button>
        </div>
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create } options={ options }/> }
      </div>
    );
  }
}
