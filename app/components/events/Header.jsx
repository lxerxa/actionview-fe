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
    i18n: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {
    const { i18n, create, indexLoading, collection } = this.props;

    return (
      <div>
        <div style={ { marginTop: '5px' } }>
          <Button 
            className='create-btn' 
            onClick={ () => { this.setState({ createModalShow: true }); } } 
            disabled={ indexLoading }>
            <i className='fa fa-plus'></i>&nbsp;新建事件
          </Button>
        </div>
        { this.state.createModalShow && 
          <CreateModal 
            show 
            close={ this.createModalClose } 
            create={ create } 
            collection={ collection } 
            i18n={ i18n }/> }
      </div>
    );
  }
}
