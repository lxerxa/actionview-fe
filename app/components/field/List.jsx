import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const OptionValuesConfigModal = require('./OptionValuesConfigModal');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false, optionValuesConfigShow: false, defaultValueConfigShow: false };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.optionValuesConfigClose = this.optionValuesConfigClose.bind(this);
    this.defaultValueConfigClose = this.defaultValueConfigClose.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    config: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    delNotify: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
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

  async show(id) {
    const { show } = this.props;
    const ecode = await show(id);
    if (ecode === 0) {
      this.setState({ editModalShow: true });
    }
  }

  async configSelect(eventKey) {
    const resultArr = eventKey.split('_');
    if (resultArr[1] === '1') {
      const { show } = this.props;
      const ecode = await show(resultArr[0]);
      if (ecode === 0) {
        this.setState({ optionValuesConfigShow: true });
      }
    } else if (resultArr[1] === '2') {
      this.setState({ defaultValueConfigShow: true });
    }
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { delNotify } = this.props;
    delNotify(id);
  }

  render() {
    const { collection, selectedItem, item, options, loading, indexLoading, itemLoading, del, edit } = this.props;

    const fields = [];
    const fieldNum = collection.length;
    for (let i = 0; i < fieldNum; i++) {
      let screens = '';
      _.forEach(collection[i].screens, function(val) {
        screens += val.name + '<br/>';
      });
      
      fields.push({
        name: ( <span>{ collection[i].name }</span> ),
        key: ( <span>{ collection[i].key }</span> ),
        type: ( <span>{ collection[i].type }</span> ),
        screen: ( <span dangerouslySetInnerHTML={ { __html: screens } }/> ),
        operation: (
          <div>
            <div className={ itemLoading && selectedItem.id === collection[i].id && 'hide' }>
              <DropdownButton bsStyle='link' disabled = { itemLoading && true } title='配置' key={ i } id={ `dropdown-basic-${i}` } onSelect={ this.configSelect.bind(this) }>
                { (collection[i].type === 'Select' || collection[i].type === 'MultiSelect' || collection[i].type === 'RedioBox' || collection[i].type === 'CheckBox') && <MenuItem eventKey={ collection[i].id + '_1' }>可选值配置</MenuItem> }
                <MenuItem eventKey={ collection[i].id + '_2' }>默认值配置</MenuItem>
              </DropdownButton>
              <Button bsStyle='link' disabled = { itemLoading && true } onClick={ this.show.bind(this, collection[i].id) }>编辑</Button>
              <Button bsStyle='link' disabled = { itemLoading && true } onClick={ this.delNotify.bind(this, collection[i].id) }>删除</Button>
            </div>
            <image src={ img } className={ (itemLoading && selectedItem.id === collection[i].id) ? 'loading' : 'hide' }/>
          </div>
        )
      });
    }

    const opts = {};
    if (indexLoading) {
      opts.noDataText = ( <div><image src={ img } className='loading'/></div> );
    } else {
      opts.noDataText = '暂无数据显示。'; 
    } 

    return (
      <div>
        <BootstrapTable data={ fields } bordered={ false } hover options={ opts }>
          <TableHeaderColumn dataField='name' isKey>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='key'>键值</TableHeaderColumn>
          <TableHeaderColumn dataField='type'>类型</TableHeaderColumn>
          <TableHeaderColumn dataField='screen'>应用界面</TableHeaderColumn>
          <TableHeaderColumn dataField='operation'>操作</TableHeaderColumn>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ item } options={ options }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
        { this.state.optionValuesConfigShow && <OptionValuesConfigModal show close={ this.optionValuesConfigClose } data={ item } config={ edit } loading={ loading }/> }
        { this.state.defaultValueConfigShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
