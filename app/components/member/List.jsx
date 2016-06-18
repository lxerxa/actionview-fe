import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false };
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  render() {
    const { collection, selectedItem, item, options, indexLoading, itemLoading, del, edit } = this.props;

    const types = [];
    const typeNum = collection.length;
    for (let i = 0; i < typeNum; i++) {
      const permissions = _.filter(options.permissions, function(o) { return _.indexOf(collection[i].permissions, o.id) !== -1; });
      types.push({
        id: collection[i].id,
        role: collection[i].role,
        permissions: (
          <ul style={ { marginBottom: '0px', paddingLeft: '0px' } }>
            { _.map(permissions, function(v){ 
              return <li key={ v.id }>{ v.name }</li> }) 
            }
          </ul>), 
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
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='role'>角色</TableHeaderColumn>
          <TableHeaderColumn dataField='member'>成员</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
