import React, { PropTypes, Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FormGroup, FormControl, ButtonGroup, Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import { webhookEvents } from '../share/Constants';

const $ = require('$');
const CreateModal = require('./CreateModal');
const OperateNotify = require('./OperateNotify');

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      operateNotifyShow: false, 
      operate: '',
      operateShow: false, 
      hoverRowId: '' }; 

    this.createModalClose = this.createModalClose.bind(this);
    this.operateNotifyClose = this.operateNotifyClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    test: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  operateNotifyClose() {
    this.setState({ operateNotifyShow: false });
  }

  operateNotify(id) {
    this.setState({ operateNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  async operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { test } = this.props;
    if (eventKey == 'test') {
      const ecode = await test(hoverRowId);
      if (ecode === 0) {
        notify.show('测试成功。', 'success', 2000);
      } else {
        notify.show('测试失败', 'error', 2000);
      }
    } else {
      this.operateNotify(hoverRowId);
      this.setState({ operate: eventKey });
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
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      index, 
      create, 
      del, 
      test, 
      update, 
      options } = this.props;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const directories = [];
    const directoryNum = collection.length;
    for (let i = 0; i < directoryNum; i++) {

      const events = [];
      _.forEach(webhookEvents, (v) => {
        const ind = _.indexOf(collection[i].events, v.id);
        if (ind !== -1) {
          events.push(v.name);
        }
      });

      directories.push({
        id: collection[i].id,
        request_url: collection[i].request_url, 
        events: (
          <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
            { _.isEmpty(events) ? '-' : _.map(events, function(v, i) { return (<li key={ i }>{ v }</li>) }) }
          </ul>
        ), 
        ssl: collection[i].ssl == 1 ? '是' : '否',
        status: collection[i].status == 'disabled' ? <Label>无效</Label> : <Label bsStyle='success'>有效</Label>,
        operation: (
          <div>
          { operateShow && hoverRowId === collection[i].id && !itemLoading &&
            <DropdownButton 
              pullRight 
              bsStyle='link' 
              style={ { textDecoration: 'blink' ,color: '#000' } } 
              title={ node } 
              id={ `dropdown-basic-${i}` } 
              onSelect={ this.operateSelect.bind(this) }>
              { collection[i].status == 'enabled' ? <MenuItem eventKey='disable'>禁用</MenuItem> : <MenuItem eventKey='enable'>启用</MenuItem> }
              <MenuItem eventKey='del'>删除</MenuItem>
            </DropdownButton> }
            <img src={ img } className={ (itemLoading && selectedItem.id === collection[i].id) ? 'loading' : 'hide' }/>
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
      <div>
        <div style={ { marginTop: '5px', height: '40px' } }>
          <FormGroup>
            <Button 
              style={ { float: 'left', marginRight: '20px' } } 
              onClick={ () => { this.setState({ createModalShow: true }); } } 
              disabled={ indexLoading }>
              <i className='fa fa-plus'></i>&nbsp;新建Webhook
            </Button>
          </FormGroup>
        </div>
        <div className='info-col' style={ { marginBottom: '15px' } }>
          <div className='info-icon'><i className='fa fa-info-circle'></i></div>
          <div className='info-content'>
            <span>
              请求Header Content-Type为：application/json，请求方法为：POST；Token附加在Header中的X-ACTIONVIEW-TOKEN里。
            </span>
          </div>
        </div>
        <div>
          <BootstrapTable data={ directories } bordered={ false } hover options={ opts } trClassName='tr-top'>
            <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='request_url'>请求Url</TableHeaderColumn>
            <TableHeaderColumn dataField='events'>事件</TableHeaderColumn>
            <TableHeaderColumn dataField='status' width='100'>状态</TableHeaderColumn>
            <TableHeaderColumn width='60' dataField='operation'/>
          </BootstrapTable>
          { this.state.createModalShow && 
            <CreateModal 
              show 
              data={ selectedItem } 
              close={ this.createModalClose } 
              create={ create } 
              i18n={ i18n }/> }
          { this.state.operateNotifyShow &&
            <OperateNotify
              show
              close={ this.operateNotifyClose }
              data={ selectedItem }
              operate={ this.state.operate }
              del={ del }
              update={ update }
              i18n={ i18n }/> }
        </div>
      </div>
    );
  }
}
