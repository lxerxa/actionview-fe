import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import _ from 'lodash';

const CreateModal = require('./CreateModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, skey: '' };
    this.createModalClose = this.createModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    isSysConfig: PropTypes.bool,
    indexLoading: PropTypes.bool,
    collection: PropTypes.array,
    options: PropTypes.object,
    search: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {
    const { 
      i18n, 
      isSysConfig, 
      create, 
      search, 
      indexLoading, 
      collection, 
      options 
    } = this.props;

    return (
      <div>
        <div style={ { marginTop: '5px' } }>
          <Button 
            className='create-btn' 
            onClick={ () => { this.setState({ createModalShow: true }); } } 
            disabled={ indexLoading }>
            <i className='fa fa-plus'></i>&nbsp;新建字段
          </Button>
          <span style={ { float: 'right', width: '22%', marginTop: '10px' } }>
            <FormControl
              disabled={ indexLoading }
              type='text'
              style={ { height: '36px' } }
              value={ this.state.skey }
              onChange={ (e) => { this.setState({ skey: e.target.value }) } }
              onKeyDown={ (e) => { if (e.keyCode == '13') { search(e.target.value) } } }
              placeholder={ '名称、键值查询...' } />
          </span>
        </div>
        <div className='info-col'>
          <div className='info-icon'><i className='fa fa-info-circle'></i></div>
          <div className='info-content'> 
            <span>创建字段时键值必须唯一，且创建后键值不能改变。<br/>只能删除没有应用到界面{ isSysConfig && '（包括各项目自定义界面）' }中的字段。</span>
          </div>
        </div>
        { this.state.createModalShow && 
          <CreateModal 
            show 
            isSysConfig={ isSysConfig }
            close={ this.createModalClose } 
            create={ create } 
            collection={ collection } 
            options={ options } 
            i18n={ i18n }/> }
      </div>
    );
  }
}
