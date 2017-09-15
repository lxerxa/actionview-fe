import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem, Label } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const CopyModal = require('./CopyModal');
const DelNotify = require('./DelNotify');
const PreviewModal = require('../workflow/PreviewModal');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      copyModalShow: false, 
      delNotifyShow: false, 
      previewShow: false,
      operateShow: false,
      hoverRowId: ''
    };
    this.editModalClose = this.editModalClose.bind(this);
    this.copyModalClose = this.copyModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.previewModalClose = this.previewModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    pkey: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    itemSteps: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    preview: PropTypes.func.isRequired,
    goConfig: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  copyModalClose() {
    this.setState({ copyModalShow: false });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  previewModalClose() {
    this.setState({ previewModalShow: false });
  }

  async operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { select, preview, goConfig } = this.props;

    let ecode = 0;
    if (eventKey === '3') {
      goConfig(hoverRowId);
    } else if (eventKey === '5') {
      ecode = await preview(hoverRowId);
      if (ecode === 0) {
        this.setState({ previewModalShow: true }); 
      }
    } else {
      select(hoverRowId);
      eventKey === '1' && this.setState({ editModalShow: true });
      eventKey === '2' && this.setState({ delNotifyShow: true });
      eventKey === '4' && this.setState({ copyModalShow: true });
    }
  }

  onRowMouseOver(rowData) {
    if (rowData.id !== this.state.hoverRowId) {
      this.setState({ operateShow: true, hoverRowId: rowData.id });
    }
  }

  onMouseLeave() {
    this.setState({ operateShow: false, hoverRowId: '' });
  }

  render() {
    const { 
      i18n, 
      pkey, 
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      itemSteps, 
      del, 
      update, 
      create } = this.props;
    const { operateShow, hoverRowId } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const workflows = [];
    const workflowNum = collection.length;
    for (let i = 0; i < workflowNum; i++) {
      const isGlobal = pkey !== '$_sys_$' && collection[i].project_key === '$_sys_$';
      workflows.push({
        id: collection[i].id,
        name:  (
          <div>
            <span className='table-td-title'>{ collection[i].name }{ isGlobal && <span style={ { fontWeight: 'normal' } }> (全局)</span> }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        latest_modify: ( 
          <span> 
            { collection[i].latest_modified_time } 
            <br/> 
            { collection[i].latest_modifier && collection[i].latest_modifier.name } 
          </span> ),
        step: collection[i].steps,
        operation: (
          <div>
            { operateShow && hoverRowId === collection[i].id && !itemLoading &&
              <DropdownButton 
                pullRight 
                bsStyle='link' 
                style={ { textDecoration: 'blink' ,color: '#000' } } 
                title={ node } key={ i } 
                id={ `dropdown-basic-${i}` } 
                onSelect={ this.operateSelect.bind(this) }>
                <MenuItem eventKey='5'>预览</MenuItem>
                { !isGlobal && <MenuItem eventKey='3'>配置</MenuItem> }
                <MenuItem eventKey='4'>复制</MenuItem>
                { !isGlobal && <MenuItem eventKey='1'>编辑</MenuItem> }
                { !isGlobal && !collection[i].is_used && <MenuItem eventKey='2'>删除</MenuItem> }
              </DropdownButton>
            }
            <img src={ img } className={ itemLoading && selectedItem.id === collection[i].id ? 'loading' : 'hide' }/>
          </div>
        )
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);

    return (
      <div style={ { marginBottom: '30px' } }>
        <BootstrapTable pullRight data={ workflows } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' >名称</TableHeaderColumn>
          <TableHeaderColumn dataField='latest_modify'>最近配置修改</TableHeaderColumn>
          <TableHeaderColumn dataField='step' width='200'>步骤</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal 
            show 
            close={ this.editModalClose } 
            update={ update } 
            data={ selectedItem } 
            i18n={ i18n }/> }
        { this.state.copyModalShow && 
          <CopyModal 
            show 
            close={ this.copyModalClose } 
            copy={ create } 
            data={ selectedItem } 
            i18n={ i18n }/> }
        { this.state.delNotifyShow && 
          <DelNotify 
            show 
            close={ this.delNotifyClose } 
            data={ selectedItem } 
            del={ del }/> }
        { this.state.previewModalShow && 
          <PreviewModal 
            show 
            close={ this.previewModalClose } 
            collection={ itemSteps } 
            name={ selectedItem.name }/> }
      </div>
    );
  }
}
