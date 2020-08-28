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
    isSysConfig: PropTypes.bool,
    options: PropTypes.object,
    create: PropTypes.func.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {
    const { i18n, isSysConfig, create, options } = this.props;

    return (
      <div>
        <div style={ { marginTop: '5px' } }>
          <Button className='create-btn' onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i>&nbsp;New 界面</Button>
        </div>
        <div className='info-col'>
          <div className='info-icon'><i className='fa fa-info-circle'></i></div>
          <div className='info-content'>
            <span>The interface is the arrangement and attribute definition of the fields, and the page is displayed when creating a question, editing a question, or executing a workflow process.<br/>If you create or edit a page defining the problem，the subject field should be added to the page first，and set it as a required field.<br/>You can only delete the type that is not associated with the issue
              { isSysConfig && '（Each project includes a custom question types）' }和没有应用到工作流{ isSysConfig && '（包括各项目自定义工作流）' }of界面。</span>
          </div>
        </div>
        { this.state.createModalShow && 
          <CreateModal 
            show 
            close={ this.createModalClose } 
            create={ create } 
            options={ options } 
            i18n={ i18n }/> }
      </div>
    );
  }
}
