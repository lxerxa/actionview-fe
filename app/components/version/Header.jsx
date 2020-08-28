import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';

const CreateModal = require('./CreateModal');
const MergeModal = require('./MergeModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, mergeModalShow: false };
    this.createModalClose = this.createModalClose.bind(this);
    this.mergeModalClose = this.mergeModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    merge: PropTypes.func.isRequired,
    collection: PropTypes.array,
    indexLoading: PropTypes.bool.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  mergeModalClose() {
    this.setState({ mergeModalShow: false });
  }

  render() {
    const { 
      i18n, 
      options={}, 
      create, 
      merge, 
      indexLoading, 
      collection } = this.props;

    return (
      <div>
        { options.permissions && options.permissions.indexOf('manage_project') !== -1 ? 
        <div style={ { marginTop: '5px' } }>
          <Button className='create-btn' disabled={ indexLoading } onClick={ () => { this.setState({ createModalShow: true }); } }>
            <i className='fa fa-plus'></i>&nbsp;New version
          </Button>
          <Button className='create-btn' disabled={ indexLoading } onClick={ () => { this.setState({ mergeModalShow: true }); } }>
            <i className='fa fa-code-fork'></i>&nbsp;Merge version
          </Button>
        </div>
        :
        <div style={ { marginTop: '15px' } }/> }
        { this.state.createModalShow && 
          <CreateModal 
            show 
            close={ this.createModalClose } 
            create={ create } 
            collection={ collection } 
            i18n={ i18n }/> }
        { this.state.mergeModalShow &&
          <MergeModal
            show
            close={ this.mergeModalClose }
            merge={ merge }
            versions={ collection }
            i18n={ i18n }/> }
      </div>
    );
  }
}
