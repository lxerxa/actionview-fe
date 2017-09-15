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
    i18n: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    collection: PropTypes.array,
    indexLoading: PropTypes.bool.isRequired,
    options: PropTypes.object.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {

    const { 
      i18n, 
      create, 
      indexLoading, 
      collection, 
      options={} } = this.props;

    return (
      <div>
        { options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
        <div style={ { marginTop: '5px' } }>
          <Button 
            className='create-btn' 
            disabled={ indexLoading } 
            onClick={ () => { this.setState({ createModalShow: true }); } }>
            <i className='fa fa-plus'></i>&nbsp;新建模块
          </Button>
        </div> }
        { options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
        <div className='info-col'>
          <div className='info-icon'><i className='fa fa-info-circle'></i></div>
          <div className='info-content'>只能删除没有应用到项目问题中的模块。</div>
        </div> }
        { this.state.createModalShow && 
          <CreateModal 
            show 
            close={ this.createModalClose } 
            create={ create } 
            collection={ collection } 
            options={ options } 
            i18n={ i18n }/> }
      </div>
    );
  }
}
