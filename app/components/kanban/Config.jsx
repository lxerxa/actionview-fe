import React, { PropTypes, Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');
const EditModal = require('./EditModal');
const FilterConfigModal = require('./FilterConfigModal');

export default class Config extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      globalFilterModalShow: false,
      quickFilterModalShow: false,
      notifications: {} };

    this.editModalClose = this.editModalClose.bind(this);
    this.globalFilterModalClose = this.globalFilterModalClose.bind(this);
    this.quickFilterModalClose = this.quickFilterModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  globalFilterModalClose() {
    this.setState({ globalFilterModalShow: false });
  }

  quickFilterModalClose() {
    this.setState({ quickFilterShow: false });
  }

  render() {

    const styles = { marginLeft: '20px', marginTop: '10px', marginBottom: '10px' };
 
    const { 
      i18n, 
      options,
      edit,
      config } = this.props;

    const items = [];
    items.push({
      id: 'basic',
      title: (
        <div>
          <span className='kanban-table-td-title'>基本信息</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>名称：{ config.name || '-' }</li>
            <li>类型：{ config.type || '-' }</li>
            <li>描述：{ config.description || '-' }</li>
          </ul>
          <Button onClick={ () => { this.setState({ editModalShow: true }) } }>编辑</Button>
        </div>
      )
    });
    items.push({
      id: 'query',
      title: (
        <div>
          <span className='kanban-table-td-title'>全局过滤</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>全部</li>
          </ul>
          <Button onClick={ () => { this.setState({ globalFilterModalShow: true }) } }>设置</Button>
        </div>
      )
    });
    items.push({
      id: 'filters',
      title: (
        <div>
          <span className='kanban-table-td-title'>自定义过滤器</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>全部</li>
          </ul>
          <Button onClick={ () => { this.setState({ editModalShow: true }) } }>添加</Button>
        </div>
      )
    });
    items.push({
      id: 'fields',
      title: (
        <div>
          <span className='kanban-table-td-title'>显示字段</span>
        </div>
      ),  
      contents: (
        <div style={ styles }>
          <div>暂不支持</div>
        </div>
      )
    });
    items.push({
      id: 'columns',
      title: (
        <div>
          <span className='kanban-table-td-title'>列</span>
        </div>
      ),  
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>全部</li>
          </ul>
        </div>
      )     
    }); 

    return (
      <div style={ { overflowY: 'auto', height: '100%' } }>
        <BootstrapTable data={ items } bordered={ false } hover trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn width='200' dataField='title'/>
          <TableHeaderColumn dataField='contents'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal  
            show 
            close={ this.editModalClose } 
            update={ edit } 
            data={ config } 
            i18n={ i18n }/> }
        { this.state.globalFilterModalShow &&
          <FilterConfigModal
            show
            model='global'
            close={ this.globalFilterModalClose }
            update={ edit }
            loading={ false }
            data={ config }
            options={ options }
            i18n={ i18n }/> }
      </div>
    );
  }
}
