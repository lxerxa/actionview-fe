import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const LayoutConfigModal = require('./LayoutConfigModal');
const LayoutFieldConfigModal = require('./LayoutConfigModal');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false, layoutConfigShow: false, layoutFieldConfigShow: false };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.layoutConfigClose = this.layoutConfigClose.bind(this);
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
    delNotify: PropTypes.func.isRequired
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

  layoutConfigClose() {
    this.setState({ layoutConfigShow: false });
  }

  layoutFieldConfigClose() {
    this.setState({ layoutFieldConfigShow: false });
  }

  async configSelect(eventKey) {
    const resultArr = eventKey.split('_');
    if (resultArr[1] === '1') {
      const { show } = this.props;
      const ecode = await show(resultArr[0]);
      if (ecode === 0) {
        this.setState({ layoutConfigShow: true });
      }
    } else if (resultArr[1] === '2') {
      this.setState({ layoutFieldConfigShow: true });
    }
  }

  async show(id) {
    const { show } = this.props;
    const ecode = await show(id);
    if (ecode === 0) {
      this.setState({ editModalShow: true });
    }
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { delNotify } = this.props;
    delNotify(id);
  }

  render() {
    const { collection, selectedItem, item, loading, indexLoading, itemLoading, del, edit } = this.props;

    const fields = [];
    const fieldNum = collection.length;
    for (let i = 0; i < fieldNum; i++) {
      let workflows = '';
      _.forEach(collection[i].workflows, function(val) {
        workflows += val.name + '<br/>';
      });
      
      fields.push({
        name: ( <span>{ collection[i].name }</span> ),
        workflow: ( <span dangerouslySetInnerHTML={ { __html: workflows } }/> ),
        operation: (
          <div>
            <div className={ itemLoading && selectedItem.id === collection[i].id && 'hide' }>
              <DropdownButton bsStyle='link' disabled = { itemLoading && true } title='配置' key={ i } id={ `dropdown-basic-${i}` } onSelect={ this.configSelect.bind(this) }>
                <MenuItem eventKey={ collection[i].id + '_1' }>页面配置</MenuItem>
                <MenuItem eventKey={ collection[i].id + '_2' }>页面字段配置</MenuItem>
              </DropdownButton>
              <Button bsStyle='link' disabled = { itemLoading && true } onClick={ this.show.bind(this, collection[i].id) }>编辑</Button>
              <Button bsStyle='link' disabled = { itemLoading && true } onClick={ this.delNotify.bind(this, collection[i].id) }>复制</Button>
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
          <TableHeaderColumn dataField='workflow'>应用工作流</TableHeaderColumn>
          <TableHeaderColumn dataField='operation'>操作</TableHeaderColumn>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ item }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
        { this.state.layoutConfigShow && <LayoutConfigModal show close={ this.layoutConfigClose } data={ item } config={ edit } loading={ loading }/> }
        { this.state.layoutFieldConfigShow && <LayoutFieldConfigModal show close={ this.layoutFieldConfigClose } data={ item } config={ edit } loading={ loading }/> }
      </div>
    );
  }
}
