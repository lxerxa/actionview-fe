import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem, Label } from 'react-bootstrap';
import _ from 'lodash';
import { FieldTypes } from '../share/Constants';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const OptionValuesConfigModal = require('./OptionValuesConfigModal');
const DefaultValueConfigModal = require('./DefaultValueConfigModal');
const ViewUsedModal = require('./ViewUsedModal');
const img = require('../../assets/images/loading.gif');

const sysFields = [ 
  'title', 
  'priority', 
  'resolution', 
  'assignee', 
  'module', 
  'comments', 
  'resolve_version', 
  'effect_versions',
  'progress',
  'expect_start_time',
  'expect_complete_time',
  'related_users',
  'descriptions', 
  'epic',
  'labels', 
  'original_estimate',
  'story_points',
  'attachments' ];

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editModalShow: false, 
      delNotifyShow: false, 
      viewUsedShow: false,
      optionValuesConfigShow: false, 
      defaultValueConfigShow: false, 
      operateShow: false, 
      hoverRowId: ''
    };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.viewUsedClose = this.viewUsedClose.bind(this);
    this.optionValuesConfigClose = this.optionValuesConfigClose.bind(this);
    this.defaultValueConfigClose = this.defaultValueConfigClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    isSysConfig: PropTypes.bool,
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
    viewUsed: PropTypes.func.isRequired,
    usedProjects: PropTypes.array.isRequired,
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

  viewUsedClose() {
    this.setState({ viewUsedShow: false });
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
    eventKey === '6' && this.setState({ viewUsedShow: true });
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
      isSysConfig,
      pkey, 
      collection, 
      selectedItem, 
      loading, 
      indexLoading, 
      itemLoading, 
      del, 
      update, 
      viewUsed,
      usedProjects,
      options } = this.props;
    const { operateShow, hoverRowId } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const fields = [];
    const fieldNum = collection.length;
    for (let i = 0; i < fieldNum; i++) {
      const isGlobal = pkey !== '$_sys_$' && collection[i].project_key === '$_sys_$';

      fields.push({
        id: collection[i].id,
        name: (
          <div>
            <span className='table-td-title'>{ collection[i].name }{ isGlobal && <span style={ { fontWeight: 'normal' } }> (Global)</span> }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        key: collection[i].key,
        type: _.find(FieldTypes, { value: collection[i].type }).label,
        screen: ( 
          <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
            { _.isEmpty(collection[i].screens) ? '-' : _.map(collection[i].screens, (v, i) => <li key={ i }>{ v.name }</li>) } 
          </ul> ),
        operation: !isGlobal && sysFields.indexOf(collection[i].key) === -1 ? (
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
                { [ 'Select', 'MultiSelect', 'RadioGroup', 'CheckboxGroup' ].indexOf(collection[i].type) !== -1 && <MenuItem eventKey='4'>可选值配置</MenuItem> }
                { (collection[i].type === 'Select.Async' || collection[i].type === 'MultiSelect.Async') && <MenuItem eventKey='5'>数据源配置</MenuItem> }
                { collection[i].type !== 'File' && collection[i].type !== 'SingleVersion' && collection[i].type !== 'MultiVersion' && collection[i].type !== 'SingleUser' && collection[i].type !== 'MultiUser' && collection[i].type !== 'TimeTracking' && collection[i].type !== 'DateTimePicker' && <MenuItem eventKey='3'>默认值配置</MenuItem> }
                <MenuItem eventKey='1'>Edit</MenuItem>
                { pkey === '$_sys_$' && <MenuItem eventKey='6'>查看项目应用</MenuItem> }
                { !collection[i].is_used && <MenuItem eventKey='2'>Delete</MenuItem> }
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
      opts.noDataText = 'No data displayed'; 
    } 

    opts.onRowMouseOver = this.onRowMouseOver.bind(this);
    // opts.onMouseLeave = this.onMouseLeave.bind(this);

    return (
      <div style={ { marginBottom: '30px' } }>
        <BootstrapTable data={ fields } bordered={ false } hover options={ opts } trClassName='tr-top'>
          <TableHeaderColumn dataField='id' hidden isKey>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
          <TableHeaderColumn dataField='key'>Key value</TableHeaderColumn>
          <TableHeaderColumn dataField='type'>Type</TableHeaderColumn>
          <TableHeaderColumn dataField='screen'>应用界面</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal 
            show 
            isSysConfig={ isSysConfig }
            close={ this.editModalClose } 
            update={ update } 
            data={ selectedItem } 
            options={ options } 
            i18n={ i18n }/> }
        { this.state.viewUsedShow &&
          <ViewUsedModal
            show
            close={ this.viewUsedClose }
            view={ viewUsed }
            loading={ loading }
            data={ selectedItem }
            projects={ usedProjects }
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
