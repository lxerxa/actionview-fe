import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const BackTop = require('../share/BackTop');
const CreateModal = require('./CreateModal');
const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createModalShow: false, 
      editModalShow: false, 
      delNotifyShow: false, 
      operateShow: false, 
      hoverRowId: '' 
    };
    this.createModalClose = this.createModalClose.bind(this);
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  async edit(id) {
    this.setState({ editModalShow: true });
    const { select } = this.props;
    select(id);
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { select } = this.props;
    select(id);
  }

  operateSelect(eventKey) {
    const { hoverRowId } = this.state;

    if (eventKey === '1') {
      this.edit(hoverRowId);
    } else if (eventKey === '2') {
      this.delNotify(hoverRowId);
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
      options, 
      collection, 
      selectedItem, 
      indexLoading, 
      loading, 
      del, 
      update, 
      create, 
      index 
    } = this.props;
    const { hoverRowId, operateShow } = this.state;

    const node = ( <span><i className='fa fa-cog'></i></span> );

    const completedStates = options.completed_states || []; 
    const inCompletedStates = options.incompleted_states || []; 

    const labels = [];
    const labelNum = collection.length;
    for (let i = 0; i < labelNum; i++) {

      let style = {};
      if (collection[i].bgColor) {
        style = { 
          backgroundColor: collection[i].bgColor, 
          borderColor: collection[i].bgColor, 
          border: '1px solid ' + collection[i].bgColor,
          color: '#fff'
        };
      }

      labels.push({
        id: collection[i].id,
        name: ( 
          <span className='issue-label' title={ collection[i].name } style={ style }>
            { collection[i].name }
          </span> ),
        bgColor: ( <div className='label-label' style={ { backgroundColor: collection[i].bgColor || '#ccc' } } /> ),
        issues: (
          <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
            <li>所有问题 - <Link to={ '/project/' + collection[i].project_key + '/issue?labels=' + collection[i].name }>{ collection[i].all_cnt || 0 }</Link></li>
            <li>未解决的 - <Link to={ '/project/' + collection[i].project_key + '/issue?resolution=Unresolved&labels=' + collection[i].name }><span style={ { color: 'red' } }>{ collection[i].unresolved_cnt || 0 }</span></Link></li>
          </ul>
        ),
        operation: (
          <div>
          { operateShow && hoverRowId === collection[i].id &&
            <DropdownButton 
              pullRight 
              bsStyle='link' 
              style={ { textDecoration: 'blink' ,color: '#000' } } 
              key={ i } 
              title={ node } 
              id={ `dropdown-basic-${i}` } 
              onSelect={ this.operateSelect.bind(this) }>
              <MenuItem eventKey='1'>编辑</MenuItem>
              <MenuItem eventKey='2'>删除</MenuItem>
            </DropdownButton> }
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
    // opts.onMouseLeave = this.onMouseLeave.bind(this);

    return (
      <div style={ { marginBottom: '30px' } }>
        <BackTop />
        <div style={ { marginTop: '15px' } }>
          <Button onClick={ () => { this.setState({ createModalShow: true }) } }>
            <i className='fa fa-plus'></i>&nbsp;新建标签
          </Button>
        </div>
        <BootstrapTable 
          hover
          data={ labels } 
          bordered={ false } 
          options={ opts } 
          trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='issues'>问题完成情况</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='operation'/>
        </BootstrapTable>
        { this.state.editModalShow && 
          <EditModal 
            show 
            close={ this.editModalClose } 
            update={ update } 
            data={ selectedItem } 
            collection={ collection } 
            i18n={ i18n }/> }
        { this.state.createModalShow &&
          <CreateModal
            show
            close={ this.createModalClose }
            create={ create }
            collection={ collection }
            i18n={ i18n }/> }
        { this.state.delNotifyShow && 
          <DelNotify 
            show 
            loading={ loading }
            close={ this.delNotifyClose } 
            index={ index }
            labels={ collection }
            data={ selectedItem } 
            del={ del }
            i18n={ i18n }/> }
      </div>
    );
  }
}
