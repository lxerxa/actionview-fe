import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem, Label } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const OptionValuesConfigModal = require('./OptionValuesConfigModal');
const DefaultValueConfigModal = require('./DefaultValueConfigModal');
const img = require('../../assets/images/loading.gif');
const fieldTypes = require('../share/FieldTypes.js');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      delNotifyShow: false, 
      optionValuesConfigShow: false, 
      defaultValueConfigShow: false, 
      operateShow: false, 
      hoverRowId: ''
    };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.optionValuesConfigClose = this.optionValuesConfigClose.bind(this);
    this.defaultValueConfigClose = this.defaultValueConfigClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    pkey: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    selectedItem: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    config: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  optionValuesConfigClose() {
    this.setState({ optionValuesConfigShow: false });
  }

  defaultValueConfigClose() {
    this.setState({ defaultValueConfigShow: false });
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;
    const { select } = this.props;

    select(hoverRowId);
    eventKey === '1' && this.setState({ editModalShow: true });
    eventKey === '2' && this.setState({ delNotifyShow : true });
    eventKey === '3' && this.setState({ defaultValueConfigShow: true });
    eventKey === '4' && this.setState({ optionValuesConfigShow: true });
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
      del, 
      update, 
      options } = this.props;
    const { operateShow, hoverRowId } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const fields = [];
    const fieldNum = collection.length;
    for (let i = 0; i < fieldNum; i++) {
      const isGlobal = pkey !== '$_sys_$' && collection[i].project_key === '$_sys_$';

      let screens = '';
      if (_.isEmpty(collection[i].screens))
      {
        screens = '-';
      }
      else
      {
        _.forEach(collection[i].screens, function(val) {
          screens += val.name + '<br/>';
        });
      }
      
      fields.push({
        id: collection[i].id,
        name: (
          <div>
            <span className='table-td-title'>{ collection[i].name }{ isGlobal && <span style={ { fontWeight: 'normal' } }> (全局)</span> }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        key: collection[i].key,
        type: _.find(fieldTypes, { value: collection[i].type }).label,
        screen: ( <span dangerouslySetInnerHTML={ { __html: screens } }/> ),
        operation: !isGlobal ? (
          <div>
            { operateShow && hoverRowId === collection[i].id && !itemLoading &&
              <DropdownButton 
                pullRight 
                bsStyle='link' 
                style={ { textDecoration: 'blink' ,color: '#000' } } 
                title={ node } 
                key={ i } 
                id={ `dropdown-basic-${i}` } 
                onSelect={ this.operateSelect.bind(this) }>
                { (collection[i].type === 'Select' || collection[i].type === 'MultiSelect' || collection[i].type === 'RadioGroup' || collection[i].type === 'CheckboxGroup') && <MenuItem eventKey='4'>可选值配置</MenuItem> }
                { (collection[i].type === 'Select.Async' || collection[i].type === 'MultiSelect.Async') && <MenuItem eventKey='5'>数据源配置</MenuItem> }
                { collection[i].type !== 'File' && collection[i].type !== 'SingleVersion' && collection[i].type !== 'MultiVersion' && collection[i].type !== 'TimeTracking' && collection[i].type !== 'DateTimePicker' && <MenuItem eventKey='3'>默认值配置</MenuItem> }
                <MenuItem eventKey='1'>编辑</MenuItem>
                { !collection[i].is_used && <MenuItem eventKey='2'>删除</MenuItem> }
              </DropdownButton>
            }
            <img src={ img } className={ itemLoading && selectedItem.id === collection[i].id ? 'loading' : 'hide' }/>
          </div>
        ) : (<div>&nbsp;</div>)
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><img src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);
    // opts.onMouseLeave = this.onMouseLeave.bind(this);

    return (
      <div style={ { marginBottom: '30px' } }>
        <BootstrapTable data={ fields } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' hidden isKey>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='key'>键值</TableHeaderColumn>
          <TableHeaderColumn dataField='type'>类型</TableHeaderColumn>
          <TableHeaderColumn dataField='screen'>应用界面</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal 
            show 
            close={ this.editModalClose } 
            update={ update } 
            data={ selectedItem } 
            options={ options } 
            i18n={ i18n }/> }
        { this.state.delNotifyShow && 
          <DelNotify 
            show 
            close={ this.delNotifyClose } 
            data={ selectedItem } 
            del={ del }/> }
        { this.state.optionValuesConfigShow &&  
          <OptionValuesConfigModal 
            show 
            close={ this.optionValuesConfigClose } 
            data={ selectedItem } 
            config={ update } 
            loading={ loading } 
            i18n={ i18n }/> }
        { this.state.defaultValueConfigShow && 
          <DefaultValueConfigModal 
            show 
            close={ this.defaultValueConfigClose } 
            data={ selectedItem } 
            config={ update } 
            loading={ loading } 
            i18n={ i18n }/> }
      </div>
    );
  }
}
