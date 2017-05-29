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
    isSysConfig: PropTypes.bool,
    options: PropTypes.object,
    create: PropTypes.func.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  render() {
    const { isSysConfig, create, options } = this.props;

    return (
      <div>
        <div style={ { marginTop: '5px' } }>
          <Button className='create-btn' onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i>&nbsp;新建界面</Button>
        </div>
        <div className='info-col'>
          <div className='info-icon'><i className='fa fa-info-circle'></i></div>
          <div className='info-content'>
            <span>界面是对字段的排列布局和属性定义，是创建问题、编辑问题或执行工作流过程时显示的页面。<br/>只能删除没有关联到问题类型{ isSysConfig && '（包括各项目自定义问题类型）' }和没有应用到工作流{ isSysConfig && '（包括各项目自定义工作流）' }的界面。</span>
          </div>
        </div>
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create } options={ options }/> }
      </div>
    );
  }
}
