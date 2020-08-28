import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';

const CreateModal = require('./CreateModal');
const SortCardsModal = require('../share/SortCardsModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, sortCardsModalShow: false };
    this.createModalClose = this.createModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    setSort: PropTypes.func.isRequired,
    collection: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    options: PropTypes.object.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  sortCardsModalClose() {
    this.setState({ sortCardsModalShow: false });
  }

  render() {

    const { 
      i18n, 
      create, 
      setSort,
      loading,
      indexLoading, 
      collection, 
      options={} } = this.props;

    return (
      <div>
        { options.permissions && options.permissions.indexOf('manage_project') !== -1 ? 
        <div style={ { marginTop: '5px' } }>
          <Button 
            className='create-btn' 
            disabled={ indexLoading } 
            onClick={ () => { this.setState({ createModalShow: true }); } }>
            <i className='fa fa-plus'></i>&nbsp;New Module
          </Button>
          { !indexLoading && 
          <Button 
            className='create-btn' 
            onClick={ () => { this.setState({ sortCardsModalShow: true }); } }>
            <i className='fa fa-pencil'></i>&nbsp;编辑顺序
          </Button> }
        </div>
        :
        <div style={ { marginTop: '15px' } }/> }
        { this.state.createModalShow && 
          <CreateModal 
            show 
            close={ this.createModalClose } 
            create={ create } 
            collection={ collection } 
            options={ options } 
            i18n={ i18n }/> }
        { this.state.sortCardsModalShow &&
          <SortCardsModal
            show
            model='Module'
            close={ this.sortCardsModalClose.bind(this) }
            cards={ collection }
            setSort={ setSort }
            sortLoading={ loading }
            i18n={ i18n }/> }
      </div>
    );
  }
}
