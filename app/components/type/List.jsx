import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import * as TypeActions from 'redux/actions/TypeActions';

const SaveModal = require('./SaveModal');
const DelNotify = require('./DelNotify');
const SortCardModal = require('./SortCardModal');
const img = require('../../assets/images/loading.gif');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TypeActions, dispatch)
  };
}

@connect(({ type }) => ({ type }), mapDispatchToProps)
export default class List extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
    this.state = { saveModalShow: false, delNotifyShow: false, sortCardModalShow: false };
    this.saveModalClose = this.saveModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
    this.sortCardModalClose = this.sortCardModalClose.bind(this);
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired
  }

  saveModalClose() {
    this.setState({ saveModalShow: false });
  }

  delNotifyClose() {
    this.setState({ delNotifyShow: false });
  }

  sortCardModalClose() {
    this.setState({ sortCardModalShow: false });
  }

  init() {
    const { actions } = this.props;
    actions.init();
    this.setState({ saveModalShow: true });
  }

  async create(values) {
    await this.props.actions.create(this.pid, values);
    return this.props.type.ecode;
  }

  async edit(values) {
    await this.props.actions.edit(this.pid, values);
    return this.props.type.ecode;
  }

  async show(id) {
    const { actions } = this.props;
    await actions.show(this.pid, id);
    if (this.props.type.ecode === 0) {
      this.setState({ saveModalShow: true });
    }
    return this.props.type.ecode;
  }

  delNotify(id) {
    this.setState({ delNotifyShow: true });
    const { actions } = this.props;
    actions.delNotify(id);
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.type.ecode;
  }

  async setSort(values) {
    await this.props.actions.setSort(this.pid, values);
    return this.props.type.ecode;
  }

  async setDefault(values) {
    await this.props.actions.setDefault(this.pid, values);
    return this.props.type.ecode;
  }

  componentWillMount() {
    const { actions } = this.props;
    const { params: { key } } = this.props;
    this.pid = key;
    actions.index(key);
  }

  render() {
    const { collection, selectedItem, item, options, itemLoading, sortLoading } = this.props.type;
    const styles = { paddingTop: '6px' };

    const types = [];
    const typeNum = collection.length;
    for (let i = 0; i < typeNum; i++) {
      types.push({
        name: ( <div style={ styles }>{ collection[i].name }</div> ),
        screen: ( <div style={ styles }>{ collection[i].screen.name }</div> ),
        workflow: ( <div style={ styles }>{ collection[i].workflow.name }</div> ),
        operation: (
          <div>
            <div className={ itemLoading && selectedItem.id === collection[i].id && 'hide' }>
              <Button bsStyle='link' onClick={ this.show.bind(this, collection[i].id) }>编辑</Button>
              <span>&nbsp;·&nbsp;</span>
              <Button bsStyle='link' onClick={ this.delNotify.bind(this, collection[i].id) }>删除</Button>
            </div>
            <image src={ img } className={ (itemLoading && selectedItem.id === collection[i].id) ? 'loading' : 'hide' }/>
          </div>
        )
      });
    }

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h2>#问题类型#</h2>
        </div>
        <div>
          <Button className='create-btn' onClick={ this.init.bind(this) }><i className='fa fa-plus'></i>&nbsp;新建类型</Button>
          <Button className='create-btn' onClick={ () => { this.setState({ sortCardModalShow: true }); } }><i className='fa fa-pencil'></i>&nbsp;编辑顺序</Button>
        </div>
        <BootstrapTable data={ types } bordered={ false } hover>
          <TableHeaderColumn dataField='name' isKey>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='screen'>界面</TableHeaderColumn>
          <TableHeaderColumn dataField='workflow'>工作流</TableHeaderColumn>
          <TableHeaderColumn dataField='operation'>操作</TableHeaderColumn>
        </BootstrapTable>
        <SaveModal show={ this.state.saveModalShow } hide={ this.saveModalClose } create={ this.create.bind(this) } edit={ this.edit.bind(this) } data={ item } options={ options }/>
        <DelNotify show={ this.state.delNotifyShow } hide={ this.delNotifyClose } data={ selectedItem } del={ this.del.bind(this) }/>
        <SortCardModal show={ this.state.sortCardModalShow } hide={ this.sortCardModalClose } cards={ collection } setSort={ this.setSort.bind(this) } sortLoading={ sortLoading }/>
      </div>
    );
  }
}
