import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
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

  show(id) {
    this.setState({ editModalShow: true });
    const { show } = this.props;
    show(id);
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { delNotify } = this.props;
    delNotify(id);
  }

  render() {
    const { collection, selectedItem, item, options, indexLoading, itemLoading, del, edit } = this.props;

    const types = [];
    const typeNum = collection.length;
    for (let i = 0; i < typeNum; i++) {
      types.push({
        name: collection[i].name,
        screen: collection[i].screen.name,
        workflow: collection[i].workflow.name,
        operation: (
          <div>
            <div className={ itemLoading && selectedItem.id === collection[i].id && 'hide' }>
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
        <BootstrapTable data={ types } bordered={ false } hover options={ opts }>
          <TableHeaderColumn dataField='name' isKey>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='screen'>界面</TableHeaderColumn>
          <TableHeaderColumn dataField='workflow'>工作流</TableHeaderColumn>
          <TableHeaderColumn width='150' dataField='operation'>操作</TableHeaderColumn>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ selectedItem } options={ options }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
