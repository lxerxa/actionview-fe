import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

const EditModal = require('./EditModal');
const DelNotify = require('./DelNotify');
const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { editModalShow: false, delNotifyShow: false, willSetPrincipalModuleIds: [], settingPrincipalModuleIds: [], willSetDefalutAssigneeModuleIds: [], settingDefaultAssigneeModuleIds: [] , principal: {}, defaultAssignee: {} };
    this.editModalClose = this.editModalClose.bind(this);
    this.delNotifyClose = this.delNotifyClose.bind(this);
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
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
    const { show } = this.props;
    show(id);
  }

  willSetPrincipal(moduleId) {
    this.state.willSetPrincipalModuleIds.push(moduleId);
    this.setState({ willSetPrincipalModuleIds: this.state.willSetPrincipalModuleIds });
  }

  cancelSetPrincipal(moduleId) {
    const index = this.state.willSetPrincipalModuleIds.indexOf(moduleId);
    this.state.willSetPrincipalModuleIds.splice(index, 1);
    // clean permission in the state
    this.state.principal[moduleId] = undefined;

    this.setState({ willSetPrincipalModuleIds: this.state.willSetPrincipalModuleIds, principal: this.state.principal });
  }

  async setPrincipal(moduleId) {
    this.state.settingPrincipalModuleIds.push(moduleId);
    this.setState({ settingPrincipalModuleIds: this.state.settingPrincipalModuleIds });

    const { edit } = this.props;
    const ecode = await edit({ principal: this.state.principal[moduleId], id: moduleId });
    if (ecode === 0) {
      const willSetIndex = _.indexOf(this.state.willSetPrincipalModuleIds, moduleId);
      this.state.willSetPrincipalModuleIds.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingPrincipalModuleIds, moduleId);
      this.state.settingPrincipalModuleIds.splice(settingIndex, 1);

      this.setState({ settingPrincipalModuleIds: this.state.settingPrincipalModuleIds, willSetPrincipalModuleIds: this.state.willSetPrincipalModuleIds });
    } else {
      const settingIndex = _.indexOf(this.state.settingPrincipalModuleIds, moduleId);
      this.state.settingPrincipalModuleIds.splice(settingIndex, 1);

      this.setState({ settingPrincipalModuleIds: this.state.settingPrincipalModuleIds });
    }
  }

  handlePrincipalSelectChange(moduleId, value) {
    this.state.principal[moduleId] = value;
    this.setState({ principal: this.state.principal });
  }

  willSetDefaultAssignee(moduleId) {
    this.state.willSetDefalutAssigneeModuleIds.push(moduleId);
    this.setState({ willSetDefalutAssigneeModuleIds: this.state.willSetDefalutAssigneeModuleIds });
  }

  cancelSetDefaultAssignee(moduleId) {
    const index = this.state.willSetDefalutAssigneeModuleIds.indexOf(moduleId);
    this.state.willSetDefalutAssigneeModuleIds.splice(index, 1);
    // clean permission in the state
    this.state.defaultAssignee[moduleId] = undefined;

    this.setState({ willSetDefalutAssigneeModuleIds: this.state.willSetDefalutAssigneeModuleIds, defaultAssignee: this.state.defaultAssignee });
  }

  async setDefaultAssignee(moduleId) {
    this.state.settingDefaultAssigneeModuleIds.push(moduleId);
    this.setState({ settingDefaultAssigneeModuleIds: this.state.settingDefaultAssigneeModuleIds });

    const { edit } = this.props;
    const ecode = await edit({ defaultAssignee: this.state.defaultAssignee[moduleId], id: moduleId });
    if (ecode === 0) {
      const willSetIndex = _.indexOf(this.state.willSetDefalutAssigneeModuleIds, moduleId);
      this.state.willSetDefalutAssigneeModuleIds.splice(willSetIndex, 1);

      const settingIndex = _.indexOf(this.state.settingDefaultAssigneeModuleIds, moduleId);
      this.state.settingDefaultAssigneeModuleIds.splice(settingIndex, 1);

      this.setState({ settingDefaultAssigneeModuleIds: this.state.settingDefaultAssigneeModuleIds, willSetDefalutAssigneeModuleIds: this.state.willSetDefalutAssigneeModuleIds });
    } else {
      const settingIndex = _.indexOf(this.state.settingDefaultAssigneeModuleIds, moduleId);
      this.state.settingDefaultAssigneeModuleIds.splice(settingIndex, 1);

      this.setState({ settingDefaultAssigneeModuleIds: this.state.settingDefaultAssigneeModuleIds });
    }
  }

  handleDefaultAssigneeSelectChange(moduleId, value) {
    this.state.defaultAssignee[moduleId] = value;
    this.setState({ defaultAssignee: this.state.defaultAssignee });
  }

  render() {
    const { collection, selectedItem, options, indexLoading, itemLoading, del, edit } = this.props;
    const { willSetPrincipalModuleIds, settingPrincipalModuleIds, willSetDefalutAssigneeModuleIds, settingDefaultAssigneeModuleIds } = this.state;

    const { users = [] } = options;
    const userOptions = _.map(users, function(val) {
      return { label: val.name, value: val.id };
    });

    const defaultAssigneeOptions = [ { value: 'projectPrincipal', label: '项目负责人' }, { value: 'modulePrincipal', label: '模块负责人' }, { value: 'none', label: '未分配' } ];

    const modules = [];
    const moduleNum = collection.length;
    for (let i = 0; i < moduleNum; i++) {
      modules.push({
        name: ( 
          <div>
            <span className='table-td-title'>{ collection[i].name }</span>
            { collection[i].description && <span className='table-td-desc'>{ collection[i].description }</span> }
          </div>
        ),
        principal: (
          <div>
          { _.indexOf(willSetPrincipalModuleIds, collection[i].id) === -1 && _.indexOf(settingPrincipalModuleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].principal ?
                <span>
                  <div style={ { display: 'inline-block', float: 'left', margin: '3px' } }> 
                    { collection[i].principal.name || '-' } 
                  </div>
                </span> 
                :
                '-' }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetPrincipal.bind(this, collection[i].id) }><i className='fa fa-pencil'></i></span>
              </div>
            </div>
            :
            <div>
              <Select simpleValue clearable={ false } disabled={ _.indexOf(settingPrincipalModuleIds, collection[i].id) !== -1 && true } options={ userOptions } value={ this.state.principal[collection[i].id] || collection[i].principal.id } onChange={ this.handlePrincipalSelectChange.bind(this, collection[i].id) } placeholder='请选择用户'/>
              <div className={ _.indexOf(settingPrincipalModuleIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setPrincipal.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetPrincipal.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div>
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingPrincipalModuleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ),
        defaultAssignee: (
          <div>
          { _.indexOf(willSetDefalutAssigneeModuleIds, collection[i].id) === -1 && _.indexOf(settingDefaultAssigneeModuleIds, collection[i].id) === -1 ?
            <div className='editable-list-field'>
              <div style={ { display: 'table', width: '100%' } }>
              { collection[i].defaultAssignee ?
                <span>
                  <div style={ { display: 'inline-block', float: 'left', margin: '3px' } }> 
                    { _.find(defaultAssigneeOptions, { value: collection[i].defaultAssignee }) ? _.find(defaultAssigneeOptions, { value: collection[i].defaultAssignee }).label : '-' } 
                  </div>
                </span> 
                :
                '-' }
                <span className='edit-icon-zone edit-icon' onClick={ this.willSetDefaultAssignee.bind(this, collection[i].id) }><i className='fa fa-pencil'></i></span>
              </div>
            </div>
            :
            <div>
              <Select simpleValue clearable={ false } searchable={ false } disabled={ _.indexOf(settingDefaultAssigneeModuleIds, collection[i].id) !== -1 && true } options={ defaultAssigneeOptions } value={ this.state.defaultAssignee[collection[i].id] || collection[i].defaultAssignee } onChange={ this.handleDefaultAssigneeSelectChange.bind(this, collection[i].id) } placeholder='默认经办人(项目负责人)'/>
              <div className={ _.indexOf(settingDefaultAssigneeModuleIds, collection[i].id) !== -1 ? 'hide' : '' } style={ { float: 'right' } }>
                <Button className='edit-ok-button' onClick={ this.setDefaultAssignee.bind(this, collection[i].id) }><i className='fa fa-check'></i></Button>
                <Button className='edit-ok-button' onClick={ this.cancelSetDefaultAssignee.bind(this, collection[i].id) }><i className='fa fa-close'></i></Button>
              </div>
            </div>
          }
          <img src={ img } style={ { float: 'right' } } className={ _.indexOf(settingDefaultAssigneeModuleIds, collection[i].id) !== -1 ? 'loading' : 'hide' }/>
          </div>
        ),
        operation: (
          <div>
            <div className={ itemLoading && selectedItem.id === collection[i].id && 'hide' }>
              <Button bsStyle='link' disabled = { itemLoading && true } onClick={ this.show.bind(this, collection[i].id) }>编辑</Button>
              <Button bsStyle='link' disabled = { itemLoading && true } onClick={ this.delNotify.bind(this, collection[i].id) }>删除</Button>
            </div>
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

    return (
      <div>
        <BootstrapTable data={ modules } bordered={ false } hover options={ opts } trClassName='tr-middle'>
          <TableHeaderColumn dataField='name' isKey>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='principal'>负责人</TableHeaderColumn>
          <TableHeaderColumn dataField='defaultAssignee'>默认经办人</TableHeaderColumn>
          <TableHeaderColumn width='120' dataField='operation'>操作</TableHeaderColumn>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } edit={ edit } data={ selectedItem } options={ options } collection={ collection }/> }
        { this.state.delNotifyShow && <DelNotify show close={ this.delNotifyClose } data={ selectedItem } del={ del }/> }
      </div>
    );
  }
}
