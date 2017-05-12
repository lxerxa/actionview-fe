import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';

const CreateModal = require('./CreateModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false };
    this.createModalClose = this.createModalClose.bind(this);
  }

  static propTypes = {
    options: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    collection: PropTypes.array,
    indexLoading: PropTypes.bool.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {
    const { options={}, create, indexLoading, collection } = this.props;

    return (
      <div>
        { options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
        <div style={ { marginTop: '5px' } }>
          <Button className='create-btn' disabled={ indexLoading } onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i>&nbsp;新建版本</Button>
        </div> }
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create } collection={ collection }/> }
      </div>
    );
  }
}
